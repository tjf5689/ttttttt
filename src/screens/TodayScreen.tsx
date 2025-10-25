import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useStore } from '../store/useStore';
import TaskRow from '../components/TaskRow';
import AddSheet from '../components/AddSheet';
import { colors } from '../app/theme';

export default function TodayScreen() {
  const list = useStore(s=> s.todayList());
  const account = useStore(s=> s.account);
  const [open, setOpen] = useState(false);

  return (
    <View style={{ flex:1, backgroundColor: colors.bg }}>
      <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', padding:12, backgroundColor:'#fff', borderBottomWidth:1, borderColor:'#eee' }}>
        <View style={{ flexDirection:'row', alignItems:'center', gap:10 }}>
          <Image source={{ uri: account.avatarUrl }} style={{ width:36, height:36, borderRadius:18 }}/>
          <View>
            <Text style={{ color:'#666' }}>{account.displayName}</Text>
            <Text style={{ fontWeight:'600' }}>{account.username}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={()=>setOpen(true)} style={{ width:36, height:36, borderRadius:18, backgroundColor: colors.primary, alignItems:'center', justifyContent:'center' }}>
          <Text style={{ color:'#fff', fontSize:20 }}>＋</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding:12 }}>
        {list.length===0 ? (
          <View style={{ marginTop:40, alignItems:'center' }}><Text style={{ color:'#888' }}>今天还没有任务，点右上角 + 添加</Text></View>
        ) : list.map(it=> <TaskRow key={it.id} name={it.name} />)}
      </ScrollView>

      <AddSheet visible={open} onClose={()=>setOpen(false)} />
    </View>
  );
}
