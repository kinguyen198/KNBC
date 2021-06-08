/* eslint-disable react-native/no-inline-styles */
/** Login Screen of the app */

//importing libraries
import React, {useState, useEffect} from 'react';
import {View, SafeAreaView, Text} from 'react-native';
import {StackActions} from '@react-navigation/native';
import {firebase} from '@react-native-firebase/auth';

export default function LoginScreen({navigation}) {
  const [visible, setVisible] = useState(1);
  var user = firebase.auth().currentUser;

  useEffect(() => {
    if (user) {
      setVisible(0);
      //divert to home
      navigation.navigate("Home")
    } else {
      setVisible(1);
    }
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#222'}}>
      <View
        style={{
          flex: 1,
          alignContent: 'stretch',
          justifyContent: 'space-between',
          opacity: visible,
        }}>
        <Text
          style={{
            width: '100%',
            color: '#46CF76',
            fontSize: 122,
            textAlign: 'center',
            //fontFamily: 'Cairo-SemiBold',
            marginTop: '20%',
            opacity: 0.8,
          }}>
          #Chats
        </Text>

        {/* <LoginButton
            style={{
              width: '70%',
              height: '4%',
              marginHorizontal: '15%',
              marginBottom: '30%',
            }}
            onLoginFinished={(error, result) => {
              if (error) {
                console.log('login has error: ' + result.error);
              } else if (result.isCancelled) {
                console.log('login is cancelled.');
              } else {
                
                this.props.navigation.navigate('Home');
              }
            }}
            onLogoutFinished={() => console.log('logout.')}
          />  */}
      </View>
    </SafeAreaView>
  );
}
