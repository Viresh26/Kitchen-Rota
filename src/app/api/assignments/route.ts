import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { addDays, addWeeks, addMonths } from 'date-fns';

const assignmentSchema = z.object({
  taskId: z.string(),
  userId: z.string(),
  scheduleId: z.string(),
  dueDate: z.string().transform((s) => new Date(s)),
});

const bulkAssignSchema = z.object({
  taskId: z.string(),
  scheduleId: z.string(),
  userIds: z.array(z.string()),
  startDate: z.string().transform((s) => new Date(s)),
  rotationType: z.enum(['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY']),
  count: z.number().int().positive(),
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
    const scheduleId = searchParams.get('scheduleId');

    const where: Record<string, unknown> = {};
    if (userId) where.userId = userId;
    if (taskId) where.taskId = taskId;
    if (scheduleId) where.scheduleId = scheduleId;

    const assignments = await prisma.assignment.findMany({
      where,
      include: {
        task: true,
        user: { select: { id: true, name: true, email: true } },
        schedule: true,
      },
      orderBy: { dueDate: 'asc' },
    });

    return NextResponse.json(assignments);
  } catch (error) {
    console.error('Get assignments error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assignments' },
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
    
    // Check if it's a bulk assignment
    if (body.userIds && body.count) {
      const validation = bulkAssignSchema.safeParse(body);
      
      if (!validation.success) {
        return NextResponse.json(
          { error: validation.error.errors[0].message },
          { status: 400 }
        );
      }

      const { taskId, scheduleId, userIds, startDate, rotationType, count } = validation.data;
      const assignments = [];

      for (let i = 0; i < count; i++) {
        let dueDate: Date;
        switch (rotationType) {
          case 'DAILY':
            dueDate = addDays(startDate, i);
            break;
          case 'WEEKLY':
            dueDate = addWeeks(startDate, i);
            break;
          case 'BIWEEKLY':
            dueDate = addWeeks(startDate, i * 2);
            break;
          case 'MONTHLY':
            dueDate = addMonths(startDate, i);
            break;
        }

        const assignment = await prisma.assignment.create({
          data: {
            taskId,
            userId: userIds[i % userIds.length],
            scheduleId,
            dueDate,
          },
          include: {
            task: true,
            user: { select: { id: true, name: true, email: true } },
            schedule: true,
          },
        });
        assignments.push(assignment);
      }

      return NextResponse.json(assignments, { status: 201 });
    }

    // Single assignment
    const validation = assignmentSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const assignment = await prisma.assignment.create({
      data: validation.data,
      include: {
        task: true,
        user: { select: { id: true, name: true, email: true } },
        schedule: true,
      },
    });

    return NextResponse.json(assignment, { status: 201 });
  } catch (error) {
    console.error('Create assignment error:', error);
    return NextResponse.json(
      { error: 'Failed to create assignment' },
      { status: 500 }
    );
  }
}
