/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { request, uploadFile } from '../tool/request';

const editor = {
  /**
   * 快速发表
   * @return {wx.RequestTask}
   */
  editorQuickPublish: async (filePath = null, formData) => {
    if (filePath) {
      return uploadFile(filePath, {
        url: '/api/v2/editor/' + formData.type + '/quick-publish',
        data: {
          ...formData,
        },
        method: 'POST',
      });
    }

    return request({
      url: '/api/v2/editor/' + formData.type + '/quick-publish',
      data: {
        ...formData,
      },
      method: 'POST',
    });
  },

  /**
   * 编辑器配置信息
   * @return {wx.RequestTask}
   */
  editorConfig: (options = {}) => {
    return request({
      url: '/api/v2/editor/' + options.type + '/config',
      data: {
        ...options,
      },
    });
  },

  /**
   * 获取草稿列表
   * @return {wx.RequestTask}
   */
  editorDrafts: (options = {}) => {
    return request({
      url: '/api/v2/editor/' + options.type + '/drafts',
      data: {
        ...options,
      },
    });
  },

  /**
   * 创建草稿
   * @return {wx.RequestTask}
   */
  editorCreate: (options = {}) => {
    return request({
      url: '/api/v2/editor/' + options.type + '/create',
      data: {
        ...options,
      },
      method: 'POST',
    });
  },

  /**
   * 生成编辑草稿
   * @return {wx.RequestTask}
   */
  editorGenerate: (options = {}) => {
    return request({
      url: '/api/v2/editor/' + options.type + '/generate/' + options.fsid,
      data: {
        ...options,
      },
      method: 'POST',
    });
  },

  /**
   * 获取草稿详情
   * @return {wx.RequestTask}
   */
  editorDetail: (options = {}) => {
    return request({
      url: '/api/v2/editor/' + options.type + '/' + options.draftId,
      data: {
        ...options,
      },
    });
  },

  /**
   * 更新草稿内容
   * @return {wx.RequestTask}
   */
  editorUpdate: (options = {}) => {
    return request({
      url: '/api/v2/editor/' + options.type + '/' + options.draftId,
      data: {
        ...options,
      },
      method: 'PUT',
      editorUpdate: true,
    });
  },

  /**
   * 提交发表（或审核）
   * @return {wx.RequestTask}
   */
  editorPublish: (options = {}) => {
    return request({
      url: '/api/v2/editor/' + options.type + '/' + options.draftId,
      data: {
        ...options,
      },
      method: 'POST',
    });
  },

  /**
   * 撤回审核中草稿
   * @return {wx.RequestTask}
   */
  editorRecall: (options = {}) => {
    return request({
      url: '/api/v2/editor/' + options.type + '/' + options.draftId,
      data: {
        ...options,
      },
      method: 'PATCH',
    });
  },

  /**
   * 删除草稿或附属文件
   * @return {wx.RequestTask}
   */
  editorDelete: (options = {}) => {
    return request({
      url: '/api/v2/editor/' + options.type + '/' + options.draftId,
      data: {
        ...options,
      },
      method: 'DELETE',
    });
  },
};

module.exports = editor;
