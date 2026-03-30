import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get total tasks
    const totalTasks = await prisma.cleaningTask.count({
      where: { active: true },
    });

    // Get assignments for this user
    const userAssignments = await prisma.assignment.findMany({
      where: { userId: user.id },
      include: { task: true },
    });

    const completedTasks = userAssignments.filter(a => a.completed).length;
    const pendingTasks = userAssignments.filter(a => !a.completed).length;
    
    const now = new Date();
    const overdueTasks = userAssignments.filter(
      a => !a.completed && new Date(a.dueDate) < now
    ).length;

    // Get total users
    const totalUsers = await prisma.user.count();

    // Calculate completion rate
    const completionRate = userAssignments.length > 0
      ? Math.round((completedTasks / userAssignments.length) * 100)
      : 0;

    // Get recent completions
    const recentCompletions = await prisma.completion.findMany({
      where: { userId: user.id },
      include: {
        task: true,
      },
      orderBy: { completedAt: 'desc' },
      take: 5,
    });

    // Get upcoming assignments
    const upcomingAssignments = await prisma.assignment.findMany({
      where: {
        userId: user.id,
        completed: false,
        dueDate: { gte: now },
      },
      include: {
        task: true,
        schedule: true,
      },
      orderBy: { dueDate: 'asc' },
      take: 5,
    });

    return NextResponse.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      totalUsers,
      completionRate,
      recentCompletions,
      upcomingAssignments,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
