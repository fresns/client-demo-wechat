/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { request, uploadFile } from '../tool/request';

const common = {
  /**
   * IP 信息
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  ipInfo: (options = {}) => {
    return request({
      path: '/api/fresns/v1/common/ip-info',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 输入提示信息
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  inputTips: (options = {}) => {
    return request({
      path: '/api/fresns/v1/common/input-tips',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 命令字请求
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  cmdWord: (options = {}) => {
    return request({
      path: '/api/fresns/v1/common/cmd-word',
      method: 'POST',
      data: {
        ...options,
      },
    });
  },

  /**
   * 生成 S3 上传文件令牌
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  fileUploadToken: (options = {}) => {
    return request({
      path: '/api/fresns/v1/common/file/upload-token',
      method: 'POST',
      data: {
        ...options,
      },
    });
  },

  /**
   * 上传文件
   * @param {String} filePath
   * @param {Object} formData
   * @return {wx.RequestTask}
   */
  fileUpload: async (filePath, formData) => {
    return uploadFile({
      path: '/api/fresns/v1/common/file/upload',
      method: 'POST',
      filePath: filePath,
      data: {
        ...formData,
      },
    });
  },

  /**
   * 更新文件信息
   * @param {String} fid 文件 fid
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  fileUpdate: (fid, options = {}) => {
    return request({
      path: '/api/fresns/v1/common/file/' + fid + '/info',
      method: 'PATCH',
      data: {
        ...options,
      },
    });
  },

  /**
   * 文件下载链接
   * @param {String} fid 文件 fid
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  fileLink: (fid, options = {}) => {
    return request({
      path: '/api/fresns/v1/common/file/' + fid + '/link',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 下载过文件的用户
   * @param {String} fid 文件 fid
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  fileUsers: (fid, options = {}) => {
    return request({
      path: '/api/fresns/v1/common/file/' + fid + '/users',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },
};

export default common;
