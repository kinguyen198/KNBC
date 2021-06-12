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
import {getStatusBarHeight} from 'react-native-status-bar-height';

export default function NavigationBar(props) {
  const heightStatusBar = getStatusBarHeight();
  return (
    <View>
      <View
        style={{
          paddingTop: heightStatusBar,
          backgroundColor: '#34a8eb',
        }}></View>
      <View
        style={{
          backgroundColor: '#34a8eb',
          flexDirection: 'row',
          //height: '10%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: '4%',
          paddingTop: '1%',
          paddingBottom: '1%',
        }}>
        <TouchableOpacity
          style={{flex: 0.75}}
          onPress={() => {
            props.back();
          }}>
          <Icon name="ios-arrow-back" size={32} style={{color: 'white'}} />
        </TouchableOpacity>
        <Text
          style={{
            marginLeft: '1%',
            flex: 1,
            fontSize: 18,
            color: '#f2f2f2',
            textAlign: 'center',
          }}>
          {props.title}
        </Text>
        <Icon name="ios-home" size={32} style={{opacity: 0, flex: 1}} />
      </View>
    </View>
  );
}
