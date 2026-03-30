import { format, formatDistanceToNow, startOfWeek, endOfWeek, eachDayOfInterval, addDays, isToday, isTomorrow, isYesterday, isAfter, isBefore, parseISO } from 'date-fns';

export function formatDate(date: Date | string): string {
  return format(typeof date === 'string' ? parseISO(date) : date, 'MMM dd, yyyy');
}

export function formatTime(date: Date | string): string {
  return format(typeof date === 'string' ? parseISO(date) : date, 'hh:mm a');
}

export function formatDateTime(date: Date | string): string {
  return format(typeof date === 'string' ? parseISO(date) : date, 'MMM dd, yyyy hh:mm a');
}

export function formatRelative(date: Date | string): string {
  return formatDistanceToNow(typeof date === 'string' ? parseISO(date) : date, { addSuffix: true });
}

export function getWeekDays(date: Date = new Date()) {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
}

export function getNextDays(days: number, startDate: Date = new Date()) {
  return Array.from({ length: days }, (_, i) => addDays(startDate, i));
}

export function isDateToday(date: Date | string): boolean {
  return isToday(typeof date === 'string' ? parseISO(date) : date);
}

export function isDateTomorrow(date: Date | string): boolean {
  return isTomorrow(typeof date === 'string' ? parseISO(date) : date);
}

export function isDateYesterday(date: Date | string): boolean {
  return isYesterday(typeof date === 'string' ? parseISO(date) : date);
}

export function isDateOverdue(date: Date | string): boolean {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return isBefore(parsedDate, new Date()) && !isToday(parsedDate);
}

export function getFrequencyLabel(frequency: string): string {
  const labels: Record<string, string> = {
    DAILY: 'Daily',
    WEEKLY: 'Weekly',
    BIWEEKLY: 'Bi-weekly',
    MONTHLY: 'Monthly',
  };
  return labels[frequency] || frequency;
}

export function getPriorityLabel(priority: string): string {
  const labels: Record<string, string> = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
  };
  return labels[priority] || priority;
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    LOW: 'text-green-600 bg-green-100',
    MEDIUM: 'text-yellow-600 bg-yellow-100',
    HIGH: 'text-red-600 bg-red-100',
  };
  return colors[priority] || 'text-gray-600 bg-gray-100';
}

export function getRotationTypeLabel(rotationType: string): string {
  const labels: Record<string, string> = {
    DAILY: 'Daily',
    WEEKLY: 'Weekly',
    BIWEEKLY: 'Bi-weekly',
    MONTHLY: 'Monthly',
  };
  return labels[rotationType] || rotationType;
}

export function getNotificationTypeColor(type: string): string {
  const colors: Record<string, string> = {
    INFO: 'text-blue-600 bg-blue-100',
    REMINDER: 'text-yellow-600 bg-yellow-100',
    WARNING: 'text-red-600 bg-red-100',
    SUCCESS: 'text-green-600 bg-green-100',
  };
  return colors[type] || 'text-gray-600 bg-gray-100';
}

export function calculateCompletionRate(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}
