import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert} from 'react-native';
import { Colors } from '../styles';
import { parseText } from '../services/api';

export default function CaseEditScreen({navigation,route}){
  const [text,setText]=useState('');
  const [suggestions,setSuggestions]=useState([]);

  async function handleSuggest(){
    try{
      const res = await parseText(text);
      setSuggestions(res.rubrics || []);
    }catch(e){
      Alert.alert('Parse failed','Could not reach backend. Using local suggestions.');
      setSuggestions([{path:'Head > Pain > Night',confidence:0.7,evidence:'parsed locally'}]);
    }
  }

  function acceptSuggestion(item){
    // push to local confirmed list (simplified)
    navigation.navigate('Review',{confirmed:[item]});
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{padding:12}}>
      <View style={styles.card}>
        <Text style={styles.label}>Enter patient complaint</Text>
        <TextInput multiline placeholder="Type complaint here..." style={styles.input} value={text} onChangeText={setText} />
        <TouchableOpacity style={styles.button} onPress={handleSuggest}>
          <Text style={styles.buttonText}>Suggest Rubrics</Text>
        </TouchableOpacity>
      </View>

      <View style={{marginTop:12}}>
        <Text style={{fontWeight:'700',color:Colors.purple,marginBottom:8}}>Suggestions</Text>
        {suggestions.map((s,i)=>(
          <TouchableOpacity key={i} style={styles.sugg} onPress={()=>acceptSuggestion(s)}>
            <Text style={{fontWeight:'600'}}>{s.path}</Text>
            <Text style={{color:'#666'}}>{(s.confidence || 0).toFixed(2)} — {s.evidence || ''}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:Colors.background},
  card:{backgroundColor:'#fff',padding:12,borderRadius:12,borderWidth:1,borderColor:Colors.border},
  label:{color:Colors.text,fontWeight:'700',marginBottom:8},
  input:{minHeight:100,borderWidth:1,borderColor:Colors.border,padding:10,borderRadius:8,backgroundColor:Colors.lightPurple},
  button:{backgroundColor:Colors.purple,padding:12,borderRadius:8,alignItems:'center',marginTop:8},
  buttonText:{color:'#fff',fontWeight:'700'},
  sugg:{backgroundColor:'#fff',padding:12,borderRadius:8,borderWidth:1,borderColor:Colors.border,marginBottom:8}
});
