/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { request, uploadFile } from '../tool/request';

const common = {
    /**
     * IP 信息
     * @return {wx.RequestTask}
     */
    commonIpInfo: (options = {}) => {
        return request({
            url: '/api/v2/common/ip-info',
            data: {
                ...options,
            },
        });
    },

    /**
     * 输入提示信息
     * @return {wx.RequestTask}
     */
    commonInputTips: (options = {}) => {
        return request({
            url: '/api/v2/common/input-tips',
            data: {
                ...options,
            },
        });
    },

    /**
     * 回调返参查询
     * @return {wx.RequestTask}
     */
    commonCallback: (options = {}) => {
        return request({
            url: '/api/v2/common/callback',
            data: {
                ...options,
            },
        });
    },

    /**
     * 发送验证码
     * @return {wx.RequestTask}
     */
    commonSendVerifyCode: (options = {}) => {
        return request({
            url: '/api/v2/common/send-verify-code',
            data: {
                ...options,
            },
            method: 'POST',
        });
    },

    /**
     * 上传日志
     * @return {wx.RequestTask}
     */
    commonUploadLog: (options = {}) => {
        return request({
            url: '/api/v2/common/upload-log',
            data: {
                ...options,
            },
            method: 'POST',
        });
    },

    /**
     * 上传文件
     * @return {wx.RequestTask}
     */
    commonUploadFile: async (filePath, formData) => {
        return uploadFile(filePath, {
            url: '/api/v2/common/upload-file',
            data: {
                ...formData,
            },
            method: 'POST',
        });
    },

    /**
     * 文件下载链接
     * @param {string} options.fid 文件 fid
     * @return {wx.RequestTask}
     */
    commonFileLink: (options = {}) => {
        return request({
            url: '/api/v2/common/file/' + options.fid + '/link',
            data: {
                ...options,
            },
        });
    },

    /**
     * 下载过文件的用户
     * @param {string} options.fid 文件 fid
     * @return {wx.RequestTask}
     */
    commonFileUsers: (options = {}) => {
        return request({
            url: '/api/v2/common/file/' + options.fid + '/users',
            data: {
                ...options,
            },
        });
    },
};

module.exports = common;
