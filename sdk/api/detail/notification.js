/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { request } from '../tool/request';

const notification = {
  /**
   * 获取消息列表
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  list: (options = {}) => {
    return request({
      path: '/api/fresns/v1/notification/list',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 更新阅读状态
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  markAsRead: (options = {}) => {
    return request({
      path: '/api/fresns/v1/notification/read-status',
      method: 'PATCH',
      data: {
        ...options,
      },
    });
  },

  /**
   * 删除消息
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  delete: (options = {}) => {
    return request({
      path: '/api/fresns/v1/notification/messages',
      method: 'DELETE',
      data: {
        ...options,
      },
    });
  },
};

export default notification;
