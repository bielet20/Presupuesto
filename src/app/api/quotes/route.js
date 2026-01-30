import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { client, preparedBy, date, notes, items, total } = await request.json();

        const quote = await prisma.quote.create({
            data: {
                client,
                preparedBy,
                date: new Date(date),
                notes,
                total,
                items: {
                    create: items.map(item => ({
                        description: item.description,
                        quantity: item.quantity,
                        price: item.price,
                        total: item.total
                    }))
                }
            },
            include: {
                items: true
            }
        });

        return NextResponse.json(quote, { status: 201 });
    } catch (error) {
        console.error("API POST ERROR:", error);
        if (error.code) console.error("Error Code:", error.code);
        if (error.meta) console.error("Error Meta:", error.meta);
        return NextResponse.json({
            error: "Failed to create quote",
            details: error.message,
            code: error.code
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        const quotes = await prisma.quote.findMany({
            include: {
                items: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return NextResponse.json(quotes);
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Failed to fetch quotes" }, { status: 500 });
    }
}
