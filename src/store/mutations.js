import {
  GET_LOGIN_INFO,
  GET_MEDIA_INFO,
  GET_USER_INFO,
  GET_SESSION,
  ROOM_STATE,
  ROOM_INFO,
  CHANGE_ROOM_STATE,
  SEND_FILE_STATE,
  SEND_AUDIO_STATE,
  SEND_IMAGE_SATTE,
  MESSAGE,
  UPDATE_SESSION,
  UPDATE_SESSION_COUNT,
} from './mutations_type'

export default {
  [GET_LOGIN_INFO] (state, payload) {
    state.loginInfo = payload;
  },
  [GET_MEDIA_INFO] (state, payload) {
    state.mediaInfo = payload
  },
  [GET_USER_INFO] (state, payload) {
    state.userInfo = payload
  },
  [GET_SESSION] (state, payload) {
    state.getSession = payload
  },
  [ROOM_STATE] (state, payload) {
    state.roomState = payload
  },
  [ROOM_INFO] (state, payload) {
    state.roomInfo = payload
  },
  [CHANGE_ROOM_STATE] (state, payload) {
    state.updateRoomState = payload
  },
  [SEND_FILE_STATE] (state, payload) {
    state.sendFileMsg = payload
  },
  [SEND_AUDIO_STATE] (state, payload) {
    state.sendAudioMsg = payload
  },
  [SEND_IMAGE_SATTE] (state, payload) {
    state.sendImgMsg = payload
  },
  [MESSAGE] (state, msg) {
    state.messages = msg
  },
  [UPDATE_SESSION] (state, {
    sessionId,
    msg
  }) {
    for(let i = 0; i< state.getSession.length; i++) {
      if(state.getSession[i].ChannelID == sessionId) {
        state.getSession[i].MessageContent.MsgContent = msg.elems[msg.elems.length-1].content
        state.getSession[i].MessageContent.MsgType = msg.elems[msg.elems.length-1].type
      }
    }
  },
  [UPDATE_SESSION_COUNT] (state, {
    sessionId,
    unreadCount
  }) {
    for(let i = 0; i< state.getSession.length; i++) {
      if(state.getSession[i].ChannelID == sessionId) {
        state.getSession[i].MessageCount = unreadCount
      }
    }
  }
}
