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

export default function PeoplesScreen({navigation, route}) {
  const [userId, setUserId] = useState('');
  const [userPhoto, setUserPhoto] = useState(null);
  const [userName, setUserName] = useState('');
  const [activePeoples, setActivePeoples] = useState([]);
  const [inactivePeoples, setInactivePeoples] = useState([]);
  const arrayTest = [
    {
      __v: 0,
      _id: '1',
      id: '12312316232126422461',
      isActive: true,
      name: 'Test16232126422469',
      photo:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1DLuBDtz2945mZR71wAT0WSkktlbwpF3chZ8omSwo5km6q6NfxZDKtx5TXWcrWz-rZDA&usqp=CAU',
    },
    {
      __v: 0,
      _id: '2',
      id: '12312316232126422462',
      isActive: true,
      name: 'Test16232126422468',
      photo:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1DLuBDtz2945mZR71wAT0WSkktlbwpF3chZ8omSwo5km6q6NfxZDKtx5TXWcrWz-rZDA&usqp=CAU',
    },
    {
      __v: 0,
      _id: '3',
      id: '123123162321264224636',
      isActive: true,
      name: 'Test16232126422467',
      photo:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1DLuBDtz2945mZR71wAT0WSkktlbwpF3chZ8omSwo5km6q6NfxZDKtx5TXWcrWz-rZDA&usqp=CAU',
    },
    {
      __v: 0,
      _id: '4',
      id: '12312316232126422464',
      isActive: true,
      name: 'Test16232126422465',
      photo:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1DLuBDtz2945mZR71wAT0WSkktlbwpF3chZ8omSwo5km6q6NfxZDKtx5TXWcrWz-rZDA&usqp=CAU',
    },
    {
      __v: 0,
      _id: '1',
      id: '12312316232126422461',
      isActive: true,
      name: 'Test16232126422469',
      photo:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1DLuBDtz2945mZR71wAT0WSkktlbwpF3chZ8omSwo5km6q6NfxZDKtx5TXWcrWz-rZDA&usqp=CAU',
    },
    {
      __v: 0,
      _id: '2',
      id: '12312316232126422462',
      isActive: true,
      name: 'Test16232126422468',
      photo:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1DLuBDtz2945mZR71wAT0WSkktlbwpF3chZ8omSwo5km6q6NfxZDKtx5TXWcrWz-rZDA&usqp=CAU',
    },
    {
      __v: 0,
      _id: '3',
      id: '123123162321264224636',
      isActive: true,
      name: 'Test16232126422467',
      photo:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1DLuBDtz2945mZR71wAT0WSkktlbwpF3chZ8omSwo5km6q6NfxZDKtx5TXWcrWz-rZDA&usqp=CAU',
    },
    {
      __v: 0,
      _id: '4',
      id: '12312316232126422464',
      isActive: true,
      name: 'Test16232126422465',
      photo:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1DLuBDtz2945mZR71wAT0WSkktlbwpF3chZ8omSwo5km6q6NfxZDKtx5TXWcrWz-rZDA&usqp=CAU',
    },
  ];
  const url = 'http://127.0.0.1:5000';
  var socket = io(url);
  const getUser = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('user');
      const user = JSON.parse(jsonValue);
      setUserId(user.userId);
      setUserName(user.userName);
      setUserPhoto(user.userPhoto);
    } catch (e) {
      console.log(e);
    }
  };
  const userActive = async () => {
    let actives = [];
    let res = await axios.get(url + '/users/active');
    if (res.status == 200) {
      let data = res.data;
      data.map(active => {
        actives.push(active);
      });
      setActivePeoples(actives);
    }
  };
  useEffect(() => {
    getUser();
    socket.connect();
    socket.on('update', () => {
      console.log('Ceeeeeeeeeeee');
      setTimeout(() => {
        userActive();
      }, 2000);
    });
  }, []);
  useEffect(() => {
    userActive();
    socket.on('connect', () => {
      //notify new user
      socket.emit('storeClientInfo', {
        customId: userId,
      });
    });
  }, [userId]);
  const renderUser = (active, showActive = true) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Messages', {
          userName: active.name,
          userId: active.id,
          userPhoto: active.photo,
          senderId: userId,
          senderName: userName,
          senderPhoto: userPhoto,
        });
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
              active.photo == ''
                ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1DLuBDtz2945mZR71wAT0WSkktlbwpF3chZ8omSwo5km6q6NfxZDKtx5TXWcrWz-rZDA&usqp=CAU'
                : active.photo,
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
            }}>
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
            {arrayTest.map(active => (
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
