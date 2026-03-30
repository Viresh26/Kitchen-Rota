import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    image?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
  }
}

export interface CleaningTask {
  id: string;
  name: string;
  description: string | null;
  frequency: 'DAILY' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
  duration: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
}

export interface Assignment {
  id: string;
  taskId: string;
  userId: string;
  scheduleId: string;
  dueDate: Date;
  completed: boolean;
  verified: boolean;
  verifiedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  task?: CleaningTask;
  user?: User;
}

export interface Schedule {
  id: string;
  name: string;
  description: string | null;
  startDate: Date;
  endDate: Date | null;
  rotationType: 'DAILY' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Completion {
  id: string;
  assignmentId: string;
  taskId: string;
  userId: string;
  completedAt: Date;
  notes: string | null;
  verified: boolean;
  verifiedBy: string | null;
  verifiedAt: Date | null;
  task?: CleaningTask;
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
