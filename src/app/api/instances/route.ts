import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name } = body;

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        const token = randomBytes(24).toString("hex");

        const instance = await prisma.instance.create({
            data: {
                name,
                token: token || crypto.randomUUID(), // Ensure token is provided
                status: "disconnected",
            },
        });

        // Call Engine to start session
        try {
            await fetch("http://localhost:4000/sessions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ sessionId: instance.id }),
            });
        } catch (error) {
            console.error("Failed to start session on Engine:", error);
            // Optional: Decide if we should fail the request or just log the error
        }

        return NextResponse.json(instance);
    } catch (error) {
        console.error("Error creating instance:", error);
        return NextResponse.json(
            { error: "Failed to create instance" },
            { status: 500 }
        );
    }
}
