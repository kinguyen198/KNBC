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
import {WebView} from 'react-native-webview';
export default function ChatsScreen({navigation, route}) {
  const [refreshing, setRefreshing] = React.useState(false);
  const [chats, setChats] = useState([]);
  const [user, setUser] = useState();
  const [showWeb, setShowWeb] = useState(false);
  const [showWebHeight, setShowWebHeight] = useState(100);

  var socket = io(Config.socket.url);
  const isFocused = useIsFocused();

  const getRoom = func => {
    Config.server.post('ajax/user.php', {method: 'listrooms'}, rooms => {
      var chats = [];
      for (var i = 0; i < rooms.length; i++) {
        var data = rooms[i];
        var latest = data.latest;
        const chatItem = null;

        if (data.type == 'r') {
          chatItem = {
            typeRoom: 'r',
            room: data._id,
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
            typeRoom: 'f',
            room: data._id,
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

      func(chats);
    });
  };
  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => {
      getRoom(function (res) {
        Config.server.rooms = res.reverse();
        setChats([...Config.server.rooms]);
        setRefreshing(false);
      });
    });
  }, []);
  useEffect(() => {
    socket.connect();
    socket.on('incommingMessage', async data => {
      console.log('incommingMessage', data);
    });
    // socket.on('message', async data => {
    //   const msg = data.message[0];

    //   console.log('new message: ', msg);
    //   getRoom(function (res) {
    //     Config.server.rooms = res;
    //     setChats([...res]);
    //   });
    // });
    // socket.on('typing',(data) => {

    //   console.log('room type: ', data.room);

    //   var rooms = Config.server.rooms;
    //   var l = rooms.length;
    //   for(var i=0; i<l; i++) {
    //     var item = rooms[i];
    //     if(item.room==data.room){
    //        console.log("socket type=>",data);
    //        item.old_message = item.message;
    //        item.message = data.userName +" is typing...";
    //     }
    //   }
    //   setChats([...chats,rooms]);
    // });
    // socket.on('untyping',(data) => {

    //   console.log('room untype: ', data.room);

    //   var rooms = Config.server.rooms;
    //   var l = rooms.length;
    //   for(var i=0; i<l; i++) {
    //     var item = rooms[i];
    //     if(item.old_message){
    //        item.message = item.old_message;
    //        item.old_message = "";
    //     }
    //   }
    //   setChats([...chats,rooms]);
    // });
    Config.server.init();
    //tell server new coming

    Config.parse_user(function (u) {
      socket.emit('storeClientInfo', {customId: u.userId});
      setUser(u);

      getRoom(function (res) {
        Config.server.rooms = res.reverse();
        setChats([...Config.server.rooms]);
      });
    });
  }, []);

  useEffect(() => {
    if (user) {
    }
  }, [isFocused, user]);

  return (
    <View>
      <View>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          style={{
            height:'100%',
            paddingLeft: '5%',
            paddingHorizontal: '7%',
            marginBottom: '18%',
            paddingBottom: '1.5%',
          }}>
          {showWeb ? (
            <View style={{width: '100%', height: showWebHeight}}>
              <WebView source={{uri: 'https://google.com'}} />
            </View>
          ) : null}
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
                    room: chatItem.room,
                    typeRoom: chatItem.typeRoom,
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
