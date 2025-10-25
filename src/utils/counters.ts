import { startOfWeek } from 'date-fns';
import type { LogItem } from '../store/types';

export function todayIndex(logs: LogItem[], name: string) {
  const now = new Date();
  const tlogs = logs.filter(l=> l.taskName===name && new Date(l.timeISO).toDateString()===now.toDateString());
  return tlogs.length;
}

export function weekIndex(logs: LogItem[], name: string) {
  const now = new Date();
  const ws = startOfWeek(now, { weekStartsOn: 1 });
  const wlogs = logs.filter(l=> l.taskName===name && new Date(l.timeISO) >= ws);
  return wlogs.length;
}
