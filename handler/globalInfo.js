import * as Api from '../api/api'
import { getConfigItemByItemKey } from '../api/tool/replace-key'
import { base64_encode } from '../libs/base64/base64'
import { navigateToSignin } from '../util/navigateToSignin'

export class GlobalInfo {
  // 网站类型，是 public 还是 private
  siteMode = null
  // 是否是暗黑模式
  isDarkMode = null
  // 设备信息
  deviceInfo = {}
  // 用户数据
  loginUser = null
  // 当前登录的 member 身份
  loginMember = null
  // 当前选中的身份 id，不选用对象，防止与 loginUser 中 member 参数不一致
  currentMemberId = null

  waitingLoginResolveQueue = []

  async init () {
    await Promise.all([
      this._initSiteMode(),
      this._initSystemInfo(),
    ])
  }

  /**
   * 刷新当前登录用户
   * @returns {Promise<void>}
   */
  async getLoginUser () {
    if (!this.uid || !this.mid || !this.token) {
      navigateToSignin()
      return
    }

    try {
      const userDetailRes = await Api.user.userDetail()
      if (userDetailRes.code === 0) {
        this.loginUser = userDetailRes.data
        await this.selectMember(userDetailRes.data.members.find(member => member.mid === wx.getStorageSync('mid')))
      }
      Object.assign(getApp().globalData, this.values())
    } catch (e) {
      navigateToSignin()
    }
  }

  /**
   * 选择用户
   * @param member
   * @param passwordStr
   * @returns {Promise<void>}
   */
  async selectMember (member, passwordStr = '') {
    const memberAuthRes = await Api.member.memberAuth(Object.assign({
      mid: member.mid,
    }, member.password && {
      password: passwordStr,
    }))

    if (memberAuthRes.code === 0) {
      wx.setStorageSync('token', memberAuthRes.data.token)
      wx.setStorageSync('mid', member.mid)

      this.loginMember = memberAuthRes.data
      this.currentMemberId = member.mid

      this.waitingLoginResolveQueue.forEach(v => v())
      this.waitingLoginResolveQueue = []
    }
  }

  /**
   * 重新获取登录状态
   * @param params
   * @returns {Promise<boolean>}
   */
  async login (params) {
    this._clearLoginStatus()
    const loginRes = await Api.user.userLogin(params)
    switch (loginRes.code) {
      case 0: {
        wx.setStorageSync('token', loginRes.data.token)
        wx.setStorageSync('uid', loginRes.data.uid)
        this.loginUser = loginRes.data
        // default select first member
        await this.selectMember(loginRes.data.members[0])
        Object.assign(getApp().globalData, this.values())
        return true
      }
      default: {
        wx.removeStorageSync('token')
        wx.removeStorageSync('uid')
        return false
      }
    }
  }

  /**
   * 阻塞状态直到用户完成整个登录
   * @returns {Promise<unknown>}
   */
  async awaitLogin () {
    return new Promise(resolve => {
      if (this.loginUser && this.loginMember) {
        resolve()
      } else {
        this.waitingLoginResolveQueue.push(resolve)
        this.getLoginUser()
      }
    })
  }

  _clearLoginStatus () {
    wx.removeStorageSync('token')
    wx.removeStorageSync('uid')
    wx.removeStorageSync('mid')
    this.loginUser = null
    this.loginMember = null
    this.currentMemberId = null
  }

  values () {
    return {
      siteMode: this.siteMode,
      isDarkMode: this.isDarkMode,
      deviceInfo: this.deviceInfo,
      loginUser: this.loginUser,
      loginMember: this.loginMember,
      currentMemberId: this.currentMemberId,
    }
  }

  async _initSiteMode () {
    const siteMode = await getConfigItemByItemKey('site_mode')
    if (siteMode !== null) {
      this.siteMode = siteMode.itemValue
    }
  }

  async _initSystemInfo () {
    const systemInfo = wx.getSystemInfoSync()
    this.isDarkMode = systemInfo.theme === 'dark'
    this.deviceInfo = {
      brand: systemInfo.brand,
      model: systemInfo.model,
    }
  }

  get uid () {
    return wx.getStorageSync('uid') || null
  }

  get token () {
    return wx.getStorageSync('token') || null
  }

  get mid () {
    return wx.getStorageSync('mid') || null
  }

  get isPublicMode () {
    return this.siteMode === 'public'
  }
}

export const globalInfo = new GlobalInfo()
