import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  ActivityIndicator,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,

} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from './component/NavigationBar';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {ScrollView} from 'react-native-gesture-handler';
import CustomMultiPicker from './component/multipleSelect';
import {cos} from 'react-native-reanimated';
import * as Config from '../Config'; 
import ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import ProgressLoader from 'rn-progress-loader';

export default function RoomSettingFriend(props) {
  const heightStatusBar = getStatusBarHeight();
  const [selectUsers, setSelectUsers] = useState([]);
  const [textSearch, setTextSearch] = useState('');
  const [title, setTitle] = useState('');
  const [avatar, setAvatar] = useState('');
  const [friends, setFriends] = useState([]);
  const [user, setUser] = useState([]);
  const [progressLoaderShow, setProgressLoaderShow] = useState(false);

  const backScreen = () => {
     setSelectUsers([]);
     props.hideModal();
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
  /**reate room
   * [description]
   * @return {[type]} [description]
   */
  const createGroup= ()=>{
    var data ={
      title:title,
      avatar:avatar?avatar:Config.settings.avatar,
      users :selectUsers.map(function(user){return user.id;}),
      method:"addroom"
    };
    console.log(data);
    Config.server.post('ajax/user.php',data, res => {
      console.log(res);
      if(typeof res==="object"){ 
        if (res.code) {
            alert(res.message);
            backScreen();
        }else{
            alert(res.error);
        }
      }else{
        alert(res);
      }
      
    });
  };
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
        setProgressLoaderShow(true);
        //ToastAndroid.show('Uploading...', ToastAndroid.LONG);
        axios.post(Config.server.url_upload, formData).then(res => {
          if (res.status === 200) {
            let {data} = res;
            if (data.code == 1) {
              alert(data.url);
              setAvatar(data.url);
            } else {
              alert('Upload image error');
            }
          } else {
            ToastAndroid.show(
              'Uploading failed. Try again',
              ToastAndroid.SHORT,
            );
          }

          setProgressLoaderShow(false);
        });
      }
    });
  };
  useEffect(() => {
    Config.parse_user(function (u) {
      setUser(u);

      loadFriends(function(res){
        setFriends(res);
      })
    });
  }, []);

  const arrayWithSearch = textSearch
    ? friends.filter(item =>
        item.name.toLocaleLowerCase().includes(textSearch),
      )
    : friends;
  const _isSelected = item => {
    const selected = selectUsers;
    var index = -1;
    for (i = 0; i < selected.length; i++) {
      if (selected[i].id == item.id) {
        index = i;
      }
    }
    if (index == -1) {
      return false;
    }
    return true;
  };
  //show item
  const renderUser = active => (
    <TouchableWithoutFeedback
      onPress={() => {
        var tmp = [...selectUsers];
        var index = -1;
        for (i = 0; i < selectUsers.length; i++) {
          if (selectUsers[i].id == active.id) {
            index = i;
          }
        }
        if (index == -1) {
          tmp.push(active);
          setSelectUsers(tmp);
        } else {
          tmp = tmp.filter(i => i.id != active.id);
          setSelectUsers(tmp);
        }
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
        <ProgressLoader
                visible={progressLoaderShow}
                isModal={true} isHUD={true}
                hudColor={"#000000"}
                color={"#FFFFFF"} />

        <Image
          source={{
            uri:active.photo
          }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 70,
          }}
        />
        {active.isActive ? (
          <View
            style={{
              position: 'absolute',
              backgroundColor: '#46CF76',
              width: 15,
              height: 15,
              left: 25,
              top: 30,
              borderRadius: 100,
              borderColor: '#222',
              borderWidth: 2,
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
        {_isSelected(active) == true ? (
          <Icon name="ios-checkmark-circle" size={25} color={'#34a8eb'} />
        ) : (
          <Icon name="ios-ellipse-outline" size={25} color={'#34a8eb'} />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
  return (
    <Modal
      animationType={'slide'}
      visible={props.modalVisible}
      onRequestClose={() => {
        console.log('close modal');
      }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{flex: 1}}>
          <View
            style={{
              paddingTop: heightStatusBar,
              backgroundColor: 'rgba(0,0,0,0.2)',
            }}></View>
          <View
            style={{
              backgroundColor: 'rgba(0,0,0,0.2)',
              flexDirection: 'row',
              //height: '10%',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: '4%',
              paddingTop: '1%',
              paddingBottom: '1%',
            }}>
            <TouchableOpacity
              style={{flex: 0.75, paddingVertical: '2%'}}
              onPress={() => {
                setSelectUsers([]);
                props.hideModal();
              }}>
              <Text style={{color: 'rgba(0,0,0,0.5)'}}>Huỷ</Text>
            </TouchableOpacity>
            <Text
              style={{
                marginLeft: '3%',
                flex: 1,
                fontSize: 18,
                color: '#f2f2f2',
                textAlign: 'center',
              }}>
              Tạo nhóm
            </Text>
            <TouchableOpacity
              style={{flex: 1, paddingVertical: '2%'}}
              // onPress={props.hideModal}
              onPress={createGroup}
              >
              <Text style={{color: 'rgba(0,0,0,0.5)', alignSelf: 'flex-end'}}>
                Tạo
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{flex: 1, backgroundColor: 'white'}}>
            <View
              style={{
                flexDirection: 'row',
                paddingVertical: '2%',
              }}>
              <TouchableOpacity style={{paddingHorizontal: '3%'}}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    borderRadius: 100,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Icon name="camera" size={30} color="grey" onPress={handleChoosePhoto} />
                </View>
              </TouchableOpacity>
              <TextInput
                style={{width: '70%', fontSize: 16}}
                placeholder={'Đặt tên nhóm'}
                placeholderTextColor={'rgba(0,0,0,0.3)'}
                onChangeText={value => {
                    setTitle(value);
                }}
              />
            </View>
            <View
              style={{
                marginTop: '1%',
                flexDirection: 'row',
                paddingHorizontal: '3%',
                borderRadius: 20,
                backgroundColor: 'rgba(0,0,0,0.1)',
                marginHorizontal: '3%',
                paddingVertical: '1%',
                alignItems: 'center',
              }}>
              <Icon name="ios-search-outline" size={25} color="grey" />
              <TextInput
                style={{
                  width: '90%',
                  marginLeft: '3%',
                  paddingVertical: Platform.OS == 'android' ? '0.5%' : null,
                  borderRadius: 20,
                  fontSize: 15,
                }}
                placeholder={'Tìm kiếm'}
                placeholderTextColor={'rgba(0,0,0,0.3)'}
                onChangeText={value => {
                  setTextSearch(value.toLocaleLowerCase());
                }}
              />
            </View>

            <View
              style={{
                paddingVertical: '2%',
                marginTop: '1%',
                alignItems: 'center',
              }}>
              <Text
                style={{fontWeight: 'bold', fontSize: 16, marginBottom: '3%'}}>
                Danh bạ
              </Text>
              <View
                style={{
                  width: '100%',
                  height: 1,
                  backgroundColor: 'rgba(0,0,0,0.1)',
                }}
              />
            </View>
            <ScrollView style={{paddingHorizontal: '3%'}}>
              {arrayWithSearch.map(active => (
                <React.Fragment key={active._id}>
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
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
