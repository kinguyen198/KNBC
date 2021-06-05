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
} from 'react-native';
import {WebView} from 'react-native-webview';
import Geolocation from '@react-native-community/geolocation';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {firebase} from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';




GoogleSignin.configure({
  webClientId: '',
});
export default function App(props) {
  GoogleSignin.configure({
    webClientId:
      '581485958090-ladigq74dh48s7v8s2btlrn0s8gj5rml.apps.googleusercontent.com',
  });
  const myWebView = useRef();
  const [currentLongitude, setCurrentLongitude] = useState('...');
  const [currentLatitude, setCurrentLatitude] = useState('...');
  const [locationStatus, setLocationStatus] = useState('');

  const [isLogin, setIsLogin] = useState(false);
  const [text, setText] = useState('');
  const [text2, setText2] = useState('');
  const GPS = (func) => {
    setLocationStatus('Getting Location ...');
    Geolocation.getCurrentPosition(
      //Will give you the current location
      position => {
        setLocationStatus('You are Here');
        //Setting Longitude state
        // setCurrentLongitude(currentLongitude);
        // //Setting Longitude state
        // setCurrentLatitude(currentLatitude);
        console.log(currentLongitude);
        console.log(currentLatitude);

        func({lat:position.coords.longitude,lng:position.coords.latitude})
      },
      error => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  };
  const onSuccess = e => {
    console.log(e.data);
  };
  const onGoogleButtonPress = async () => {
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  };
  const loginWithGoogle = async (fun) => {
    onGoogleButtonPress().then(async user => {
      console.log('Login Success with google');
      setIsLogin(true);
      if(typeof fun === 'function'){
        fun(user.user);
      }
      
    });
  };
  const logOut = () => {
    firebase.auth().signOut();
    setIsLogin(false);
  }; 
  
  const onWebViewMessage = event => {
    console.log('Message received from webview');
    console.log();
    let msgData;
    try {
      msgData = JSON.parse(event.nativeEvent.data);
      console.log(msgData);
    } catch (err) {
      console.warn(err);
      return;
    }
    switch (msgData.targetFunc) {
      case 'handleDataReceived':
        setText2(`Message from web view ${msgData.data}`),
          (msgData.isSuccessfull = true);
        msgData.args = [msgData.data % 2 ? 'green' : 'red'];
        // myWebView.injectedJavaScript(
        //   `window.postMessage('${JSON.stringify(msgData)}', '*');`,
        // );
         myWebView.current.injectJavaScript(
          `window.postMessage('${JSON.stringify(msgData)}', '*');`,
        );
        break;
      case 'logingoogle':
        console.log("Login");
        logOut();
        loginWithGoogle(function(user){
          console.log(user);
           msgData.args = [user];
           msgData.isSuccessfull = true;
           myWebView.current.injectJavaScript(
            `window.postMessage('${JSON.stringify(msgData)}', '*');`,
          );
        });
        
        break;
        case 'gps':
        console.log("gps");
        
        GPS(function(pos){
          console.log(pos);
           msgData.args = [pos];
           msgData.isSuccessfull = true;
           myWebView.current.injectJavaScript(
            `window.postMessage('${JSON.stringify(msgData)}', '*');`,
          );
        });
        
        break;
    }
  };

  useEffect(()=>{
     
  },[])
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
        source={require('./resource/index.html')}
        // source= {
        //   {uri: Platform.OS === "android"
        //       ? 'file:///android_asset/index.html'
        //       : 'assets/index.html'
        //   }
        // }
        //source={{ html: '<h1>This is a static HTML source!</h1>' }}
        onMessage={onWebViewMessage}
        allowFileAccess={true}
        domStorageEnabled={true}
        allowUniversalAccessFromFileURLs={true}
        allowFileAccessFromFileURLs={true}
        mixedContentMode="always"
        sharedCookiesEnabled={true}
        // onShouldStartLoadWithRequest={(request) => {
        //   // If we're loading the current URI, allow it to load
        //   return true;
        //   // if (request.url === this.prop) return true;
        //   // // We're loading a new URL -- change state first
        //   // setURI(request.url);
        //   // return false;
        // }}
      />
      {/* <QRCodeScanner
        onRead={onSuccess}
        flashMode={RNCamera.Constants.FlashMode.off}
        topContent={
          <Text style={styles.centerText}>
            Go to{' '}
            <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on
            your computer and scan the QR code.
          </Text>
        }
      /> */}
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
