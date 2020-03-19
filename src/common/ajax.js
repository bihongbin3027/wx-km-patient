import { urlParse } from './utils'
import  hex_md5  from './plugin/md5'
import envconfig from '../envconfig/envconfig'
import { Toast } from 'mand-mobile'

var AppToken, AppKey = 'SHY', UserToken;

const urlParams = urlParse();

export default async (type = 'GET', url = '', data = {}, api = false, method = 'fetch') => {
  type = type.toUpperCase();
  if (api) {
    url = envconfig.imApi + url; // 新的api
  } else {
    url = envconfig.imApi + url;
  }
  if(urlParams.AppKey) {
    AppToken = urlParams.AppToken;
    UserToken = urlParams.UserToken;
    AppKey = urlParams.AppKey
  } else {
    AppToken = window.appToken || undefined
    if(window.userInfo) {
      UserToken = window.userInfo.UserToken
    } else {
      UserToken =  undefined
    }
  }
  const noneStr = _getNonceStr();
  // 生成签名
  const sign = _getSign(AppToken, noneStr, UserToken);
  if (type == 'GET' || type == 'DELETE') {
    let dataStr = '';
    Object.keys(data).forEach(key => {
      dataStr += key + '=' + data[key] + '&';
    })
    
    if (dataStr !== '') {
      dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
      url = url + '?' + dataStr;
    }
  }
  if (window.fetch && method !== 'fetch') { // 暂时没有用
    let requestConfig = {
      // credentials: 'include',
      method: type,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'apptoken': App,
        'usertoken': User,
        'noncestr': noneStr,
        'sign': sign
      },
      mode: "cors",
      cache: "force-cache"
    }
    
    if (type == 'POST') {
      Object.defineProperty(requestConfig, 'body', {
        value: JSON.stringify(data)
      })
    }
    
    try {
      var response = await fetch(url, requestConfig);
      var responseJson = await response.json();
    } catch (error) {
      throw new Error(error)
    }
    return responseJson
  } else {
    
    return new Promise(function (resolve, reject) {
      let requestObj;
      if (window.XMLHttpRequest) {
        requestObj = new XMLHttpRequest();
      } else {
        requestObj = new ActiveXObject;
      }
      requestObj.open(type, url, true);
      requestObj.setRequestHeader("AppId", "Healthcloud.IM");
      if(urlParams.AppKey) {
        requestObj.setRequestHeader("apptoken", AppToken );
        requestObj.setRequestHeader("usertoken", UserToken);
        requestObj.setRequestHeader("noncestr", noneStr);
        requestObj.setRequestHeader("sign", sign);
      } else {
        if (UserToken && AppToken) {
          requestObj.setRequestHeader("apptoken", AppToken );
          requestObj.setRequestHeader("usertoken", UserToken);
          requestObj.setRequestHeader("noncestr", noneStr);
          requestObj.setRequestHeader("sign", sign);
        } else {
          if(AppToken) {
            requestObj.setRequestHeader("apptoken", AppToken );
            requestObj.setRequestHeader("noncestr", noneStr);
            requestObj.setRequestHeader("sign", sign);
          }
        }
      }
 

      let sendData = '';
      if (type === 'POST') {
        requestObj.setRequestHeader("Content-type", "application/json; charset=utf-8");
        sendData = JSON.stringify(data);
      }
      
      requestObj.send(sendData);
      requestObj.onreadystatechange = function () {
        if (requestObj.readyState == 4) {
          if (requestObj.status == 200) {
            let obj = requestObj.response
            if (typeof obj !== 'object') {
              obj = JSON.parse(obj);
            }
            if (!failHanlder(obj)) {
              reject(obj)
            } else {
              resolve(obj.Data)
            }
            
          } else {
            reject(requestObj)
          }
        }
      }
    })
    
  }
}

//生成随机数
function _getNonceStr() {
  var data = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
  var result = "";
  for (var i = 0; i < 15; i++) {
    var r = Math.floor(Math.random() * 62);     //取得0-62间的随机数，目的是以此当下标取数组data里的值！
    result += data[r];        //输出15次随机数的同时，让rrr加15次，就是15位的随机字符串了。
  }
  var now = new Date();
  var day = now.getDate() + "" + now.getHours() + "" + now.getMinutes() + "" + now.getSeconds();
  return day + result;
}

//生成签名
function _getSign(apptoken, noncestr, usertoken) {
  apptoken = apptoken || window.appToken;
  const str = "appkey=" + AppKey + "&apptoken=" + apptoken + "&noncestr=" + noncestr + (!usertoken ? "" : "&usertoken=" + usertoken);
  const sign = hex_md5(str).toUpperCase();
  return sign;
}

function failHanlder(obj) {
  
  if (obj.Status == 4) {
    errToast(obj.Msg)
    console.error('status:', obj.Status + " - " + obj.Msg)
    return false;
  }
  // apptoken过期或无效，请重新获取
  if (obj.Status == 5) {
    errToast(obj.Msg)
    console.error('status:', obj.Status + " - " + obj.Msg)
    return false;
  }
  //用户登录已过期，清除本地用户数据
  if (obj.Status == 6) {
    errToast(obj.Msg)
    console.error('status:', obj.Status + " - " + obj.Msg)
    return false;
  }
  if (obj.Status == 3) {
    console.error('status:', obj.Status + " - " + obj.Msg)
    return false;
  }
  
  return true
}

function errToast(msg) {
  if (typeof msg !== 'string') {
    return
  }
  
  Toast(msg, 1500);
}
