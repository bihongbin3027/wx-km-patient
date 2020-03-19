import { SparkMD5 } from "./plugin/spark-md5";
import { global_StoreConfig } from './config';
import  hex_md5  from './plugin/md5'
import { loadFromLocal } from "../utils/utils"

let appkey = 'SHY';
let AppToken;
let getUserToken;
AppToken = loadFromLocal('h5', 'appToken') || ''
if(window.userInfo) {
  getUserToken = window.userInfo.UserToken
  getUserToken = JSON.parse(window.localStorage.getItem('userInfo')).UserToken
} else {
  getUserToken =  ''
}

//生成随机数
function getNonceStr() {
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
function getAppToken(successCallBack) {
  let AppToken = loadFromLocal('h5', 'appToken') || ''
  if (successCallBack)
    successCallBack(AppToken)
  
  return AppToken;
}
//生成签名
function getSign(apptoken, noncestr, usertoken) {
  
  let str = "appkey=" + appkey + "&apptoken=" + apptoken + "&noncestr=" + noncestr + (!usertoken ? "" : "&usertoken=" + usertoken);
  
  
  let sign = hex_md5(str).toUpperCase();
  
  return sign;
}

//获取文件MD5
var getFileMD5 = function (file, cbOk, cbErr) {
  
  var fileReader = null;
  try {
    fileReader = new FileReader();//分块读取文件对象
  } catch (e) {
    if (cbErr) {
      cbErr(tool.getReturnError('当前浏览器不支持FileReader'));
      return;
    }
  }
  //file的slice方法，注意它的兼容性，在不同浏览器的写法不同
  var blobSlice = File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice;
  if (!blobSlice) {
    if (cbErr) {
      cbErr(tool.getReturnError('当前浏览器不支持FileAPI'));
      return;
    }
  }
  
  var chunkSize = 2 * 1024 * 1024;//分块大小，2M
  var chunks = Math.ceil(file.size / chunkSize);//总块数
  var currentChunk = 0;//当前块数
  
  var spark = new SparkMD5();//获取MD5对象
  
  fileReader.onload = function (e) {//数据加载完毕事件
    
    var binaryStr = "";
    var bytes = new Uint8Array(e.target.result);
    var length = bytes.byteLength;
    for (var i = 0; i < length; i++) {
      binaryStr += String.fromCharCode(bytes[i]);//二进制转换字符串
    }
    spark.appendBinary(binaryStr);
    currentChunk++;
    if (currentChunk < chunks) {
      loadNext();//读取下一块数据
    } else {
      this.fileMd5 = spark.end();//得到文件MD5值
      if (cbOk) {
        cbOk(this.fileMd5);
      }
    }
  };
  //分片读取文件
  function loadNext() {
    var start = currentChunk * chunkSize, end = start + chunkSize >= file.size ? file.size : start + chunkSize;
    //根据开始和结束位置，切割文件
    var b = blobSlice.call(file, start, end);

    fileReader.readAsArrayBuffer(b);//ie，chrome，firefox等主流浏览器兼容此方法
    
  }
  loadNext();//开始读取
};

//获取文件类型，根据文件扩展
var getFileTypeByExt = function (obj) {
  var picExts = ".png|.jpg|.gif|.bmp|.jpeg";
  var photoExt = obj.value.substr(obj.value.lastIndexOf(".") + 1).toLowerCase();//获得文件后缀名
  var pos = picExts.indexOf(photoExt);
  if (pos < 0) {
    return "File";
  }
  else {
    return "Image";
  }
  
}

//获取文件类型（根据文件类型）
var getFileTypeByContentType = function (file) {
  var type = file.type.substr(0, 5);
  
  //图片
  if (type == "image") {
    return "Image"
  }
  //音频
  else if (type == "audio") {
    return "Audio"
  }
  //音频
  else if (type == "video") {
    return "Video"
  }
  //文件
  else
    return "File";
  
}

/*
 * 上传文件
 * @author 郭明
 * params:
 *      @file 需要上传的文件
 *      @fileType 文件类型
 *      @okCallback   上传成功回调函数
 *      @failCallback 上传失败回调函数
 */
var uploadFile = function (file, fileType, okCallback, failCallback) {
  
  console.log("计算文件Md5", new Date())
  
  //读取文件MD5
  getFileMD5(file, (fileMd5)=> {
    
    console.info('fileMd5: ' + fileMd5, new Date());
    
    getAppToken((tokenStr)=>{
      var appToken = tokenStr;
      var noneStr = getNonceStr();
      var userToken = getUserToken;
      var sign = getSign(appToken, noneStr, userToken);
      
      //上传
      var xhr = new XMLHttpRequest();
      xhr.open("post", global_StoreConfig.UrlPrefix + "/Upload/" + fileType + "?Md5=" + fileMd5, true);
      xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      console.log('a:', appToken, noneStr, userToken)
      xhr.setRequestHeader('apptoken', appToken)//授权的访问
      xhr.setRequestHeader('noncestr', noneStr)//放置回放攻击
      xhr.setRequestHeader('usertoken', userToken)//用户已登录
      xhr.setRequestHeader('sign', sign) //防篡改
      xhr.onerror = function (err) {
        console.error("upload error")
        
        if (failCallback)
          failCallback(err,file,fileType,fileMd5)
        
      }
      xhr.ontimeout = function (e) { console.error("upload timeout") };
      xhr.upload.onprogress = function (e) { console.debug("upload progress") };
      xhr.onload = function () {
        
        if (this.readyState === 4 && this.status === 200) {
          
          if (this.responseText) {
            var response = eval("(" + this.responseText + ")");
            
            if (response.Status == 0) {
              
              console.log("upload success")
              
              if (okCallback)
                okCallback(response)
              
            }
            else {
              console.log("upload fail")
              
              if (failCallback)
                failCallback(response,file,fileType,fileMd5)
            }
          }
        }
        else {
          if (failCallback)
            failCallback({},file,fileType,fileMd5)
        }
      }
      
      var fd = new FormData();
      fd.append('mypic', file);
      xhr.send(fd);
      
      
    }, function (err) {
      if (failCallback)
        failCallback(err)
      
      console.error("get app token error")
    });
    
    
  }, function () {
    console.error("getFileMd5 fail");
    
  })
}

/*
 * 触发文件上传
 * @author 郭明
 * params:
 *   @file 需要上传的文件
 *   @preHandlerCallback 预处理回调函数
 */
var onFileUpload = function (file, preHandlerCallback) {
  if (!window.File || !window.FileList || !window.FileReader) {
    alert("您的浏览器不支持File Api");
    return;
  }
  
  //预览图片
  var reader = new FileReader();
  
  reader.onload = (function (file) {
    
    
    //获取文件大小
    var fileSize = file.size;
    
    var fileType = getFileTypeByContentType(file);
    
    console.debug("upload file", file);
    
    console.info('fileSize: ' + fileSize);
    
    console.info('fileType: ' + fileType);
    
    return function (e) {
      
      if (preHandlerCallback) {
        
        preHandlerCallback({
          file: file,
          fileType: fileType,
          reader: this
        }, function (okCallback, failCallback) {
          
          uploadFile(file, fileType, okCallback, failCallback);
          
        });
        
      }
      else {
        console.error("not Implement onUpload Function");
      }
    };
    
  })(file);
  
  //预览图片
  reader.readAsDataURL(file);
  
}


export {
  uploadFile,
  onFileUpload,
  getFileMD5
};


