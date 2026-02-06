import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const body = await request.json();
        const {
            webhookUrlSend,
            webhookUrlReceive,
            webhookUrlConnect,
            webhookUrlDisconnect,
            settingsRejectCalls,
            settingsReadMessages,
            settingsReadStatus,
            settingsDisableQueue
        } = body;

        const { id } = await params;
        const instance = await prisma.instance.update({
            where: { id },
            data: {
                webhookUrlSend,
                webhookUrlReceive,
                webhookUrlConnect,
                webhookUrlDisconnect,
                settingsRejectCalls,
                settingsReadMessages,
                settingsReadStatus,
                settingsDisableQueue: settingsDisableQueue ?? false, // Handle legacy/optional
            },
        });

        return NextResponse.json(instance);
    } catch (error) {
        console.error("Error updating instance:", error);
        return NextResponse.json(
            { error: "Failed to update instance settings", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Call Engine to stop/delete session (We need to implement DELETE /sessions/:id in Engine first, but for now we can just delete from DB)
        // Ideally: await fetch(`http://localhost:4000/sessions/${id}`, { method: "DELETE" });

        await prisma.instance.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("Error deleting instance:", error);
        return NextResponse.json(
            { error: "Failed to delete instance" },
            { status: 500 }
        );
    }
}
