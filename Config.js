import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Share from 'react-native-share';

export const socket = {
  url: '127.0.0.1:5000',
};
export const server = {
  url: 'https://hcm.ahlupos.com/test/chatroom/',
  post: async function (url, data, func) {
    console.log('Post =>' + this.url + url + ' with ', data);

    let params = new URLSearchParams();
    for (var i in data) {
      params.append(i, data[i]);
    }

    let res = await axios.post(this.url + url, params);
    res = res.data;
    try {
      res = JSON.parse(res);
    } catch (e) {}

    console.log(res);
    func(res);
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

export const parse_user = async fun => {
  try {
    const jsonValue = await AsyncStorage.getItem('user');
    fun(JSON.parse(jsonValue));
  } catch (e) {
    fun(null);
  }
};
