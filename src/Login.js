import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ActivityIndicator,
  View,
  Image,
  Text,
  TouchableOpacity,
  Keyboard,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from './component/NavigationBar';
import * as Config from '../Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function Login({navigation, route}) {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const [textError, setTextError] = useState('');

  const login = async () => {
    Config.server.post(
      'ajax/user.php',
      {
        method: 'login',
        username: userName,
        password: password,
      },
      async res => {
        if (res.code == 1) {
          let user = {
            userId: res.id_user,
            userName: res.username,
            userPhoto: res.avatar,
            code:res.code,
            token: res.token,
          };
          try {
            await AsyncStorage.setItem('user', JSON.stringify(user), () => {
              navigation.navigate('Home');
            });
          } catch (err) {
            console.log(err);
          }
        }
      },
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
          onChangeText={text => {
            setUserName(text);
          }}
        />
        <TextInput
          secureTextEntry={true}
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
          onChangeText={text => {
            setPassword(text);
          }}
        />
        <TouchableOpacity
          onPress={login}
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
    </TouchableWithoutFeedback>
  );
}
