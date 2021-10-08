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
  // 是否是暗黑模式
  isDarkMode = null
  // 当前主题
  theme = null
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
    } catch (e) {
      navigateToSignin()
    }
  }

  /**
   * 选择用户，之后刷新应用 globalData
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

      Object.assign(getApp().globalData, this.values())
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
        if (loginRes.data.members.length === 1) {
          await this.selectMember(loginRes.data.members[0])
          const pages = getCurrentPages()
          pages[pages.length - 2].onLoad()
          wx.navigateBack()
        } else {
          const pages = getCurrentPages()
          pages[pages.length - 2].onLoad()
          wx.redirectTo({
            url: '/pages/user/members',
          })
        }
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
   * 登出当前用户
   * @returns {Promise<void>}
   */
  async logout () {
    this._clearLoginStatus()
    wx.redirectTo({
      url: '/pages/portal/index',
    })
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
      theme: this.theme,
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
    const networkInfo = wx.getNetworkType()
    this.systemInfo = systemInfo
    this.networkInfo = networkInfo

    this.isDarkMode = systemInfo.theme === 'dark'
    this.theme = systemInfo.theme
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

  get uid () {
    return wx.getStorageSync('uid') || null
  }

  get token () {
    return wx.getStorageSync('token') || null
  }

  get mid () {
    return wx.getStorageSync('mid') || null
  }

  get langTag () {
    const systemLan = this.systemInfo?.language || "zh_CN"
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
