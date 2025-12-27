import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform} from 'react-native';
import { Colors } from '../styles';
import { signup } from '../services/api';

export default function SignupScreen({navigation}){
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');

  async function handleSignup(){
    try{
      await signup(name,email,password);
      navigation.replace('Cases');
    }catch(e){
      Alert.alert('Signup failed','Could not create account.');
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create account</Text>
        <TextInput placeholder="Full name" style={styles.input} value={name} onChangeText={setName} />
        <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} autoCapitalize='none' keyboardType='email-address' />
        <TextInput placeholder="Password" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate('Login')}>
          <Text style={styles.link}>Back to login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:Colors.background},
  card:{width:'92%',backgroundColor:'#fff',padding:20,borderRadius:12,shadowColor:'#000',shadowOpacity:0.05,shadowRadius:10,borderWidth:1,borderColor:Colors.border},
  title:{fontSize:20,fontWeight:'700',color:Colors.purple,marginBottom:12,textAlign:'center'},
  input:{borderWidth:1,borderColor:Colors.border,padding:10,borderRadius:8,marginBottom:12,backgroundColor:Colors.lightPurple},
  button:{backgroundColor:Colors.purple,padding:12,borderRadius:8,alignItems:'center'},
  buttonText:{color:'#fff',fontWeight:'600'},
  link:{color:Colors.purple,marginTop:12,textAlign:'center'}
});
