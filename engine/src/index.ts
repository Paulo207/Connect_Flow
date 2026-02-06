import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { WhatsAppSession } from "./lib/WhatsAppSession";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const sessions = new Map<string, WhatsAppSession>();

app.get("/", (req, res) => {
    res.json({ status: "online", service: "ConnectFlow Engine" });
});

// Create/Start Session
app.post("/sessions", async (req, res) => {
    try {
        const { sessionId } = req.body;

        if (!sessionId) {
            return res.status(400).json({ error: "sessionId is required" });
        }

        if (sessions.has(sessionId)) {
            return res.json({ message: "Session already exists", session: sessions.get(sessionId)?.getSessionInfo() });
        }

        const session = new WhatsAppSession(sessionId);
        await session.start();
        sessions.set(sessionId, session);

        res.json({ message: "Session started", session: session.getSessionInfo() });
    } catch (error) {
        console.error("Error starting session:", error);
        res.status(500).json({ error: "Failed to start session" });
    }
});

// Get Session Status (QR Code)
app.get("/sessions/:sessionId/status", (req, res) => {
    const { sessionId } = req.params;
    const session = sessions.get(sessionId);

    if (!session) {
        return res.status(404).json({ error: "Session not found" });
    }

    res.json(session.getSessionInfo());
});

app.listen(PORT, () => {
    console.log(`WhatsApp Engine running on port ${PORT}`);
});
