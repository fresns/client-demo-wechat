/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import appConfig from '../../../fresns';
import { request } from '../tool/request';

const global = {
  /**
   * 客户端状态
   * @return {wx.RequestTask}
   */
  status: () => {
    const spaceId = appConfig.spaceId || '';

    if (spaceId) {
      return request({
        path: '/api/fresns/v1/global/status',
        method: 'GET',
        data: {
          timestamp: Date.now(),
        },
      });
    }

    return request({
      path: '/status.json',
      method: 'GET',
      data: {
        timestamp: Date.now(),
      },
    });
  },

  /**
   * 全局配置信息
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  configs: (options = {}) => {
    return request({
      path: '/api/fresns/v1/global/configs',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 语言包信息
   * @return {wx.RequestTask}
   */
  languagePack: () => {
    return request({
      path: '/api/fresns/v1/global/language-pack',
      method: 'GET',
    });
  },

  /**
   * 扩展频道
   * @return {wx.RequestTask}
   */
  channels: () => {
    return request({
      path: '/api/fresns/v1/global/channels',
      method: 'GET',
    });
  },

  /**
   * 扩展档案
   * @param {String} type user, post, comment
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  archives: (type, options = {}) => {
    return request({
      path: '/api/fresns/v1/global/' + type + '/archives',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 内容类型
   * @param {String} type post, comment
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  contentTypes: (type, options = {}) => {
    return request({
      path: '/api/fresns/v1/global/' + type + '/content-types',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 用户角色
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  roles: (options = {}) => {
    return request({
      path: '/api/fresns/v1/global/roles',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 表情图
   * @return {wx.RequestTask}
   */
  stickers: () => {
    return request({
      path: '/api/fresns/v1/global/stickers',
      method: 'GET',
    });
  },
};

export default global;
