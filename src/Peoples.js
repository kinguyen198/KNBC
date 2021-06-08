/* eslint-disable react-native/no-inline-styles */
/** Active peoples tab in Home Screen */

//importing libraries
import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, Image, TouchableOpacity} from 'react-native';
import axios from 'axios';
import io from 'socket.io-client';
import {firebase} from '@react-native-firebase/auth';
var user = firebase.auth().currentUser;
export default function PeoplesScreen({navigation, route}) {
  const [userId, setUserId] = useState(user.uid);
  const [userPhoto, setUserPhoto] = useState(user.photoURL);
  const [userName, setUserName] = useState(user.displayName);
  const [activePeoples, setActivePeoples] = useState([]);
  const [inactivePeoples, setInactivePeoples] = useState([]);

  const userActive = async () => {
    let actives = [];
    await axios
      .get('http://127.0.0.1:5000' + '/users/active')
      .then(response => {
        response.data.map(active => {
          if (active.id != userId) {
            actives.push(active);
          }
        });
        setActivePeoples(actives);
      })
      .catch(error => {
        console.log(error);
      });
  };
  useEffect(() => {
    var socket = io('http://127.0.0.1:5000');
    socket.connect();
    socket.on('connect', () => {
      //notify new user
      socket.emit('storeClientInfo', {
        customId: user.uid,
      });
    });
    userActive();
    socket.on('update', () => {
      console.log('Ceeeeeeeeeeee');
      userActive();
    });
  }, []);
  return (
    <View>
      <Text
        style={{
          color: 'black',
          fontSize: 36,
          padding: '5%',
          paddingLeft: '7%',
          //fontFamily: 'Cairo-Regular',
        }}>
        Peoples
      </Text>
      <View>
        <ScrollView
          style={{
            paddingHorizontal: '7%',
            marginBottom: '18%',
            paddingBottom: '1.5%',
          }}>
          {activePeoples.map(active => (
            <React.Fragment key={active.id}>
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
                    paddingVertical: '4%',
                    borderRadius: 10,
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
                      borderColor: '#444',
                      borderWidth: 2,
                    }}
                  />
                  <View
                    style={{
                      position: 'absolute',
                      backgroundColor: '#46CF76',
                      width: 15,
                      height: 15,
                      left: 30,
                      top: 40,
                      borderRadius: 100,
                      borderColor: '#222',
                      borderWidth: 2,
                    }}
                  />
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'column',
                      marginHorizontal: '5%',
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
            </React.Fragment>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
