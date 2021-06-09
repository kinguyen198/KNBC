/* eslint-disable react-native/no-inline-styles */
/** Settings tab in Homescreen */

//importing libraries
import React, {useState, useEffect} from 'react';
import {View, Text, Image, Switch, TouchableOpacity} from 'react-native';
// import {
//   LoginManager,
//   GraphRequest,
//   GraphRequestManager,
// } from 'react-native-fbsdk';
import {StackAction, CommonActions} from '@react-navigation/native';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {firebase} from '@react-native-firebase/auth';

export default function Settings({navigation}) {
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [userPhoto, setUserPhoto] = useState(null);
  const url = 'http://127.0.0.1:5000';
  var socket = io(url);
  const getUser = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('user');
      const user = JSON.parse(jsonValue);
      setUserId(user.userId);
      setUserName(user.userName);
      setUserPhoto(user.userPhoto);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getUser();
  }, []);

  return (
    <View>
      <Text
        style={{
          color: '#f4f4f4',
          fontSize: 36,
          padding: '5%',
          paddingLeft: '7%',
          //fontFamily: 'Cairo-Regular',
        }}>
        Settings
      </Text>
      <View
        style={{
          paddingHorizontal: '7%',
          marginBottom: '18%',
          paddingBottom: '1.5%',
        }}>
        <View
          style={{
            flex: 2,
            flexDirection: 'row',
            marginVertical: '2%',
            paddingVertical: '4%',
            borderRadius: 10,
          }}>
          <Image
            source={{
              uri: userPhoto,
            }}
            style={{
              width: 60,
              height: 60,
              borderRadius: 70,
              borderColor: '#333',
              borderWidth: 2,
            }}
          />
          <View
            style={{
              position: 'absolute',
              backgroundColor: '#46CF76',
              width: 18,
              height: 18,
              left: 50,
              top: 52,
              borderRadius: 100,
              borderColor: '#222',
              borderWidth: 3,
            }}
          />
          <View
            style={{
              flex: 3,
              width: '100%',
              height: 55,
              flexDirection: 'column',
              marginHorizontal: '4%',
              marginTop: '1%',
            }}>
            <Text
              style={{
                fontSize: 25,
                //fontFamily: 'Cairo-SemiBold',
                color: 'black',
              }}>
              {userName}
            </Text>
            <Text
              style={{
                fontSize: 14,
                //fontFamily: 'Cairo-Light',
                color: 'lightgrey',
              }}>
              {'@' + userId}
            </Text>
          </View>
        </View>
      </View>
      <View>
        <Text
          style={{
            marginLeft: '7%',
            fontSize: 22,
            //fontFamily: 'Cairo-SemiBold',
            color: '#555',
            paddingVertical: '3%',
          }}>
          Set server address
        </Text>
      </View>
      <View>
        <TouchableOpacity
          onPress={async () => {
            await AsyncStorage.removeItem('user', () => {
              socket.disconnect();
              firebase.auth().signOut();
              navigation.navigate('MainScreen');
            });
          }}>
          <Text
            style={{
              width: '100%',
              marginLeft: '7%',
              fontSize: 22,
              //ontFamily: 'Cairo-SemiBold',
              color: 'tomato',
              paddingVertical: '3%',
            }}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
