/** Home Screen of the app */

//importing libraries
import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ActivityIndicator,
  View,
  Image,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Dimensions,
  Modal,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {fromRight, zoomIn, fromBottom} from 'react-navigation-transitions';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import * as Config from '../Config';

//importing screens
import ChatsScreen from './Chats';
import PeoplesScreen from './Peoples';
import SettingsScreen from './Settings';
import CreateGroup from './CreateGroup';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers,
} from 'react-native-popup-menu';

//create a tab navigator for homescreen
export default function Home({navigation}) {
  const heightStatusBar = getStatusBarHeight();
  const Tab = createMaterialTopTabNavigator();
  const [user, setUser] = useState();
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const hideModal = () => {
    setModalVisible(false);
  };
  useEffect(() => {
    Config.parse_user(user => {
      setUser(user);
    });
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#34a8eb'}}>
      <View
        style={{
          marginTop: heightStatusBar,
          flexDirection: 'row',
          //marginVertical: '2%',
          padding: '3%',
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            marginHorizontal: '3%',
          }}>
          <Image
            source={{uri: user ? user.userPhoto : null}}
            style={{
              width: 50,
              height: 50,
              borderRadius: 70,
            }}
          />
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginLeft: 8,
              color: 'white',
              alignSelf: 'flex-end',
              marginBottom: '2%',
            }}>
            {user ? user.userName : ''}
          </Text>
        </View>

        <View
          style={{
            flex: 0,
            flexDirection: 'column',
            marginHorizontal: '2%',
            justifyContent: 'flex-end',
            marginBottom: '1%',
          }}>
          <Menu
            renderer={renderers.Popover}
            rendererProps={{placement: 'bottom'}}>
            <MenuTrigger>
              <Icon
                name="add-outline"
                type="ionicon"
                color="white"
                style={{fontSize: 28}}
              />
            </MenuTrigger>
            <MenuOptions
              optionsContainerStyle={{
                backgroundColor: 'white',
                width: Dimensions.get('screen').width / 1.8,
              }}>
              <MenuOption
                onSelect={() => setModalVisible(true)}
                style={styles.menuOption}>
                <Icon name="people-sharp" color={'grey'} size={28} />
                <Text style={{marginLeft: '5%'}}>Tạo nhóm</Text>
              </MenuOption>
              <MenuOption
                onSelect={() => navigation.navigate('AddFriend')}
                style={styles.menuOption}>
                <Icon name="person-add" color={'grey'} size={28} />
                <Text style={{marginLeft: '5%'}}>Thêm bạn</Text>
              </MenuOption>
              <MenuOption
                onSelect={() => navigation.navigate('ScanQR', {user: user})}
                style={styles.menuOption}>
                <Icon name="qr-code-outline" color={'grey'} size={28} />
                <Text style={{marginLeft: '5%'}}>Quét mã QR</Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
        </View>
      </View>
      <Tab.Navigator style={{flex: 1}}>
        <Tab.Screen
          name="ChatsScreen"
          component={ChatsScreen}
          options={{
            tabBarLabel: 'Chat',
            tabBarIcon: ({color, size}) => (
              <Icon name="ios-chatboxes" color={color} size={28} />
            ),
          }}></Tab.Screen>
        {/* <Tab.Screen
          name="PeoplesScreen"
          component={PeoplesScreen}
          options={{
            tabBarLabel: 'Waiting friends',
            tabBarIcon: ({color, size}) => (
              <Icon name="ios-contacts" color={color} size={28} />
            ),
          }}></Tab.Screen> */}
        <Tab.Screen
          name="SettingsScreen"
          component={SettingsScreen}
          options={{
            tabBarLabel: 'Setting',
            tabBarIcon: ({color, size}) => (
              <Icon name="ios-chatboxes" color={color} size={28} />
            ),
          }}></Tab.Screen>
      </Tab.Navigator>
      <CreateGroup modalVisible={modalVisible} hideModal={hideModal} />
    </View>
  );
}
const styles = StyleSheet.create({
  menuOption: {
    paddingLeft: '5%',
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
