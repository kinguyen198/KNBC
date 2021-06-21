/* eslint-disable react-native/no-inline-styles */
/** Message screen for chatroom messages */

//importing libraries
import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  View,
  StatusBar,
  TouchableOpacity,
  ToastAndroid,
  Text,
  BackHandler,
  SafeAreaView,
  Image,
  Platform,
  Button,
  TouchableWithoutFeedback,
  Linking,
} from 'react-native';
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  Send,
  MessageText,
  Composer,
} from 'react-native-gifted-chat';
import YoutubePlayer from 'react-native-youtube-iframe';
import BottomSheet from 'reanimated-bottom-sheet';
import Geolocation from '@react-native-community/geolocation';

import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import io from 'socket.io-client';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import Video from 'react-native-video';
import * as Config from '../Config';
import Share from 'react-native-share';
import EditMessage from './component/editMessage';
import RoomSetting from './RoomSetting';
import RoomSettingFriend from './RoomSettingFriend';
export default function Messages({navigation, route}) {
  const heightStatusBar = getStatusBarHeight();
  var videoRef = useRef(null);
  const [user, setUser] = useState();
  const [typeRoom, setTypeRoom] = useState('f');
  const [userId, setUserId] = useState('');
  const [userPhoto, setUserPhoto] = useState(null);
  const [userName, setUserName] = useState('');
  const [recieverId, setRecieverId] = useState('');
  const [messages, setMessages] = useState([]);
  const [playVideo, setPlayVideo] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [endVideo, setEndVideo] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showRoomSetting, setShowRoomSetting] = useState(false);
  const [showRoomSettingFriend, setShowRoomSettingFriend] = useState(false);

  const {params} = route;
  console.log(params)
  const [edit, setEdit] = useState();
  const sheetRef = useRef();
  var page = 0;
  // var socket = io(url + '/chatsocket');
  var socket = io(Config.socket.url);

  const sendLocation = () => {
    Geolocation.getCurrentPosition(
      //Will give you the current location
      position => {
        console.log(position.coords.latitude);
        console.log(position.coords.longitude);
        const id = messages.length + 1;
        const messGPS = [
          {
            _id: id,
            text:
              '[map]' +
              position.coords.latitude +
              ',' +
              position.coords.longitude,
            createdAt: new Date(),
            user: {
              _id: userId,
              name: userName,
              avatar: userPhoto,
            },
          },
        ];
        onSend(messGPS);
        sheetRef.current.snapTo(1);
      },
      error => {
        console.log(error);
        sheetRef.current.snapTo(1);
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 1000,
      },
    );
  };
  const renderContent = () => (
    <View
      style={{
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 16,
        justifyContent: 'flex-end',
        height: '100%',
        borderRadius: 20,
        paddingBottom: '10%',
      }}>
      <TouchableOpacity
        onPress={sendLocation}
        style={{
          width: '100%',
          height: 55,
          backgroundColor: 'white',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{color: 'blue', fontSize: 16}}>Send location</Text>
      </TouchableOpacity>
      <View style={{width: '100%', height: 1, backgroundColor: 'grey'}} />
      <TouchableOpacity
        onPress={() => {
          sheetRef.current.snapTo(1);
          handleChoosePhoto();
        }}
        style={{
          //marginTop: '1%',
          width: '100%',
          height: 55,
          backgroundColor: 'white',
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{color: 'blue', fontSize: 16}}>Send image or video</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          sheetRef.current.snapTo(1);
        }}
        style={{
          marginTop: '1%',
          width: '100%',
          height: 55,
          backgroundColor: 'white',
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{color: 'red', fontSize: 16, fontWeight: 'bold'}}>
          Cancel
        </Text>
      </TouchableOpacity>
    </View>
  );

  const getUser = () => {
    Config.parse_user(user => {
      setUser(user);
    });
  };
  const hideModal = () => {
    setShowEdit(false);
    getMessages();
  };
  const hideRoomSetting = () => {
    setShowRoomSetting(false);
  };
  const hideRoomSettingFriend = () => {
    setShowRoomSettingFriend(false);
  };
  function matchYoutubeUrl(url) {
    var p =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    return url.match(p) ? RegExp.$1 : false;
  }

  const onStateChange = useCallback(state => {
    if (state === 'ended') {
      setPlaying(false);
      //Alert.alert("video has finished playing!");
    }
  }, []);

  /**
   * When user get menu setting
   * @return {[type]} [description]
   */
  const menuSetting = function () {
    //check this room is friend or group
    if (typeRoom == 'f') {
      setShowRoomSettingFriend(true);
      //navigation.navigate('RoomSettingFriend', params);
    } else {
      setShowRoomSetting(true);
      //navigation.navigate('RoomSetting', params);
    }
  };
  const renderMessageText = props => {
    const {currentMessage} = props;
    const {text: currText} = currentMessage;
    var regex = /(\[map])/;
    //console.log(currText);
    if (regex.test(currText)) {
      const arrayPos = currText.slice(5).split(',');
      const pos = {
        lat: arrayPos[0],
        lng: arrayPos[1],
      };
      const urlImage = Config.map.static(pos).image;
      const link = Config.map.static(pos).url;
      return (
        <View
          style={{
            position: 'relative',
            height: 150,
            width: 250,
            marginBottom: '2%',
            justifyContent: 'center',
          }}>
          <TouchableWithoutFeedback
            onPress={async () => {
              const supported = await Linking.canOpenURL(link);

              if (supported) {
                // Opening the link with some app, if the URL scheme is "http" the web link should be opened
                // by some browser in the mobile
                await Linking.openURL(link);
              } else {
                Alert.alert(`Don't know how to open this URL: ${link}`);
              }
            }}>
            <Image
              source={{uri: urlImage}}
              style={{
                width: '100%',
                height: '100%',
                resizeMode: 'contain',
                borderRadius: 20,
                marginTop: '1%',
              }}
            />
          </TouchableWithoutFeedback>
        </View>
      );
    }
    return <MessageText {...props} />;
  };
  const renderMessageVideo = props => {
    if (
      props.currentMessage.video.includes('mp4') == true ||
      props.currentMessage.video.includes('mpeg')
    ) {
      return (
        <TouchableWithoutFeedback
          onPress={() => {
            if (endVideo == true) {
              videoRef.current.seek(0);
              setEndVideo(false);
            }
            setPlayVideo(prev => !prev);
          }}>
          <View
            style={{
              position: 'relative',
              height: 150,
              width: 250,
              marginBottom: '2%',
            }}>
            <Video
              ref={videoRef}
              onEnd={() => {
                setEndVideo(true);
                console.log('end');
              }}
              paused={playVideo}
              style={{
                left: 0,
                top: 0,
                height: 150,
                width: 250,
                borderRadius: 20,
              }}
              shouldPlay
              isLooping
              rate={1.0}
              resizeMode="cover"
              height={150}
              width={250}
              muted={true}
              source={{uri: props.currentMessage.video}}
              allowsExternalPlayback={false}></Video>
          </View>
        </TouchableWithoutFeedback>
      );
    } else {
      return (
        <View
          style={{
            position: 'relative',
            height: 150,
            width: 250,
            marginBottom: '2%',
          }}>
          <YoutubePlayer
            height={150}
            width={250}
            webViewStyle={{borderRadius: 20, alignItems: 'center'}}
            webViewProps={{allowsFullscreenVideo: true}}
            play={playing}
            videoId={matchYoutubeUrl(props.currentMessage.video)}
            onChangeState={onStateChange}
          />
        </View>
      );
    }
  };
  //styling chat bubbles
  const renderBubble = props => {
    return (
      <Bubble
        {...props}
        textStyle={{
          right: {
            color: '#fff',
          },
        }}
        wrapperStyle={{
          right: {
            backgroundColor: '#34a8eb',
          },
          left: {
            backfroundColor: '#aaa',
          },
        }}
      />
    );
  };
  //syling input bar
  const renderInputToolbar = props => {
    return (
      <>
        <InputToolbar
          {...props}
          renderActions={() => (
            <TouchableOpacity
              style={{
                bottom: 0,
                position: 'absolute',
                width: '8%',
                marginLeft: '4%',
                marginBottom: Platform.OS == 'ios' ? '0.5%' : '1%',
              }}
              onPress={() => sheetRef.current.snapTo(0)}>
              <Icon
                name="ios-reorder-three-sharp"
                style={{color: '#34a8eb'}}
                size={32}
              />
            </TouchableOpacity>
          )}
          containerStyle={{
            backgroundColor: '#d6d5d0',
            borderTopWidth: 0,
            marginHorizontal: 10,
            borderRadius: 80,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            //backgroundColor:'red',
            //height: 50,
          }}
          textInputProps={{
            style: {
              color: 'black',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: '17%',
              marginRight: -20,
              marginBottom: Platform.OS == 'ios' ? '3%' : null,
            },
            multiline: false,
            returnKeyType: 'go',
            onSubmitEditing: () => {
              if (props.text && props.onSend) {
                let text = props.text;
                props.onSend({text: text.trim()}, true);
              }
            },
          }}
        />
      </>
    );
  };

  //styling send button
  const renderSend = props => {
    return (
      <>
        <Send {...props}>
          <Icon
            name="send"
            style={{
              color: '#34a8eb',
              marginRight: '5%',
              //marginBottom: '10%',
            }}
            size={32}
          />
        </Send>
      </>
    );
  };

  //choose photo fromgallery or camera
  const handleChoosePhoto = () => {
    const options = {
      title: 'Select a Media',
      noData: true,
      takePhotoButtonTitle: 'Take Media',
      chooseFromLibraryButtonTitle: 'Choose Media',
      cancelButtonTitle: 'cancel',
      cameraType: 'front',
      mediaType: 'mixed',
      videoQuality: 'medium',
      aspectX: 1,
      aspectY: 1,
      //allowsEditing: true,
      quality: 1.0,
    };
    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: response};
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        console.log('Image Uri: ');
        console.log(source);
        console.log(source.uri.uri);
        let formData = new FormData();
        formData.append('file', {
          uri:
            Platform.OS === 'android'
              ? source.uri.uri
              : source.uri.uri.replace('file://', ''),
          name:
            source.uri.type == 'image/jpeg'
              ? `dummy${Date.now()}.jpg`
              : `dummy${Date.now()}.mp4`,
          type: 'image/*',
        });
        //ToastAndroid.show('Uploading...', ToastAndroid.LONG);
        axios.post(Config.server.url_upload, formData).then(res => {
          if (res.status === 200) {
            console.log(res.status);
            let {data} = res;
            if (data.code == 1) {
              const id = messages.length + 1;
              var imageMsg = [];
              if (source.uri.type == 'image/jpeg') {
                imageMsg = [
                  {
                    _id: id,
                    text: '',
                    createdAt: new Date(),
                    user: {
                      _id: userId,
                      name: userName,
                      avatar: userPhoto,
                    },
                    image: data.url,
                  },
                ];
              } else {
                imageMsg = [
                  {
                    _id: id,
                    text: '',
                    createdAt: new Date(),
                    user: {
                      _id: userId,
                      name: userName,
                      avatar: userPhoto,
                    },
                    video: data.url,
                  },
                ];
              }

              //send image
              onSend(imageMsg);
              imageMsg = [];
            } else {
              alert('Upload image error');
            }
          } else {
            ToastAndroid.show(
              'Uploading failed. Try again',
              ToastAndroid.SHORT,
            );
          }
        });
      }
    });
  };
  const shareOptions = {
    title: 'Share via',
    message: 'some message',
    url: 'some share url',
    social: Share.Social.WHATSAPP,
    whatsAppNumber: '9199999999', // country code + phone number
    filename: 'test', // only for base64 file in Android
  };
  const onLongPress = (context, message) => {
    const options = ['Share', 'Edit', 'Delete', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            const url = 'https://awesome.contents.com/';
            const title = 'Awesome Contents';
            const messages = 'Please check this out.';
            const icon =
              'data:<data_type>/<file_extension>;base64,<base64_data>';
            const options = Platform.select({
              ios: {
                activityItemSources: [
                  {
                    // For sharing url with custom title.
                    placeholderItem: {type: 'url', content: url},
                    item: {
                      default: {type: 'url', content: url},
                    },
                    subject: {
                      default: title,
                    },
                    linkMetadata: {originalUrl: url, url, title},
                  },
                  {
                    // For sharing text.
                    placeholderItem: {type: 'text', content: messages},
                    item: {
                      default: {type: 'text', content: messages},
                      messages: null, // Specify no text to share via Messages app.
                    },
                    linkMetadata: {
                      // For showing app icon on share preview.
                      title: messages,
                    },
                  },
                  {
                    // For using custom icon instead of default text icon at share preview when sharing with message.
                    placeholderItem: {
                      type: 'url',
                      content: icon,
                    },
                    item: {
                      default: {
                        type: 'text',
                        content: `${messages} ${url}`,
                      },
                    },
                    linkMetadata: {
                      title: messages,
                      icon: icon,
                    },
                  },
                ],
              },
              default: {
                title,
                subject: title,
                message: `${messages} ${url}`,
              },
            });
            Share.open(options)
              .then(res => {
                console.log(res);
              })
              .catch(err => {
                err && console.log(err);
              });
            break;
          case 1:
            setShowEdit(true);
            const editMess = {
              id: message._id,
              room: params.room,
              createdAt: message.createdAt,
            };
            setEdit(editMess);
            break;
          case 2:
            Config.server.post(
              'ajax/chat.php',
              {
                method: 'delete',
                r: params.room,
                id: message._id,
              },
              res => {
                getMessages();
              },
            );
            break;
          default:
            break;
        }
      },
    );
  };

  const handleBackPress = () => {
    navigation.goBack(); // works best when the goBack is async
    return true;
  };
  var timeoutVar = null;
  const onInputTextChanged = async message => {
    socket.emit('typing', {
      room: params.room,
      userName: userName,
    });

    if (timeoutVar) {
      clearTimeout(timeoutVar);
    }
    timeoutVar = setTimeout(() => {
      typing = 0;
      console.log('Stop typing');
      // setState({typing : false});
      socket.emit('untyping', {
        room: params.room,
        userName: userName,
      });
    }, 500);
  };
  const onSend = async message => {
    console.log(message);
    socket.emit('message', {
      sender: userId,
      reciever: recieverId,
      message: message,
    });

    //console.log(message)
    ///setMessages(previousMessages => GiftedChat.append(previousMessages, message))
    const tmpMess = messages;
    const newMess = GiftedChat.append(tmpMess, message);

    try {
      let formData = {
        room: params.room,
        sender: userId,
        reciever: recieverId,
        messages: newMess,
      };

      socket.emit('newMessage', formData);
      const type = message[0].text
        ? 'text'
        : message[0].image
        ? 'image'
        : 'video';
      Config.server.post(
        'ajax/chat.php',
        {
          //code: user.token,
          method: 'throw',
          r: params.room,
          type: type,
          message: {
            _id: message[0]._id,
            text: message[0].text,
            createdAt: message[0].createdAt,
            image: message[0].image ? message[0].image : '',
            video: message[0].video ? message[0].video : '',
          },
        },
        res => {
          getMessages();
        },
      );
    } catch (error) {
      console.error(error);
    }
  };

  const getMessages = async => {
    if (user) {
      Config.server.post(
        'ajax/chat.php',
        {
          method: 'fetch',
          r: params.room,
          //code: user.token,
        },
        listMess => {
          console.log(listMess);
          const newArray = [];
          const objectArray = Object.entries(listMess.messages);
          objectArray.forEach(([key, value]) => {
            value.map(item => {
              if (typeof item == 'object') {
                newArray.push(item);
              }
            });
          });
          setMessages(newArray.reverse());
        },
      );
    }
  };
  useEffect(() => {
    getUser();
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );
    setUserId(params.senderId);
    setUserName(params.senderName);
    setUserPhoto(params.senderPhoto);
    setRecieverId(params.userId);

    socket.connect();
    socket.on('incommingMessage', data => {
      //console.log('chat',data);
      // getMessages();
    });
    socket.emit('subscribe', {room: params.room});
    // socket.on('message', async data => {
    //   getMessages();
    // });
    // socket.on('typing', data => {
    //   console.log('room type: ', data.room);
    //   getMessages();
    // });
    return () => backHandler.remove();
  }, []);
  useEffect(() => {
    getMessages();
  }, [user]);
  const isCloseToTop = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToTop = 80;
    return (
      contentSize.height - layoutMeasurement.height - paddingToTop <=
      contentOffset.y
    );
  };

  return (
    <>
      <View style={{backgroundColor: 'white', flex: 1}}>
        <View
          style={{
            paddingTop: heightStatusBar,
            backgroundColor: '#34a8eb',
          }}></View>
        <View
          style={{
            backgroundColor: '#34a8eb',
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: '4%',
            paddingTop: '1%',
            paddingBottom: '1%',
          }}>
          <TouchableOpacity
            style={{flex: 1}}
            onPress={() => {
              navigation.goBack();
            }}>
            <Icon name="ios-arrow-back" size={32} style={{color: 'white'}} />
          </TouchableOpacity>
          <View
            style={{
              flex: 8,
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              paddingBottom:'1%'
            }}>
            <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
              <Image
                source={{
                  uri:
                    params.userPhoto == ''
                      ? Config.settings.avatar
                      : params.userPhoto,
                }}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 70,
                  borderColor: '#444',
                  borderWidth: 2,
                }}
              />
              <Text
                style={{
                  marginLeft: '2%',
                  fontSize: 18,
                  color: '#f2f2f2',
                  textAlign: 'center',
                }}>
                {params.userName}
              </Text>
            </View>
            {params.typeRoom == 'r' ? (
              <Text style={{color: 'white', paddingVertical: '1%'}}>
                Tổng thành viên:
              </Text>
            ) : null}
          </View>
          <View style={{flex: 1}}>
            <Icon
              name="menu-outline"
              size={32}
              style={{opacity: 1, color: '#fff'}}
              onPress={menuSetting}
            />
          </View>
        </View>
        <GiftedChat
          listViewProps={{
            scrollEventThrottle: 400,
            onScroll: ({nativeEvent}) => {
              if (isCloseToTop(nativeEvent)) {
                page += 1;
                //getMessages(page);
              }
            },
            style: {
              backgroundColor: 'white',
            },
          }}
          render
          alwaysShowSend={true}
          messages={messages}
          renderMessageText={renderMessageText}
          renderMessageVideo={renderMessageVideo}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          renderSend={renderSend}
          onLongPress={onLongPress}
          onInputTextChanged={onInputTextChanged}
          onSend={messages => {
            if (
              messages[0].text.includes('.mp4') == true ||
              messages[0].text.includes('.mpeg') == true
            ) {
              console.log(messages[0].text);
              const id = messages.length + 1;
              let videoMsg = [
                {
                  _id: id,
                  text: '',
                  createdAt: new Date(),
                  user: {
                    _id: userId,
                    name: userName,
                    avatar: userPhoto,
                  },
                  video: messages[0].text,
                },
              ];
              onSend(videoMsg);
              return;
            } else if (
              messages[0].text.includes('youtube.com/?v=') == true ||
              messages[0].text.includes('youtube.com/watch?v=') == true
            ) {
              console.log(messages[0].text);
              const id = messages.length + 1;
              let videoMsg = [
                {
                  _id: id,
                  text: '',
                  createdAt: new Date(),
                  user: {
                    _id: userId,
                    name: userName,
                    avatar: userPhoto,
                  },
                  video: messages[0].text,
                },
              ];
              onSend(videoMsg);
              return;
            }
            onSend(messages);
          }}
          user={{
            _id: userId,
            name: userName,
            avatar: userPhoto,
          }}
        />
        <EditMessage
          modalVisible={showEdit}
          hideModal={hideModal}
          edit={edit}
        />
        <RoomSetting
          modalVisible={showRoomSetting}
          hideModal={hideRoomSetting}
        />
        <RoomSettingFriend
          modalVisible={showRoomSettingFriend}
          hideModal={hideRoomSettingFriend}
        />
        <BottomSheet
          initialSnap={1}
          ref={sheetRef}
          snapPoints={['100%', 0]}
          borderRadius={10}
          renderContent={renderContent}
        />
        <View
          style={{
            height: '1%',
            width: '100%',
          }}
        />
      </View>
    </>
  );
}
