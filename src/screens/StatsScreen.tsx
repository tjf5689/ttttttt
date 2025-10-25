import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useStore } from '../store/useStore';
import { colors } from '../app/theme';
import { fmtDateISO } from '../utils/date';

export default function StatsScreen() {
  const logs = useStore(s=> s.logs);
  const tasks = useStore(s=> s.tasks);
  const logsByTask = useStore(s=> s.logsByTask);
  const [openTask, setOpenTask] = useState<string | null>(null);

  const groups = useMemo(()=>{
    const m = new Map<string, number>();
    logs.forEach(l=> m.set(l.taskName, (m.get(l.taskName)||0)+1));
    return Array.from(m.entries()).sort((a,b)=> b[1]-a[1]);
  }, [logs]);

  const currentLogs = openTask? logsByTask(openTask): [];

  return (
    <View style={{ flex:1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding:12 }}>
        <View style={{ backgroundColor:'#fff', borderRadius:12, padding:12 }}>
          <Text style={{ fontWeight:'600', marginBottom:8 }}>任务统计</Text>
          {groups.length===0 ? <Text style={{ color:'#888' }}>暂无数据</Text> : groups.map(([name, count])=> (
            <TouchableOpacity key={name} onPress={()=>setOpenTask(name)} style={{ paddingVertical:10, borderBottomWidth:1, borderColor:'#f0f0f0', flexDirection:'row', justifyContent:'space-between' }}>
              <Text>{name}</Text><Text style={{ color: colors.sub }}>{count}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal visible={!!openTask} transparent animationType="slide" onRequestClose={()=>setOpenTask(null)}>
        <View style={{ flex:1, backgroundColor:'rgba(0,0,0,0.4)', justifyContent:'flex-end' }}>
          <View style={{ backgroundColor:'#fff', borderTopLeftRadius:16, borderTopRightRadius:16, maxHeight:'75%' }}>
            <View style={{ padding:12, borderBottomWidth:1, borderColor:'#eee' }}>
              <Text style={{ fontWeight:'600' }}>{openTask} 的全部打卡记录</Text>
            </View>
            <ScrollView contentContainerStyle={{ padding:12 }}>
              {currentLogs.length===0? <Text style={{ color:'#888' }}>暂无</Text> : currentLogs.map(l=> (
                <View key={l.id} style={{ paddingVertical:10, borderBottomWidth:1, borderColor:'#f0f0f0' }}>
                  <Text>{fmtDateISO(l.timeISO)}</Text>
                  <Text style={{ color:'#888' }}>今天第 {l.dayIndexToday} 次 · 本周第 {l.weekIndex} 次</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity onPress={()=>setOpenTask(null)} style={{ alignSelf:'center', paddingVertical:10, paddingHorizontal:16, backgroundColor: colors.primary, borderRadius:10, margin:12 }}>
              <Text style={{ color:'#fff' }}>关闭</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
