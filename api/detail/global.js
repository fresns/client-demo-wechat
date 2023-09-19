/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { request } from '../tool/request';

const global = {
  /**
   * 客户端状态
   * @return {wx.RequestTask}
   */
  globalStatus: () => {
    return request({
      url: '/status.json',
      data: {
        timestamp: Date.now(),
      },
    });
  },

  /**
   * 全局配置信息
   * @return {wx.RequestTask}
   */
  globalConfigs: (options = {}) => {
    return request({
      url: '/api/v2/global/configs',
      data: {
        ...options,
      },
    });
  },

  /**
   * 状态码信息
   * @return {wx.RequestTask}
   */
  globalCodeMessages: (options = {}) => {
    return request({
      url: '/api/v2/global/code-messages',
      data: {
        ...options,
      },
    });
  },

  /**
   * 扩展频道
   * @return {wx.RequestTask}
   */
  globalChannels: () => {
    return request({
      url: '/api/v2/global/channels',
    });
  },

  /**
   * 扩展档案配置
   * @param {string} options.type user,group,hashtag,post,comment
   * @return {wx.RequestTask}
   */
  globalArchives: (options = {}) => {
    return request({
      url: '/api/v2/global/' + options.type + '/archives',
      data: {
        ...options,
      },
    });
  },

  /**
   * 上传用的令牌
   * @return {wx.RequestTask}
   */
  globalUploadToken: (options = {}) => {
    return request({
      url: '/api/v2/global/upload-token',
      data: {
        ...options,
      },
    });
  },

  /**
   * 用户角色
   * @return {wx.RequestTask}
   */
  globalRoles: (options = {}) => {
    return request({
      url: '/api/v2/global/roles',
      data: {
        ...options,
      },
    });
  },

  /**
   * 地图服务商
   * @return {wx.RequestTask}
   */
  globalMaps: (options = {}) => {
    return request({
      url: '/api/v2/global/maps',
      data: {
        ...options,
      },
    });
  },

  /**
   * 内容类型
   * @param {string} options.type post, comment
   * @return {wx.RequestTask}
   */
  globalContentTypes: (options = {}) => {
    return request({
      url: '/api/v2/global/' + options.type + '/content-types',
      data: {
        ...options,
      },
    });
  },

  /**
   * 表情图
   * @return {wx.RequestTask}
   */
  globalStickers: (options = {}) => {
    return request({
      url: '/api/v2/global/stickers',
      data: {
        ...options,
      },
    });
  },

  /**
   * 处理词列表
   * @return {wx.RequestTask}
   */
  globalBlockWords: (options = {}) => {
    return request({
      url: '/api/v2/global/block-words',
      data: {
        ...options,
      },
    });
  },
};

module.exports = global;
