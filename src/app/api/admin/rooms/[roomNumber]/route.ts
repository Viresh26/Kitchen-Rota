import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export const runtime = 'edge';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ roomNumber: string }> }
) {
  try {
    const session = await auth();
    
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { roomNumber: roomNumberRaw } = await params;
    const roomNumber = parseInt(roomNumberRaw);
    
    if (isNaN(roomNumber)) {
      return NextResponse.json({ error: 'Invalid room number' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { roomNumber },
    });

    if (!user) {
      return NextResponse.json({ error: 'No user found for this room' }, { status: 404 });
    }

    // Use a transaction to cleanup all associated data and delete user
    await prisma.$transaction([
      prisma.completion.deleteMany({ where: { userId: user.id } }),
      prisma.notification.deleteMany({ where: { userId: user.id } }),
      prisma.user.delete({ where: { id: user.id } }),
    ]);

    return NextResponse.json({ message: `Room ${roomNumber} has been reset.` });
  } catch (error) {
    console.error('Room reset error:', error);
    return NextResponse.json(
      { error: 'Failed to reset room' },
      { status: 500 }
    );
  }
}
