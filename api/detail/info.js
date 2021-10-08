/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
const { request } = require('../tool/request')

const info = {
  /**
   * 下载内容文件
   * @return {wx.RequestTask}
   */
  infoDownloadFile: () => {
    return request({
      url: '/api/fresns/info/downloadFile',
    })
  },
  /**
   * 上传交互日志
   * @return {wx.RequestTask}
   */
  infoUploadLog: () => {
    return request({
      url: '/api/fresns/info/uploadLog',
    })
  },
  /**
   * 输入提示查询
   * @return {wx.RequestTask}
   */
  infoInputTips: (options) => {
    return request({
      url: '/api/fresns/info/inputTips',
      data: {
        ...options
      }
    })
  },
  /**
   * 发送验证码
   * @return {wx.RequestTask}
   */
  infoSendVerifyCode: (options) => {
    return request({
      url: '/api/fresns/info/sendVerifyCode',
      data: {
        ...options
      }
    })
  },
  /**
   * 处理词列表
   * @return {wx.RequestTask}
   */
  infoStopWords: () => {
    return request({
      url: '/api/fresns/info/stopWords',
    })
  },
  /**
   * 表情包
   * @return {wx.RequestTask}
   */
  infoEmojis: () => {
    return request({
      url: '/api/fresns/info/emojis',
    })
  },
  /**
   * 全局概述信息
   * @return {wx.RequestTask}
   */
  infoOverview: () => {
    return request({
      url: '/api/fresns/info/overview',
    })
  },
  /**
   * 扩展配置信息
   * @return {wx.RequestTask}
   */
  infoExtensions: (options) => {
    return request({
      url: '/api/fresns/info/extensions',
      data: {
        ...options
      }
    })
  },
  /**
   * 系统配置信息
   * @return {wx.RequestTask}
   */
  infoConfigs: (options) => {
    return request({
      url: '/api/fresns/info/configs',
      data: {
        ...options,
      }
    })
  },
  /**
   * 回调返参查询
   * @return {wx.RequestTask}
   */
  infoCallbacks: (options) => {
    return request({
      url: '/api/fresns/info/callbacks',
      data: {
        ...options,
      }
    })
  },
}

module.exports = info
