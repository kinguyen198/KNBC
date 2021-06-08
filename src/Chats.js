/* eslint-disable react-native/no-inline-styles */
/** Chats tab in Homescreen */

//importing libraries
import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon1 from 'react-native-vector-icons/FontAwesome';

import axios from 'axios';
import io from 'socket.io-client';
import {firebase} from '@react-native-firebase/auth';

export default function ChatsScreen({navigation, route}) {
  var user = firebase.auth().currentUser;
  const [userId, setUserId] = useState(user.uid);
  const [userPhoto, setUserPhoto] = useState(user.photoURL);
  const [userName, setUserName] = useState(user.displayName);
  const [chats, setChats] = useState([]);
  var socket = io('http://127.0.0.1:5000');
  useEffect(() => {
    getMessages();
    socket.connect();
    socket.on('incommingMessage', () => {
      console.log('called');
      getMessage();
    });
  }, []);
  const getMessages = async () => {
    try {
      let response = await axios.get(
        'http://127.0.0.1:5000' + '/chats/' + userId,
      );
      if (response.status === 200) {
        let chats = [];
        response.data.map(async active => {
          if (active.sender === userId) {
            await axios
              .get('http://127.0.0.1:5000/find/' + active.reciever)
              .then(res => {
                console.log(active.messages[0]);
                const chatItem = {
                  message: active.messages[0].text
                    ? active.messages[0].text
                    : 'Sent an image',
                  user: res.data,
                };
                chats.push(chatItem);
              });
          } else {
            await axios
              .get('http://127.0.0.1:5000/find/' + active.sender)
              .then(res => {
                const chatItem = {
                  message: active.messages[0].text
                    ? active.messages[0].text
                    : 'Sent an image',
                  user: res.data,
                };
                chats.push(chatItem);
              });
          }
          setChats(chats);
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
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
        Conversations
      </Text>
      <View>
        <ScrollView
          style={{
            paddingHorizontal: '7%',
            marginBottom: '18%',
            paddingBottom: '1.5%',
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Broadcast', {
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
                  uri: 'https://i.imgur.com/4vzW11a.png',
                }}
                style={{width: 60, height: 60, borderRadius: 70}}
              />
              <View
                style={{
                  flex: 2,
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
                  Broadcast
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    //fontFamily: 'Cairo-Light',
                    color: 'black',
                  }}>
                  Chat with the global community
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          {chats.map(chatItem => (
            <React.Fragment key={chatItem.senderId}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Messages', {
                    userName: chatItem.user.name,
                    userId: chatItem.user.id,
                    userPhoto: chatItem.user.photo,
                    senderId: userId,
                    senderName: userName,
                    senderPhoto: userPhoto,
                  });
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
                      uri: chatItem.user.photo,
                    }}
                    style={{width: 60, height: 60, borderRadius: 70}}
                  />
                  <View
                    style={{
                      flex: 2,
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
                      {chatItem.user.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        //fontFamily: 'Cairo-Light',
                        color: 'black',
                      }}>
                      {chatItem.message}
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