import axios from "axios";
import { prisma } from "./prisma";

type WebhookEvent = "messages.upsert" | "connection.update" | "messages.update";

export class WebhookDispatcher {
    static async dispatch(instanceId: string, event: WebhookEvent, payload: any) {
        try {
            const instance = await prisma.instance.findUnique({
                where: { id: instanceId },
                select: {
                    webhookUrl: true,
                    webhookUrlSend: true,
                    webhookUrlReceive: true,
                    webhookUrlConnect: true,
                    webhookUrlDisconnect: true
                }
            });

            if (!instance) return;

            // Determine which URL to use based on the event
            let targetUrl = instance.webhookUrl; // Default legacy URL

            if (event === "messages.upsert" && instance.webhookUrlReceive) {
                targetUrl = instance.webhookUrlReceive;
            } else if (event === "connection.update") {
                const status = payload?.status;
                if (status === "open" && instance.webhookUrlConnect) {
                    targetUrl = instance.webhookUrlConnect;
                } else if (status === "close" && instance.webhookUrlDisconnect) {
                    targetUrl = instance.webhookUrlDisconnect;
                }
            }

            // Fallback to generic webhookUrl if specific one is not set
            if (!targetUrl) return;

            console.log(`Dispatching webhook ${event} to ${targetUrl}`);

            await axios.post(targetUrl, {
                event: event,
                instanceId: instanceId,
                data: payload,
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error(`Failed to dispatch webhook for instance ${instanceId}:`, error);
        }
    }
}
