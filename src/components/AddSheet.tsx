import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, ScrollView } from 'react-native';
import { useStore } from '../store/useStore';
import { colors, spacing } from '../app/theme';

type Props = { visible: boolean; onClose: ()=>void; };

export default function AddSheet({ visible, onClose }: Props) {
  const addTask = useStore(s=> s.addTask);
  const addTemplate = useStore(s=> s.addTemplate);
  const [tab, setTab] = useState<'task'|'template'>('task');
  const [name, setName] = useState('');
  const [futureDays, setFutureDays] = useState(7);
  const [required, setRequired] = useState<number[]>([]);
  const toggle = (d:number)=> setRequired(prev=> prev.includes(d)? prev.filter(x=>x!==d): [...prev, d]);

  const ok = ()=>{
    if (!name.trim()) return;
    if (tab==='task') addTask(name.trim());
    else addTemplate(name.trim(), futureDays, required.sort());
    setName(''); setRequired([]); setFutureDays(7);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{ flex:1, backgroundColor:'rgba(0,0,0,0.4)', justifyContent:'flex-end' }}>
        <View style={{ backgroundColor:'#fff', borderTopLeftRadius:16, borderTopRightRadius:16, padding:16, maxHeight:'80%' }}>
          <View style={{ flexDirection:'row', marginBottom:12 }}>
            <TouchableOpacity onPress={()=>setTab('task')} style={{ paddingVertical:8, paddingHorizontal:12, backgroundColor: tab==='task'? colors.primary: '#EFEFEF', borderRadius:8, marginRight:8 }}>
              <Text style={{ color: tab==='task'? '#fff':'#333' }}>单项任务</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>setTab('template')} style={{ paddingVertical:8, paddingHorizontal:12, backgroundColor: tab==='template'? colors.primary: '#EFEFEF', borderRadius:8 }}>
              <Text style={{ color: tab==='template'? '#fff':'#333' }}>按天任务模板</Text>
            </TouchableOpacity>
          </View>

          <ScrollView>
            <Text style={{ color:'#666', marginBottom:6 }}>名称</Text>
            <TextInput value={name} onChangeText={setName} placeholder={tab==='task'? '如：阅读 20 页':'如：学习日模板'} style={{ borderWidth:1, borderColor:'#ddd', borderRadius:10, padding:10, marginBottom:12 }}/>

            {tab==='template' && (
              <View>
                <Text style={{ color:'#666', marginBottom:6 }}>未来多少天可生成</Text>
                <View style={{ flexDirection:'row', flexWrap:'wrap', gap:8, marginBottom:12 }}>
                  {[7,14,21,30,60,90].map(n=> (
                    <TouchableOpacity key={n} onPress={()=>setFutureDays(n)} style={{ paddingVertical:6, paddingHorizontal:10, borderRadius:8, backgroundColor: futureDays===n? colors.primary: '#EFEFEF' }}>
                      <Text style={{ color: futureDays===n? '#fff':'#333' }}>{n} 天</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={{ color:'#666', marginBottom:6 }}>每周必须完成的星期（可多选）</Text>
                <View style={{ flexDirection:'row', flexWrap:'wrap', gap:10, marginBottom:12 }}>
                  {[0,1,2,3,4,5,6].map(i=> (
                    <TouchableOpacity key={i} onPress={()=>toggle(i)} style={{ paddingVertical:6, paddingHorizontal:12, borderRadius:20, backgroundColor: required.includes(i)? colors.primary: '#EFEFEF' }}>
                      <Text style={{ color: required.includes(i)? '#fff':'#333' }}>周{'一二三四五六日'[i]}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>

          <View style={{ flexDirection:'row', justifyContent:'flex-end', marginTop:12 }}>
            <TouchableOpacity onPress={onClose} style={{ paddingVertical:10, paddingHorizontal:16, marginRight:8 }}>
              <Text>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={ok} style={{ paddingVertical:10, paddingHorizontal:16, backgroundColor: colors.primary, borderRadius:10 }}>
              <Text style={{ color:'#fff' }}>确定</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
