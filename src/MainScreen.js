/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  ScrollView,
  BackHandler,
  Platform,
  Dimensions,
  RefreshControl,
} from 'react-native';
import {WebView} from 'react-native-webview';
import Geolocation from '@react-native-community/geolocation';

import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {firebase} from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Config from '../Config';
import DeviceInfo from 'react-native-device-info';
import {NetworkInfo} from 'react-native-network-info';
//
import {isIphoneX} from 'react-native-iphone-x-helper';

export default function MainScreen({navigation, route}) {
  const myWebView = useRef();
  const [currentLongitude, setCurrentLongitude] = useState('...');
  const [currentLatitude, setCurrentLatitude] = useState('...');
  const [locationStatus, setLocationStatus] = useState('');

  const [isLogin, setIsLogin] = useState(false);
  const [text, setText] = useState('');
  const [text2, setText2] = useState('');
  const [jscode, setJscode] = useState('');

  //
  const GPS = func => {
    setLocationStatus('Getting Location ...');
    Geolocation.getCurrentPosition(
      //Will give you the current location
      position => {
        setLocationStatus('You are Here');
        //Setting Longitude state
        // setCurrentLongitude(currentLongitude);
        // //Setting Longitude state
        // setCurrentLatitude(currentLatitude);
        // c

        console.log(position);

        func({lat: position.coords.longitude, lng: position.coords.latitude});
      },
      error => {
        // setLocationStatus(error.message);
        func({lat: 0, lng: 0});
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  };

  const onGoogleButtonPress = async () => {
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  };
  const loginWithGoogle = async fun => {
    onGoogleButtonPress().then(async user => {
      console.log('Login Success with google');
      setIsLogin(true);
      if (typeof fun === 'function') {
        fun(user.user);
      }
    });
  };
  const logOut = () => {
    firebase.auth().signOut();
    setIsLogin(false);
  };

  const Scan = fun => {
    //goi view sceen
    navigation.navigate('QRCodeScreen', {
      handleDataQR: data => {
        if (data != '') {
          fun(data);
        }
      },
    });
  };
  const Chat = async user => {
    //goi view sceen
    // try {
    //   const jsonValue = await AsyncStorage.getItem('user');
    //   const user = JSON.parse(jsonValue);
    //   if (user !== null) {
    //     console.log(user);
    //     navigation.navigate('Home');
    //   } else {
    //     loginWithGoogle(async user => {
    //       try {
    //         let newUser = {
    //           userName: user.displayName,
    //           userPhoto: !user.photoURL
    //             ? Config.settings.avatar
    //             : user.photoURL,
    //           userId: user.uid,
    //         };
    //         await AsyncStorage.setItem('user', JSON.stringify(newUser));
    //         navigation.navigate('Home');
    //       } catch (e) {
    //         console.log(e);
    //       }
    //     });
    //   }
    // } catch (e) {
    //   console.log(e);
    // }
    // try {
    // const jsonValue = await AsyncStorage.getItem('user');
    // const userStorage = JSON.parse(jsonValue);
    // if (userStorage !== null) {
    //   console.log(1);
    //   navigation.navigate('Home');
    // } else {
    // console.log(2);
    if (typeof user === 'object') {
      let newUser = {
        userName: user.userName,
        userPhoto:
          user.userPhoto == '' ? Config.settings.avatar : user.userPhoto,
        userId: user.userId,
        code: user.code,
      };

      await AsyncStorage.setItem('user', JSON.stringify(newUser), () => {
        navigation.navigate('Home');
      });
    }
    //   }
    // } catch (e) {
    //   console.log(e);
    // }
  };

  const onWebViewMessage = event => {
    console.log('Message received from webview');
    let msgData = null;
    try {
      msgData = JSON.parse(event.nativeEvent.data);
      console.log(msgData);
    } catch (err) {
      console.warn(err);
      return;
    }
    switch (msgData.targetFunc) {
      case 'logingoogle':
        console.log('Login');
        //logOut();
        loginWithGoogle(function (user) {
          console.log(user);
          msgData.args = [user];
          msgData.isSuccessfull = true;
          myWebView.current.injectJavaScript(
            `window.postMessage('${JSON.stringify(msgData)}', '*');`,
          );
        });

        break;
      case 'gps':
        console.log('gps');

        GPS(function (pos) {
          console.log(pos);
          msgData.args = [pos];
          msgData.isSuccessfull = true;
          myWebView.current.injectJavaScript(
            `window.postMessage('${JSON.stringify(msgData)}', '*');`,
          );
        });

        break;
      case 'gps':
        console.log('gps');

        GPS(function (pos) {
          console.log(pos);
          msgData.args = [pos];
          msgData.isSuccessfull = true;
          myWebView.current.injectJavaScript(
            `window.postMessage('${JSON.stringify(msgData)}', '*');`,
          );
        });

        break;
      case 'scan':
        console.log('scan');

        Scan(function (code) {
          console.log(code);
          msgData.args = [code];
          msgData.isSuccessfull = true;
          myWebView.current.injectJavaScript(
            `window.postMessage('${JSON.stringify(msgData)}', '*');`,
          );
        });
        break;
      case 'chat':
        console.log('chat');
        const user = msgData.data;
        Chat(user);
        break;
      case 'login':
        Config.parse_user(function (u) {
          if (u) {
            navigation.navigate('Home');
          } else {
            navigation.navigate('Login');
          }
        });
        break;
      case 'view':
        var callback = function () {
          msgData.args = arguments;
          msgData.isSuccessfull = true;
          myWebView.current.injectJavaScript(
            `window.postMessage('${JSON.stringify(msgData)}', '*');`,
          );
        };
        //https://stackoverflow.com/questions/44942130/navigate-callback-react-native
        navigation.navigate(msgData.data, {callback: callback});
        break;
      case 'share':
        // if (msgData.message && msgData.url) {
        //   Config.share.text(msgData.title, msgData.message + msgData.url);
        // } else {
        //   if (msgData.url) {
        //     Config.share.link(msgData.title, msgData.url);
        //   } else {
        //     Config.share.text(msgData.title, msgData.message);
        //   }
        // }
        navigation.navigate('GetStarted');
        break;
    }
  };
  useEffect(async () => {
    var code =
      Platform.OS === 'android'
        ? "window.root_local ='file:///android_asset/';"
        : `window.root_local = document.location.origin+document.location.pathname.split("/").slice(0, -1).join("/")+"/";`;
    code +=
      'window.AhluDevice=' +
      JSON.stringify({
        mac: DeviceInfo.getUniqueId(),
        appName: DeviceInfo.getApplicationName(),
        buildNumber: DeviceInfo.getBuildNumber(),
        bundle: DeviceInfo.getBundleId(),
        os: Platform.OS,
        iphonex: isIphoneX(),
      }) +
      ';';
    // alert(code);
    setJscode(code);
    DeviceInfo.getDeviceToken()
      .then(deviceToken => {
        // iOS: "a2Jqsd0kanz..."
        // alert(deviceToken);
      })
      .catch(console.error);

    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', function () {
        myWebView.current.injectJavaScript(
          `window.postMessage('window_back', '*');`,
        );
        // alert("back");
        return false;
      });
    }

    // Get BSSID
    NetworkInfo.getBSSID().then(bssid => {
      myWebView.current.injectJavaScript(
        `window.AhluDevice.macwifi = '${bssid}';`,
      );
    });
    NetworkInfo.getIPAddress().then(ipAddress => {
      // alert(ipAddress);
      myWebView.current.injectJavaScript(
        `window.AhluDevice.ip_local = '${ipAddress}';`,
      );
    });
    NetworkInfo.getIPV4Address().then(ipv4Address => {
      // alert(ipv4Address);
      myWebView.current.injectJavaScript(
        `window.AhluDevice.ip = '${ipv4Address}';`,
      );
    });
  }, []);

  function wait(timeout) {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={myWebView}
        //source={{uri: 'https://google.com'}}
        useWebKit={true}
        originWhitelist={['*']}
        allowsInlineMediaPlayback={true}
        scrollEnabled={false}
        // source={{uri: 'https://hcm.ahlupos.com/test/chatroom/my.php?user=azs2nd'}}
        // source={{uri: 'https://hcm.ahlupos.com/test/menupos/app.php'}}
        //source={require('../resource/index.html')}
        source={
          Platform.OS === 'android'
            ? {uri: 'file:///android_asset/index.html'}
            : require('../android/app/src/main/assets/index.html')
        }
        // source={{
        //   uri:
        //     Platform.OS === 'android'
        //       ? 'file:///android_asset/index.html'
        //       : '/assets/index.html',
        // }}
        //source={{ html: '<h1>This is a static HTML source!</h1>' }}
        onMessage={onWebViewMessage}
        allowFileAccess={true}
        domStorageEnabled={true}
        allowUniversalAccessFromFileURLs={true}
        allowFileAccessFromFileURLs={true}
        mixedContentMode="always"
        sharedCookiesEnabled={true}
        onShouldStartLoadWithRequest={
          Config.webview.onShouldStartLoadWithRequest
        }
        injectedJavaScript={jscode}
      />
      {/* {isLogin == false ? (
         <TouchableOpacity onPress={loginWithGoogle} style={styles.button}>
           <Text>loginWithGoogle</Text>
         </TouchableOpacity>
       ) : (
         <TouchableOpacity onPress={logOut} style={[styles.button,{backgroundColor:'red'}]}>
           <Text>logOut</Text>
         </TouchableOpacity>
       )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    //alignItems: 'center',
    //justifyContent: 'center',
  },
  containerWeb: {
    width: '100%',
    height: '100%',
  },
  button: {
    width: 300,
    height: 50,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
