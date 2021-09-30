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
  infoInputTips: () => {
    return request({
      url: '/api/fresns/info/inputTips',
    })
  },
  /**
   * 发送验证码
   * @return {wx.RequestTask}
   */
  infoSendVerifyCode: () => {
    return request({
      url: '/api/fresns/info/sendVerifyCode',
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
      ...options,
    })
  },
}

module.exports = info
