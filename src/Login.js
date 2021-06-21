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
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from './component/NavigationBar';
import * as Config from '../Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions} from '@react-navigation/native';

export default function Login({navigation, route}) {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [textError, setTextError] = useState('');

  const login = async () => {
    Config.server.post(
      'ajax/user.php',
      {method: 'login', username: userName, password: password},
      async res => {
        if (res.code == 1) {
          let user = {
            userId: res.id_user,
            userName: res.username,
            userPhoto: res.avatar,
            code: res.code,
            token: res.token,
          };
          try {
            await AsyncStorage.setItem('user', JSON.stringify(user), () => {
              //navigation.navigate('Home');
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{name: 'Home'}],
                }),
              );
            });
          } catch (err) {
            console.log(err);
          }
        } else {
          setTextError(res);
        }
      },
    );
  };
  useEffect(() => {
    setTextError('');
  }, [userName, password]);
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.1)'}}>
        <View style={{flexDirection: 'row', paddingHorizontal: '3%'}}>
          <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
            <Icon name={'ios-arrow-back'} size={40} color={'#34a8eb'} />
          </TouchableWithoutFeedback>
        </View>
        <View style={{paddingHorizontal: '5%', marginTop: '10%'}}>
          <Text>Email or phone number</Text>
          <TextInput
            value={userName}
            style={{
              width: '100%',
              height: 40,
              marginVertical: '3%',
              paddingLeft: '2%',
              textTransform: 'lowercase',
              borderBottomWidth: 2,
              borderColor: '#34a8eb',
            }}
            onChangeText={text => {
              setUserName(text.toLowerCase());
            }}
          />
          <Text>Password</Text>
          <TextInput
            value={password}
            secureTextEntry={true}
            style={{
              paddingLeft: '2%',
              width: '100%',
              height: 40,
              borderBottomWidth: 2,
              marginVertical: '3%',
              borderColor: '#34a8eb',
            }}
            onChangeText={text => {
              setPassword(text);
            }}
          />
          {textError ? (
            <View>
              <Text
                style={{
                  color: 'red',
                  marginBottom: '5%',
                  fontWeight: 'bold',
                  fontSize: 16,
                }}>
                {'Notice: ' + textError}
              </Text>
            </View>
          ) : null}
          <View style={{alignItems: 'center'}}>
            <Text style={{color: '#34a8eb', marginVertical: '2%'}}>
              Forgot your password?
            </Text>
            <TouchableOpacity
              onPress={login}
              style={{
                height: 40,
                width: '70%',
                backgroundColor: '#34a8eb',
                alignItems: 'center',
                justifyContent: 'center',
                marginVertical: '5%',
                borderRadius: 20,
              }}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>LOG IN</Text>
            </TouchableOpacity>
            <Text
              onPress={() => {
                navigation.navigate('RegisterWithPhone');
              }}
              style={{color: '#34a8eb', fontWeight: 'bold'}}>
              CREATE A NEW ACCOUNT
            </Text>
            <View style={{marginTop: '15%'}}>
              <Text style={{textAlign: 'left'}}>
                JOIN A NEW AREA OF SOCIAL NETWORKINGJOIN A NEW AREA OF SOCIAL
                NETWORKINGJOIN A NEW AREA OF SOCIAL NETWORKING
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
