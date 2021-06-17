import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import * as Config from '../../Config';

export default function EditMessage(props) {
  const heightStatusBar = getStatusBarHeight();
  const [mess, setMess] = useState('');
  return (
    <Modal
      avoidKeyboard={false}
      transparent={true}
      animationType={'fade'}
      visible={props.modalVisible}
      onRequestClose={() => {
        console.log('close modal');
      }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <TouchableOpacity
            onPress={props.hideModal}
            style={{
              position: 'absolute',
              right: '5%',
              top: '5%',
              padding: '1%',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>X</Text>
          </TouchableOpacity>
          <Text>Edit message</Text>
          <TextInput
            onChangeText={text => setMess(text)}
            autoFocus={true}
            placeholder={'Enter message'}
            placeholderTextColor={'grey'}
            style={{
              paddingLeft: '3%',
              width: '90%',
              height: 40,
              backgroundColor: 'rgba(0,0,0,0.2)',
              marginTop: '3%',
              borderRadius: 10,
              color: 'black',
            }}
          />
          <TouchableOpacity
            onPress={() => {
              Config.server.post(
                'ajax/chat.php',
                {
                  //code: user.token,
                  method: 'edit',
                  r: props.edit.room,
                  id: props.edit.id,
                  message: {
                    text: mess,
                    createdAt: props.createdAt,
                  },
                },
                res => {
                  props.hideModal();
                },
              );
            }}
            style={{
              backgroundColor: '#34a8eb',
              paddingVertical: '2%',
              marginTop: '5%',
              width: '30%',
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{color: 'white'}}>Done</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
const width = Dimensions.get('window').width;
const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 10,
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    //height: scale(170),
    width: '100%',
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#rgba(0, 0, 0, 0.5)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 2,
    shadowOpacity: 0.5,
    elevation: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});
