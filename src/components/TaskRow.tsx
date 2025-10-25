import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { useStore } from '../store/useStore';
import { colors } from '../app/theme';

export default function TaskRow({ name }: { name: string }) {
  const checkIn = useStore(s=> s.checkIn);
  const redo = useStore(s=> s.redo);
  const [visible, setVisible] = useState(false);
  const scale = useSharedValue(1);

  const press = (kind:'check'|'redo')=>{
    scale.value = withTiming(0.96, { duration: 80 }, ()=>{
      scale.value = withTiming(1.06, { duration: 120 }, ()=>{
        scale.value = withTiming(1, { duration: 80 }, ()=>{
          setVisible(true);
        });
      });
    });
    if (kind==='check') checkIn(name);
    else redo(name);
  };

  const animStyle = useAnimatedStyle(()=> ({ transform: [{ scale: scale.value }] }));

  return (
    <View style={{ backgroundColor:'#fff', padding:12, borderRadius:12, marginBottom:10, borderWidth:1, borderColor:'#eee', flexDirection:'row', alignItems:'center', justifyContent:'space-between' }}>
      <Text style={{ fontWeight:'600' }}>{name}</Text>
      <View style={{ flexDirection:'row', gap:8 }}>
        <Animated.View style={animStyle}>
          <TouchableOpacity onPress={()=>press('check')} style={{ paddingVertical:8, paddingHorizontal:12, borderRadius:10, backgroundColor: colors.primary }}>
            <Text style={{ color:'#fff' }}>打卡</Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={animStyle}>
          <TouchableOpacity onPress={()=>press('redo')} style={{ paddingVertical:8, paddingHorizontal:12, borderRadius:10, backgroundColor: colors.primarySoft }}>
            <Text style={{ color: colors.primary }}>补做</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <Modal visible={visible} transparent animationType="fade">
        <View style={{ flex:1, backgroundColor:'rgba(0,0,0,0.4)', justifyContent:'center', alignItems:'center' }}>
          <View style={{ width:'80%', backgroundColor:'#fff', borderRadius:16, padding:16 }}>
            <Text style={{ textAlign:'center', marginBottom:12, fontWeight:'600' }}>{name}</Text>
            <Text style={{ textAlign:'center', color: colors.primary, marginBottom:12 }}>打卡/补做成功</Text>
            <TouchableOpacity onPress={()=>setVisible(false)} style={{ alignSelf:'center', paddingVertical:10, paddingHorizontal:16, backgroundColor: colors.primary, borderRadius:10 }}>
              <Text style={{ color:'#fff' }}>好的</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
