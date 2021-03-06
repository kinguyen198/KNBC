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

export default function AddFriend({navigation, route}) {
  const [input, setInput] = useState('');
  const [user, setUser] = useState('');

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
  //add friend
  const addFriend = () => {
    if(!input.trim()){
       Alert.alert('Notification', "Enter your friend!.");
    }else{
       var data = {
        method: 'addfriend',
        user_id: input.trim(),
      };
      Config.server.post('ajax/user.php',data, res => {
        if (res.code) {
          Alert.alert('Notification', res.message);
          backScreen();
        }else{
           Alert.alert('Notification', res.error);
        }
        //console.log(res);
      } );
    }
    
  };

  useEffect(() => {
    Config.parse_user(function(u){
        setUser(u);
    });
    
  }, []);
  return (
    <View style={{flex: 1}}>
      <NavigationBar title="Th??m b???n" back={backScreen} />
      <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.1)'}}>
        <View style={{backgroundColor: 'white', marginBottom: '2%'}}>
          <Text style={{paddingLeft: '3%', paddingTop: '3%'}}>
            Th??m b???n b???ng s??? ??i???n tho???i ho???c email
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
              placeholder={'Nh???p s??? ??i???n tho???i/email'}
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
              <Text style={{color: 'white', fontSize: 16}}>Th??m b???n</Text>
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
            title="Qu??t m?? QR"
            onPress={() => {
              navigation.navigate('CameraScan');
            }}
            description="Th??m b???n b???ng qu??t m?? QR"
            icon="qr-code-outline"
          />
          <Button
            title="Gi???i thi???u ???ng cho b???n b??"
            description="G???i tin nh???n sms ????? m???i b???n "
            icon="md-chatbox-ellipses-outline"
            onPress={()=>{
              Config.share.text("T???i ???ng d???ng vad nh???p m?? gi???i thi???u"+user.id);
            }}
          />
          <Button
            title="B???n t??? danh b??? m??y"
            description="Th??m b???n t??? danh b??? m??y"
            icon="md-people"
            onPress={()=>{
              
            }}
          />
          <Button
            title="C?? th??? b???n quen"
            description="Th??m b???n t??? danh s??ch g???i ??"
            icon="ios-man"
            onPress={()=>{
              
            }}
          />
        </View>
        <View style={{backgroundColor: 'white', paddingLeft: '3%'}}>
          <Button
            title="L???i m???i k???t b???n ???? g???i"
            description="Thu h???i ho???c g???i l???i y??u c???u"
            icon="md-person-add-sharp"
          />
        </View>
      </View>
    </View>
  );
}
