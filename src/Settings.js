/* eslint-disable react-native/no-inline-styles */
/** Settings tab in Homescreen */

//importing libraries
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  Switch,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
// import {
//   LoginManager,
//   GraphRequest,
//   GraphRequestManager,
// } from 'react-native-fbsdk';
import {StackAction, CommonActions} from '@react-navigation/native';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {firebase} from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Config from '../Config'
import Share from 'react-native-share';

export default function Settings({navigation}) {


  return (
    <View style={{padding: 16}}>
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
      <View style={styles.white_view}>
        <Icon
          name="settings-sharp"
          type="ionicon"
          color="grey"
          style={{fontSize: 32}}
        />
        <Text
          style={{
            marginLeft: '5%',
            fontSize: 22,
            color: 'black',
            paddingVertical: '3%',
          }}>
          My account
        </Text>
      </View>
      <View style={styles.white_view}>
        <Icon
          name="home"
          type="ionicon"
          color="grey"
          style={{fontSize: 32}}
        />
        <TouchableWithoutFeedback
          onPress={async () => {
            navigation.navigate('MainScreen');
          }}>
          <Text
            style={{
              //width: '100%',
              marginLeft: '5%',
              fontSize: 22,
              paddingVertical: '3%',
            }}>
            Back to Home
          </Text>
        </TouchableWithoutFeedback>
      </View>

      <View style={styles.white_view}>
        <Icon
          name="exit"
          type="ionicon"
          color="grey"
          style={{fontSize: 32}}
        />
        <TouchableWithoutFeedback
          onPress={async () => {
            await AsyncStorage.removeItem('user', () => {
              //socket.disconnect();
              //firebase.auth().signOut();
              navigation.navigate('Login');
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
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={async () => {
            await AsyncStorage.removeItem('user', () => {
              navigation.navigate.goBack();
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
            Back to Home
          </Text>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  white_view: {
    flexDirection: 'row',
    padding: 24,
    backgroundColor: '#fff',
    color: '#555',
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#eaeaea',
  },
  title: {
    marginTop: 16,
    paddingVertical: 8,
    borderWidth: 4,
    borderColor: '#20232a',
    borderRadius: 6,
    backgroundColor: '#61dafb',
    color: '#20232a',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
  },
});
