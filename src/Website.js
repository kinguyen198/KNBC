import React, {useState, useEffect, useRef} from 'react';
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
  KeyboardAvoidingView,Picker,Linking,Clipboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from './component/NavigationBar';
import * as Config from '../Config';
import {CommonActions} from '@react-navigation/native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers,
} from 'react-native-popup-menu';
import DeviceInfo from 'react-native-device-info';
import Toast from 'react-native-simple-toast';

import {WebView} from 'react-native-webview';
import Geolocation from '@react-native-community/geolocation';
import {NetworkInfo} from 'react-native-network-info';
import { isIphoneX } from 'react-native-iphone-x-helper';

export default function Website({navigation, route}) {
  const [userName, setUserName] = useState(''); 
  const [textError, setTextError] = useState('');
  const heightStatusBar = getStatusBarHeight();
  const {params} = route;
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [url, setUrl] = useState('');

  const hideModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    var url = params.url;
    if(url.includes('?')){
       url = url+"?source="+DeviceInfo.getApplicationName()
    }else{
      url = url+"&source="+DeviceInfo.getApplicationName()
    }
    setUrl(url);
  }, [url]);

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
   
    if (typeof user === 'object') {
      let newUser = {
        userName: user.userName,
        userPhoto:
          user.userPhoto == '' ? Config.settings.avatar  : user.userPhoto,
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
    let msgData=null;
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
        
        Config.parse_user(function(u){
            if(u){
              navigation.navigate("Home");
            }else{
              navigation.navigate("Login");
            }
        });
        break;
      case 'view':
        var callback = function(){
          msgData.args = arguments;
          msgData.isSuccessfull = true;
          myWebView.current.injectJavaScript(
            `window.postMessage('${JSON.stringify(msgData)}', '*');`,
          );
        };
        //https://stackoverflow.com/questions/44942130/navigate-callback-react-native
        navigation.navigate(msgData.data,{ callback: callback});
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
  useEffect(async () => {
   
    var code = Platform.OS === "android"?"window.root_local ='file:///android_asset/';":`window.root_local = document.location.origin+document.location.pathname.split("/").slice(0, -1).join("/")+"/";`;
    code+='window.AhluDevice='+JSON.stringify({
    mac: DeviceInfo.getUniqueId(),
    appName:DeviceInfo.getApplicationName(),
    buildNumber: DeviceInfo.getBuildNumber(),
    bundle:DeviceInfo.getBundleId(),
    os:Platform.OS,
    iphonex : isIphoneX()
  })+";";
    // alert(code);
    setJscode(code);
    DeviceInfo.getDeviceToken().then((deviceToken) => {
      // iOS: "a2Jqsd0kanz..."
      // alert(deviceToken);
    }).catch(console.error);
   

    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', function(){
        myWebView.current.injectJavaScript(
          `window.postMessage('window_back', '*');`,
        );
        // alert("back");
        return false;
      });
    }


    // Get BSSID
    NetworkInfo.getBSSID().then(bssid => {
       myWebView.current.injectJavaScript(`window.AhluDevice.macwifi = '${bssid}';`);
    });
    NetworkInfo.getIPAddress().then(ipAddress => {
        // alert(ipAddress);
        myWebView.current.injectJavaScript(`window.AhluDevice.ip_local = '${ipAddress}';`);
    });
    NetworkInfo.getIPV4Address().then(ipv4Address => {
      // alert(ipv4Address);
      myWebView.current.injectJavaScript(`window.AhluDevice.ip = '${ipv4Address}';`);
    });

  }, []);

  function wait(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

  return (
  
      <View style={{backgroundColor: 'white', flex: 1}}>
          <View
          style={{
            paddingTop: heightStatusBar,
            backgroundColor: '#34a8eb',
            flex: 0
          }}></View>
          <View
          style={{
            backgroundColor: '#34a8eb',
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: '4%',
            paddingTop: '1%',
            paddingBottom: '1%',
          }}>
          <TouchableOpacity
            style={{flex: 0}}
            onPress={() => {
              navigation.goBack();
            }}>
            <Icon name="ios-arrow-back" size={32} style={{color: 'white'}} />
          </TouchableOpacity>
          <View style={{flex: 1, paddingLeft:'1%', paddingRight:'1%', justifyContent: 'flex-start', width: '100%'}}>
             
            <Text numberOfLines={1} 
              style={{
                marginLeft: '1%',
                fontSize: 18,
                color: '#f2f2f2',
                textAlign: 'center',
              }}>
              {params.title}
            </Text>
          </View>
          <View style={{flex:0,opacity: 1, color: '#fff'}} >
          <Menu
            renderer={renderers.Popover}
            rendererProps={{placement: 'bottom'}}>
              <MenuTrigger>
                <Icon
                name="ellipsis-horizontal-outline"
                color="white"
                style={{fontSize: 28}}/>
              </MenuTrigger>
              <MenuOptions
                text='Select action'
                optionsContainerStyle={{
                  backgroundColor: 'white',
                  width: Dimensions.get('screen').width / 1.8,
                }}>
                <MenuOption
                  onSelect={() => {
                    
                    console.log(url);
                    Linking.openURL(url);
                  }}
                  style={styles.menuOption}> 
                  <Text style={{marginLeft: '5%'}}>Mở địa chỉ</Text>
                </MenuOption>
                <MenuOption
                  onSelect={() => {
                     Clipboard.setString(url);
                     Toast.show('Copied', Toast.SHORT);
                  }}
                  style={styles.menuOption}> 
                  <Text style={{marginLeft: '5%'}}>Copy địa chỉ</Text>
                </MenuOption>
                <MenuOption
                  onSelect={() => {
                      Config.share.text(url);
                  }}
                  style={styles.menuOption}> 
                  <Text style={{marginLeft: '5%'}}>Share địa chỉ</Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </View>
        </View>
        <View style={styles.container}>
        <WebView
          ref={myWebView}
          useWebKit={true}
          originWhitelist={['*']}
          allowsInlineMediaPlayback={true}
          scrollEnabled={true}
          source={{uri: url}}
          onMessage={onWebViewMessage}
          domStorageEnabled={true}
          mixedContentMode="always"
          sharedCookiesEnabled={true}
          injectedJavaScript={jscode}
        />
      </View>
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
