/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { request, uploadFile } from '../tool/request';

const editor = {
  /**
   * 编辑器配置信息
   * @param {String} type post, comment
   * @return {wx.RequestTask}
   */
  configs: (type) => {
    return request({
      path: '/api/fresns/v1/editor/' + type + '/configs',
      method: 'GET',
    });
  },

  /**
   * 直接发表
   * @param {String} type post, comment
   * @param {String} filePath
   * @param {Object} formData
   * @return {wx.RequestTask}
   */
  publish: async (type, filePath = null, formData) => {
    if (filePath) {
      return uploadFile(filePath, {
        path: '/api/fresns/v1/editor/' + type + '/publish',
        method: 'POST',
        data: {
          ...formData,
        },
      });
    }

    return request({
      path: '/api/fresns/v1/editor/' + type + '/publish',
      method: 'POST',
      data: {
        ...formData,
      },
    });
  },

  /**
   * 编辑帖子或评论
   * @param {String} type post, comment
   * @param {String} fsid pid or cid
   * @return {wx.RequestTask}
   */
  edit: (type, fsid) => {
    return request({
      path: '/api/fresns/v1/editor/' + type + '/edit/' + fsid,
      method: 'POST',
    });
  },

  /**
   * 草稿: 创建
   * @param {String} type post, comment
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  draftCreate: (type, options = {}) => {
    return request({
      path: '/api/fresns/v1/editor/' + type + '/draft',
      method: 'POST',
      data: {
        ...options,
      },
    });
  },

  /**
   * 草稿: 列表
   * @param {String} type post, comment
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  draftList: (type, options = {}) => {
    return request({
      path: '/api/fresns/v1/editor/' + type + '/drafts',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 草稿: 详情
   * @param {String} type post, comment
   * @param {String} did
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  draftDetail: (type, did, options = {}) => {
    return request({
      path: '/api/fresns/v1/editor/' + type + '/draft/' + did,
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 草稿: 更新
   * @param {String} type post, comment
   * @param {String} did
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  draftUpdate: (type, did, options = {}) => {
    return request({
      path: '/api/fresns/v1/editor/' + type + '/draft/' + did,
      method: 'PATCH',
      data: {
        ...options,
      },
      draftUpdate: true,
    });
  },

  /**
   * 草稿: 提交发表（或审核）
   * @param {String} type post, comment
   * @param {String} did
   * @return {wx.RequestTask}
   */
  draftPublish: (type, did) => {
    return request({
      path: '/api/fresns/v1/editor/' + type + '/draft/' + did,
      method: 'POST',
    });
  },

  /**
   * 草稿: 撤回审核中草稿
   * @param {String} type post, comment
   * @param {String} did
   * @return {wx.RequestTask}
   */
  draftRecall: (type, did) => {
    return request({
      path: '/api/fresns/v1/editor/' + type + '/draft/' + did,
      method: 'PUT',
    });
  },

  /**
   * 草稿: 删除
   * @param {String} type post, comment
   * @param {String} did
   * @return {wx.RequestTask}
   */
  draftDelete: (type, did) => {
    return request({
      path: '/api/fresns/v1/editor/' + type + '/draft/' + did,
      method: 'DELETE',
    });
  },
};

export default editor;
