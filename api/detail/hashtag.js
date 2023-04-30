/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { request } from '../tool/request';

const hashtag = {
    /**
     * 获取话题[列表]
     * @return {wx.RequestTask}
     */
    hashtagList: (options = {}) => {
        return request({
            url: '/api/v2/hashtag/list',
            data: {
                ...options,
            },
        });
    },

    /**
     * 获取话题[详情]
     * @return {wx.RequestTask}
     */
    hashtagDetail: (options = {}) => {
        return request({
            url: '/api/v2/hashtag/' + options.hid + '/detail',
            data: {
                ...options,
            },
        });
    },

    /**
     * 获取话题[详情] 互动列表
     * @return {wx.RequestTask}
     */
    hashtagInteraction: (options = {}) => {
        return request({
            url: '/api/v2/hashtag/' + options.hid + '/interaction/' + options.type,
            data: {
                ...options,
            },
        });
    },
};

module.exports = hashtag;
