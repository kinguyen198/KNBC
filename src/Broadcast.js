/* eslint-disable react-native/no-inline-styles */
/** Messages screen for broadcast messages */

//importing libraries
import React, {useState, useEffect, useRef,useCallback} from 'react';
import {
  View,
  StatusBar,
  TouchableOpacity,
  ToastAndroid,
  Text,
  BackHandler,
  SafeAreaView,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  Send,
  Composer,
} from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import io from 'socket.io-client';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import NavigationBar from './component/NavigationBar';
import Video from 'react-native-video';
import YoutubePlayer from 'react-native-youtube-iframe';
import * as Config from '../Config'
import Share from 'react-native-share';

export default function Broadcast({navigation, route}) {
  const heightStatusBar = getStatusBarHeight();

  const [userId, setUserId] = useState('');
  const [userPhoto, setUserPhoto] = useState(null);
  const [userName, setUserName] = useState('');
  const [messages, setMessages] = useState([]);
  const [playVideo, setPlayVideo] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [endVideo, setEndVideo] = useState(false);
  const {params} = route;
  const url = 'http://127.0.0.1:5000';
  var socket = io(url + '/chatsocket');
  var videoRef = useRef(null);

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
                marginBottom: '0.5%',
              }}
              onPress={handleChoosePhoto}>
              <Icon
                name="ios-images"
                style={{
                  color: '#34a8eb',
                }}
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
          }}
          textInputProps={{
            style: {
              color: 'black',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: '17%',
              marginRight: -20,
              marginBottom: '3%',
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

  //choose photo from gallery or camera
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
        axios
          .post('https://hcm.ahlupos.com/test/chatroom/upload.php', formData)
          .then(res => {
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
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );
    setUserId(params.senderId);
    setUserName(params.senderName);
    setUserPhoto(params.senderPhoto);
    getMessages();

    socket.connect();
    socket.on('incommingMessage', () => {
      console.log('called');
      getMessages();
    });

    return () => backHandler.remove();
  }, []);
  const getMessages = async () => {
    try {
      let response = await axios.get(url + '/broadcast');
      if (response.status === 200) {
        let broadcasts = response.data.reverse();
        setMessages(GiftedChat.append(broadcasts, []));
        //console.log(broadcasts)
      }
    } catch (error) {
      console.error(error);
    }
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
    console.log(context, message);
    const options = ['Share', 'Cancel'];
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
            const message = 'Please check this out.';
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
                    placeholderItem: {type: 'text', content: message},
                    item: {
                      default: {type: 'text', content: message},
                      message: null, // Specify no text to share via Messages app.
                    },
                    linkMetadata: {
                      // For showing app icon on share preview.
                      title: message,
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
                        content: `${message} ${url}`,
                      },
                    },
                    linkMetadata: {
                      title: message,
                      icon: icon,
                    },
                  },
                ],
              },
              default: {
                title,
                subject: title,
                message: `${message} ${url}`,
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

  const onSend = async (message = []) => {
    //setMessages(GiftedChat.append(messages, message));
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, message),
    );
    //notify new message
    socket.emit('newMessage', 'sent');
    //console.log(message[0]);
    try {
      let formData = message[0];
      let response = await axios.post(url + '/broadcast/', formData);
      if (response.status === 200) {
        socket.emit('newMessage', 'sent');
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <StatusBar backgroundColor="#111" barStyle="light-content" />
      <View style={{backgroundColor: 'white', flex: 1}}>
        <NavigationBar
          title="Broadcast"
          back={() => {
            navigation.goBack();
          }}
        />
        <GiftedChat
          listViewProps={{
            style: {
              backgroundColor: 'white',
              marginBottom: '1%',
            },
          }}
          renderUsernameOnMessage={true}
          alwaysShowSend={true}
          messages={messages}
          renderMessageVideo={renderMessageVideo}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          renderSend={renderSend}

          onLongPress={onLongPress}
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
