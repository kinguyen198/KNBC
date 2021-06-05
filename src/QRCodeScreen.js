import React, { useState, useEffect, useRef } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
export default function QRCodeScreen({ navigation, route }) {
    const onSuccess = e => {
        route.params.handleDataQR(e.data)
        navigation.goBack();
    };
    return (
        <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center' }}>
            <QRCodeScanner
                onRead={onSuccess}
                flashMode={RNCamera.Constants.FlashMode.off}
            />
        </View>
    )
}