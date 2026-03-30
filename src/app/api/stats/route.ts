import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { startOfWeek, endOfWeek, addWeeks, format } from 'date-fns';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // --- Automated Duty Rotation Logic ---
    const now = new Date();
    const currentWeekStr = format(now, "yyyy-'W'II"); // e.g. 2026-W14
    
    // Fetch all duty settings at once
    const allSettings = await prisma.settings.findMany({
      where: { key: { in: ['current_duty_room', 'duty_room_numbers', 'duty_paused_rooms', 'last_rotation_week'] } }
    });
    
    const getVal = (key: string) => {
      const s = allSettings.find(item => item.key === key);
      return s ? JSON.parse(s.value) : null;
    };

    let currentRoom = getVal('current_duty_room');
    const pool = getVal('duty_room_numbers') || [];
    const paused = getVal('duty_paused_rooms') || [];
    const lastWeek = getVal('last_rotation_week');

    // If it's a new week and we have a pool, rotate!
    if (currentWeekStr !== lastWeek && pool.length > 0) {
      let nextIndex = 0;
      if (currentRoom !== null) {
        const currentIndex = pool.indexOf(currentRoom);
        nextIndex = (currentIndex + 1) % pool.length;
      }
      
      // Skip paused rooms
      let attempts = 0;
      while (paused.includes(pool[nextIndex]) && attempts < pool.length) {
        nextIndex = (nextIndex + 1) % pool.length;
        attempts++;
      }

      const nextRoom = pool[nextIndex];
      
      // Update settings in DB
      await prisma.$transaction([
        prisma.settings.upsert({
          where: { key: 'current_duty_room' },
          update: { value: JSON.stringify(nextRoom) },
          create: { key: 'current_duty_room', value: JSON.stringify(nextRoom) }
        }),
        prisma.settings.upsert({
          where: { key: 'last_rotation_week' },
          update: { value: JSON.stringify(currentWeekStr) },
          create: { key: 'last_rotation_week', value: JSON.stringify(currentWeekStr) }
        })
      ]);
      
      currentRoom = nextRoom;
      console.log(`Rotated duty to Room ${currentRoom} for week ${currentWeekStr}`);
    }
    // --------------------------------------
    
    // Find the user currently on duty
    let onDutyUser = null;
    if (currentRoom) {
      onDutyUser = await prisma.user.findFirst({
        where: { roomNumber: currentRoom },
        select: { id: true, name: true, roomNumber: true }
      });
    }

    const isUserOnDuty = onDutyUser?.id === user.id;

    // Get tasks for the current duty (active tasks)
    const activeTasks = await prisma.cleaningTask.findMany({
      where: { active: true }
    });

    // Get completions for this week (Monday to Sunday)
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    const end = endOfWeek(new Date(), { weekStartsOn: 1 });
    
    // Last week (for public view)
    const lastStart = startOfWeek(addWeeks(new Date(), -1), { weekStartsOn: 1 });
    const lastEnd = endOfWeek(addWeeks(new Date(), -1), { weekStartsOn: 1 });

    const weekCompletions = await prisma.completion.findMany({
      where: {
        completedAt: { gte: start, lte: end }
      },
      include: { task: true, user: true }
    });

    const lastWeekCompletions = await prisma.completion.findMany({
      where: {
        completedAt: { gte: lastStart, lte: lastEnd }
      },
      include: { task: true, user: true }
    });

    // Calculate pending/completed tasks for ON DUTY user specifically this week
    const dutyCompletions = weekCompletions.filter(c => c.userId === onDutyUser?.id);
    const completedTaskIds = new Set(dutyCompletions.map(c => c.taskId));
    
    const pendingTasksCount = activeTasks.length - completedTaskIds.size;
    const completedTasksCount = completedTaskIds.size;

    return NextResponse.json({
      totalTasks: activeTasks.length,
      completedTasks: completedTasksCount,
      pendingTasks: pendingTasksCount,
      overdueTasks: 0, // Simplified for now
      totalUsers: await prisma.user.count(),
      completionRate: activeTasks.length > 0 ? Math.round((completedTasksCount / activeTasks.length) * 100) : 0,
      recentCompletions: weekCompletions,
      lastWeekCompletions,
      currentDutyUser: onDutyUser,
      isUserOnDuty,
      activeTasks, // Return active tasks for checkboxes
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
