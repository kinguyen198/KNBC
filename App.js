import QRCodeScreen from './src/QRCodeScreen';
import MainScreen from './src/MainScreen';

//Chat
import Home from './src/Home';
import Messages from './src/Messages';
import Broadcast from './src/Broadcast';
import ScanQR from './src/ScanQRCode';
import CameraScan from './src/CameraScan';
import AddFriend from './src/AddFriend';

import Login from './src/Login';
import Register from './src/Register';
import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {MenuProvider} from 'react-native-popup-menu';

export default function App({navigation}) {
  GoogleSignin.configure({
    webClientId:
      '581485958090-ladigq74dh48s7v8s2btlrn0s8gj5rml.apps.googleusercontent.com',
  });
  const Stack = createStackNavigator();
  return (
      <MenuProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="MainScreen">
            <Stack.Screen
              name="MainScreen"
              component={MainScreen}
              options={{headerShown: false}}
              initialRouteName="Landing"
              headerMode="none"
              transitionConfig={() => zoomIn()}
            />
            <Stack.Screen
              name="QRCodeScreen"
              component={QRCodeScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Home"
              component={Home}
              options={{headerShown: false}}></Stack.Screen>
            <Stack.Screen
              name="Messages"
              component={Messages}
              options={{headerShown: false}}></Stack.Screen>
            <Stack.Screen
              name="Broadcast"
              component={Broadcast}
              options={{headerShown: false}}></Stack.Screen>
            <Stack.Screen
              name="ScanQR"
              component={ScanQR}
              options={{headerShown: false}}></Stack.Screen>
            <Stack.Screen
              name="CameraScan"
              component={CameraScan}
              options={{headerShown: false}}></Stack.Screen>
            <Stack.Screen
              name="AddFriend"
              component={AddFriend}
              options={{headerShown: false}}></Stack.Screen>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{headerShown: false}}></Stack.Screen>
            <Stack.Screen
              name="Register"
              component={Register}
              options={{headerShown: false}}></Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </MenuProvider>
  );
}
