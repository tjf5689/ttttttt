export type Task = {
  id: string;
  name: string;
  type: 'once' | 'dailyTemplate';
};

export type DayPlan = {
  id: string;
  name: string;
  dateISO: string; // 00:00 当天
};

export type LogItem = {
  id: string;
  taskName: string;
  timeISO: string;
  dayIndexToday: number;
  weekIndex: number;
};

export type Template = {
  id: string;
  name: string;
  futureDays: number;          // 未来 N 天生成
  requiredWeekdays: number[];  // 0..6 (Mon..Sun)
};

export type Account = {
  username: string;
  displayName: string;
  avatarUrl: string;
};

export type StoreState = {
  account: Account;
  tasks: Task[];
  templates: Template[];
  plan: DayPlan[];
  logs: LogItem[];
};
