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

export default function RegisterWithPhone({navigation, route}) {
  const [phone, setPhone] = useState('');
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
            What's your number?
          </Text>
          <Text style={{width: '60%'}}>
            Don't worry nobody will see you mobile number
          </Text>
          <Text style={{paddingVertical: '5%'}}>Your phone</Text>
          <PhoneInput
            containerStyle={{
              marginTop: 20,
              borderBottomWidth: 2,
              borderColor: '#34a8eb',
            }}
            //ref={refInputPhone}
            //defaultValue={phoneNum}
            defaultCode="VN"
            layout="first"
            onChangeFormattedText={text => {
              //console.log(text)
              setPhone(text);
            }}
            autoFocus
          />
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.navigate('RegisterWithEmail');
            }}>
            <View
              style={{
                flexDirection: 'row',
                paddingVertical: '5%',
                alignItems: 'center',
              }}>
              <Icon
                name={'mail-open-outline'}
                size={25}
                color={'#34a8eb'}
                style={{paddingHorizontal: '2%'}}
              />
              <Text style={{color: '#34a8eb'}}>Use email instead</Text>
            </View>
          </TouchableWithoutFeedback>
          <Text style={{paddingHorizontal: '2%', paddingVertical: '3%'}}>
            JOIN A NEW AREA OF SOCIAL NETWORKINGJOIN A NEW AREA OF SOCIAL
            NETWORKINGJOIN A NEW AREA OF SOCIAL NETWORKING
          </Text>
          <View style={{alignItems: 'flex-end'}}>
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
