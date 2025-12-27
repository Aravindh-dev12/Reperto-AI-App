import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform} from 'react-native';
import { Colors } from '../styles';
import { login } from '../services/api';

export default function LoginScreen({navigation}){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');

  async function handleLogin(){
    try{
      await login(email,password);
      navigation.replace('Cases');
    }catch(e){
      Alert.alert('Login failed','Please check credentials or start backend server.');
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Reperto AI</Text>
        <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} autoCapitalize='none' keyboardType='email-address' />
        <TextInput placeholder="Password" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate('Signup')}>
          <Text style={styles.link}>Create account</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:Colors.background},
  card:{width:'92%',backgroundColor:'#fff',padding:20,borderRadius:12,shadowColor:'#000',shadowOpacity:0.05,shadowRadius:10,borderWidth:1,borderColor:Colors.border},
  title:{fontSize:24,fontWeight:'700',color:Colors.purple,marginBottom:12,textAlign:'center'},
  input:{borderWidth:1,borderColor:Colors.border,padding:10,borderRadius:8,marginBottom:12,backgroundColor:Colors.lightPurple},
  button:{backgroundColor:Colors.purple,padding:12,borderRadius:8,alignItems:'center'},
  buttonText:{color:'#fff',fontWeight:'600'},
  link:{color:Colors.purple,marginTop:12,textAlign:'center'}
});
