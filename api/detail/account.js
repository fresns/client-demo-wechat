/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import { request } from '../tool/request';

const user = {
    /**
     * 钱包交易记录
     * @return {wx.RequestTask}
     */
    userWalletLogs: (options) => {
        return request({
            url: '/api/v1/account/walletLogs',
            data: {
                ...options,
            },
        });
    },
    /**
     * 修改账号资料
     * @return {wx.RequestTask}
     */
    userEdit: (options) => {
        return request({
            url: '/api/v1/account/edit',
            data: {
                ...options,
            },
        });
    },
    /**
     * 账号基本信息
     * @return {wx.RequestTask}
     */
    userDetail: () => {
        return request({
            url: '/api/v1/account/detail',
        });
    },
    /**
     * 重置密码
     * @return {wx.RequestTask}
     */
    userReset: (options) => {
        return request({
            url: '/api/v1/account/reset',
            data: {
                ...options,
            },
        });
    },
    /**
     * 恢复
     * @return {wx.RequestTask}
     */
    userRestore: () => {
        return request({
            url: '/api/v1/account/restore',
        });
    },
    /**
     * 注销
     * @return {wx.RequestTask}
     */
    userDelete: () => {
        return request({
            url: '/api/v1/account/delete',
        });
    },
    /**
     * 退出登录
     * @return {wx.RequestTask}
     */
    userLogout: () => {
        return request({
            url: '/api/v1/account/logout',
        });
    },
    /**
     * 登录
     * @return {wx.RequestTask}
     */
    userLogin: (options) => {
        return request({
            url: '/api/v1/account/login',
            data: {
                ...options,
            },
        });
    },
    /**
     * 注册
     * @return {wx.RequestTask}
     */
    userRegister: (options) => {
        return request({
            url: '/api/v1/account/register',
            data: {
                ...options,
            },
        });
    },

    /**
     * 账号修改账号验证
     * @return {wx.RequestTask}
     */
    userVerification: (options) => {
        return request({
            url: '/api/v1/account/verification',
            data: {
                ...options,
            },
        });
    },
};

module.exports = user;
