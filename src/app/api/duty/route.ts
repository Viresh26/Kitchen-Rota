import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { startOfWeek, endOfWeek, addWeeks, format } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const settings = await prisma.settings.findMany({
      where: {
        key: { in: ['duty_room_numbers', 'current_duty_room', 'duty_paused_rooms'] }
      }
    });

    const config: any = {};
    settings.forEach(s => {
      config[s.key] = JSON.parse(s.value);
    });

    return NextResponse.json({
      roomNumbers: config.duty_room_numbers || [],
      currentRoom: config.current_duty_room || null,
      pausedRooms: config.duty_paused_rooms || [],
    });
  } catch (error) {
    console.error('Get duty error:', error);
    return NextResponse.json({ error: 'Failed to fetch duty settings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, roomNumbers, currentRoom, room1, room2, pauseRoom } = await request.json();

    if (action === 'update_pool') {
      await prisma.settings.upsert({
        where: { key: 'duty_room_numbers' },
        update: { value: JSON.stringify(roomNumbers) },
        create: { key: 'duty_room_numbers', value: JSON.stringify(roomNumbers) }
      });
    } else if (action === 'set_current') {
      await prisma.settings.upsert({
        where: { key: 'current_duty_room' },
        update: { value: JSON.stringify(currentRoom) },
        create: { key: 'current_duty_room', value: JSON.stringify(currentRoom) }
      });
    } else if (action === 'switch') {
      const resp = await prisma.settings.findUnique({ where: { key: 'duty_room_numbers' } });
      let pool = resp ? JSON.parse(resp.value) : [];
      const idx1 = pool.indexOf(room1);
      const idx2 = pool.indexOf(room2);
      if (idx1 !== -1 && idx2 !== -1) {
        [pool[idx1], pool[idx2]] = [pool[idx2], pool[idx1]];
        await prisma.settings.update({
          where: { key: 'duty_room_numbers' },
          data: { value: JSON.stringify(pool) }
        });
      }
    } else if (action === 'pause') {
      const resp = await prisma.settings.findUnique({ where: { key: 'duty_paused_rooms' } });
      const paused = resp ? JSON.parse(resp.value) : [];
      if (!paused.includes(pauseRoom)) {
        paused.push(pauseRoom);
        await prisma.settings.upsert({
          where: { key: 'duty_paused_rooms' },
          update: { value: JSON.stringify(paused) },
          create: { key: 'duty_paused_rooms', value: JSON.stringify(paused) }
        });
        
        // If the paused room is the current duty room, move to next
        const currentResp = await prisma.settings.findUnique({ where: { key: 'current_duty_room' } });
        const current = currentResp ? JSON.parse(currentResp.value) : null;
        if (current === pauseRoom) {
           const poolResp = await prisma.settings.findUnique({ where: { key: 'duty_room_numbers' } });
           const pool = poolResp ? JSON.parse(poolResp.value) : [];
           const currentIndex = pool.indexOf(current);
           let nextIndex = (currentIndex + 1) % pool.length;
           while (paused.includes(pool[nextIndex]) && pool[nextIndex] !== current) {
             nextIndex = (nextIndex + 1) % pool.length;
           }
           await prisma.settings.update({
             where: { key: 'current_duty_room' },
             data: { value: JSON.stringify(pool[nextIndex]) }
           });
        }
      }
    } else if (action === 'unpause') {
      const resp = await prisma.settings.findUnique({ where: { key: 'duty_paused_rooms' } });
      let paused = resp ? JSON.parse(resp.value) : [];
      paused = paused.filter((r: number) => r !== pauseRoom);
      await prisma.settings.update({
        where: { key: 'duty_paused_rooms' },
        data: { value: JSON.stringify(paused) }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update duty error:', error);
    return NextResponse.json({ error: 'Failed to update duty settings' }, { status: 500 });
  }
}
