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

export default function GetStated({navigation, route}) {
  return (
    <View style={{flex: 1}}>
      <Image
        style={{width: '100%', height: '100%', position: 'absolute'}}
        source={require('../assets/backgroundGetStarted.jpeg')}
      />
      <View style={{flex: 1.5, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{fontSize: 36, fontWeight: 'bold'}}>New Apps</Text>
      </View>
      <View
        style={{flex: 2, alignItems: 'center', justifyContent: 'flex-start'}}>
        <Text
          style={{
            fontSize: 25,
            fontWeight: 'bold',
            textAlign: 'center',
            marginHorizontal: '10%',
          }}>
          JOIN A NEW AREA OF SOCIAL NETWORKING
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: '#34a8eb',
            width: '70%',
            marginVertical: '4%',
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            height: 50,
          }}>
          <Text style={{fontSize: 20, color: 'white'}}>GET STARTED</Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={{height: 1, backgroundColor: 'grey', width: '35%'}} />
          <Text style={{paddingHorizontal: '2%'}}>OR</Text>
          <View style={{height: 1, backgroundColor: 'grey', width: '35%'}} />
        </View>
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.2)',
            width: '65%',
            marginVertical: '4%',
            alignItems: 'center',
            justifyContent: 'center',
            height: 40,
            flexDirection: 'row',
          }}>
          <Text style={{fontSize: 16, color: 'white'}}>
            Have an account already?
          </Text>
          <Text
            onPress={() => {
              navigation.navigate('Login');
            }}
            style={{
              paddingHorizontal: '2%',
              color: '#34a8eb',
              fontWeight: 'bold',
            }}>
            LOG IN
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            paddingBottom: '8%',
            paddingHorizontal: '7%',
          }}>
          <Text style={{textAlign:'left'}}>
            JOIN A NEW AREA OF SOCIAL NETWORKINGJOIN A NEW AREA OF SOCIAL
            NETWORKINGJOIN A NEW AREA OF SOCIAL NETWORKING
          </Text>
        </View>
      </View>
    </View>
  );
}
