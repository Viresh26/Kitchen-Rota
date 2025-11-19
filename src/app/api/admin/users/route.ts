import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { jwtVerify } from 'jose';

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key');

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

export async function GET(request: Request) {
    if (!await isAdmin(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const users = await prisma.user.findMany({
            orderBy: { roomNumber: 'asc' },
            select: {
                id: true,
                roomNumber: true,
                email: true,
                isOptedIn: true,
                isAdmin: true,
            },
        });
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}
