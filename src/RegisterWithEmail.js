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
  TextInput,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from './component/NavigationBar';
import * as Config from '../Config';
import PhoneInput from 'react-native-phone-number-input';

export default function RegisterWithEmail({navigation, route}) {
  const [email, setEmail] = useState('');

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{flex: 1}}>
        <View style={{flexDirection: 'row', paddingHorizontal: '3%'}}>
          <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
            <Icon name={'ios-arrow-back'} size={40} color={'#34a8eb'} />
          </TouchableWithoutFeedback>
        </View>
        <View style={{paddingHorizontal: '5%', marginTop: '10%'}}>
          <Text
            style={{fontSize: 23, fontWeight: 'bold', paddingVertical: '5%'}}>
            Enter your email address
          </Text>
          <Text style={{width: '60%'}}>
            To get notified on the things you care about
          </Text>
          <Text style={{paddingVertical: '5%'}}>Email address</Text>
          <TextInput
            value={email}
            onChangeText={text => {
              setEmail(text);
            }}
            style={{borderBottomWidth: 2, borderColor: '#34a8eb', width: '90%'}}
          />
          <View style={{alignItems: 'flex-end', marginTop: '5%'}}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('RegisterSuccess');
              }}
              style={{
                width: '30%',
                height: 40,
                backgroundColor: '#34a8eb',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 20,
              }}>
              <Text style={{color: 'white'}}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
