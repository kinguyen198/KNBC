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
  Alert,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from './component/NavigationBar';
import * as Config from '../Config';
import Share from 'react-native-share';

export default function AddFriend({navigation, route}) {
  const [input, setInput] = useState('');
  const backScreen = () => {
    navigation.goBack();
  };
  const Button = props => (
    <View>
      <TouchableOpacity onPress={props.onPress}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: '1%',
          }}>
          <Icon
            name={props.icon}
            type="ionicon"
            color="grey"
            style={{
              fontSize: 32,
              marginVertical: '3%',
              marginHorizontal: '3%',
            }}
          />
          <View style={{width: '75%'}}>
            <Text style={{width: '100%', marginBottom: '2%'}}>
              {props.title}
            </Text>
            <Text style={{width: '100%', color: 'rgba(0,0,0,0.3)'}}>
              {props.description}
            </Text>
          </View>

          <Icon name="chevron-forward" color="grey" size={25} />
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: 'rgba(0,0,0,0.1)',
            width: '85%',
            alignSelf: 'flex-end',
          }}></View>
      </TouchableOpacity>
    </View>
  );

  const addFriend = () => {
    Config.server.post(
      'ajax/user.php',
      {
        method: 'addfriend',
        user_id: input,
      },
      res => {
        if (res.message) {
          Alert.alert('Notification', res.message);
        }
        //console.log(res);
      },
    );
  };
  return (
    <View style={{flex: 1}}>
      <NavigationBar title="Thêm bạn" back={backScreen} />
      <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.1)'}}>
        <View style={{backgroundColor: 'white', marginBottom: '2%'}}>
          <Text style={{paddingLeft: '3%', paddingTop: '3%'}}>
            Thêm bạn bằng số điện thoại hoặc email
          </Text>
          <View
            style={{
              flexDirection: 'row',
              paddingLeft: '3%',
              paddingVertical: '3%',
              alignItems: 'center',
            }}>
            <TextInput
              style={{width: '70%', fontSize: 16, paddingVertical: '2%'}}
              placeholder={'Nhập số điện thoại/email'}
              placeholderTextColor={'rgba(0,0,0,0.3)'}
              onChangeText={value => {
                setInput(value);
              }}
            />
            <TouchableOpacity
              onPress={addFriend}
              disabled={input === ''}
              style={{
                marginLeft: '2%',
                backgroundColor: input !== '' ? '#34a8eb' : 'rgba(0,0,0,0.3)',
                paddingVertical: '1.5%',
                paddingHorizontal: '3%',
                borderRadius: 30,
              }}>
              <Text style={{color: 'white', fontSize: 16}}>Thêm bạn</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            paddingLeft: '3%',
            marginBottom: '2%',
          }}>
          <Button
            title="Quét mã QR"
            onPress={() => {
              navigation.navigate('CameraScan');
            }}
            description="Thêm bạn bằng quét mã QR"
            icon="qr-code-outline"
          />
          <Button
            title="Giới thiệu KNBC cho bạn bè"
            description="Gửi tin nhắn sms để mời bạn "
            icon="md-chatbox-ellipses-outline"
          />
          <Button
            title="Bạn từ danh bạ máy"
            description="Thêm bạn từ danh bạ máy"
            icon="md-people"
          />
          <Button
            title="Có thể bạn quen"
            description="Thêm bạn từ danh sách gợi ý"
            icon="ios-man"
          />
        </View>
        <View style={{backgroundColor: 'white', paddingLeft: '3%'}}>
          <Button
            title="Lời mời kết bạn đã gửi"
            description="Thu hồi hoặc gửi lại yêu cầu"
            icon="md-person-add-sharp"
          />
        </View>
      </View>
    </View>
  );
}
