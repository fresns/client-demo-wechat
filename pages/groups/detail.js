/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import Api from '../../api/api';

Page({
    mixins: [require('../../mixin/themeChanged'), require('../../mixin/handler/groupHandler')],
    data: {
        gid: null,

        // 群组信息详情
        groups: [],

        // 文章
        posts: [],

        // 分页请求逻辑
        requestBody: null,
        page: 1,
        isReachBottom: false,
    },
    onLoad: async function (options) {
        const { gid } = options;
        this.setData({ gid: gid });

        const groupDetailRes = await Api.content.groupDetail({
            gid: gid,
        });
        if (groupDetailRes.code === 0) {
            this.setData({
                groups: [groupDetailRes.data.detail],
            });
        }

        await this._loadCurPageData();
    },
    _loadCurPageData: async function () {
        if (this.data.isReachBottom) {
            return;
        }

        const { gid, page } = this.data;
        const resultRes = await Api.content.postLists({
            searchGid: gid,
            page: page,
        });

        if (resultRes.code === 0) {
            const { pagination, list } = resultRes.data;
            this.setData({
                posts: this.data.posts.concat(list),
                page: this.data.page + 1,
                isReachBottom: pagination.current === pagination.lastPage,
            });
        }
    },
    onReachBottom: async function () {
        await this._loadCurPageData();
    },
    onShareAppMessage: function () {
        return {
            title: 'Fresns',
        };
    },
    onShareTimeline: function () {
        return {
            title: 'Fresns',
        };
    },
});
