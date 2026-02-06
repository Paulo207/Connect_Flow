
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const response = await fetch(`http://localhost:4000/sessions/${id}/status`);

        if (!response.ok) {
            return NextResponse.json({ status: "disconnected" });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching status from Engine:", error);
        return NextResponse.json({ status: "disconnected" });
    }
}
