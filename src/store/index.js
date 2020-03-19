import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

Vue.use(Vuex);

const state = {
  loginInfo: null, // 登录信息
  mediaInfo: null,  // 多媒体信息
  userInfo: null,  //用户信息
  getSession: null, // 获取会话
  roomState: null, // 房间状态
  roomInfo: null, // 获取房间信息
  messages: [],
  updateRoomState: false,
  sendFileMsg: null,
  sendAudioMsg: null,
  sendImgMsg: null,
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
