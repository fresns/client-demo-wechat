/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
const { request } = require('../tool/request')

const message = {
  /**
   * [会话]删除消息
   * @return {wx.RequestTask}
   */
  dialogDelete: () => {
    return request({
      url: '/api/fresns/dialog/delete',
    })
  },
  /**
   * [会话]发送消息
   * @return {wx.RequestTask}
   */
  dialogSend: () => {
    return request({
      url: '/api/fresns/dialog/send',
    })
  },
  /**
   * [会话]更新阅读状态
   * @return {wx.RequestTask}
   */
  dialogRead: () => {
    return request({
      url: '/api/fresns/dialog/read',
    })
  },
  /**
   * [会话]获取消息列表
   * @return {wx.RequestTask}
   */
  dialogMessages: () => {
    return request({
      url: '/api/fresns/dialog/messages',
    })
  },
  /**
   * [会话]获取会话列表
   * @return {wx.RequestTask}
   */
  dialogLists: () => {
    return request({
      url: '/api/fresns/dialog/lists',
    })
  },
  /**
   * [通知]删除消息
   * @return {wx.RequestTask}
   */
  notifyDelete: () => {
    return request({
      url: '/api/fresns/notify/delete',
    })
  },
  /**
   * [通知]更新阅读状态
   * @return {wx.RequestTask}
   */
  notifyRead: () => {
    return request({
      url: '/api/fresns/notify/read',
    })
  },
  /**
   * [通知]获取消息列表
   * @return {wx.RequestTask}
   */
  notifyLists: (options) => {
    return request({
      url: '/api/fresns/notify/lists',
      data: {
        ...options
      }
    })
  },
}

module.exports = message
