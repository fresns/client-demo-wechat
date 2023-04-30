/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { request } from '../tool/request';

const account = {
    /**
     * 注册
     * @return {wx.RequestTask}
     */
    accountRegister: (options = {}) => {
        return request({
            url: '/api/v2/account/register',
            data: {
                ...options,
            },
            method: 'POST',
        });
    },

    /**
     * 登录
     * @return {wx.RequestTask}
     */
    accountLogin: (options = {}) => {
        return request({
            url: '/api/v2/account/login',
            data: {
                ...options,
            },
            method: 'POST',
        });
    },

    /**
     * 重置密码
     * @return {wx.RequestTask}
     */
    accountResetPassword: (options = {}) => {
        return request({
            url: '/api/v2/account/reset-password',
            data: {
                ...options,
            },
            method: 'PUT',
        });
    },

    /**
     * 获取账号详情
     * @return {wx.RequestTask}
     */
    accountDetail: () => {
        return request({
            url: '/api/v2/account/detail',
        });
    },

    /**
     * 钱包交易记录
     * @return {wx.RequestTask}
     */
    accountWalletLogs: (options = {}) => {
        return request({
            url: '/api/v2/account/wallet-logs',
            data: {
                ...options,
            },
        });
    },

    /**
     * 身份验证
     * @return {wx.RequestTask}
     */
    accountVerifyIdentity: (options = {}) => {
        return request({
            url: '/api/v2/account/verify-identity',
            data: {
                ...options,
            },
            method: 'POST',
        });
    },

    /**
     * 修改账号资料
     * @return {wx.RequestTask}
     */
    accountEdit: (options = {}) => {
        return request({
            url: '/api/v2/account/edit',
            data: {
                ...options,
            },
            method: 'PUT',
        });
    },

    /**
     * 退出登录
     * @return {wx.RequestTask}
     */
    accountLogout: () => {
        return request({
            url: '/api/v2/account/logout',
            method: 'DELETE',
        });
    },

    /**
     * 申请删除账号
     * @return {wx.RequestTask}
     */
    accountDelete: (options = {}) => {
        return request({
            url: '/api/v2/account/apply-delete',
            data: {
                ...options,
            },
            method: 'POST',
        });
    },

    /**
     * 撤销删除申请
     * @return {wx.RequestTask}
     */
    accountRestore: (options = {}) => {
        return request({
            url: '/api/v2/account/restore',
            method: 'POST',
        });
    },
};

module.exports = account;
