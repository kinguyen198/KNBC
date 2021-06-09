import QRCodeScreen from './src/QRCodeScreen';
import MainScreen from './src/MainScreen';
import Home from './src/Home';
import Messages from './src/Messages';
import Broadcast from './src/Broadcast';
import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

export default function App({navigation}) {
  GoogleSignin.configure({
    webClientId:
      '581485958090-ladigq74dh48s7v8s2btlrn0s8gj5rml.apps.googleusercontent.com',
  });
  const Stack = createStackNavigator();
  return (
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
