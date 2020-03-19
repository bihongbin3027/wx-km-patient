<template>
  <div class="talk">
    <ul class="content" ref="chatDom">
      <li :class="!item.isSend ? 'wrap clearfix avatarLeft' : 'wrap clearfix avatarRight'" v-for="(item, index) in messages" :key="index">
        <div v-if="!item.isSend" class="avatar" :style="avatarFormat(item)"></div>
        <!--语音消息-->
        <vMsgVoice
          class="msg"
          :class="!item.isSend ? 'other fl' : 'self fr'"
          :message="item"
          v-if="item.msgType == enumMsgType.MSGTYPE_VOICE"
        ></vMsgVoice>
        <!--图片消息-->
        <vMsgImage
          class="msg"
          :class="!item.isSend ? 'other fl' : 'self fr'"
          :message="item"
          v-if="item.msgType == enumMsgType.MSGTYPE_IMAGE"
        ></vMsgImage>
        <!--纯文本消息(文字，表情)-->
        <vMsgText
          class="msg"
          :class="!item.isSend ? 'other fl' : 'self fr'"
          :message="item"
          v-if="item.msgType == enumMsgType.MSGTYPE_TEXT"
        ></vMsgText>
        <!--链接消息-->
        <vMsgUrl
          class="msg"
          :class="!item.isSend ? 'other fl' : 'self fr'"
          :message="item"
          v-if="item.msgType == enumMsgType.MSGTYPE_URL"
        ></vMsgUrl>
        <!--附件-->
        <vMsgAttach
          class="msg"
          :class="!item.isSend ? 'other fl' : 'self fr'"
          :message="item"
          v-if="item.msgType == enumMsgType.MSGTYPE_ATTACH"
        >
        </vMsgAttach>
        <div v-if="item.isSend" class="avatar" :style="avatarFormat(item)"></div>
      </li>
    </ul>
    <!-- 选择表情 开始-->
    <ul class="popExpression" v-show="emotionShow">
      <li
        v-for="(item, index) in EmotionPicData"
        @click="setEmotion(item[0])"
        :key="index"
      >
        <img :src="item[1]" alt="" />
      </li>
    </ul>
    <!-- 选择表情 结束 -->
    <div class="entry">
      <!--<input type="file" style="display: none" id="speaker-file" accept="audio/*" capture="microphone">-->
      <span class="speaker" id="speaker"> </span>
      <form class="message" @submit.prevent="onSendMessage()">
        <input
          type="text"
          maxlength="300"
          class="words"
          id="words"
          autocomplete="off"
          v-model="text"
        />
      </form>
      <span class="expression" @click="emotionShow = !emotionShow"></span>
      <form
        class="webuploader"
        name="webuploader_form"
        enctype="multipart/form-data"
        v-if="!text"
      >
        <input
          type="file"
          id="webuploader_file"
          multiple
          accept="image/*"
          class="form-control"
          @change="onUploadFile"
          name="file"
        />
        <label for="webuploader_file" class="addImgBtn">
          <span class="add"></span>
        </label>
      </form>
      <span class="send-btn" v-else @click="onSendMessage()">发送</span>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { Toast } from "mand-mobile";
import eventBus from "../IM/eventBus";
import * as uploader from "../common/uploader";
// 文本消息
import roomTalkMsgText from "../components/roomTalkMsgText";
// 图片消息
import roomTalkMsgImage from "../components/roomTalkMsgImage";
// 链接消息
import roomTalkMsgUrl from "../components/roomTalkMsgUrl";
// 附件消息
import roomTalkMsgAttach from "../components/roomTalkMsgAttach";
// 语音消息
import roomTalkMsgVoice from "../components/roomTalkMsgVoice";
// 每条消息之间的高度
const LI_MARGIN_TOP = 25;
import { saveToLocal } from "../utils/utils"
import { global_ApiConfig, APPSECRET } from "../common/config"
import axios from "axios"

