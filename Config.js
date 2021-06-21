import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Share from 'react-native-share';
 import {
Linking
} from 'react-native';
export const settings = {
  logo:'../assets/logo.png',
  background:'../assets/background.jpeg',
  avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1DLuBDtz2945mZR71wAT0WSkktlbwpF3chZ8omSwo5km6q6NfxZDKtx5TXWcrWz-rZDA&usqp=CAU',
};
 

export const socket = {
  url: 'https://azservices.work:5000',
  port: 5000,
};
export const server = {
  rooms:null,
  rooms_find:function(id){
    if(this.rooms){
      var l = this.rooms.length;
      for(var i=0; i<l; i++) {
        var item = this.rooms[i];
        // console.log(item.room);
        if(item.room==id){
           return item;
        }
      }
    }
    return null;
  },
  user: null,
  init: function () {
    var me = this;
    parse_user(function (u) {
      me.user = u;
    });
    return this;
  },
  // url : 'https://sreal.sreal.vn/',
  url: 'https://hcm.ahlupos.com/test/chatroom/',
  skip_url: function (url) {
    return url.includes('ahlupos.com');
    // return url.includes("sreal.vn");
  },
  upload : function(file,data,func){
    return this;
  },
  // url : 'https://hcm.ahlupos.com/test/chatroom/',
  post: async function (url, data, func) {
    console.log('Post =>' + this.url + url + ' with ', data);

    var params = new URLSearchParams();
    for (var i in data) {
      params.append(
        i,
        typeof data[i] == 'object' ? JSON.stringify(data[i]) : data[i],
      );
    }

    if (this.user) {
      params.append('code', this.user.token);
    } else {
      this.init();
    }
    let res = await axios.post(this.url + url, params);
    res = res.data;

    try {
      res = JSON.parse(res);
    } catch (e) {}

    //console.log(res);
    func(res);
    return this;
  },
  url_upload: 'https://hcm.ahlupos.com/test/chatroom/upload.php',
  schema: 'knbc://',
};
export const utils = {
  getFileExtension3: function (filename) {
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
  },
};
export const post = async (url, data) => {
  let res = await axios.post(url, data);
  try {
    res = res.data;
    res = JSON.parse(res);
  } catch (e) {}
  return res;
};
//https://www.google.com/maps/dir/10.8745855,106.7241761/10.8454616,106.7385566/
export const map = {
  static : function(pos,zoom){
      zoom = zoom?zoom:17;
      return {image:'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/'+pos.lng+','+pos.lat+','+zoom+',0,60/400x250?&access_token=pk.eyJ1IjoiYWhsdSIsImEiOiJja3B0ODM0aXEwMHUzMnZyM21tdnNzc2FvIn0.6dAfESP_bzUMu9t9j2dNSQ',url:'https://www.google.com/maps/dir/@'+pos.lng+','+pos.lat+',16z'};
  }
};
export const share = (function () {
  function share(options) {
    Share.open(options)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        err && console.log(err);
      });
  }
  return {
    text: function (title, message) {
      const options = Platform.select({
        ios: {
          activityItemSources: [
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
          ],
        },
        default: {
          title: title,
          subject: title,
          message: message,
        },
      });
      share(options);
    },
    link: function (title, url) {
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
          ],
        },
        default: {
          title,
          subject: title,
          message: url,
        },
      });
      share(options);
    },
  };
})();

export const parse_user = async (fun) => {
  var u = await storage.get('user');
   fun(u?u:null);
};
export const storage = {
  get : async (name,defaults) => {
      try {
        const jsonValue = await AsyncStorage.getItem(name);
        return jsonValue != null ? JSON.parse(jsonValue):defaults;
      } catch (e) {
        
      }
      return null;
  },
  set: async (name,data,func) =>{
     try {
        await AsyncStorage.setItem(name, JSON.stringify(data), () => {
          //navigation.navigate('Home');
          func();
        });
      } catch (err) {
        func();
      }
  }
};

export const webview = {
  
  onShouldStartLoadWithRequest: function(request) {
    var matches = request.url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
    var domain = matches && matches[1];
    if (server.url.includes(domain)) {
      return true;
    }
    if (request.url.includes('iframe=true')) {
      return true;
    }
    if (request.url.includes('open=true')) {
      Linking.openURL(request.url);
      return false;
    }
    //ext
    var ext = utils.getFileExtension3(request.url);
    switch (ext) {
      case 'mp3':
      case 'mp4':
      case 'wma':
      case 'flv':
      case 'mpeg':
        return true;
    }

    if (!/^[data:text, about:blank]/.test(request.url)) {
      console.log(request.url);
      if (
        request.url.startsWith('tel:') ||
        request.url.startsWith('mailto:') ||
        request.url.startsWith('maps:') ||
        request.url.startsWith('geo:') ||
        request.url.startsWith('sms:')
      ) {
        Linking.openURL(request.url).catch(er => {
          console.log('Failed to open Link:', er.message);
        });
        return false;
      } else {
        if (request.url.startsWith(server.schema)) {
          const path = request.url.replace(server.schema, '');
          var regex = /[?&]([^=#]+)=([^&#]*)/g,
            params = {},
            match;
          while ((match = regex.exec(path))) {
            params[match[1]] = match[2];
          }
          path = path.split('?')[0];
          if (path.startsWith('share')) {
            //share
          } else if (path.startsWith('add')) {
            //share
          } else if (path.startsWith('send')) {
            //share
          }
          console.log(params);
          return false;
        } else {
          //skip
          if (
            request.url.startsWith('wvjbscheme://') ||
            request.url.includes('://localhost')
          ) {
            return true;
          }
          //open all in default
          Linking.openURL(request.url);
          return false;
        }
      }
    }
    return true;
  }
};
