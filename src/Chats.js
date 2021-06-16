/* eslint-disable react-native/no-inline-styles */
/** Chats tab in Homescreen */

//importing libraries
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import * as Config from '../Config';

export default function ChatsScreen({navigation, route}) {
  const [refreshing, setRefreshing] = React.useState(false);
  const [chats, setChats] = useState([]);
  const [user, setUser] = useState();
  const url = Config.socket.url;

  var socket = io(url + '/chatsocket');
  const isFocused = useIsFocused();

  const getUser = () => {
    Config.parse_user(user => {
      setUser(user);
    });
  };

  const getRoom = () => {
    if (user) {
      Config.server.post(
        'ajax/user.php',
        {method: 'listrooms', code: user.token},
        rooms => {
          var chats = [];
          for (var i = 0; i < rooms.length; i++) {
            var data = rooms[i];
            var latest = data.latest;
            const chatItem = null;

            if (data.type == 'r') {
              chatItem = {
                message: latest.text
                  ? latest.text
                  : latest.image
                  ? 'Sent an image'
                  : 'Sent an video',
                user: {
                  name: data.title,
                  id: data._id,
                  photo: data.avatar,
                },
              };
            } else {
              chatItem = {
                message: latest.text
                  ? latest.text
                  : latest.image
                  ? 'Sent an image'
                  : 'Sent an video',
                user: {
                  name: data.reciever.name,
                  id: data._id,
                  photo: data.reciever.avatar,
                },
              };
            }
            chats.push(chatItem);
          }
          setChats(chats);
        },
      );
    }
  };
  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);
  useEffect(() => {
    getUser();
    socket.connect();
    socket.on('incommingMessage', async data => {});
    socket.on('message', data => {
      const msg = data[0];
      // const chats  = getChats();
      //getMessages();
      // if(chats){
      //    chats.map(item => {
      //       //check step step user in list
      //       if(item.user.id==msg.sender){
      //          item.message = msg.message.text;
      //       }
      //    });
      //
      // }
      // setChats(chats);
    });
    socket.on('typing', data => {
      console.log('type: ', data);
    });
  }, []);
  useEffect(() => {
    if (user) {
      getRoom();
    }
  }, [user]);
  useEffect(() => {
    if (user) {
      getRoom();
    }
  }, [isFocused]);

  return (
    <View>
      <View>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          style={{
            paddingLeft: '5%',
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
            {/* <View
              style={{
                flex: 2,
                flexDirection: 'row',
                //marginVertical: '2%',
                paddingVertical: '5%',
                borderRadius: 10,
              }}>
              <Image
                source={{
                  uri: 'https://i.imgur.com/4vzW11a.png',
                }}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 70,
                }}
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
            </View> */}
          </TouchableOpacity>
          {chats.map(chatItem => (
            <React.Fragment key={chatItem.user.id}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Messages', {
                    userName: chatItem.user.name,
                    userId: chatItem.user.id,
                    userPhoto: chatItem.user.photo,
                    senderId: user.userId,
                    senderName: user.userName,
                    senderPhoto: user.userPhoto,
                  });
                }}>
                <View
                  style={{
                    flex: 2,
                    flexDirection: 'row',
                    marginVertical: '1%',
                    borderRadius: 10,
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      height: 1,
                      backgroundColor: 'grey',
                      opacity: 0.3,
                      width: '100%',
                      position: 'absolute',
                      left: '21%',
                      bottom: 0,
                      alignSelf: 'flex-end',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}></View>
                  <Image
                    source={{
                      uri: chatItem.user.photo,
                    }}
                    style={{width: 60, height: 60, borderRadius: 70}}
                  />
                  {chatItem.user.isActive ? (
                    <View
                      style={{
                        position: 'absolute',
                        backgroundColor: '#46CF76',
                        width: 15,
                        height: 15,
                        left: 45,
                        top: 40,
                        borderRadius: 100,
                        borderColor: '#222',
                        borderWidth: 2,
                      }}
                    />
                  ) : null}

                  <View
                    style={{
                      flex: 2,
                      width: '100%',
                      flexDirection: 'column',
                      marginHorizontal: '4%',
                      marginBottom: '3%',
                    }}>
                    <Text
                      style={{
                        fontSize: 18,
                        color: 'black',
                      }}>
                      {chatItem.user.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        //fontFamily: 'Cairo-Light',
                        opacity: 0.5,
                        color: 'black',
                        marginTop: '3%',
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
