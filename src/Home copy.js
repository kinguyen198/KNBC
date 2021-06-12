/** Home Screen of the app */

//importing libraries
import React, {useState, useEffect} from 'react';
import {SafeAreaView, ActivityIndicator, View,Image,Text,TouchableOpacity} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {fromRight, zoomIn, fromBottom} from 'react-navigation-transitions';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

//importing screens
import ChatsScreen from './Chats';
import PeoplesScreen from './Peoples';
import SettingsScreen from './Settings';

//create a tab navigator for homescreen
export default function Home() {
  const Tab = createMaterialTopTabNavigator();
  const [user, setUser] = useState('');

  const url = 'http://127.0.0.1:5000';
  const getUser = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('user');
      const user = JSON.parse(jsonValue);
      login(user);
      
    } catch (e) {
      console.log(e);
    }
  };

  const login = async (user) => {
    let payload = {name: user.userName, id: user.userId, photo: user.userPhoto};
    try {
      let res = await axios.post(url + '/login', payload);
      let data = res.data;
      console.log(data);
      if (data._id !== '') {
        // setUserId(data._id);
        // setUserName(data.name);
        // setUserPhoto(data.photo);
        setUser(user);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUser();
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{
        flex: 0,
        flexDirection: 'row',
        marginVertical: '2%',
        flexJustifyContent: 'space-between',
        padding: '3%'
      }}>
        
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            marginHorizontal: '5%',
            marginTop: '1%',
          }}>
          <Image
            source={{ uri:user.userPhoto }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 70,
              borderColor: '#444',
              borderWidth: 2,
            }}
          />

          <Text
            style={{
              fontSize: 18,
              //fontFamily: 'Cairo-SemiBold',
              marginLeft:8,
              color: 'black',
            }}>
            {user.userName}
          </Text>
        </View>

        <View
          style={{
            flex: 0,
            flexDirection: 'column',
            marginHorizontal: '5%',
            marginTop: '1%',
          }}>
           <TouchableOpacity onPress={() => { }}>
              <Icon name='add-outline' type='ionicon' color='#517fa4' style={{fontSize:28}} />
          </TouchableOpacity>
        </View>


      </View>
      <Tab.Navigator style={{flex: 1}}>
        <Tab.Screen
          name="ChatsScreen"
          component={ChatsScreen}
          options={{
            tabBarLabel: 'Chat',
            tabBarIcon: ({color, size}) => (
              <Icon name="ios-chatboxes" color={color} size={28} />
            ),
          }}></Tab.Screen>
        <Tab.Screen
          name="PeoplesScreen"
          component={PeoplesScreen}
          options={{
            tabBarLabel: 'People Active',
            tabBarIcon: ({color, size}) => (
              <Icon name="ios-contacts" color={color} size={28} />
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
    </SafeAreaView>
  );
}
