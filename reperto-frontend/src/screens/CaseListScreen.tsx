import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import { Colors } from '../styles';

const dummy = [
  {id:'1',title:'Case 1 - Headache'},
  {id:'2',title:'Case 2 - Cough'}
];

export default function CaseListScreen({navigation}){
  return (
    <View style={styles.container}>
      <FlatList data={dummy} keyExtractor={i=>i.id} renderItem={({item})=>(
        <TouchableOpacity style={styles.card} onPress={()=>navigation.navigate('EditCase',{caseId:item.id})}>
          <Text style={styles.title}>{item.title}</Text>
        </TouchableOpacity>
      )} />
      <TouchableOpacity style={styles.fab} onPress={()=>navigation.navigate('EditCase')}>
        <Text style={{color:'#fff',fontWeight:'700'}}>New Case</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:Colors.background,padding:12},
  card:{backgroundColor:'#fff',padding:16,borderRadius:10,marginBottom:12,borderWidth:1,borderColor:Colors.border},
  title:{color:Colors.text,fontWeight:'600'},
  fab:{position:'absolute',right:16,bottom:20,backgroundColor:Colors.purple,padding:14,borderRadius:40}
});
