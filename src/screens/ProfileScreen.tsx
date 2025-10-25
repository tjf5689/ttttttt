import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TextInput, TouchableOpacity } from 'react-native';
import { useStore } from '../store/useStore';
import { colors } from '../app/theme';
import { fmtDateISO } from '../utils/date';

export default function ProfileScreen() {
  const account = useStore(s=> s.account);
  const setAccount = useStore(s=> s.setAccount);
  const logs = useStore(s=> s.logs);
  const [username, setUsername] = useState(account.username);
  const [displayName, setDisplayName] = useState(account.displayName);
  const [avatarUrl, setAvatarUrl] = useState(account.avatarUrl);

  const save = ()=> setAccount(username, displayName, avatarUrl);

  return (
    <View style={{ flex:1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding:12 }}>
        <View style={{ backgroundColor:'#fff', borderRadius:12, padding:12, marginBottom:12 }}>
          <View style={{ flexDirection:'row', alignItems:'center', gap:12 }}>
            <Image source={{ uri: avatarUrl }} style={{ width:48, height:48, borderRadius:24 }}/>
            <View style={{ flex:1 }}>
              <Text style={{ color:'#666' }}>名称</Text>
              <TextInput value={displayName} onChangeText={setDisplayName} style={{ borderWidth:1, borderColor:'#eee', borderRadius:8, padding:8, marginBottom:8 }}/>
              <Text style={{ color:'#666' }}>用户名</Text>
              <TextInput value={username} onChangeText={setUsername} style={{ borderWidth:1, borderColor:'#eee', borderRadius:8, padding:8, marginBottom:8 }}/>
              <Text style={{ color:'#666' }}>头像 URL</Text>
              <TextInput value={avatarUrl} onChangeText={setAvatarUrl} style={{ borderWidth:1, borderColor:'#eee', borderRadius:8, padding:8 }}/>
            </View>
          </View>
          <TouchableOpacity onPress={save} style={{ alignSelf:'flex-end', marginTop:12, paddingVertical:8, paddingHorizontal:12, backgroundColor: colors.primary, borderRadius:10 }}>
            <Text style={{ color:'#fff' }}>保存</Text>
          </TouchableOpacity>
        </View>

        <View style={{ backgroundColor:'#fff', borderRadius:12, padding:12, marginBottom:12 }}>
          <Text style={{ fontWeight:'600', marginBottom:8 }}>所有打卡记录</Text>
          {logs.length===0 ? <Text style={{ color:'#888' }}>暂无</Text> : logs.map(l=> (
            <View key={l.id} style={{ paddingVertical:10, borderBottomWidth:1, borderColor:'#f0f0f0' }}>
              <Text>{l.taskName}</Text>
              <Text style={{ color:'#888' }}>{fmtDateISO(l.timeISO)} · 今天第 {l.dayIndexToday} 次 · 本周第 {l.weekIndex} 次</Text>
            </View>
          ))}
        </View>

        <View style={{ backgroundColor:'#fff', borderRadius:12, padding:12 }}>
          <Text style={{ fontWeight:'600', marginBottom:8 }}>任务统计 · 设置 · 个人四项</Text>
          <Text>· 习惯目标 · 提醒偏好 · 备份同步 · 导入导出</Text>
        </View>
      </ScrollView>
    </View>
  );
}
