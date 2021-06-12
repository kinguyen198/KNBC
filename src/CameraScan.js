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
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import {getStatusBarHeight} from 'react-native-status-bar-height';

export default function CameraScan({navigation, route}) {
  const SCREEN_HEIGHT = Dimensions.get('window').height;
  const SCREEN_WIDTH = Dimensions.get('window').width;
  const heightStatusBar = getStatusBarHeight();

  const backScreen = () => {
    navigation.goBack();
  };
  const onSuccess = e => {
    //route.params.handleDataQR(e.data);
    navigation.goBack();
  };
  return (
    <View style={{flex: 1}}>
      <NavigationBar back={backScreen} />
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <QRCodeScanner
          showMarker
          customMarker={
            <View
              style={{
                width: SCREEN_WIDTH * 0.65,
                height: SCREEN_WIDTH * 0.65,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
              }}>
              <Icon
                name="md-scan-outline"
                size={SCREEN_WIDTH * 0.7}
                color={'white'}
                style={{marginTop: '-8%'}}
              />
            </View>
          }
          cameraStyle={{
            height: '100%',
            position: 'absolute',
          }}
          onRead={onSuccess}
          flashMode={RNCamera.Constants.FlashMode.off}
        />
      </View>
    </View>
  );
}