export default {
  data() {
    return {
      emotionShow: false,
      ChannelID: this.$route.query.id,
      text: "",
      Sending: false,
      unsbscribes: [],
      err: "",
      audio_context: null,
      recorder: null
    };
  },
  components: {
    vMsgText: roomTalkMsgText,
    VMsgImage: roomTalkMsgImage,
    VMsgUrl: roomTalkMsgUrl,
    VMsgAttach: roomTalkMsgAttach,
    vMsgVoice: roomTalkMsgVoice
  },
  props: {
    room: {
      type: Object
    },
    enumMsgType: {
      type: Object
    },
    appendToMessages: null
  },
  created() {
    document.title = "咨询室";
  },
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    this.room.session.selToID = null;
    this.$store.state.messages = [];
    console.log("this.room.session: ", this.room.session);
    next();
  },
  mounted() {
    Toast.loading("请稍候...");
    axios.get(`${global_ApiConfig.WebApiUrl}/Token/get?appId=SHY&appSecret=${APPSECRET}`).then(res => {
      saveToLocal("h5", "appToken", res.data.Data.Token)
    })
    setTimeout(() => {
      Toast.hide();
      this.$store.state.messages = [];
      this.subscribeEvent();
      this.toggleRoom(this.ChannelID);
      this._initSpeaker();
      this.bindTouchHandler();
      //this.getMediaInfo(this.ChannelID)
    }, 2000);
  },
  updated() {
    let chatDom = this.$refs.chatDom;
    if (chatDom) {
      this.scrollMessageContentToBottom();
    }
  },
  methods: {
    // 聊天头像
    avatarFormat({ isSend }) {
      let { patientPortrait, headPortrait } = this.$route.query
      if (isSend) {
        return {
          backgroundImage: `url(${patientPortrait})`,
          backgroundColor: '#ccc'
        }
      } else {
        return {
          backgroundImage: `url(${headPortrait})`,
          backgroundColor: '#ccc'
        }
      }
    },
    // 订阅事件
    subscribeEvent() {
      var self = this;
      if (this.unsbscribes.length > 0) return;
      this.unsbscribes.push(
        eventBus.subscribe("room-changed", () => {
          self.room.syncMessage();
        })
      );
      this.unsbscribes.push(
        eventBus.subscribe("im-new-c2c-msg", (eventType, eventArgs) => {
          self.appendToMessages(eventArgs.msg, eventArgs.isNewMsg);
        })
      );
    },
    // 取消事件
    unsubscribeEvent() {
      for (var i = 0; i < this.unsbscribes.length; i++) {
        this.unsbscribes[i]();
      }
      this.unsbscribes = [];
    },
    bindTouchHandler() {
      var self = this;
      var speaker = document.getElementById("speaker");
      speaker.addEventListener(
        "touchstart",
        function() {
          self.startSpeakerHandler();
        },
        false
      );
      speaker.addEventListener(
        "touchend",
        function() {
          self.endSpeakerHandler();
        },
        false
      );
    },
    startSpeakerHandler() {
      console.log("startSpeakerHandler");
      this.recorder && this.recorder.record();
    },
    /**
     * @params obj 配置参数
     * @return Promise getUserMedia
     */
    getUserMedia(constraints) {
      let getUserMedia =
        navigator.getUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.msGetUserMedia;
      if (!getUserMedia) {
        return Promise.reject(
          new Error("getUserMedia is not implemented in this browser")
        );
      }
      return new Promise(function(resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    },
    _initSpeaker() {
      let self = this;
      try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        window.URL = window.URL || window.webkitURL;
        this.audio_context = new AudioContext();
        console.log("Audio context set up.");
      } catch (e) {
        console.warn("No web audio support in this browser!");
      }
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
      }
      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = self.getUserMedia;
      }
      var constraints = { audio: true };
      // 只能用https 需要CA证书
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(stream => {
          self._startUserMedia(stream);
        })
        .catch(e => {
          console.error("No live audio input: " + e);
        });
    },
    _startUserMedia(stream) {
      let input = this.audio_context.createMediaStreamSource(stream);
      console.log("Media stream created.");
      // Uncomment if you want the audio to feedback directly
      //input.connect(audio_context.destination);
      //__log('Input connected to audio context destination.');
      this.recorder = new Recorder(input);
      console.log("Recorder initialised.", this.recorder);
    },
    _createDownloadLink() {
      let self = this;
      console.log("_createDownloadLink");
      this.recorder &&
        this.recorder.exportWAV(function(blob) {
          uploader.onFileUpload(blob, self.onUpload);
        });
    },
    endSpeakerHandler() {
      console.log("endSpeakerHandler");
      this.recorder && this.recorder.stop();
      this._createDownloadLink();
      this.recorder.clear();
    },
    toggleRoom(ChannelID) {
      //检查群组是否存在，不存在则创建（避免刷新页面或重复进入此页面的问题）
      if (ChannelID != "") {
        this.room.ChannelID = ChannelID + "";
        // 获取房间信息
        this.getChannel(ChannelID).then(() => {
          // 切换会话
          let State = this.roomInfo.RoomState;
          let ChannelID = this.roomInfo.ChannelID;
          let ServiceType = this.roomInfo.ServiceType;
          let Secret = this.roomInfo.Secret;
          this.room.ServiceType = ServiceType;
          //切换会话
          this.room.toggleSession(this.room.ChannelID, null, {}, () => {
            //未就诊，进入诊室
            if (State == 0) {
              //候诊中
              this.changeRoomState(ChannelID).then(resp => {
                if (ServiceType == 1) {
                  //图文咨询
                } else {
                  this.goRoomWaiting(this.ChannelID, this.DoctorID);
                }
              });
            } else {
              //候诊中
              if (State == 1) {
                if (ServiceType == 1) {
                  //图文咨询
                } else {
                  // this.goRoomWaiting(this.ChannelID, this.DoctorID);
                }
              }
              //就诊中
              else if (State == 2) {
                // this.goRoomConnected(this.ChannelID, this.DoctorID)
              }
              //已就诊
              else if (State == 3) {
                // this.goRoomClosed(this.ChannelID, this.DoctorID);
              }
              //呼叫中
              else if (State == 4) {
                // this.goRoomAnswer(this.ChannelID, this.DoctorID);
              }
              //离开中
              else if (State == 5) {
                // this.onReveiveExitRoomInvite(this.ChannelID, this.DoctorID);
              }
            }
          });
        });
      } else {
        this.goRoomClosed(this.ChannelID, this.DoctorID);
      }
    },
    // 修改房间状态
    async changeRoomState(ChannelID) {
      await this.$store.dispatch("changeRoomState", {
        ChannelID: ChannelID,
        State: 1
      });
    },
    //获取房间信息
    async getChannel(ChannelID) {
      await this.$store.dispatch("getRoomInfo", ChannelID);
    },
    // 获取多媒体配置
    getMediaInfo(id) {
      this.$store.dispatch("getMediaInfo", id);
    },
    sendFileMessage(data) {
      return this.$store.dispatch("sendFileMsg", data);
    },
    sendAudioMessage(data) {
      return this.$store.dispatch("sendAudioMsg", data);
    },
    sendImageMessage(data) {
      return this.$store.dispatch("sendImageMsg", data);
    },
    // 选择表情
    setEmotion(emotion) {
      this.text += emotion;
      this.emotionShow = false;
    },
    onUpload(params, process) {
      var self = this;
      //申明发送消息方法
      var SendMessage = function() {
        //默认重新上传（如果图片没有上传成功时，用户重新发送消息则重新调用上传方法）
        FileUpload();
      };
      //获取一条消息
      var GetMessage = function(params) {
        var user = self.room.memberMgr.formatUser(
          self.room.loginInfo.Identifier,
          self.lang
        );
        var message = {
          avatar: user.avatar, //头像
          author: user.nickName, //名称
          isNewMsg: true,
          isSend: true,
          _msg: {
            status: -1,
            Send: SendMessage //通过此闭包处理消息重试
          },
          File: params.file,
          FileName: params.file.name, //文件名
          FileSize: self.bytesToSize(params.file.size), //文件大小
          FileType: params.file.type, //文件类型
          FileUrl: "", //文件下载地址
          FileMd5: "",
          html: ""
        };
        if (params.fileType == "File") {
          message.msgType = self.enumMsgType.MSGTYPE_ATTACH;
          return message;
        } else if (params.fileType == "Image") {
          message.msgType = self.enumMsgType.MSGTYPE_IMAGE;
          message.html =
            '<img  style="width:100%"  class="img-thumbnail" src="' +
            params.reader.result +
            '" />'; //内容
          return message;
        } else if (params.fileType == "Audio") {
          var url = URL.createObjectURL(params.file);
          message.msgType = self.enumMsgType.MSGTYPE_VOICE;
          message.voicePlaying = false;
          message.voiceUnRead = false; //
          message.voiceSize = params.file.size; //文件大小
          message.voiceSecond = 0; //秒
          message.voiceUrl = url; //地址
          return message;
        } else if (params.fileType == "Video") {
          message.msgType = self.enumMsgType.MSGTYPE_VIDEO;
          return message;
        } else {
          console.error("不支持发送此类型的消息");
        }
      };
      //上传方法
      var FileUpload = function() {
        //上传文件
        process(
          function(uploadResp) {
            //开始发送消息
            SendMessage(message, uploadResp);
          },
          function(resp) {
            //上传文件失败
            console.error(resp);
            Toast.info("文件上传失败", 1500);
            message._msg.status = 0;
          }
        );
      };
      //#region 根据文件类型实现发送消息的方法
      //消息默认包装
      var IMMessageWrapperDefaultHandler = function(message, uploadResp) {
        //上传后返回文件名称，访问路径，文件MD5
        message.FileMd5 = uploadResp.Data.MD5;
        message.FileUrl = uploadResp.Data.UrlPrefix + uploadResp.Data.FileName;
        window.localStorage.FileUrl = message.FileUrl + "?download=1";
        return message;
      };
      //什么发送处理程序
      var IMSendHandler = this.sendFileMessage;
      //实时消息包装处理程序
      var IMMessageWrapperHandler = IMMessageWrapperDefaultHandler;
      var self = this;
      if (params.fileType == "Image") {
        //调用图片发送接口
        IMSendHandler = this.sendImageMessage;
      }
      if (params.fileType == "Video") {
        //          IMSendHandler = this.sendVideoMessage;
      }
      if (params.fileType == "Audio") {
        IMSendHandler = this.sendAudioMessage;
        IMMessageWrapperHandler = function(message, uploadResp) {
          message = IMMessageWrapperDefaultHandler(message, uploadResp);
          //语音文件需要设置播放时长
          message.voiceSecond = uploadResp.Data.Second;
          return message;
        };
      }
      //实现发送文件消息
      SendMessage = function(message, uploadResp) {
        //将上传的结果包装到当前消息上（不同的消息包装方式不一样）
        message = IMMessageWrapperHandler(message, uploadResp);
        message._msg.status = -1;
        //完成上传完成之后(调用服务端接口发送文件，IM客户端不支持发送文件)
        let msgobj = {
          ChanndlId: self.room.ChannelID,
          FileMD5: message.FileMd5
        }
        if (params.fileType === 'File') {
          msgobj.FileSize = params.file.size
          msgobj.FileName = params.file.name
        }
        if (params.fileType === 'Audio') {
          msgobj.FileSize = params.file.size
          msgobj.Second = uploadResp.Data.Second
        }
        if (params.fileType === 'Image') {
          msgobj.FileUrl = message.FileUrl
        }
        IMSendHandler(msgobj)
          .then(() => {
            message._msg.status = 1;
          })
          .catch(e => {
            message.status = 0;
          });
      };
      // 写入消息记录
      var message = GetMessage(params);
      this.messages.push(message);
      this.scrollMessageContentToBottom();
      //开始上传文件
      FileUpload();
    },
    /*上传文件  */
    onUploadFile(event) {
      var uploadFile = event.currentTarget;
      // 转化为MB
      let size = Math.ceil(uploadFile.size / 1024 / 1024);

      // 上传文件大小不能大于15M
      if (size >= 15) {
        Toast.info("上传的文件大于10M, 请重新选择文件", 1500);
        return;
      }
      for (var i = 0; i < uploadFile.files.length; i++) {
        //触发文件上传
        uploader.onFileUpload(uploadFile.files[i], this.onUpload);
      }
      document.forms["webuploader_form"].reset();
    },
    // 字节转换
    bytesToSize(bytes) {
      if (bytes === 0) return "0 B";
      var k = 1000, // or 1024
        sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
        i = Math.floor(Math.log(bytes) / Math.log(k));
      return (bytes / Math.pow(k, i)).toPrecision(3) + " " + sizes[i];
    },
    // 发送消息
    onSendMessage() {
      var _this = this;
      if (!this.text) {
        return;
      }
      // 获取自己的对话
      let replyContent = this.text;
      //检查是否能够发送
      if (!this.room.messageMgr.checkSendMsg(replyContent)) {
        console.warn("内容为空");
        return;
      }
      //正在发送中则返回
      if (this.Sending) {
        console.log("正在发送中");
        return;
      }
      //设置当前状态为正在发送中，避免重复提交
      this.Sending = true;
      //发送消息
      this.room.messageMgr.sendMsg(
        replyContent,
        msg => {
          console.log("发送成功");
          // 表情框隐藏
          this.Sending = false;
          this.emotionShow = false;
          this.text = "";
          _this.addMsgContentToBottom();
          //添加消息到聊天记录中
          this.appendToMessages(msg, false);
        },
        (msg, error) => {
          this.Sending = false;

          if (error) {
            Toast.info("发送失败", 1500);
            console.error(error);
          }
        }
      );
    },
    scrollMessageContentToBottom() {
      const confirmBottom = 50; // 确认滚动到底部给出的随便值
      this.$nextTick(() => {
        setTimeout(() => {
          let chatDom = this.$refs.chatDom;
          if (chatDom.children !== undefined) {
            var scrollHeight = 0;
            for (var i = 0; i < chatDom.children.length; i++) {
              scrollHeight +=
                chatDom.children[i].offsetHeight +
                LI_MARGIN_TOP +
                confirmBottom;
            }
            chatDom.scrollTop = scrollHeight;
            this.err = chatDom.scrollTop;
          }
        }, 300);
      });
    },
    addMsgContentToBottom() {
      this.$nextTick(() => {
        let chatDom = this.$refs.chatDom;
        if (chatDom.children !== undefined) {
          var words = document.getElementById("words");
          var lastLi = chatDom.children[chatDom.children.length - 1];
          words.blur();
          // 防止数据未更新
          setTimeout(() => {
            this.lastLIHeight = lastLi.offsetHeight + LI_MARGIN_TOP;
            chatDom.scrollTop += this.lastLIHeight;
          }, 300);
        }
      });
    }
  },
  computed: {
    ...mapState(["mediaInfo", "roomInfo", "messages"]),
    EmotionPicData() {
      return this.room.messageMgr && this.room.messageMgr.EmotionPicData;
    }
  },
  destroyed() {
    // this.removeTouchHandler()
    this.unsubscribeEvent();
  }
};
</script>

