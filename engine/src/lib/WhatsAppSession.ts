
import makeWASocket, {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    WASocket,
    ConnectionState
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import pino from "pino";
import fs from "fs";
import path from "path";
import { WebhookDispatcher } from "./WebhookDispatcher";

export class WhatsAppSession {
    private socket: WASocket | null = null;
    private sessionId: string;
    private folderPath: string;
    public qrCode: string | undefined;
    public status: "connecting" | "connected" | "disconnected" = "disconnected";

    constructor(sessionId: string) {
        this.sessionId = sessionId;
        this.folderPath = path.join(__dirname, "../../sessions", sessionId);

        if (!fs.existsSync(this.folderPath)) {
            fs.mkdirSync(this.folderPath, { recursive: true });
        }
    }



    async start() {
        this.status = "connecting";
        const { state, saveCreds } = await useMultiFileAuthState(this.folderPath);
        const { version } = await fetchLatestBaileysVersion();

        this.socket = makeWASocket({
            version,
            logger: pino({ level: "silent" }) as any,
            printQRInTerminal: true,
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" }) as any),
            },
            browser: ["ConnectFlow", "Chrome", "1.0.0"],
        });

        this.socket.ev.on("creds.update", saveCreds);

        // Webhook for New Messages
        this.socket.ev.on("messages.upsert", async (m) => {
            if (m.type === "notify") {
                // console.log(JSON.stringify(m, undefined, 2));
                await WebhookDispatcher.dispatch(this.sessionId, "messages.upsert", m);
            }
        });

        this.socket.ev.on("connection.update", (update: Partial<ConnectionState>) => {
            const { connection, lastDisconnect, qr } = update;

            // Dispatch Connection Update Webhook
            WebhookDispatcher.dispatch(this.sessionId, "connection.update", update);

            if (qr) {
                this.qrCode = qr;
                console.log(`QR Code received for session ${this.sessionId}`);
            }

            if (connection === "close") {
                const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
                console.log(`Connection closed for session ${this.sessionId}. Reconnecting: ${shouldReconnect}`);
                this.status = "disconnected";

                if (shouldReconnect) {
                    this.start();
                } else {
                    console.log(`Session ${this.sessionId} logged out. Delete session folder to restart.`);
                }
            } else if (connection === "open") {
                console.log(`Session ${this.sessionId} opened successfully`);
                this.status = "connected";
                this.qrCode = undefined;
            }
        });
    }

    getSessionInfo() {
        return {
            sessionId: this.sessionId,
            status: this.status,
            qrCode: this.qrCode
        };
    }
}
