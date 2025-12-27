import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { Colors } from '../styles';

export default function RubricSuggestion({item,onPress}){
  return (
    <TouchableOpacity style={styles.container} onPress={()=>onPress(item)}>
      <Text style={styles.path}>{item.path}</Text>
      <Text style={styles.conf}>{(item.confidence||0).toFixed(2)}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container:{backgroundColor:'#fff',padding:12,borderRadius:8,borderWidth:1,borderColor:Colors.border,marginBottom:8},
  path:{fontWeight:'600'},
  conf:{color:'#666'}
});
