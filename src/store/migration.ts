// B 方案：重设计存储，默认清空旧数据，只保留最小示例。
import type { StoreState } from './types';

export const initialState: StoreState = {
  account: {
    username: 'username',
    displayName: '未命名账号',
    avatarUrl: 'https://i.pravatar.cc/100?img=12',
  },
  tasks: [
    { id: 't1', name: '晨跑 3 公里', type: 'once' },
    { id: 't2', name: '英语听力 30 分钟', type: 'once' },
  ],
  templates: [
    { id: 'd1', name: '学习日模板', futureDays: 14, requiredWeekdays: [1,3,5] },
  ],
  plan: [],
  logs: [],
};
