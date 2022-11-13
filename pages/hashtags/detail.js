/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import Api from '../../api/api';

Page({
    mixins: [require('../../mixin/themeChanged'), require('../../mixin/handler/hashtagHandler')],
    data: {
        hashtags: [],
        posts: [],
    },
    onLoad: async function (options) {
        const { huri } = options;
        const hashtagsDetailRes = await Api.content.hashtagDetail({
            huri: huri,
        });
        if (hashtagsDetailRes.code === 0) {
            this.setData({
                hashtags: [hashtagsDetailRes.data.detail],
            });
        }

        const postListRes = await Api.content.postLists({
            searchHuri: huri,
        });
        if (postListRes.code === 0) {
            this.setData({
                posts: postListRes.data.list,
            });
        }
    },
    onShareAppMessage: function () {
        return {
            title: '话题名',
        };
    },
    onShareTimeline: function () {
        return {
            title: '话题名',
        };
    },
});
