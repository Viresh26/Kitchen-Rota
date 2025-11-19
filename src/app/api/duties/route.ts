import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { jwtVerify } from 'jose';

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key');

// Helper to verify admin
async function isAdmin(request: Request) {
    const token = request.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
    if (!token) return false;
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload.isAdmin === true;
    } catch {
        return false;
    }
}

export async function GET() {
    try {
        const duties = await prisma.duty.findMany({
            orderBy: { order: 'asc' },
        });
        return NextResponse.json(duties);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch duties' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    if (!await isAdmin(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { description } = await request.json();

        // Get max order
        const lastDuty = await prisma.duty.findFirst({
            orderBy: { order: 'desc' },
        });
        const newOrder = (lastDuty?.order ?? 0) + 1;

        const duty = await prisma.duty.create({
            data: {
                description,
                order: newOrder,
            },
        });

        return NextResponse.json(duty, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create duty' }, { status: 500 });
    }
}
