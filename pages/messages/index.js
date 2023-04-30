/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../api/api';
import { fresnsConfig, fresnsLang } from '../../api/tool/function';

Page({
    /** 外部 mixin 引入 **/
    mixins: [
        require('../../mixins/themeChanged'),
        require('../../mixins/checkSiteMode'),
        require('../../mixins/loginInterceptor'),
    ],

    /** 页面的初始数据 **/
    data: {
        creatorDeactivate: null,
        conversations: [],
        page: 1,
        loadingStatus: false,
        loadingTipType: 'none',
        isReachBottom: false,
    },

    /** 监听页面加载 **/
    onLoad: async function () {
        wx.setNavigationBarTitle({
            title: await fresnsConfig('menu_conversations'),
        });

        this.setData({
            creatorDeactivate: await fresnsLang('contentCreatorDeactivate'),
        });

        await this.loadFresnsPageData();
    },

    /** 加载列表数据 **/
    loadFresnsPageData: async function () {
        if (this.data.isReachBottom) {
            return;
        }

        wx.showNavigationBarLoading();

        const resultRes = await fresnsApi.message.conversationList({
            whitelistKeys: 'avatar,nickname,status',
            page: this.data.page,
        });

        if (resultRes.code === 0) {
            const { paginate, list } = resultRes.data;
            const isReachBottom = paginate.currentPage === paginate.lastPage;
            let tipType = 'none';
            if (isReachBottom) {
                tipType = this.data.conversations.length > 0 ? 'page' : 'empty';
            }

            this.setData({
                conversations: this.data.conversations.concat(list),
                page: this.data.page + 1,
                loadingTipType: tipType,
                isReachBottom: isReachBottom,
            });
        }

        this.setData({
            loadingStatus: false,
        });

        wx.hideNavigationBarLoading();
    },

    /** 监听用户下拉动作 **/
    onPullDownRefresh: async function () {
        this.setData({
            conversations: [],
            page: 1,
            loadingTipType: 'none',
            isReachBottom: false,
        });

        await this.loadFresnsPageData();
        wx.stopPullDownRefresh();
    },

    /** 监听用户上拉触底 **/
    onReachBottom: async function () {
        await this.loadFresnsPageData();
    },
});
