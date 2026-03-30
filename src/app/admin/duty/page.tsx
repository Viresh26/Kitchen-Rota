'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import toast from 'react-hot-toast';

export default function AdminDutyPage() {
  const [roomNumbers, setRoomNumbers] = useState<number[]>([]);
  const [currentRoom, setCurrentRoom] = useState<number | null>(null);
  const [pausedRooms, setPausedRooms] = useState<number[]>([]);
  const [allRooms] = useState(Array.from({ length: 11 }, (_, i) => i + 1));
  const [loading, setLoading] = useState(true);

  const [switchRoom1, setSwitchRoom1] = useState<number | ''>('');
  const [switchRoom2, setSwitchRoom2] = useState<number | ''>('');

  useEffect(() => {
    fetchDutySettings();
  }, []);

  async function fetchDutySettings() {
    try {
      const response = await fetch('/api/duty');
      if (response.ok) {
        const data = await response.json();
        setRoomNumbers(data.roomNumbers || []);
        setCurrentRoom(data.currentRoom);
        setPausedRooms(data.pausedRooms || []);
      }
    } catch (error) {
      toast.error('Failed to load duty settings');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdatePool(newPool: number[]) {
    try {
      const response = await fetch('/api/duty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_pool', roomNumbers: newPool }),
      });
      if (response.ok) {
        setRoomNumbers(newPool);
        toast.success('Duty pool updated');
      }
    } catch (error) {
      toast.error('Failed to update pool');
    }
  }

  async function handleSetCurrent(room: number) {
    try {
      const response = await fetch('/api/duty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'set_current', currentRoom: room }),
      });
      if (response.ok) {
        setCurrentRoom(room);
        toast.success(`Duty set to Room ${room}`);
      }
    } catch (error) {
      toast.error('Failed to set current duty');
    }
  }

  async function handleSwitch() {
    if (switchRoom1 === '' || switchRoom2 === '') return;
    try {
      const response = await fetch('/api/duty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'switch', room1: switchRoom1, room2: switchRoom2 }),
      });
      if (response.ok) {
        toast.success('Duties switched');
        fetchDutySettings();
        setSwitchRoom1('');
        setSwitchRoom2('');
      }
    } catch (error) {
      toast.error('Failed to switch duties');
    }
  }

  async function handlePause(room: number) {
    try {
      const response = await fetch('/api/duty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'pause', pauseRoom: room }),
      });
      if (response.ok) {
        toast.success(`Room ${room} duty paused`);
        fetchDutySettings();
      }
    } catch (error) {
      toast.error('Failed to pause duty');
    }
  }

  async function handleUnpause(room: number) {
    try {
      const response = await fetch('/api/duty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'unpause', pauseRoom: room }),
      });
      if (response.ok) {
        toast.success(`Room ${room} duty unpaused`);
        fetchDutySettings();
      }
    } catch (error) {
      toast.error('Failed to unpause duty');
    }
  }

  async function handleResetRoom(room: number) {
    if (!confirm(`Are you sure you want to reset Room ${room}? This will DELETE the associated user and all their task history. This cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/rooms/${room}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        toast.success(`Room ${room} has been reset`);
        fetchDutySettings();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to reset room');
      }
    } catch (error) {
      toast.error('Failed to reset room');
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Duty Management</h1>
        <p className="text-neutral-600 mt-1">Configure kitchen duty rotation and room-based tasks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Duty Pool" description="Select which rooms are part of the rotation.">
          <div className="grid grid-cols-4 gap-2">
            {allRooms.map(room => (
              <button
                key={room}
                onClick={() => {
                  const newPool = roomNumbers.includes(room)
                    ? roomNumbers.filter(r => r !== room)
                    : [...roomNumbers, room].sort((a,b) => a-b);
                  handleUpdatePool(newPool);
                }}
                className={`py-2 rounded-lg border transition-all ${
                  roomNumbers.includes(room)
                    ? 'bg-primary border-primary text-white font-bold'
                    : 'bg-white border-neutral-200 text-neutral-600 hover:border-primary-300'
                }`}
              >
                Room {room}
              </button>
            ))}
          </div>
        </Card>

        <Card title="Current Duty" description="Select whose duty it is this week.">
          <div className="space-y-4">
            <Select
              value={currentRoom?.toString() || ''}
              onChange={(e) => handleSetCurrent(Number(e.target.value))}
              options={[
                { value: '', label: 'Select a room' },
                ...roomNumbers.map(r => ({ value: r.toString(), label: `Room ${r}` }))
              ]}
            />
            {currentRoom && (
              <div className="p-4 bg-primary-50 rounded-lg border border-primary-100 flex items-center justify-between">
                <div>
                  <p className="text-sm text-primary-600 font-medium">Currently on Duty</p>
                  <p className="text-xl font-bold text-primary-900">Room {currentRoom}</p>
                </div>
                <Badge variant="success">Active</Badge>
              </div>
            )}
          </div>
        </Card>

        <Card title="Switch Duties" description="Swap the rotation order of two rooms.">
          <div className="flex items-center gap-4">
            <Select
              className="flex-1"
              value={switchRoom1.toString()}
              onChange={(e) => setSwitchRoom1(e.target.value === '' ? '' : Number(e.target.value))}
              options={[
                { value: '', label: 'Room 1' },
                ...roomNumbers.map(r => ({ value: r.toString(), label: `Room ${r}` }))
              ]}
            />
            <span className="text-neutral-400">↔</span>
            <Select
              className="flex-1"
              value={switchRoom2.toString()}
              onChange={(e) => setSwitchRoom2(e.target.value === '' ? '' : Number(e.target.value))}
              options={[
                { value: '', label: 'Room 2' },
                ...roomNumbers.map(r => ({ value: r.toString(), label: `Room ${r}` }))
              ]}
            />
            <Button onClick={handleSwitch} disabled={switchRoom1 === '' || switchRoom2 === ''}>
              Switch
            </Button>
          </div>
        </Card>

        <Card title="Pause Duty" description="Temporarily skip a room in the rotation.">
          <div className="space-y-3">
             <div className="flex gap-2 flex-wrap">
               {roomNumbers.map(room => (
                 <button
                    key={room}
                    onClick={() => pausedRooms.includes(room) ? handleUnpause(room) : handlePause(room)}
                 >
                   <Badge 
                      variant={pausedRooms.includes(room) ? "danger" : "neutral"}
                      className="cursor-pointer py-1 px-3"
                   >
                     Room {room} {pausedRooms.includes(room) ? "(Paused)" : ""}
                   </Badge>
                 </button>
               ))}
             </div>
             <p className="text-xs text-neutral-500 italic">Click a badge to toggle pause status.</p>
          </div>
        </Card>

        <Card title="Tenant Management" description="Reset a room when a tenant changes. This deletes the user.">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {allRooms.map(room => (
              <div key={room} className="flex flex-col gap-2 p-3 border border-neutral-100 rounded-lg bg-neutral-50">
                <span className="text-sm font-bold text-neutral-900">Room {room}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-600 hover:bg-red-50 hover:border-red-200"
                  onClick={() => handleResetRoom(room)}
                >
                  Reset
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
