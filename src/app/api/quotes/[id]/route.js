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

export async function PATCH(request, { params }) {
    const { id } = await params;
    try {
        const body = await request.json();
        const { client, preparedBy, date, notes, items, total, companyName, companyAddress, taxRate, showTax } = body;

        const updatedQuote = await prisma.$transaction(async (tx) => {
            // Delete existing items
            await tx.quoteItem.deleteMany({
                where: { quoteId: id }
            });

            // Update quote and create new items
            return await tx.quote.update({
                where: { id },
                data: {
                    client,
                    preparedBy,
                    companyName,
                    companyAddress,
                    date: new Date(date),
                    notes,
                    taxRate: parseFloat(taxRate) || 0,
                    showTax: Boolean(showTax),
                    total,
                    items: {
                        create: items.map(item => ({
                            description: item.description,
                            quantity: item.quantity,
                            price: item.price,
                            taxRate: parseFloat(item.taxRate || 21),
                            total: item.total
                        }))
                    }
                },
                include: { items: true }
            });
        });

        return NextResponse.json(updatedQuote);
    } catch (error) {
        console.error("PATCH API Error:", error);
        return NextResponse.json({
            error: "Failed to update quote",
            details: error.message,
            code: error.code
        }, { status: 500 });
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
