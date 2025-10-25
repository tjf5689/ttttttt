import create from 'zustand';
import { MMKV } from 'react-native-mmkv';
import { persist, createJSONStorage } from 'zustand/middleware';
import { addDays, startOfWeek, isSameDay } from 'date-fns';
import type { StoreState, Task, Template, DayPlan, LogItem } from './types';
import { initialState } from './migration';

const storage = new MMKV({ id: 'checkin-v2' });
const mmkvStorage = {
  getItem: (name: string) => storage.getString(name) ?? null,
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => storage.delete(name),
};

function newId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export const useStore = create<StoreState & {
  addTask: (name: string)=>void;
  addTemplate: (name: string, futureDays: number, requiredWeekdays: number[])=>void;
  generatePlans: (days: number)=>void;
  checkIn: (taskName: string)=>void;
  redo: (taskName: string)=>void;
  logsByTask: (taskName: string)=>LogItem[];
  todayList: ()=>{ id:string; name:string }[];
  setAccount: (username: string, displayName: string, avatarUrl: string)=>void;
}>(persist((set, get)=> ({
  ...initialState,

  addTask: (name) => set((s)=> ({
    tasks: [...s.tasks, { id: newId('t'), name, type: 'once' as const }]
  })),

  addTemplate: (name, futureDays, requiredWeekdays) => set((s)=> ({
    templates: [...s.templates, { id: newId('tpl'), name, futureDays, requiredWeekdays }]
  })),

  generatePlans: (days) => set((s)=> {
    const now = new Date(); now.setHours(0,0,0,0);
    const templates = s.templates;
    const list: DayPlan[] = [];
    for(let i=0;i<days;i++){
      const d = addDays(now, i);
      const weekday = (d.getDay()+6)%7;
      templates.forEach(t=>{
        if (t.requiredWeekdays.length===0 || t.requiredWeekdays.includes(weekday)){
          list.push({ id: newId('p'), name: t.name, dateISO: d.toISOString() });
        }
      });
    }
    return { plan: [...s.plan, ...list] };
  }),

  checkIn: (taskName) => set((s)=> {
    const now = new Date();
    const todayLogs = s.logs.filter(l=> new Date(l.timeISO).toDateString()===now.toDateString() && l.taskName===taskName);
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekLogs = s.logs.filter(l=> new Date(l.timeISO) >= weekStart && l.taskName===taskName);
    const log: LogItem = {
      id: newId('log'),
      taskName,
      timeISO: now.toISOString(),
      dayIndexToday: todayLogs.length + 1,
      weekIndex: weekLogs.length + 1,
    };
    return { logs: [log, ...s.logs] };
  }),

  redo: (taskName) => {
    get().checkIn(taskName);
  },

  logsByTask: (taskName) => get().logs.filter(l=> l.taskName===taskName),

  todayList: () => {
    const s = get();
    const now = new Date();
    now.setHours(0,0,0,0);
    const fromOnce = s.tasks.map(t=> ({id:`o-${t.id}`, name: t.name}));
    const fromPlan = s.plan.filter(p=> isSameDay(new Date(p.dateISO), now)).map(p=> ({id:`p-${p.id}`, name: p.name}));
    const map = new Map<string, {id:string;name:string}>();
    [...fromOnce, ...fromPlan].forEach(x=> { if(!map.has(x.name)) map.set(x.name, x); });
    return Array.from(map.values());
  },

  setAccount: (username, displayName, avatarUrl)=> set(()=>({ account: { username, displayName, avatarUrl } })),

}), { name: 'checkin-v2', storage: createJSONStorage(()=>mmkvStorage) }));
