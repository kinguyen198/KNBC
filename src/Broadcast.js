/* eslint-disable react-native/no-inline-styles */
/** Messages screen for broadcast messages */

//importing libraries
import React, {useState, useEffect} from 'react';
import {
  View,
  StatusBar,
  TouchableOpacity,
  ToastAndroid,
  Text,
  BackHandler,
  SafeAreaView
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

export default function Broadcast({navigation,route}) {
  const [userId, setUserId] = useState('');
  const [userPhoto, setUserPhoto] = useState('');
  const [userName, setUserName] = useState('');
  const [messages, setMessages] = useState([]);
  const {params} = route;
  var socket = io('http://127.0.0.1:5000/chatsocket');


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
            backgroundColor: '#46CF76',
          },
        }}
      />
    );
  };

  //styling input bar
  const renderInputToolbar = props => {
    return (
      <>
        <InputToolbar
          {...props}
          containerStyle={{
            backgroundColor: 'grey',
            borderTopWidth: 0,
            marginHorizontal: 10,
            marginLeft: '15%',
            borderRadius: 80,
          }}
          textInputProps={{
            style: {
              color: '#fff',
              flex: 1,
              alignItems: 'center',
              paddingHorizontal: 20,
              marginBottom: '4%',
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
        <TouchableOpacity
          style={{
            position: 'absolute',
            marginLeft: '3%',
            marginBottom: '0.5%',
            bottom: 0,
          }}
          onPress={handleChoosePhoto}>
          <Icon
            name="reorder-three"
            style={{
              color: '#46CF76',
            }}
            size={35}
          />
        </TouchableOpacity>
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
              color: '#46CF76',
              marginRight: '5%',
              marginBottom: '10%',
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
      noData: true,
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
        let axiosConfig = {
          headers: {
            Authorization: 'Client-ID ead116aab30174c',
          },
          timeout: 8000,
        };

        let formData = new FormData();
        formData.append('image', source.uri);
        ToastAndroid.show('Uploading...', ToastAndroid.LONG);

        //upload image to imgur
        axios
          .post('https://api.imgur.com/3/image', formData, axiosConfig)
          .then(res => {
            if (res.status === 200) {
              console.log(res.status);
              let {data} = res;
              // this.setState({imageURL: data.data.link});
              const id = messages.length + 1;
              let imageMsg = [
                {
                  _id: id,
                  text: '',
                  createdAt: new Date(),
                  user: {
                    _id: userId,
                    name: userName,
                    avatar: userPhoto,
                  },
                  image: data.data.link,
                },
              ];

              //send image
              onSend(imageMsg);
              imageMsg = [];
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
      let response = await axios.get(
        'http://127.0.0.1:5000' + '/broadcast',
      );
      if (response.status === 200) {
        let broadcasts = response.data.reverse();
        setMessages(GiftedChat.append(broadcasts, []));
        //console.log(broadcasts)
      }
    } catch (error) {
      console.error(error);
    }
  };


  const handleBackPress = () => {
    navigation.goBack(); // works best when the goBack is async
    return true;
  };


  const  onSend = async (message = []) => {
    //setMessages(GiftedChat.append(messages, message));
    setMessages(previousMessages => GiftedChat.append(previousMessages, message))
    //notify new message
    socket.emit('newMessage', 'sent');
    //console.log(message[0]);
    try {
      let formData = message[0];
      let response = await axios.post(
        'http://127.0.0.1:5000' + '/broadcast/',
        formData,
      );
      if (response.status === 200) {
        socket.emit('newMessage', 'sent');
      }
    } catch (error) {
      console.error(error);
    }
  }
    return (
      <>
        <StatusBar backgroundColor="#111" barStyle="light-content" />
        <View style={{backgroundColor: 'white', flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              height: '10%',
              width: '100%',
              backgroundColor: 'grey',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: '4%',
              paddingTop:'6%',
            }}>
            <TouchableOpacity
              style={{flex: 1}}
              onPress={() => {
                navigation.goBack();
              }}>
              <Icon
                name="ios-arrow-back"
                size={32}
                style={{color: '#46CF76'}}
              />
            </TouchableOpacity>
            <Text
              name="ios-home"
              style={{
                flex: 1,
                fontSize: 18,
                color: '#f2f2f2',
                textAlign: 'center',
              }}>
              Broadcast
            </Text>
            <Icon name="ios-home" size={32} style={{opacity: 0, flex: 1}} />
          </View>
          <GiftedChat
            listViewProps={{
              style: {
                backgroundColor: 'white',
                marginBottom:'1%',
              },
            }}
            renderUsernameOnMessage={true}
            alwaysShowSend={true}
            messages={messages}
            renderBubble={renderBubble}
            renderInputToolbar={renderInputToolbar}
            renderSend={renderSend}
            onSend={messages => onSend(messages)}
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