<style lang='scss' scoped>
@import "../style/index.scss";

.chat {
  position: relative;
  height: 100%;
  .err {
    position: absolute;
    z-index: 20;
    top: 40px;
    left: 50%;
  }
  .content {
    position: absolute;
    top: 0;
    bottom: 116px;
    overflow: scroll;
    width: 100%;
    padding: 24px;
    background-color: #ededed;
    .wrap {
      display: block;
      margin-bottom: 20px;
      .msg {
        display: block;
        word-break: break-all;
        max-width: 80%;
        background-color: #fff;
        padding: 30px 30px;
        position: relative;
        border-radius: 10px;
        box-shadow: 0px 0px 20px 0px #b7b7b6;
      }
    }
    .self {
      float: right;
      background-color: #26B7BC !important;
      color: #fff;
      &:before {
        display: block;
        content: "";
        border-width: 8px;
        border-style: solid;
        border-color: transparent transparent transparent $white;
        position: absolute;
        right: -16px;
        top: -16px;
      }
    }
    .other {
      float: left;
      &:before {
        display: block;
        content: "";
        border-width: 8px;
        border-style: solid;
        border-color: transparent $white transparent transparent;
        position: absolute;
        left: -8px;
        top: 16px;
      }
    }
  }
  .popExpression {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    padding: 8px;
    background-color: $white;
    border: 1px solid #f6f6f6;
    position: absolute;
    bottom: 116px;
    right: 0;
    text-align: center;
    li {
      padding: 9px;
    }
  }
  .entry {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 116px;
    background-color: #f6f6f6;
    padding: 0 12px;
    border-top: 2px solid $border-color;
    & span {
      display: inline-block;
      width: 64px;
      height: 64px;
    }
    .speaker {
      display: inline-block;
      width: 64px;
      height: 64px;
      margin-right: 10px;
      @include bg-image(speak_icon);
    }
    .expression {
      margin-left: 10px;
      @include bg-image(expression_icon);
    }
    .addImgBtn {
      display: block;
    }
    .webuploader {
      position: relative;
      .form-control {
        width: 74px;
        height: 64px;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
        opacity: 0;
      }
      .add {
        vertical-align: top;
        margin-left: 10px;
        @include bg-image(add_icon);
      }
    }
    .message {
      width: 66%;
      .words {
        text-indent: 0.5em;
        width: 60%;
        word-break: break-all;
        width: 100%;
        min-height: 70px;
        background-color: #fff;
        border: none;
        border-radius: 6px;
        font-size: 28px;
        border: 1px solid #dedede;
        outline: none;
      }
    }
  }
  .ml-10 {
    margin-left: 10px;
  }
  .mr-10 {
    margin-right: 10px;
  }
  .content {
    padding-left: 20px;
    padding-right: 20px;
    .other {
      &:before {
        display: block;
        content: "";
        border-width: 12px;
        border-style: solid;
        border-color: transparent #fff transparent transparent;
        position: absolute;
        left: -24px;
        top: 24px;
      }
    }
    .self {
      &:before {
        display: block;
        content: "";
        border-width: 12px;
        border-style: solid;
        border-color: transparent transparent transparent #26b7bc;
        position: absolute;
        right: -24px;
        top: 24px;
      }
    }
    .wrap {
      display: flex;
      &.avatarLeft {
        .avatar {
          margin-right: 20px;
        }
      }
      &.avatarRight {
        justify-content: flex-end;
        .avatar {
          margin-left: 20px;
        }
      }
    }
  }
  .avatar {
    width: 88px;
    height: 88px;
    background-size: contain;
    border-radius: 100%;
  }
  .send-btn {
    flex: 0 0 80px;
    display: flex !important;
    align-items: center;
    justify-content: center;
    background-color: #26B7BC;
    border-radius: 4px;
    color: #fff;
    margin-left: 10px;
  }
}
</style>
