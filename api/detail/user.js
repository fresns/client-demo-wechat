/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
const { request } = require('../tool/request');

const user = {
    /**
     * 获取用户角色[列表]
     * @return {wx.RequestTask}
     */
    userRoles: () => {
        return request({
            url: '/api/v1/user/roles',
        });
    },
    /**
     * 获取用户[互动列表]
     * @return {wx.RequestTask}
     */
    userInteractions: () => {
        return request({
            url: '/api/v1/user/interactions',
        });
    },
    /**
     * 获取用户[列表]
     * @return {wx.RequestTask}
     */
    userLists: (options) => {
        return request({
            url: '/api/v1/user/lists',
            data: {
                ...options,
            },
        });
    },
    /**
     * 获取用户[单个]
     * @param {Object} options 请求参数
     * @param {string} options.viewUid 用户 id
     * @param {string} options.viewUsername 用户名称
     * @return {wx.RequestTask}
     */
    userDetail: (options = {}) => {
        return request({
            url: '/api/v1/user/detail',
            data: {
                ...options,
            },
        });
    },
    /**
     * 获取标记内容[列表]
     * @return {wx.RequestTask}
     */
    userMarkLists: (options = {}) => {
        return request({
            url: '/api/v1/user/markLists',
            data: {
                ...options,
            },
        });
    },
    /**
     * 操作删除内容
     * @return {wx.RequestTask}
     */
    userDelete: (options = {}) => {
        return request({
            url: '/api/v1/user/delete',
            data: {
                ...options,
            },
        });
    },
    /**
     * 操作标记内容
     * @return {wx.RequestTask}
     */
    userMark: (options) => {
        return request({
            url: '/api/v1/user/mark',
            data: {
                ...options,
            },
        });
    },
    /**
     * 修改用户资料
     * @return {wx.RequestTask}
     */
    userEdit: (options) => {
        return request({
            url: '/api/v1/user/edit',
            data: {
                ...options,
            },
        });
    },
    /**
     * 用户登录
     * @return {wx.RequestTask}
     */
    userAuth: (options) => {
        return request({
            url: '/api/v1/user/auth',
            data: {
                ...options,
            },
        });
    },
};

module.exports = user;
