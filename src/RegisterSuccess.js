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

export default function RegisterSuccess({navigation, route}) {
  const [fullName, setFullName] = useState('');

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
            Hello, What's your name?
          </Text>
          <Text style={{paddingVertical: '5%'}}>Full Name</Text>
          <TextInput
            value={fullName}
            onChangeText={text => setFullName(text)}
            style={{borderBottomWidth: 2, borderColor: '#34a8eb', width: '90%'}}
          />
          <View
            style={{
              marginLeft: '3%',
              width: '90%',
              height: '40%',
              backgroundColor: 'yellow',
              marginTop: '10%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              style={{width: '100%', height: '100%', position: 'absolute'}}
              source={require('../assets/backgoundRegister.jpeg')}
            />
            <View style={{paddingHorizontal: '8%', alignItems: 'center'}}>
              <Text style={{fontSize: 25, paddingVertical: '5%'}}>
                Congratulations!
              </Text>
              <Text style={{textAlign: 'center', fontWeight: 'bold'}}>
                You have received a reward.Please continue your signup process
                to claim it
              </Text>
            </View>
          </View>

          <View style={{alignItems: 'flex-end'}}>
            <TouchableOpacity
              style={{
                marginTop: '5%',
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
