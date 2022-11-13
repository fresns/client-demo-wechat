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
        infoOverview: null,
    },
    onLoad: async function (options) {
        const infoOverviewRes = await Api.info.infoOverview();
        if (infoOverviewRes.code === 0) {
            this.setData({
                infoOverview: infoOverviewRes.data,
            });
        }
    },
});
