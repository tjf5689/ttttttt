import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useStore } from '../store/useStore';
import { colors } from '../app/theme';

export default function TemplatesScreen() {
  const templates = useStore(s=> s.templates);
  const generate = useStore(s=> s.generatePlans);

  return (
    <View style={{ flex:1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding:12 }}>
        <View style={{ backgroundColor:'#fff', borderRadius:12, padding:12, marginBottom:12 }}>
          <Text style={{ fontWeight:'600', marginBottom:8 }}>日模板</Text>
          {templates.map(t=>(
            <View key={t.id} style={{ paddingVertical:10, borderBottomWidth:1, borderColor:'#f0f0f0' }}>
              <Text style={{ fontWeight:'500' }}>{t.name}</Text>
              <Text style={{ color:'#888', marginTop:4 }}>未来 {t.futureDays} 天；必做星期：{t.requiredWeekdays.length? t.requiredWeekdays.map(i=>'一二三四五六日'[i]).join('、'):'不限'}</Text>
            </View>
          ))}
        </View>

        <View style={{ backgroundColor:'#fff', borderRadius:12, padding:12 }}>
          <Text style={{ fontWeight:'600', marginBottom:8 }}>生成每日计划</Text>
          <View style={{ flexDirection:'row', gap:10 }}>
            <TouchableOpacity onPress={()=>generate(7)} style={{ paddingVertical:10, paddingHorizontal:14, backgroundColor: colors.primary, borderRadius:10 }}><Text style={{ color:'#fff' }}>未来 1 周</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>generate(30)} style={{ paddingVertical:10, paddingHorizontal:14, backgroundColor: colors.primary, borderRadius:10 }}><Text style={{ color:'#fff' }}>未来 1 月</Text></TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
