/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { request } from '../tool/request';

const user = {
    /**
     * 获取用户列表
     * @return {wx.RequestTask}
     */
    userList: (options = {}) => {
        return request({
            url: '/api/v2/user/list',
            data: {
                ...options,
            },
        });
    },

    /**
     * 获取用户详情
     * @return {wx.RequestTask}
     */
    userDetail: (options = {}) => {
        return request({
            url: '/api/v2/user/' + options.uidOrUsername + '/detail',
            data: {
                ...options,
            },
        });
    },

    /**
     * 获取用户认识的关注者
     * @return {wx.RequestTask}
     */
    userFollowersYouKnow: (options = {}) => {
        if (!options.uidOrUsername) {
            return;
        }

        return request({
            url: '/api/v2/user/' + options.uidOrUsername + '/followers-you-follow',
            data: {
                ...options,
            },
        });
    },

    /**
     * 获取用户互动的用户列表
     * @return {wx.RequestTask}
     */
    userInteraction: (options = {}) => {
        if (!options.uidOrUsername) {
            return;
        }

        return request({
            url: '/api/v2/user/' + options.uidOrUsername + '/interaction/' + options.type,
            data: {
                ...options,
            },
        });
    },

    /**
     * 获取用户标记的内容列表
     * @return {wx.RequestTask}
     */
    userMarkList: (options = {}) => {
        if (!options.uidOrUsername) {
            return;
        }

        return request({
            url: '/api/v2/user/' + options.uidOrUsername + '/mark/' + options.markType + '/' + options.listType,
            data: {
                ...options,
            },
        });
    },

    /**
     * 用户登录
     * @return {wx.RequestTask}
     */
    userAuth: (options = {}) => {
        return request({
            url: '/api/v2/user/auth',
            data: {
                ...options,
            },
            method: 'POST',
        });
    },

    /**
     * 用户面板
     * @return {wx.RequestTask}
     */
    userPanel: () => {
        return request({
            url: '/api/v2/user/panel',
        });
    },

    /**
     * 修改用户资料
     * @return {wx.RequestTask}
     */
    userEdit: (options = {}) => {
        return request({
            url: '/api/v2/user/edit',
            data: {
                ...options,
            },
            method: 'PUT',
        });
    },

    /**
     * 操作标记
     * @return {wx.RequestTask}
     */
    userMark: (options = {}) => {
        return request({
            url: '/api/v2/user/mark',
            data: {
                ...options,
            },
            method: 'POST',
        });
    },

    /**
     * 标记备注
     * @return {wx.RequestTask}
     */
    userMarkNote: (options = {}) => {
        return request({
            url: '/api/v2/user/mark-note',
            data: {
                ...options,
            },
            method: 'PUT',
        });
    },
};

module.exports = user;
