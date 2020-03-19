const APPID = 'SHY';
const APPSECRET = encodeURIComponent('SHY#2017@TEST');

let global_ApiConfig = {}; //api配置(内外测试环境)
let global_StoreConfig = {}; //存储配置

if (process.env.NODE_ENV == 'development') {
  global_ApiConfig.WebApiUrl = 'https://tapi2.kmwlyy.com:8015',
  global_ApiConfig.CommonApiUrl =  'https://tcommonapi2.kmwlyy.com:8015';
  global_StoreConfig.UrlPrefix = 'https://tstore2.kmwlyy.com:8015';
} else {
  global_ApiConfig.WebApiUrl = 'https://tapi2.kmwlyy.com:8015',
  global_ApiConfig.CommonApiUrl = 'https://tcommonapi2.kmwlyy.com:8015';
  global_StoreConfig.UrlPrefix = 'https://tstore2.kmwlyy.com:8015';
}

//各应用端的地址
const global_WebSideUrlConfig = {
  'Home': 'https://www.kmwlyy.com',
  'User': 'https://user.kmwlyy.com',
  'Doctor': 'https://doctor.kmwlyy.com',
  'DrugStore': 'https://drugstore.kmwlyy.com'
};

export {
  APPID,
  APPSECRET,
  global_ApiConfig,
  global_StoreConfig,
  global_WebSideUrlConfig
}
