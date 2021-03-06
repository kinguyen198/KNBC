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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from './component/NavigationBar';
import * as Config from '../Config';
import Share from 'react-native-share';

export default function ScanQR({navigation, route}) {
  const {user} = route.params;
  const backScreen = () => {
    navigation.goBack();
  };
  return (
    <View style={{flex: 1}}>
      <NavigationBar title="ScanQR" back={backScreen} />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: '5%',
        }}>
        <View
          style={{
            width: '100%',
            backgroundColor: 'grey',
            //paddingHorizontal: 10,
            paddingVertical: '17%',
            paddingBottom: '10%',
            alignItems: 'center',
            borderRadius: 20,
            //justifyContent:'center',
          }}>
          <View
            style={{position: 'absolute', top: '-7%', alignItems: 'center'}}>
            <Image
              source={{uri: user.userPhoto}}
              style={{
                width: 50,
                height: 50,
                borderRadius: 70,
                backgroundColor: 'blue',
              }}
            />
            <Text
              style={{
                fontSize: 15,
                fontWeight: 'bold',
                color: 'white',
                marginTop: '5%',
                marginBottom: '5%',
              }}>
              {user.userName}
            </Text>
          </View>

          <Image
            source={{
              uri: 'https://images.viblo.asia/5974cb6b-ec70-41d0-9074-d4319b62f4c7.png',
            }}
            style={{
              width: Dimensions.get('screen').height * 0.3,
              height: Dimensions.get('screen').height * 0.3,
            }}
          />
        </View>
        <Text
          style={{
            marginTop: '5%',
            fontSize: 15,
            textAlign: 'center',
            color: 'rgba(0,0,0,0.3)',
          }}>
          Your QRCode is private. If you share it with someone,they can scan it
          with their KNBC camera to add you as contact
        </Text>
        <TouchableOpacity>
          <Text
            style={{
              marginTop: '5%',
              fontSize: 16,
              textAlign: 'center',
              color: '#34a8eb',
            }}>
            Reset QR Code
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('CameraScan');
          }}
          style={{
            marginTop: '10%',
            backgroundColor: '#34a8eb',
            paddingVertical: '5%',
            width: '70%',
            borderRadius: 10,
          }}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 16,
              textAlign: 'center',
              color: 'white',
            }}>
            Scan
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
