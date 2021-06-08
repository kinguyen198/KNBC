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
import {firebase} from '@react-native-firebase/auth';

export default function Settings({navigation}) {
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [userPhotoUrl, setUserPhotoUrl] = useState('');

  useEffect(() => {
    var user = firebase.auth().currentUser;
    console.log(user);
    setUserId(user.uid);
    setUserName(user.displayName);
    setUserPhotoUrl(user.photoURL);
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
              uri:
                userPhotoUrl == ''
                  ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1DLuBDtz2945mZR71wAT0WSkktlbwpF3chZ8omSwo5km6q6NfxZDKtx5TXWcrWz-rZDA&usqp=CAU'
                  : userPhotoUrl,
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
              height: 50,
              flexDirection: 'column',
              marginHorizontal: '5%',
              marginTop: '1%',
            }}>
            <Text
              style={{
                fontSize: 30,
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
          onPress={() => {
            firebase.auth().signOut();
            navigation.navigate('MainScreen');
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
