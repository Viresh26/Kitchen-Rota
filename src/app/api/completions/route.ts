import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { startOfWeek, endOfWeek } from 'date-fns';

const completionSchema = z.object({
  assignmentId: z.string().optional(),
  taskId: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const taskId = searchParams.get('taskId');

    const where: Record<string, unknown> = {};
    if (userId) where.userId = userId;
    if (taskId) where.taskId = taskId;

    const completions = await prisma.completion.findMany({
      where,
      include: {
        task: true,
        user: { select: { id: true, name: true, email: true, roomNumber: true } } as any,
      },
      orderBy: { completedAt: 'desc' },
    });

    return NextResponse.json(completions);
  } catch (error) {
    console.error('Get completions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch completions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = completionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { taskId, notes } = validation.data;

    if (!taskId) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    // Check if task exists
    const task = await prisma.cleaningTask.findUnique({
      where: { id: taskId }
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Create completion record directly
    const completion = await prisma.completion.create({
      data: {
        taskId: taskId,
        userId: user.id,
        notes: notes,
      },
      include: {
        task: true,
        user: { select: { id: true, name: true, roomNumber: true } } as any,
      },
    });

    return NextResponse.json(completion, { status: 201 });
  } catch (error) {
    console.error('Create completion error:', error);
    return NextResponse.json(
      { error: 'Failed to record completion' },
      { status: 500 }
    );
  }
}
