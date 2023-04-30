/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { request } from '../tool/request';

const search = {
    /**
     * 搜索用户
     * @return {wx.RequestTask}
     */
    searchUsers: (options = {}) => {
        return request({
            url: '/api/v2/search/users',
            data: {
                ...options,
            },
        });
    },

    /**
     * 搜索小组
     * @return {wx.RequestTask}
     */
    searchGroups: (options = {}) => {
        return request({
            url: '/api/v2/search/groups',
            data: {
                ...options,
            },
        });
    },

    /**
     * 搜索话题
     * @return {wx.RequestTask}
     */
    searchHashtags: (options = {}) => {
        return request({
            url: '/api/v2/search/hashtags',
            data: {
                ...options,
            },
        });
    },

    /**
     * 搜索帖子
     * @return {wx.RequestTask}
     */
    searchPosts: (options = {}) => {
        return request({
            url: '/api/v2/search/posts',
            data: {
                ...options,
            },
        });
    },

    /**
     * 搜索评论
     * @return {wx.RequestTask}
     */
    searchComments: (options = {}) => {
        return request({
            url: '/api/v2/search/comments',
            data: {
                ...options,
            },
        });
    },
};

module.exports = search;
