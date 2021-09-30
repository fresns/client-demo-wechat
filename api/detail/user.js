import { request } from '../tool/request'

const user = {
  /**
   * 钱包交易记录
   * @return {wx.RequestTask}
   */
  userWalletLogs: () => {
    return request({
      url: '/api/fresns/user/walletLogs',
    })
  },
  /**
   * 修改用户资料
   * @return {wx.RequestTask}
   */
  userEdit: () => {
    return request({
      url: '/api/fresns/user/edit',
    })
  },
  /**
   * 用户基本信息
   * @return {wx.RequestTask}
   */
  userDetail: () => {
    return request({
      url: '/api/fresns/user/detail',
    })
  },
  /**
   * 重置密码
   * @return {wx.RequestTask}
   */
  userReset: () => {
    return request({
      url: '/api/fresns/user/reset',
    })
  },
  /**
   * 恢复
   * @return {wx.RequestTask}
   */
  userRestore: () => {
    return request({
      url: '/api/fresns/user/restore',
    })
  },
  /**
   * 注销
   * @return {wx.RequestTask}
   */
  userDelete: () => {
    return request({
      url: '/api/fresns/user/delete',
    })
  },
  /**
   * 退出登录
   * @return {wx.RequestTask}
   */
  userLogout: () => {
    return request({
      url: '/api/fresns/user/logout',
    })
  },
  /**
   * 登录
   * @return {wx.RequestTask}
   */
  userLogin: (options) => {
    return request({
      url: '/api/fresns/user/login',
      data: {
        ...options,
      },
    })
  },
  /**
   * 注册
   * @return {wx.RequestTask}
   */
  userRegister: () => {
    return request({
      url: '/api/fresns/user/register',
    })
  },
}

module.exports = user
