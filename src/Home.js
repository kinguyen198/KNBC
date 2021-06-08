/** Home Screen of the app */

//importing libraries
import React, {useState, useEffect} from 'react';
import {SafeAreaView, ActivityIndicator, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {fromRight, zoomIn, fromBottom} from 'react-navigation-transitions';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import io from 'socket.io-client';
import {firebase} from '@react-native-firebase/auth';

//importing screens
import ChatsScreen from './Chats';
import PeoplesScreen from './Peoples';
import SettingsScreen from './Settings';

//create a tab navigator for homescreen
export default function Home() {
  var user = firebase.auth().currentUser;
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [userPhotoUrl, setUserPhotoUrl] = useState('');
  const Tab = createMaterialTopTabNavigator();
  const login = async () => {
    console.log(user.displayName);
    let payload = {name: user.displayName, id: user.uid, photo: user.photoURL};
    try {
      let res = await axios.post('http://127.0.0.1:5000' + '/login', payload);
      let data = res.data;
      console.log(data)
      if (data._id !== '') {
        setUserId(data._id);
        setUserName(data.name);
        setUserPhotoUrl(data.photo);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    console.log(user);
    setUserId(user.uid);
    setUserName(user.displayName);
    setUserPhotoUrl(user.photoURL);
    login();
  }, []);
  return (
    <SafeAreaView style={{flex: 1}}>
      {userId ? (
        <Tab.Navigator>
        <Tab.Screen
            name="ChatsScreen"
            component={ChatsScreen}
            options={{
              tabBarLabel: 'Chat',
              tabBarIcon: ({color, size}) => (
                <Icon name="ios-chatboxes" color={tintColor} size={28} />
              ),
            }}></Tab.Screen>
          <Tab.Screen
            name="PeoplesScreen"
            component={PeoplesScreen}
            options={{
              tabBarLabel: 'People',
              tabBarIcon: ({color, size}) => (
                <Icon name="ios-contacts" color={tintColor} size={28} />
              ),
            }}></Tab.Screen>
          <Tab.Screen
            name="SettingsScreen"
            component={SettingsScreen}
            options={{
              tabBarLabel: 'Setting',
              tabBarIcon: ({color, size}) => (
                <Icon name="ios-chatboxes" color={color} size={28} />
              ),
            }}></Tab.Screen>
        </Tab.Navigator>
      ) : (
        <ActivityIndicator size="large" color="#46CF76" style={{flex: 1}} />
      )}
    </SafeAreaView>
  );
}
