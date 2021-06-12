import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ActivityIndicator,
  View,
  Image,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Dimensions,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from './component/NavigationBar';
export default function Login({navigation, route}) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: '10%',
      }}>
      <Text style={{marginBottom: '5%', fontWeight: 'bold', fontSize: 30}}>
        LOGIN
      </Text>
      <TextInput
        style={{
          width: '100%',
          height: 40,
          backgroundColor: 'grey',
          marginBottom: '3%',
          color: 'white',
          paddingLeft: '2%',
          borderRadius: 10,
        }}
        placeholder={'Username'}
        placeholderTextColor={'white'}
      />
      <TextInput
        style={{
          borderRadius: 10,

          paddingLeft: '2%',
          width: '100%',
          height: 40,
          backgroundColor: 'grey',
          marginBottom: '5%',
          color: 'white',
        }}
        placeholder={'Password'}
        placeholderTextColor={'white'}
      />
      <TouchableOpacity
        style={{
          height: 40,
          width: '50%',
          backgroundColor: '#34a8eb',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '5%',
          borderRadius: 10,
        }}>
        <Text style={{color: 'white'}}>Login</Text>
      </TouchableOpacity>
      <Text
        onPress={() => {
          navigation.navigate('Register');
        }}
        style={{color: '#34a8eb'}}>
        Register
      </Text>
    </View>
  );
}
