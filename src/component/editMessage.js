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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {getStatusBarHeight} from 'react-native-status-bar-height';

export default function EditMessage(props) {
  const heightStatusBar = getStatusBarHeight();
  return (
    <Modal
      avoidKeyboard={false}
      transparent={true}
      animationType={'fade'}
      visible={props.modalVisible}
      onRequestClose={() => {
        console.log('close modal');
      }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <Text>Edit message</Text>
            <TextInput
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
              onPress={props.hideModal}
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
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
const width = Dimensions.get('window').width;
const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
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
