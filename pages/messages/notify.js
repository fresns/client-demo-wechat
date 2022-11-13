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
        type: null,
        notifies: [],
        page: 1,
        isReachBottom: false,
    },
    onLoad: async function (options) {
        const { type } = options;
        this.setData({ type: +type });
        await this._loadCurPageData();
    },
    _loadCurPageData: async function () {
        if (this.data.isReachBottom) {
            return;
        }
        const resultRes = await Api.message.notifyLists({
            type: this.data.type,
            page: this.data.page,
        });
        if (resultRes.code === 0) {
            const { pagination, list } = resultRes.data;
            this.setData({
                notifies: this.data.notifies.concat(list),
                page: this.data.page + 1,
                isReachBottom: pagination.current === pagination.lastPage,
            });
        }
    },
    onReachBottom: async function () {
        await this._loadCurPageData();
    },
});
