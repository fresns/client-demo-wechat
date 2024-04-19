/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { request } from '../tool/request';

const message = {
  /**
   * [通知]获取消息列表
   * @return {wx.RequestTask}
   */
  notificationList: (options = {}) => {
    return request({
      url: '/api/v2/notification/list',
      data: {
        ...options,
      },
    });
  },

  /**
   * [通知]更新阅读状态
   * @return {wx.RequestTask}
   */
  notificationMarkAsRead: (options = {}) => {
    return request({
      url: '/api/v2/notification/mark-as-read',
      data: {
        ...options,
      },
      method: 'PUT',
    });
  },

  /**
   * [通知]删除消息
   * @return {wx.RequestTask}
   */
  notificationDelete: (options = {}) => {
    return request({
      url: '/api/v2/notification/delete',
      data: {
        ...options,
      },
      method: 'DELETE',
    });
  },

  /**
   * [对话]获取对话列表
   * @return {wx.RequestTask}
   */
  conversationList: (options = {}) => {
    return request({
      url: '/api/v2/conversation/list',
      data: {
        ...options,
      },
    });
  },

  /**
   * [对话]获取对话详情
   * @return {wx.RequestTask}
   */
  conversationDetail: (options = {}) => {
    return request({
      url: '/api/v2/conversation/' + options.conversationId + '/detail',
      data: {
        ...options,
      },
    });
  },

  /**
   * [对话]获取消息列表
   * @return {wx.RequestTask}
   */
  conversationMessages: (options = {}) => {
    return request({
      url: '/api/v2/conversation/' + options.conversationId + '/messages',
      data: {
        ...options,
      },
    });
  },

  /**
   * [对话]置顶对话
   * @return {wx.RequestTask}
   */
  conversationPin: (options = {}) => {
    return request({
      url: '/api/v2/conversation/pin',
      data: {
        ...options,
      },
      method: 'PUT',
    });
  },

  /**
   * [对话]更新阅读状态
   * @return {wx.RequestTask}
   */
  conversationMarkAsRead: (options = {}) => {
    return request({
      url: '/api/v2/conversation/mark-as-read',
      data: {
        ...options,
      },
      method: 'PUT',
    });
  },

  /**
   * [对话]发送消息
   * @return {wx.RequestTask}
   */
  conversationSendMessage: (options = {}) => {
    return request({
      url: '/api/v2/conversation/send-message',
      data: {
        ...options,
      },
      method: 'POST',
    });
  },

  /**
   * [对话]删除对话或对话的消息
   * @return {wx.RequestTask}
   */
  conversationDelete: (options = {}) => {
    return request({
      url: '/api/v2/conversation/delete',
      data: {
        ...options,
      },
      method: 'DELETE',
    });
  },
};

export default message;
