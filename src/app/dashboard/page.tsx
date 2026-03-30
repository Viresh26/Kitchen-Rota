'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate, cn } from '@/utils/helpers';
import type { CleaningTask, Completion } from '@/types';
import toast from 'react-hot-toast';

interface DashboardData {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  totalUsers: number;
  completionRate: number;
  recentCompletions: Completion[];
  lastWeekCompletions: Completion[];
  currentDutyUser: { id: string; name: string; roomNumber: number } | null;
  isUserOnDuty: boolean;
  activeTasks: CleaningTask[];
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      const response = await fetch('/api/stats');
      if (response.ok) {
        setData(await response.json());
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleTask(taskId: string, isCompleted: boolean) {
    if (!data?.isUserOnDuty) return;

    try {
      if (!isCompleted) {
        const response = await fetch('/api/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ taskId }),
        });

        if (response.ok) {
          toast.success('Task marked as completed');
          fetchDashboardData();
        }
      }
    } catch (error) {
      toast.error('Failed to update task');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isCompleted = (taskId: string) => 
    data?.recentCompletions.some(c => c.taskId === taskId && c.user?.id === data.currentDutyUser?.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Kitchen Dashboard</h1>
          <p className="text-neutral-600 mt-1">Weekly duty overview and task tracking.</p>
        </div>
        <Card className="bg-primary-50 border-primary-100 py-3 px-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-primary-600 font-semibold uppercase tracking-wider">This Week's Duty</p>
              <p className="text-lg font-bold text-primary-900">
                {data?.currentDutyUser ? `${data.currentDutyUser.name} (Room ${data.currentDutyUser.roomNumber})` : 'No one assigned'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Checklist */}
        <Card className="lg:col-span-2" title="Weekly Tasks" description={data?.isUserOnDuty ? "It's your duty this week! Mark tasks as you complete them." : `Check the status of tasks for room ${data?.currentDutyUser?.roomNumber}.`}>
          <div className="space-y-4">
            {data?.activeTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-100 hover:border-primary-200 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={isCompleted(task.id)}
                      onChange={() => toggleTask(task.id, !!isCompleted(task.id))}
                      disabled={!data.isUserOnDuty || isCompleted(task.id)}
                      className="w-6 h-6 rounded border-neutral-300 text-primary focus:ring-primary disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <p className={cn("font-semibold text-neutral-900", isCompleted(task.id) && "line-through text-neutral-400")}>
                      {task.name}
                    </p>
                    {task.description && <p className="text-sm text-neutral-500">{task.description}</p>}
                  </div>
                </div>
                <Badge variant={isCompleted(task.id) ? "success" : "warning"}>
                  {isCompleted(task.id) ? "Completed" : "Pending"}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Stats & Progress */}
        <div className="space-y-6">
          <Card title="Duty Progress">
            <div className="space-y-4 pt-2">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Completion Rate</p>
                  <p className="text-3xl font-bold text-neutral-900">{data?.completionRate}%</p>
                </div>
                <p className="text-sm font-medium text-primary">
                  {data?.completedTasks} / {data?.totalTasks} Tasks
                </p>
              </div>
              <div className="w-full bg-neutral-100 rounded-full h-3">
                <div 
                  className="bg-primary h-3 rounded-full transition-all duration-700" 
                  style={{ width: `${data?.completionRate}%` }}
                />
              </div>
            </div>
          </Card>

          <Card title="History" description="Team completions over the last 2 weeks">
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">This Week</h4>
                {data?.recentCompletions.slice(0, 3).map((c) => (
                  <div key={c.id} className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <p className="text-sm text-neutral-700 truncate flex-1">
                      <span className="font-medium text-neutral-900">Room {c.user?.roomNumber}</span> completed <span className="text-neutral-600">{c.task?.name}</span>
                    </p>
                  </div>
                ))}
              </div>
              <div className="pt-2">
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Last Week</h4>
                {data?.lastWeekCompletions.slice(0, 3).map((c) => (
                  <div key={c.id} className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-neutral-300" />
                    <p className="text-sm text-neutral-500 truncate flex-1">
                      Room {c.user?.roomNumber} completed {c.task?.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

