/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import * as Api from '../api/api'
import { getConfigItemByItemKey } from '../api/tool/replace-key'
import { navigateToSignin } from '../util/navigateToSignin'

export class GlobalInfo {
  // 小程序默认系统信息
  systemInfo = null

  // 网站类型，是 public 还是 private
  siteMode = null
  // 当前主题
  theme = null
  // 设备信息
  deviceInfo = {}
  // 用户数据
  loginUser = null
  // 当前登录的 user 身份
  loginUser = null
  // 当前选中的身份 id，不选用对象，防止与 loginUser 中 user 参数不一致
  currentUserId = null

  waitingLoginResolveQueue = []

  async init() {
    await Promise.all([
      this._initSiteMode(),
      this._initSystemInfo(),
    ])
  }

  /**
   * 刷新当前登录用户
   * @returns {Promise<void>}
   */
  async getLoginUser() {
    if (!this.aid || !this.uid || !this.token) {
      navigateToSignin()
      return
    }

    try {
      const userDetailRes = await Api.user.userDetail()
      if (userDetailRes.code === 0) {
        this.loginUser = userDetailRes.data
        await this.selectUser(userDetailRes.data.users.find(user => user.uid === wx.getStorageSync('uid')))
      }
    } catch (e) {
      navigateToSignin()
    }
  }

  /**
   * 选择用户，之后刷新应用 globalData
   * @param user
   * @param passwordStr
   * @returns {Promise<void>}
   */
  async selectUser(user, passwordStr = '') {
    const userAuthRes = await Api.user.userAuth(Object.assign({
      uid: user.uid,
    }, user.password && {
      password: passwordStr,
    }))

    if (userAuthRes.code === 0) {
      wx.setStorageSync('token', userAuthRes.data.token)
      wx.setStorageSync('uid', user.uid)

      this.loginUser = userAuthRes.data
      this.currentUserId = user.uid

      this.waitingLoginResolveQueue.forEach(v => v())
      this.waitingLoginResolveQueue = []

      Object.assign(getApp().globalData, this.values())
    }
    return userAuthRes;
  }

  /**
   * 重新获取登录状态
   * @param params
   * @returns {Promise<boolean>}
   */
  async login(params) {
    this._clearLoginStatus()
    const loginRes = await Api.user.userLogin(params)
    switch (loginRes.code) {
      case 0: {
        wx.setStorageSync('token', loginRes.data.token)
        wx.setStorageSync('aid', loginRes.data.aid)
        this.loginUser = loginRes.data
        if (loginRes.data.users.length === 1) {
          await this.selectUser(loginRes.data.users[0])
          const pages = getCurrentPages()
          pages[pages.length - 2].onLoad()
          wx.navigateBack()
        } else {
          const pages = getCurrentPages()
          pages[pages.length - 2].onLoad()
          wx.redirectTo({
            url: '/pages/user/users',
          })
        }
        return true
      }
      default: {
        wx.removeStorageSync('token')
        wx.removeStorageSync('aid')
        return false
      }
    }
  }

  /**
   * 登出当前用户
   * @returns {Promise<void>}
   */
  async logout() {
    this._clearLoginStatus()
    wx.redirectTo({
      url: '/pages/portal/index',
    })
  }

  /**
   * 阻塞状态直到用户完成整个登录
   * @returns {Promise<unknown>}
   */
  async awaitLogin() {
    return new Promise(resolve => {
      if (this.loginUser && this.loginUser) {
        resolve()
      } else {
        this.waitingLoginResolveQueue.push(resolve)
        this.getLoginUser()
      }
    })
  }

  /**
   * 判断用户是否登录
   */
  isLogin() {
    return this.loginUser && this.loginUser
  }

  _clearLoginStatus() {
    wx.removeStorageSync('token')
    wx.removeStorageSync('aid')
    wx.removeStorageSync('uid')
    this.loginUser = null
    this.loginUser = null
    this.currentUserId = null
  }

  values() {
    return {
      siteMode: this.siteMode,
      theme: this.theme,
      deviceInfo: this.deviceInfo,
      loginUser: this.loginUser,
      loginUser: this.loginUser,
      currentUserId: this.currentUserId,
    }
  }

  async _initSiteMode() {
    const siteMode = await getConfigItemByItemKey('site_mode')
    if (siteMode !== null) {
      this.siteMode = siteMode.itemValue
    }
  }

  async _initSystemInfo() {
    const systemInfo = wx.getSystemInfoSync()
    const networkInfo = wx.getNetworkType()
    const appBaseInfo = wx.getAppBaseInfo()
    this.systemInfo = systemInfo
    this.networkInfo = networkInfo

    this.theme = appBaseInfo.theme
    this.deviceInfo = {
      'brand': systemInfo.brand,
      'model': systemInfo.model,
      'system': systemInfo.system,
      'browser': systemInfo.platform,
      'networkType': networkInfo.networkType,
      'networkIpv4': '',
      'networkIpv6': '',
      'networkPort': '',
      'mapId': null,
      'latitude': null,
      'longitude': null,
      'scale': '',
      'nation': '',
      'province': '',
      'city': '',
      'district': '',
      'adcode': '',
      'positionName': '',
      'address': '',
    }
  }

  get aid() {
    return wx.getStorageSync('aid') || null
  }

  get token() {
    return wx.getStorageSync('token') || null
  }

  get uid() {
    return wx.getStorageSync('uid') || null
  }

  get langTag() {
    const systemLan = this.systemInfo?.language || 'zh_CN'
    if (systemLan === 'zh_CN') {
      return 'zh-Hans'
    }
    if (systemLan === 'zh_TW') {
      return 'zh-Hant'
    }

    return systemLan
  }
}

export const globalInfo = new GlobalInfo()
