/* eslint-disable react-native/no-inline-styles */
/** Active peoples tab in Home Screen */

//importing libraries
import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, Image, TouchableOpacity,
  Animated,
  ImageBackground,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import io from 'socket.io-client';
import {firebase} from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Config from '../Config';

export default function StickyScreen({navigation, route}) {

  const OFFSET = 40;
const ITEM_WIDTH = Dimensions.get("window").width - (OFFSET * 2);
const ITEM_HEIGHT = 200;

const scrollX = React.useRef(new Animated.Value(0)).current;

  const [cards, setCards] = useState([]);
  const [allnew, setAllnew] = useState([]);
 
  const getHomeNews = async () =>{
      var data = await Config.storage.get("news",[
          {
            id: '1',
            title: "HLV Bồ Đào Nha: 'Tự Ronaldo không thể chiến thắng trận đấu'",
            date: '2021-03-24 43:23:12',
            photo: 'https://vnn-imgs-f.vgcloud.vn/2021/06/19/11/cristiano-ronaldo.jpg',
            url:'https://vietnamnet.vn/'
          },
          {
            id: '2',
            title: 'Kèo Bồ Đào Nha vs Đức: Khóa chặt Ronaldo',
            date: '2021-03-24 43:23:12',
            photo: 'https://vnn-imgs-f.vgcloud.vn/2021/06/19/10/duc-bo-dao-nha.jpg',
            url:'https://vietnamnet.vn/'
          },
          {
            id: '1',
            title: "HLV Bồ Đào Nha: 'Tự Ronaldo không thể chiến thắng trận đấu'",
            date: '2021-03-24 43:23:12',
            photo: 'https://vnn-imgs-f.vgcloud.vn/2021/06/19/11/cristiano-ronaldo.jpg',
            url:'https://vietnamnet.vn/'
          },
          {
            id: '2',
            title: 'Kèo Bồ Đào Nha vs Đức: Khóa chặt Ronaldo',
            date: '2021-03-24 43:23:12',
            photo: 'https://vnn-imgs-f.vgcloud.vn/2021/06/19/10/duc-bo-dao-nha.jpg',
            url:'https://vietnamnet.vn/'
          },
          {
            id: '1',
            title: "HLV Bồ Đào Nha: 'Tự Ronaldo không thể chiến thắng trận đấu'",
            date: '2021-03-24 43:23:12',
            photo: 'https://vnn-imgs-f.vgcloud.vn/2021/06/19/11/cristiano-ronaldo.jpg',
            url:'https://vietnamnet.vn/'
          },
          {
            id: '2',
            title: 'Kèo Bồ Đào Nha vs Đức: Khóa chặt Ronaldo',
            date: '2021-03-24 43:23:12',
            photo: 'https://vnn-imgs-f.vgcloud.vn/2021/06/19/10/duc-bo-dao-nha.jpg',
            url:'https://vietnamnet.vn/'
          }
        ]);
      setAllnew(data);

      data = await Config.storage.get("newsslider",[
          { title: "Movie 1", posterUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTN8fG1vdmllfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
          { title: "Movie 2", posterUrl: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8bW92aWV8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
          { title: "Movie 3", posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8bW92aWV8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
          { title: "Movie 4", posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bW92aWV8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
        ]);
 
      setCards(data);

      Config.server.post("ajax/news.php",{method:"home"},function(res){
          if(typeof res==="object"){
             Config.storage.set("news",res.news,function(){
              setAllnew([...res.news]);
            });

            Config.storage.set("newsslider",res.slider,function(){
              setCards([...res.slider]);
            });
          }else{
            console.log(res);
          }
          
       });
  };

  
  useEffect(() => {
    //get storage
     getHomeNews();
    
  }, []);
  //Shwo list news
  const renderUser = (active, showActive = true) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Website', {
          url: active.url,
          title:active.title
        });
        // console.log(this.props);
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
          source={{ uri: active.photo == '' ? Config.settings.avatar : active.photo}}
          style={{
            width:115,
            height: 75,
            borderRadius: 8,
          }}
        />
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            marginHorizontal: '3%',
            marginTop: '1%',
            justifyContent:'flex-start'
          }}>
          <Text
            style={{
              fontSize: 18,
              //fontFamily: 'Cairo-SemiBold',
              color: 'black',
            }}>
            {active.title}
          </Text>
          <Text
            style={{
              fontSize: 14,
              //fontFamily: 'Cairo-SemiBold',
              color: 'black',

            }}>
            {active.date}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  return (
    <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.1)'}}>
      <ScrollView alwaysBounceVertical={true}>
        <ScrollView
        horizontal={true}
        decelerationRate={"normal"}
        snapToInterval={ITEM_WIDTH}
        style={{ marginTop: 8,marginBottom: 8, paddingHorizontal: 0 }}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        disableIntervalMomentum
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={12}
      >
        {cards.map((item, idx) => {
          const inputRange = [
            (idx - 1) * ITEM_WIDTH,
            idx * ITEM_WIDTH,
            (idx + 1) * ITEM_WIDTH,
          ]

          const translate = scrollX.interpolate({
            inputRange,
            outputRange: [0.85, 1, 0.85],
          })

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.5, 1, 0.5],
          })

          return (
            <Animated.View
              style={{
                width: ITEM_WIDTH,
                height: ITEM_HEIGHT,
                marginLeft: idx === 0 ? OFFSET : undefined,
                marginRight: idx === cards.length - 1 ? OFFSET : undefined,
                opacity: opacity,
                transform: [{ scale: translate }],
              }}
            >
              <ImageBackground
                source={{uri:item.posterUrl}}
                style={{
                  flex: 1,
                  resizeMode: "cover",
                  justifyContent: "center",
                  marginBottom:8
                }}
                imageStyle={{ borderRadius: 6}}
              />
              <Text>{item.title}</Text>
            </Animated.View>
          )
        })}
      </ScrollView>
        <View style={{backgroundColor: 'white', marginBottom: '2%'}}>
          

          <TouchableOpacity
            style={{
              flexDirection: 'row', 
              alignItems: 'center',
            }}
            onPress={()=>{
               navigation.navigate('AddFriend');
            }}
            >
            <Icon
              name="people-sharp"
              type="ionicon"
              color="grey"
              style={{
                fontSize: 32,
                marginVertical: '3%',
                marginHorizontal: '3%',
              }}
            />
            <Text>Lời mời kết bạn</Text>
          </TouchableOpacity>
          
        </View>
        
        <View
          style={{
            backgroundColor: 'white',
            marginBottom: '15%',
            paddingLeft: '3%',
            paddingVertical: '2%',
            paddingBottom: '0%',
          }}>
          <Text style={{fontSize: 13, fontWeight: 'bold'}}>Latest news</Text>
          <ScrollView alwaysBounceVertical={false}>
            {allnew.map(active => (
              <React.Fragment>
                {renderUser(active, false)}
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
      </ScrollView>
    </View>
  );
}
