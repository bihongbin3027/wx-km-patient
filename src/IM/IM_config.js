// 账号模式, 0-独立模式, 1-托管模式
const ACCOUNT_MODE = 1;

//枚举会话类型
var SessionType = { //聊天类型，C2C : 私聊，GROUP：群聊
  'C2C': 'C2C',
  'GROUP': 'GROUP'
};

//腾讯登录服务错误码（用于托管模式）
var TlsErrorCode = {
  'OK': 0,//功成
  'SIGNATURE_EXPIRATION': 11//用户身份凭证过期
};

//最大能发送消息长度
var MaxMsgLen = {//消息最大长度（字节），
  'C2C': 12000,//私聊消息
  'GROUP': 8898//群聊
};

//图片业务类型
var UploadPicBussinessType = {
  'GROUP_MSG': 1,//私聊图片
  'C2C_MSG': 2,//群聊图片
  'USER_HEAD': 3,//用户头像
  'GROUP_HEAD': 4//群头像
};

export {
  ACCOUNT_MODE,
  SessionType,
  TlsErrorCode,
  MaxMsgLen,
  UploadPicBussinessType
}
