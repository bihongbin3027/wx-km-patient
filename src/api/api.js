import { Toast } from 'mand-mobile'
import Server from './server'

class API extends Server {
  /**
   *  用途：获取我的订单列表
   *  @method post
   *  @return {}
   */
  async myOrders(params) {
    try {
      let result = await this.axios('post', '/wx/user/myOrders', {
        data: params
      })
      if (result && result.code === '1') {
        return result.rows
      } else {
        let err = {
          tip: '获取我的订单列表失败',
          response: result,
          url: '/wx/user/myOrders'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1500)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：按ID获取订单详情
   *  @method post
   *  @return {}
   */
  async getOrderById(params) {
    try {
      let result = await this.axios('post', '/wx/user/getOrderById', {
        data: params
      })
      if (result && result.code === '1') {
        return result.rows
      } else {
        let err = {
          tip: '按ID获取订单详情失败',
          response: result,
          url: '/wx/user/getOrderById'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1500)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：发起支付
   *  @method post
   *  @return {}
   */
  async pay(params) {
    try {
      let result = await this.axios('post', '/wx/user/pay', {
        data: params
      })
      if (result && result.code === '1') {
        return result.rows
      } else {
        let err = {
          tip: '发起支付失败',
          response: result,
          url: '/wx/user/pay'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1500)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：发送手机获取验证码
   *  @method post
   *  @return {}
   */
  async sendPhoneGetCode(params) {
    try {
      let result = await this.axios('post', '/wx/user/sendPhoneGetCode', {
        data: params
      })
      if (result && result.code === '1') {
        return result.rows
      } else {
        let err = {
          tip: '发送手机获取验证码失败',
          response: result,
          url: '/wx/user/sendPhoneGetCode'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1500)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：手机绑定登录
   *  @method post
   *  @return {}
   */
  async loginByPhone(params) {
    try {
      let result = await this.axios('post', '/wx/user/loginByPhone', {
        data: params
      })
      if (result && result.code === '1') {
        return result.rows
      } else {
        let err = {
          tip: '手机绑定登录失败',
          response: result,
          url: '/wx/user/loginByPhone'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1500)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：获取我的医生
   *  @method post
   *  @return {}
   */
  async getMyDotors(params) {
    try {
      let result = await this.axios('post', '/wx/user/getMyDotors', {
        data: params
      })
      if (result && result.code === '1') {
        return result.rows
      } else {
        let err = {
          tip: '获取我的医生失败',
          response: result,
          url: '/wx/user/getMyDotors'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1500)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：查询处方pdf
   *  @method post
   *  @return {}
   */
  async getRescriptionPdfUrl(params) {
    try {
      let result = await this.axios('post', '/wx/user/getRescriptionPdfUrl', {
        data: params
      })
      if (result && result.code === '1') {
        return result.rows
      } else {
        let err = {
          tip: '查询处方pdf失败',
          response: result,
          url: '/wx/user/getRescriptionPdfUrl'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1500)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：添加地址
   *  @method post
   *  @return {}
   */
  async addAddress(params) {
    try {
      let result = await this.axios('post', '/wx/user/addAddress', {
        data: params
      })
      if (result && result.code === '1') {
        return result.rows
      } else {
        let err = {
          tip: '添加地址失败',
          response: result,
          url: '/wx/user/addAddress'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1500)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：修改地址
   *  @method post
   *  @return {}
   */
  async editAddress(params) {
    try {
      let result = await this.axios('post', '/wx/user/editAddress', {
        data: params
      })
      if (result && result.code === '1') {
        return result.rows
      } else {
        let err = {
          tip: '修改地址失败',
          response: result,
          url: '/wx/user/editAddress'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1500)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：查询地址
   *  @method post
   *  @return {}
   */
  async getAddressList(params) {
    try {
      let result = await this.axios('post', '/wx/user/getAddressList', {
        data: params
      })
      if (result && result.code === '1') {
        return result.rows
      } else {
        let err = {
          tip: '查询地址失败',
          response: result,
          url: '/wx/user/getAddressList'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1500)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：删除地址
   *  @method post
   *  @return {}
   */
  async delAddress(params) {
    try {
      let result = await this.axios('post', '/wx/user/delAddress', {
        data: params
      })
      if (result && result.code === '1') {
        return result.rows
      } else {
        let err = {
          tip: '删除地址失败',
          response: result,
          url: '/wx/user/delAddress'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1500)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：添加家庭成员
   *  @method post
   *  @return {}
   */
  async addFamilyMemberVO(params) {
    try {
      let result = await this.axios('post', '/wx/user/addFamilyMemberVO', {
        data: params
      })
      if (result && result.code === '1') {
        return result.rows
      } else {
        let err = {
          tip: '添加家庭成员失败',
          response: result,
          url: '/wx/user/addFamilyMemberVO'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1500)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：删除家庭成员
   *  @method post
   *  @return {}
   */
  async delFamilyMemberVOById(params) {
    try {
      let result = await this.axios('post', '/wx/user/delFamilyMemberVOById', {
        data: params
      })
      if (result && result.code === '1') {
        return result.rows
      } else {
        let err = {
          tip: '删除家庭成员失败',
          response: result,
          url: '/wx/user/delFamilyMemberVOById'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1500)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：查询家庭成员
   *  @method post
   *  @return {}
   */
  async getFamilyMemberList(params) {
    try {
      let result = await this.axios('post', '/wx/user/getFamilyMemberList', {
        data: params
      })
      if (result && result.code === '1') {
        return result.rows
      } else {
        let err = {
          tip: '查询家庭成员失败',
          response: result,
          url: '/wx/user/getFamilyMemberList'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1500)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：发送家庭成员手机号码
   *  @method post
   *  @return {}
   */
  async sendCodeRedPassword(params) {
    try {
      let result = await this.axios('post', '/wx/user/sendCodeRedPassword', {
        data: params
      })
      if (result && result.code === '1') {
        return result.rows
      } else {
        let err = {
          tip: '发送家庭成员手机号码失败',
          response: result,
          url: '/wx/user/sendCodeRedPassword'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1500)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：按ID查询医生详情
   *  @method post
   *  @return {}
   */
  async getMyDotorById(params) {
    try {
      let result = await this.axios('post', '/wx/user/getMyDotorById', {
        data: params
      })
      if (result && result.code === '1') {
        return result.rows
      } else {
        let err = {
          tip: '按ID查询医生详情失败',
          response: result,
          url: '/wx/user/getMyDotorById'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1500)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：关注医生
   *  @method post
   *  @return {}
   */
  async foucusDoctor(params) {
    try {
      let result = await this.axios('post', '/wx/user/foucusDoctor', {
        data: params
      })
      if (result && result.code === '1') {
        return result.rows
      } else {
        let err = {
          tip: '关注医生失败',
          response: result,
          url: '/wx/user/foucusDoctor'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1500)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：取消关注医生
   *  @method post
   *  @return {}
   */
  async unFoucusDoctor(params) {
    try {
      let result = await this.axios('post', '/wx/user/unFoucusDoctor', {
        data: params
      })
      if (result && result.code === '1') {
        return result.rows
      } else {
        let err = {
          tip: '取消关注医生失败',
          response: result,
          url: '/wx/user/unFoucusDoctor'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1500)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：分页获取我的订单列表
   *  @method post
   *  @return {}
   */
  async myOrders(params) {
    try {
      let result = await this.axios('post', '/wx/user/myOrders', {
        data: params
      })
      if (result && result.code === '1') {
        return result.rows
      } else {
        let err = {
          tip: '分页获取我的订单列表失败',
          response: result,
          url: '/wx/user/myOrders'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1500)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
 *  用途：取消订单
 *  @method post
 *  @return {}
 */
  async cancle(params) {
    try {
      let result = await this.axios('post', '/wx/user/cancle', {
        data: params
      })
      if (result && result.code === '1') {
        return result.rows
      } else {
        let err = {
          tip: '取消订单失败',
          response: result,
          url: '/wx/user/cancle'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1500);
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
 *  用途：获取用户资料
 *  @method post
 *  @return {}
 */
  async getUserInfo(params) {
    try {
      let result = await this.axios('post', '/wx/user/getUserInfo', {
        data: params
      })
      if (result && result.code === '1') {
        return result.rows
      } else {
        let err = {
          tip: '获取用户资料失败',
          response: result,
          url: '/wx/user/getUserInfo'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1500);
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
 *  用途：提交用户资料
 *  @method post
 *  @return {}
 */
  async updateUserInfoJJ(params) {
    try {
      let result = await this.axios('post', '/wx/user/updateUserInfoJJ', {
        data: params
      })
      if (result && result.code === '1') {
        return result.rows
      } else {
        let err = {
          tip: '提交用户资料失败',
          response: result,
          url: '/wx/user/updateUserInfoJJ'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1500);
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
 *  用途：创建IM聊天房间
 *  @method post
 *  @return {}
 */
  async createIMRoom(params) {
    try {
      let result = await this.axios('post', '/wx/user/createIMRoom', {
        data: params
      })
      if (result && result.code === '1') {
        return result.rows
      } else {
        let err = {
          tip: '创建IM聊天房间失败',
          response: result,
          url: '/wx/user/createIMRoom'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1500);
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
 *  用途：获取IM用户标识
 *  @method post
 *  @return {}
 */
  async getIMId(params) {
    try {
      let result = await this.axios('post', '/wx/user/getIMId', {
        data: params
      })
      if (result && result.code === '1') {
        return result.rows
      } else {
        let err = {
          tip: '获取IM用户标识失败',
          response: result,
          url: '/wx/user/getIMId'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1500);
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
 *  用途：咨询下单
 *  @method post
 *  @return {}
 */
  async placeConsultOrder(params) {
    try {
      let result = await this.axios('post', '/wx/user/placeConsultOrder', {
        data: params
      })
      if (result && result.code === '1') {
        return result.rows
      } else {
        let err = {
          tip: '咨询下单失败',
          response: result,
          url: '/wx/user/placeConsultOrder'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1500);
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
 *  用途：咨询下单
 *  @method post
 *  @return {}
 */
  async getMemberConsultByOrderId(params) {
    try {
      let result = await this.axios('post', '/wx/user/getMemberConsultByOrderId', {
        data: params
      })
      if (result && result.code === '1') {
        return result.rows
      } else {
        let err = {
          tip: '咨询下单失败',
          response: result,
          url: '/wx/user/getMemberConsultByOrderId'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1500);
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：图片上传
   *  @method post
   *  @return {}
   */
  async useruploadFiles(params) {
    try {
      let result = await this.axios('post', '/wx/user/uploadFiles', {
        data: params
      })
      if (result && result.code === '1') {
        return result.rows
      } else {
        let err = {
          tip: '图片上传失败',
          response: result,
          url: '/wx/user/uploadFiles'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1500);
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：支付药品订单的患者地址相关
   *  @method post
   *  @return {}
   */
  async editOrderAddress(params) {
    try {
      let result = await this.axios('post', '/wx/user/editOrderAddress', {
        data: params
      })
      if (result && result.code === '1') {
        return result.rows
      } else {
        let err = {
          tip: '支付药品订单的患者地址相关',
          response: result,
          url: '/wx/user/editOrderAddress'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1500);
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：IM患者端心跳发送
   *  @method post
   *  @return {}
   */
  async sendHeartBit(params) {
    try {
      let result = await this.axios('post', '/wx/user/sendHeartBit', {
        data: params
      })
      if (result && result.code === '1') {
        return result.rows
      } else {
        let err = {
          tip: 'IM患者端心跳发送失败',
          response: result,
          url: '/wx/user/sendHeartBit'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1500);
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

}

export default new API()
