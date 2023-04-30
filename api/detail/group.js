/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { request } from '../tool/request';

const group = {
    /**
     * 获取小组[树结构列表]
     * @return {wx.RequestTask}
     */
    groupTree: (options = {}) => {
        return request({
            url: '/api/v2/group/tree',
            data: {
                ...options,
            },
        });
    },

    /**
     * 获取小组[列表] 分类
     * @return {wx.RequestTask}
     */
    groupCategories: (options = {}) => {
        return request({
            url: '/api/v2/group/categories',
            data: {
                ...options,
            },
        });
    },

    /**
     * 获取小组[列表] 小组
     * @return {wx.RequestTask}
     */
    groupList: (options = {}) => {
        return request({
            url: '/api/v2/group/list',
            data: {
                ...options,
            },
        });
    },

    /**
     * 获取小组[详情]
     * @return {wx.RequestTask}
     */
    groupDetail: (options = {}) => {
        return request({
            url: '/api/v2/group/' + options.gid + '/detail',
            data: {
                ...options,
            },
        });
    },

    /**
     * 获取小组[详情] 互动列表
     * @return {wx.RequestTask}
     */
    groupInteraction: (options = {}) => {
        return request({
            url: '/api/v2/group/' + options.gid + '/interaction/' + options.type,
            data: {
                ...options,
            },
        });
    },
};

module.exports = group;
