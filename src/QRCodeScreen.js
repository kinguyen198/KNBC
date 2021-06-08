import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
export default function QRCodeScreen({navigation, route}) {
  const [isShowCamera, setIsShowCamera] = useState(false);
  const onSuccess = e => {
    route.params.handleDataQR(e.data);
    navigation.goBack();
  };
  return (
    <View style={{flex: 1, alignContent: 'center', justifyContent: 'center'}}>
      <View style={[styles.view, {flex: 1}]}>
        <Text>Lorem 123123</Text>
      </View>
      <View style={[styles.view, {flex: 2}]}>
        {isShowCamera == true ? (
          <QRCodeScanner
            onRead={onSuccess}
            flashMode={RNCamera.Constants.FlashMode.off}
          />
        ) : null}
      </View>
      <View style={[styles.view, {flex: 1, flexDirection: 'row'}]}>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: 'red'}]}
          onPress={() => {
            navigation.goBack();
          }}>
          <Text>BACK</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: 'green'}]}
          onPress={() => {
            setIsShowCamera(true);
          }}>
          <Text>SCAN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  view: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 150,
    height: 50,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
});
