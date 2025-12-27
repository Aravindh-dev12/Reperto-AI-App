import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { Colors } from '../styles';

export default function ReviewScreen({navigation,route}){
  const confirmed = route.params?.confirmed || [];
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Confirmed Rubrics</Text>
        {confirmed.map((c,i)=>(
          <View key={i} style={styles.row}>
            <Text style={styles.rub}>{c.path}</Text>
            <Text style={styles.conf}>{(c.confidence||0).toFixed(2)}</Text>
          </View>
        ))}
        <TouchableOpacity style={styles.analyze} onPress={()=>navigation.goBack()}>
          <Text style={{color:'#fff',fontWeight:'700'}}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:Colors.background,padding:12},
  card:{backgroundColor:'#fff',padding:16,borderRadius:12,borderWidth:1,borderColor:Colors.border},
  title:{fontSize:18,fontWeight:'700',color:Colors.purple,marginBottom:12},
  row:{flexDirection:'row',justifyContent:'space-between',paddingVertical:8,borderBottomWidth:1,borderColor:Colors.border},
  rub:{fontWeight:'600'},
  conf:{color:'#666'},
  analyze:{marginTop:16,backgroundColor:Colors.purple,padding:12,alignItems:'center',borderRadius:8}
});
