/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import Api from '../../api/api';

Page({
    /** 外部 mixin 引入 **/
    mixins: [require('../../mixin/themeChanged'), require('../../mixin/loginInterceptor')],
    data: {
        walletLogs: [],
        // 下次请求时候的页码，初始值为 1
        page: 1,
        // 页面是否到底
        isReachBottom: false,
    },
    onLoad: async function (options) {
        await this._loadCurPageData();
    },
    _loadCurPageData: async function () {
        if (this.data.isReachBottom) {
            return;
        }

        const resultRes = await Api.user.userWalletLogs({
            page: this.data.page,
        });
        if (resultRes.code === 0) {
            const { pagination, list } = resultRes.data;
            this.setData({
                walletLogs: this.data.walletLogs.concat(list),
                page: this.data.page + 1,
                isReachBottom: pagination.current === pagination.lastPage,
            });
        }
    },
    onReachBottom: async function () {
        await this._loadCurPageData();
    },
});
