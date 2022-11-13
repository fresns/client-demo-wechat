/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import Api from '../../api/api';
import { getConfigItemValue } from '../../api/tool/replace-key';

Page({
    mixins: [require('../../mixin/themeChanged')],
    data: {
        // 配置数据库中的请求体
        requestBody: null,
        // 父级 groupId
        parentGid: null,
        // 当前页面数据
        groups: [],
        // 下次请求时候的页码，初始值为 1
        page: 1,
        // 页面是否到底
        isReachBottom: false,
    },
    onLoad: async function (options) {
        const { parentGid } = options;
        this.setData({ parentGid: parentGid });

        this.data.requestBody = await getConfigItemValue('menu_group_list_config');
        await this._loadCurPageData();
    },
    _loadCurPageData: async function () {
        if (this.data.isReachBottom) {
            return;
        }

        const resultRes = await Api.content.groupLists(
            Object.assign(this.data.requestBody || {}, {
                parentGid: this.data.parentGid,
                page: this.data.page,
                type: 2,
            })
        );

        if (resultRes.code === 0) {
            const { pagination, list } = resultRes.data;
            this.setData({
                groups: this.data.groups.concat(list),
                page: this.data.page + 1,
                isReachBottom: pagination.current === pagination.lastPage,
            });
        }
    },
    onReachBottom: async function () {
        await this._loadCurPageData();
    },
    /** 右上角菜单-分享给好友 **/
    onShareAppMessage: function () {
        return {
            title: 'Fresns',
        };
    },
    /** 右上角菜单-分享到朋友圈 **/
    onShareTimeline: function () {
        return {
            title: 'Fresns',
        };
    },
});
