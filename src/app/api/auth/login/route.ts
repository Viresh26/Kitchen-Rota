import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key');

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { roomNumber, password } = body;

        if (!roomNumber || !password) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { roomNumber: parseInt(roomNumber) },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Create JWT
        const token = await new SignJWT({
            userId: user.id,
            roomNumber: user.roomNumber,
            isAdmin: user.isAdmin
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('24h')
            .sign(JWT_SECRET);

        const response = NextResponse.json(
            { success: true, user: { id: user.id, roomNumber: user.roomNumber, isAdmin: user.isAdmin } },
            { status: 200 }
        );

        // Set cookie
        response.cookies.set({
            name: 'token',
            value: token,
            httpOnly: true,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
        });

        return response;

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
