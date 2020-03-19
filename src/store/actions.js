import ajax from '../common/ajax'
import { Toast } from 'mand-mobile'
import API from '../api/api'

export default {
  // 获取登录信息
  async getLoginInfo({ commit }) {
    const identifier = await API.getIMId()
    const params = {
      identifier
    }
    let res = await ajax('get', '/v1/Config', params);
    commit('GET_LOGIN_INFO', res);
  },
  // 获取多媒体配置
  async getMediaInfo({ commit, state }, id) {
    const params = {
      ChannelID: id,
      Identifier: state.loginInfo.Identifier
    };
    const res = await ajax('get', '/v1/MediaConfig', params)
    commit('GET_MEDIA_INFO', res)
  },
  // 获取用户信息
  async getUserInfo({ commit, state }, id) {
    const params = {
      ChannelID: id,
      Identifiers: [state.loginInfo.Identifier]
    };
    const res = await ajax('post', '/v1/Users', params)
    commit('GET_USER_INFO', res)
  },
  // 获取会话
  async getSession({ commit, state }, params) {
    const res = await ajax('get', '/v1/GetSessions', params, true)
    commit('GET_SESSION', res)
  },
  // 获取房间状态
  async getRoomState({ commit, state }, params) {
    const res = await ajax('get', '/v1/Room/State', params)
    commit('GET_ROOM_STATE', res)
  },
  // 获取房间信息
  async getRoomInfo({ commit, state }, id) {
    const params = {
      ChannelID: id,
      identifier: state.loginInfo.Identifier
    };
    try {
      const res = await ajax('get', '/v1/Room', params)
      commit('ROOM_INFO', res)
    }
    catch (e) {
      errToast('获取房间信息失败', 1500)
    }
  },
  // 修改房间状态
  async changeRoomState({ commit, state }, params) {
    try {
      const res = await ajax('put', '/v1/Room/State', params)
      commit('CHANGE_ROOM_STATE', res)
    }
    catch (e) {
      errToast('修改房间信息失败', 1500)
    }
  },
  // 发送文件信息
  async sendFileMsg({ commit, state }, params) {
    params.Identifier = state.loginInfo.Identifier
    try {
      const res = await ajax('post', '/v1/Message/SendFileMessage', params)
      commit('SEND_FILE_STATE', res)
    }
    catch (e) {
      errToast('发送文件失败', 1500)
    }
  },
  // 发送音频消息
  async sendAudioMsg({ commit, state }, params) {
    params.Identifier = state.loginInfo.Identifier
    try {
      const res = await ajax('post', '/v1/Message/SendAudioMessage', params)
      commit('SEND_AUDIO_STATE', res)
    }
    catch (e) {
      errToast('发送音频失败', 1500)
    }
  },
  // 发送图片消息
  async sendImageMsg({ commit, state }, params) {
    params.Identifier = state.loginInfo.Identifier
    try {
      const res = await ajax('post', '/v1/Message/SendImageMessage', params)
      commit('SEND_IMAGE_SATTE', res)
    }
    catch (e) {
      errToast('发送图片失败', 1500)
    }
  }
}


function errToast(msg) {
  if (typeof msg !== 'string') {
    return
  }

  Toast.info(msg, 1500);
}
