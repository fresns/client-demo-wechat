/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import { request, uploadFile } from '../tool/request';

const editor = {
    /**
     * 撤回审核中草稿
     * @return {wx.RequestTask}
     */
    editorRevoke: () => {
        return request({
            url: '/api/v1/editor/revoke',
        });
    },
    /**
     * 提交内容正式发表
     * @return {wx.RequestTask}
     */
    editorSubmit: (options) => {
        return request({
            url: '/api/v1/editor/submit',
            data: {
                ...options,
            },
        });
    },
    /**
     * 快速发表
     * @return {wx.RequestTask}
     */
    editorPublish: (options) => {
        return request({
            url: '/api/v1/editor/publish',
            data: {
                ...options,
            },
        });
    },
    /**
     * 删除草稿或附属文件
     * @return {wx.RequestTask}
     */
    editorDelete: (options) => {
        return request({
            url: '/api/v1/editor/delete',
            data: {
                ...options,
            },
        });
    },
    /**
     * 更新草稿内容
     * @return {wx.RequestTask}
     */
    editorUpdate: (options) => {
        return request({
            url: '/api/v1/editor/update',
            data: {
                ...options,
            },
        });
    },
    /**
     * 上传文件
     * @return {wx.RequestTask}
     */
    editorUpload: async (filePath, formData) => {
        return uploadFile(filePath, {
            url: '/api/v1/editor/upload',
            data: {
                ...formData,
            },
        });
    },
    /**
     * 获取上传凭证
     * @return {wx.RequestTask}
     */
    editorUploadToken: () => {
        return request({
            url: '/api/v1/editor/uploadToken',
        });
    },
    /**
     * 创建新草稿
     * @return {wx.RequestTask}
     */
    editorCreate: (options) => {
        return request({
            url: '/api/v1/editor/create',
            data: {
                ...options,
            },
        });
    },
    /**
     * 获取草稿详情
     * @return {wx.RequestTask}
     */
    editorDetail: (options) => {
        return request({
            url: '/api/v1/editor/detail',
            data: {
                ...options,
            },
        });
    },
    /**
     * 获取草稿列表
     * @return {wx.RequestTask}
     */
    editorLists: (options) => {
        return request({
            url: '/api/v1/editor/lists',
            data: {
                ...options,
            },
        });
    },
    /**
     * 获取编辑器配置信息
     * @return {wx.RequestTask}
     */
    editorConfigs: (options) => {
        return request({
            url: '/api/v1/editor/configs',
            data: {
                ...options,
            },
        });
    },
};

module.exports = editor;
