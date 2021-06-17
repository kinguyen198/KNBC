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
  Alert,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from './component/NavigationBar';
import * as Config from '../Config';
import {
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native-gesture-handler';

export default function Register({navigation, route}) {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [textError, setTextError] = useState('');
  const register = () => {
    setTextError('');
    Config.server.post(
      'ajax/user.php',
      {
        method: 'signup',
        user: userName,
        password: password,
        repeat_password: rePassword,
        email: email,
        phone: phone,
      },
      res => {
        const action = [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('Login');
            },
          },
        ];
        if (res.code == 1) {
          Alert.alert('Notification', res.message, action);
        } else {
          setTextError(res.error);
        }
      },
    );
  };
  useEffect(() => {
    setTextError('');
  }, [userName, password, phone, email, rePassword]);
  return (
    <ScrollView
      scrollEnabled={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        flex: 1,
      }}>
      <Image
        source={require('../assets/background.jpeg')}
        style={{
          width: '100%',
          height: '100%',
          resizeMode: 'cover',
          position: 'absolute',
        }}
      />
      <KeyboardAvoidingView
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: '10%',
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}>
        <Image
          source={require('../assets/logo.png')}
          style={{
            width: '50%',
            height: '20%',
            resizeMode: 'contain',
            marginBottom: '5%',
          }}
        />
        <View>
          <Text
            style={{
              marginBottom: '5%',
              fontWeight: 'bold',
              fontSize: 35,
              color: '#34a8eb',
            }}>
            REGISTER
          </Text>
        </View>

        <TextInput
          value={userName}
          style={{
            width: '100%',
            height: 40,
            backgroundColor: 'grey',
            marginBottom: '3%',
            color: 'white',
            paddingLeft: '2%',
            borderRadius: 10,
          }}
          onChangeText={text => {
            setUserName(text);
          }}
          placeholder={'Username'}
          placeholderTextColor={'white'}
        />

        <TextInput
          value={password}
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
        <TextInput
          value={rePassword}
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
          placeholder={'Re-Password'}
          placeholderTextColor={'white'}
          onChangeText={text => {
            setRePassword(text);
          }}
        />
        <TextInput
          value={email}
          style={{
            borderRadius: 10,

            paddingLeft: '2%',
            width: '100%',
            height: 40,
            backgroundColor: 'grey',
            marginBottom: '5%',
            color: 'white',
          }}
          placeholder={'Email'}
          placeholderTextColor={'white'}
          onChangeText={text => {
            setEmail(text);
          }}
        />
        <TextInput
          value={phone}
          style={{
            borderRadius: 10,
            paddingLeft: '2%',
            width: '100%',
            height: 40,
            backgroundColor: 'grey',
            marginBottom: '3%',
            color: 'white',
          }}
          placeholder={'Phone'}
          placeholderTextColor={'white'}
          onChangeText={text => {
            setPhone(text);
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

        <TouchableOpacity
          onPress={register}
          style={{
            height: 40,
            width: '50%',
            backgroundColor: '#34a8eb',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '5%',
            borderRadius: 10,
          }}>
          <Text style={{color: 'white'}}>Register</Text>
        </TouchableOpacity>
        <View>
          <Text
            onPress={() => {
              navigation.navigate('Login');
            }}
            style={{color: '#34a8eb'}}>
            Login
          </Text>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
