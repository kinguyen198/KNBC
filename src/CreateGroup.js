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
import Share from 'react-native-share';

export default function CreateGroup(props) {
  const heightStatusBar = getStatusBarHeight();
  const [selectUsers, setSelectUsers] = useState([]);
  const [textSearch, setTextSearch] = useState('');
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
      _id: '5',
      id: '1231231623212642246133',
      isActive: true,
      name: 'Test16232126422469',
      photo:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1DLuBDtz2945mZR71wAT0WSkktlbwpF3chZ8omSwo5km6q6NfxZDKtx5TXWcrWz-rZDA&usqp=CAU',
    },
    {
      __v: 0,
      _id: '6',
      id: '1231231623212642246211',
      isActive: true,
      name: 'Test16232126422468',
      photo:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1DLuBDtz2945mZR71wAT0WSkktlbwpF3chZ8omSwo5km6q6NfxZDKtx5TXWcrWz-rZDA&usqp=CAU',
    },
    {
      __v: 0,
      _id: '7',
      id: '1231231623212642246',
      isActive: true,
      name: 'Test16232126422467',
      photo:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1DLuBDtz2945mZR71wAT0WSkktlbwpF3chZ8omSwo5km6q6NfxZDKtx5TXWcrWz-rZDA&usqp=CAU',
    },
    {
      __v: 0,
      _id: '8',
      id: '123123162321264264',
      isActive: true,
      name: 'Test16232126422465',
      photo:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1DLuBDtz2945mZR71wAT0WSkktlbwpF3chZ8omSwo5km6q6NfxZDKtx5TXWcrWz-rZDA&usqp=CAU',
    },
  ];
  const arrayWithSearch = textSearch
    ? arrayTest.filter(item =>
        item.name.toLocaleLowerCase().includes(textSearch),
      )
    : arrayTest;
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
              Nhóm mới
            </Text>
            <TouchableOpacity
              style={{flex: 1, paddingVertical: '2%'}}
              onPress={props.hideModal}>
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
                  <Icon name="camera" size={30} color="grey" />
                </View>
              </TouchableOpacity>
              <TextInput
                style={{width: '70%', fontSize: 16}}
                placeholder={'Đặt tên nhóm'}
                placeholderTextColor={'rgba(0,0,0,0.3)'}
                onChangeText={value => {}}
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
