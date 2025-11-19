import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        // Get the current week's start date (Monday)
        const today = new Date();
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        const monday = new Date(today.setDate(diff));
        monday.setHours(0, 0, 0, 0);

        // Check if rota exists for this week
        let currentRota = await prisma.rota.findFirst({
            where: {
                weekStartDate: monday,
            },
            include: {
                user: {
                    select: {
                        roomNumber: true,
                        email: true,
                    },
                },
            },
        });

        if (!currentRota) {
            // Generate new rota
            // 1. Get all opted-in users
            const eligibleUsers = await prisma.user.findMany({
                where: { isOptedIn: true },
                orderBy: { roomNumber: 'asc' },
            });

            if (eligibleUsers.length === 0) {
                return NextResponse.json({ message: 'No eligible users for rota' }, { status: 404 });
            }

            // 2. Find last rota to determine next person
            const lastRota = await prisma.rota.findFirst({
                orderBy: { weekStartDate: 'desc' },
            });

            let nextUserIndex = 0;

            if (lastRota) {
                const lastUserIndex = eligibleUsers.findIndex(u => u.id === lastRota.userId);
                if (lastUserIndex !== -1) {
                    nextUserIndex = (lastUserIndex + 1) % eligibleUsers.length;
                }
            }

            const nextUser = eligibleUsers[nextUserIndex];

            currentRota = await prisma.rota.create({
                data: {
                    weekStartDate: monday,
                    userId: nextUser.id,
                },
                include: {
                    user: {
                        select: {
                            roomNumber: true,
                            email: true,
                        },
                    },
                },
            });
        }

        return NextResponse.json(currentRota);
    } catch (error) {
        console.error('Rota error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
