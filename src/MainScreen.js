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
} from 'react-native';
import {WebView} from 'react-native-webview';
import Geolocation from '@react-native-community/geolocation';

import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {firebase} from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Config from '../Config';

GoogleSignin.configure({
  webClientId: '',
});
export default function MainScreen({navigation, route}) {
  const myWebView = useRef();
  const [currentLongitude, setCurrentLongitude] = useState('...');
  const [currentLatitude, setCurrentLatitude] = useState('...');
  const [locationStatus, setLocationStatus] = useState('');

  const [isLogin, setIsLogin] = useState(false);
  const [text, setText] = useState('');
  const [text2, setText2] = useState('');
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
    //             ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1DLuBDtz2945mZR71wAT0WSkktlbwpF3chZ8omSwo5km6q6NfxZDKtx5TXWcrWz-rZDA&usqp=CAU'
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
          user.userPhoto == ''
            ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1DLuBDtz2945mZR71wAT0WSkktlbwpF3chZ8omSwo5km6q6NfxZDKtx5TXWcrWz-rZDA&usqp=CAU'
            : user.userPhoto,
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
  const LoginUser = () => {
    navigation.navigate('Login');
  };
  const onWebViewMessage = event => {
    console.log('Message received from webview');
    let msgData;
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
        LoginUser();
        break;
      case 'share':
        if (msgData.message && msgData.url) {
          Config.share.text(msgData.title, msgData.message + msgData.url);
        } else {
          if (msgData.url) {
            Config.share.link(msgData.title, msgData.url);
          } else {
            Config.share.text(msgData.title, msgData.message);
          }
        }

        break;
    }
  };
  const onShouldStartLoadWithRequest = request => {
    var matches = request.url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
    var domain = matches && matches[1];
    if (Config.server.url.includes(domain)) {
      return true;
    }
    if (request.url.includes('iframe=true')) {
      return true;
    }
    if (request.url.includes('open=true')) {
      Linking.openURL(request.url);
      return false;
    }
    //ext
    var ext = Config.utils.getFileExtension3(request.url);
    switch (ext) {
      case 'mp3':
      case 'mp4':
      case 'wma':
      case 'flv':
      case 'mpeg':
        return true;
    }

    if (!/^[data:text, about:blank]/.test(request.url)) {
      console.log(request.url);
      if (
        request.url.startsWith('tel:') ||
        request.url.startsWith('mailto:') ||
        request.url.startsWith('maps:') ||
        request.url.startsWith('geo:') ||
        request.url.startsWith('sms:')
      ) {
        Linking.openURL(request.url).catch(er => {
          console.log('Failed to open Link:', er.message);
        });
        return false;
      } else {
        if (request.url.startsWith(Config.server.schema)) {
          const path = request.url.replace(Config.server.schema, '');
          var regex = /[?&]([^=#]+)=([^&#]*)/g,
            params = {},
            match;
          while ((match = regex.exec(path))) {
            params[match[1]] = match[2];
          }
          path = path.split('?')[0];
          if (path.startsWith('share')) {
            //share
          } else if (path.startsWith('add')) {
            //share
          } else if (path.startsWith('send')) {
            //share
          }
          console.log(params);
          return false;
        } else {
          //skip
          if (
            request.url.startsWith('wvjbscheme://') ||
            request.url.includes('://localhost')
          ) {
            return true;
          }
          //open all in default
          Linking.openURL(request.url);
          return false;
        }
      }
    }
    return true;
  };
  useEffect(() => {}, []);
  // useEffect(() => {
  //   getOneTimeLocation();
  // }, []);
  // useEffect(() => {
  //   console.log(currentLatitude);
  //   console.log(currentLongitude);
  // }, [currentLongitude, currentLatitude]);
  return (
    <SafeAreaView style={styles.container}>
      <WebView
        ref={myWebView}
        //source={{uri: 'https://google.com'}}
        useWebKit={true}
        originWhitelist={['*']}
        allowsInlineMediaPlayback={true}
        scrollEnabled={false}
        // source={{uri: 'https://hcm.ahlupos.com/test/chatroom/my.php?user=azs2nd'}}
        //source={require('../resource/index.html')}
        source={
          Platform.OS === 'android'
            ? {uri: 'file:///android_asset/index.html'}
            : require('../resource/index.html')
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
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        // onShouldStartLoadWithRequest={(request) => {
        //   // If we're loading the current URI, allow it to load
        //   return true;
        //   // if (request.url === this.prop) return true;
        //   // // We're loading a new URL -- change state first
        //   // setURI(request.url);
        //   // return false;
        // }}
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
    </SafeAreaView>
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
