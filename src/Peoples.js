/* eslint-disable react-native/no-inline-styles */
/** Active peoples tab in Home Screen */

//importing libraries
import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, Image, TouchableOpacity} from 'react-native';
import axios from 'axios';
import io from 'socket.io-client';
import {firebase} from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Config from '../Config';

export default function PeoplesScreen({navigation, route}) {
  const [userId, setUserId] = useState('');
  const [userPhoto, setUserPhoto] = useState(null);
  const [userName, setUserName] = useState('');
  const [friends, setFriends] = useState([]);
  const [inactivePeoples, setInactivePeoples] = useState([]);
  const [activePeoples, setActivePeoples] = useState([]);

  const backScreen = () => {
     setSelectUsers([]); 
  };
  const loadFriends =  (func) => {
     Config.server.post('ajax/user.php',{method:"myfriend"}, res => {
      if (res.code) {
          var data = res.data.map(function(item,i){
            return {
                  __v: i,
                  _id: item.user_id,
                  id: item.user_id,
                  isActive: item.isActive,
                  name: item.username,
                  photo:item.avatar?item.avatar:Config.settings.avatar
                };
          });
          func(data);
      }else{
         func([]);
      }
      //console.log(res);
    } );
  };

  const arrayTest = [
    {
      __v: 0,
      _id: '1',
      id: '12312316232126422461',
      isActive: true,
      name: 'Test16232126422469',
      photo:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1DLuBDtz2945mZR71wAT0WSkktlbwpF3chZ8omSwo5km6q6NfxZDKtx5TXWcrWz-rZDA&usqp=CAU',
    }
  ]; 
 
  useEffect(() => {
    loadFriends(function(res){
        setActivePeoples(res);
        setFriends(res);
    });
    
  }, [userId]);
  const renderUser = (active, showActive = true) => (
    <TouchableOpacity
      onPress={() => {
        // navigation.navigate('Messages', {
        //   userName: active.name,
        //   userId: active.id,
        //   userPhoto: active.photo,
        //   senderId: userId,
        //   senderName: userName,
        //   senderPhoto: userPhoto,
        // });
        // console.log(this.props);
      }}>
      <View
        style={{
          flex: 2,
          flexDirection: 'row',
          marginVertical: '2%',
          paddingVertical: '1%',
          borderRadius: 10,
          alignItems: 'center',
        }}>
        <Image
          source={{
            uri:
              active.photo == '' ? Config.settings.avatar : active.photo,
          }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 70,
          }}
        />
        {showActive ? (
          <View
            style={{
              position: 'absolute',
              backgroundColor: '#46CF76',
              width: 15,
              height: 15,
              left: 30,
              top: 30,
              borderRadius: 100,
            }}
          />
        ) : null}

        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            marginHorizontal: '3%',
            marginTop: '1%',
          }}>
          <Text
            style={{
              fontSize: 18,
              //fontFamily: 'Cairo-SemiBold',
              color: 'black',
            }}>
            {active.name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  return (
    <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.1)'}}>
      <ScrollView alwaysBounceVertical={true}>
        <View style={{backgroundColor: 'white', marginBottom: '2%'}}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              //marginVertical: '5%',
              alignItems: 'center',
            }}
            onPress={()=>{
                navigation.navigate('AddFriend');
            }}
            >
            <Icon
              name="people-sharp"
              type="ionicon"
              color="grey"
              style={{
                fontSize: 32,
                marginVertical: '3%',
                marginHorizontal: '3%',
              }}
            />
            <Text>Lời mời kết bạn</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              //marginVertical: '5%',
              alignItems: 'center',
            }}>
            <Icon
              name="md-call"
              type="ionicon"
              color="grey"
              style={{
                fontSize: 32,
                marginVertical: '3%',
                marginHorizontal: '3%',
              }}
            />
            <Text>Bạn từ danh bạ máy</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            marginBottom: '2%',
            paddingLeft: '3%',
            //paddingVertical: '2%',
            //paddingBottom: '2%',
          }}>
          <Text style={{fontSize: 13, fontWeight: 'bold',paddingVertical: '2%',}}>
            Bạn bè mới truy cập
          </Text>
          <ScrollView alwaysBounceVertical={false}>
            {activePeoples
              .filter(active => {
                return active.id !== userId;
              })
              .map(active => (
                <React.Fragment key={active.id}>
                  {renderUser(active)}
                  <View
                    style={{
                      width: '100%',
                      height: 1,
                      backgroundColor: 'grey',
                      opacity: 0.3,
                    }}
                  />
                </React.Fragment>
              ))}
          </ScrollView>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            marginBottom: '15%',
            paddingLeft: '3%',
            paddingVertical: '2%',
            paddingBottom: '0%',
          }}>
          <Text style={{fontSize: 13, fontWeight: 'bold'}}>Danh bạ</Text>
          <ScrollView alwaysBounceVertical={false}>
            {friends.map(active => (
              <React.Fragment>
                {renderUser(active, false)}
                <View
                  style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: 'grey',
                    opacity: 0.3,
                  }}
                />
              </React.Fragment>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}
