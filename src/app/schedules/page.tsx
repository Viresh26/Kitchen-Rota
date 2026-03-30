'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { formatDate, getRotationTypeLabel } from '@/utils/helpers';
import type { Schedule, CleaningTask, User, Assignment } from '@/types';
import toast from 'react-hot-toast';

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [tasks, setTasks] = useState<CleaningTask[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    rotationType: 'WEEKLY',
  });
  const [assignmentData, setAssignmentData] = useState({
    taskId: '',
    userIds: [] as string[],
    count: 4,
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [schedulesRes, tasksRes, usersRes] = await Promise.all([
        fetch('/api/schedules'),
        fetch('/api/tasks'),
        fetch('/api/users'),
      ]);

      if (schedulesRes.ok) setSchedules(await schedulesRes.json());
      if (tasksRes.ok) setTasks(await tasksRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateSchedule(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          startDate: new Date(formData.startDate).toISOString(),
          endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
        }),
      });

      if (!response.ok) throw new Error('Failed to create schedule');

      toast.success('Schedule created successfully');
      setIsModalOpen(false);
      setFormData({
        name: '',
        description: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        rotationType: 'WEEKLY',
      });
      fetchData();
    } catch (error) {
      console.error('Create schedule error:', error);
      toast.error('Failed to create schedule');
    }
  }

  async function handleAssignTasks(e: React.FormEvent) {
    e.preventDefault();
    
    if (!selectedSchedule || !assignmentData.taskId) return;

    try {
      const response = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: assignmentData.taskId,
          scheduleId: selectedSchedule.id,
          userIds: assignmentData.userIds,
          startDate: selectedSchedule.startDate,
          rotationType: selectedSchedule.rotationType,
          count: assignmentData.count,
        }),
      });

      if (!response.ok) throw new Error('Failed to create assignments');

      toast.success('Tasks assigned successfully');
      setIsAssignModalOpen(false);
      setSelectedSchedule(null);
      setAssignmentData({ taskId: '', userIds: [], count: 4 });
      fetchData();
    } catch (error) {
      console.error('Assign tasks error:', error);
      toast.error('Failed to assign tasks');
    }
  }

  function openAssignModal(schedule: Schedule) {
    setSelectedSchedule(schedule);
    setIsAssignModalOpen(true);
  }

  function toggleUserSelection(userId: string) {
    setAssignmentData((prev) => ({
      ...prev,
      userIds: prev.userIds.includes(userId)
        ? prev.userIds.filter((id) => id !== userId)
        : [...prev.userIds, userId],
    }));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Schedules</h1>
          <p className="text-neutral-600 mt-1">Manage cleaning schedules and assignments</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Schedule
        </Button>
      </div>

      {schedules.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-neutral-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No schedules yet</h3>
            <p className="text-neutral-500 mb-4">Create your first cleaning schedule</p>
            <Button onClick={() => setIsModalOpen(true)}>Create Schedule</Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {schedules.map((schedule) => (
            <Card key={schedule.id}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">{schedule.name}</h3>
                  {schedule.description && (
                    <p className="text-sm text-neutral-500 mt-1">{schedule.description}</p>
                  )}
                </div>
                <Badge variant="primary">{getRotationTypeLabel(schedule.rotationType)}</Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-neutral-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Starts: {formatDate(schedule.startDate)}
                </div>
                {schedule.endDate && (
                  <div className="flex items-center text-sm text-neutral-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Ends: {formatDate(schedule.endDate)}
                  </div>
                )}
              </div>

              <Button onClick={() => openAssignModal(schedule)} className="w-full">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Assign Tasks
              </Button>
            </Card>
          ))}
        </div>
      )}

      {/* Create Schedule Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Schedule"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateSchedule}>Create</Button>
          </>
        }
      >
        <form onSubmit={handleCreateSchedule} className="space-y-4">
          <Input
            label="Schedule Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Weekly Kitchen Cleaning"
            required
          />
          
          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Optional description"
          />
          
          <Input
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
          />
          
          <Input
            label="End Date (optional)"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          />
          
          <Select
            label="Rotation Type"
            value={formData.rotationType}
            onChange={(e) => setFormData({ ...formData, rotationType: e.target.value })}
            options={[
              { value: 'DAILY', label: 'Daily' },
              { value: 'WEEKLY', label: 'Weekly' },
              { value: 'BIWEEKLY', label: 'Bi-weekly' },
              { value: 'MONTHLY', label: 'Monthly' },
            ]}
          />
        </form>
      </Modal>

      {/* Assign Tasks Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setSelectedSchedule(null);
        }}
        title="Assign Tasks"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAssignModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAssignTasks} disabled={!assignmentData.taskId || assignmentData.userIds.length === 0}>
              Assign
            </Button>
          </>
        }
      >
        <form onSubmit={handleAssignTasks} className="space-y-4">
          <Select
            label="Select Task"
            value={assignmentData.taskId}
            onChange={(e) => setAssignmentData({ ...assignmentData, taskId: e.target.value })}
            options={[
              { value: '', label: 'Select a task...' },
              ...tasks.map((t) => ({ value: t.id, label: t.name })),
            ]}
            required
          />
          
          <div>
            <label className="label">Select Users</label>
            <div className="space-y-2 max-h-48 overflow-y-auto border border-neutral-200 rounded-md p-2">
              {users.map((user) => (
                <label key={user.id} className="flex items-center gap-2 p-2 hover:bg-neutral-50 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={assignmentData.userIds.includes(user.id)}
                    onChange={() => toggleUserSelection(user.id)}
                    className="rounded border-neutral-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm">{user.name}</span>
                </label>
              ))}
            </div>
          </div>
          
          <Input
            label="Number of Rotations"
            type="number"
            value={assignmentData.count}
            onChange={(e) => setAssignmentData({ ...assignmentData, count: parseInt(e.target.value) || 1 })}
            min={1}
            max={52}
          />
        </form>
      </Modal>
    </div>
  );
}
