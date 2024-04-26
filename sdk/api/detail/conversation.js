/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { request } from '../tool/request';

const conversation = {
  /**
   * 获取对话列表
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  list: (options = {}) => {
    return request({
      path: '/api/fresns/v1/conversation/list',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 获取对话详情
   * @param {String} uidOrUsername
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  detail: (uidOrUsername, options = {}) => {
    return request({
      path: '/api/fresns/v1/conversation/' + uidOrUsername + '/detail',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 获取消息列表
   * @param {String} uidOrUsername
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  messages: (uidOrUsername, options = {}) => {
    return request({
      path: '/api/fresns/v1/conversation/' + uidOrUsername + '/messages',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 置顶对话
   * @param {String} uidOrUsername
   * @return {wx.RequestTask}
   */
  pin: (uidOrUsername) => {
    return request({
      path: '/api/fresns/v1/conversation/' + uidOrUsername + '/pin',
      method: 'PATCH',
      data: {},
    });
  },

  /**
   * 更新阅读状态
   * @param {String} uidOrUsername
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  markAsRead: (uidOrUsername, options = {}) => {
    return request({
      path: '/api/fresns/v1/conversation/' + uidOrUsername + '/read-status',
      method: 'PATCH',
      data: {
        ...options,
      },
    });
  },

  /**
   * 删除消息
   * @param {String} uidOrUsername
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  delete: (uidOrUsername, options = {}) => {
    return request({
      path: '/api/fresns/v1/conversation/' + uidOrUsername,
      method: 'DELETE',
      data: {
        ...options,
      },
    });
  },

  /**
   * 发送消息
   * @param {String} uidOrUsername
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  sendMessage: (options = {}) => {
    return request({
      path: '/api/fresns/v1/conversation/message',
      method: 'POST',
      data: {
        ...options,
      },
    });
  },
};

export default conversation;
