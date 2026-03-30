import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      roomNumber?: number | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    roomNumber?: number | null;
    image?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    roomNumber?: number | null;
  }
}

export interface CleaningTask {
  id: string;
  name: string;
  description: string | null;
  frequency: 'DAILY' | 'TWICE_WEEKLY' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
}

export interface Completion {
  id: string;
  taskId: string;
  userId: string;
  completedAt: Date;
  notes: string | null;
  verified: boolean;
  verifiedBy: string | null;
  verifiedAt: Date | null;
  task?: CleaningTask;
  user?: User;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'REMINDER' | 'WARNING' | 'SUCCESS';
  read: boolean;
  createdAt: Date;
  link: string | null;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  roomNumber: number | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  totalUsers: number;
  completionRate: number;
}
