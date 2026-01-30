import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    const { id } = await params;
    try {
        const quote = await prisma.quote.findUnique({
            where: { id },
            include: { items: true }
        });

        if (!quote) return NextResponse.json({ error: "Quote not found" }, { status: 404 });

        return NextResponse.json(quote);
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Failed to fetch quote" }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const { id } = await params;
    try {
        await prisma.quote.delete({
            where: { id }
        });
        return NextResponse.json({ message: "Quote deleted successfully" });
    } catch (error) {
        console.error("DELETE API Error:", error);
        return NextResponse.json({ error: "Failed to delete quote" }, { status: 500 });
    }
}
