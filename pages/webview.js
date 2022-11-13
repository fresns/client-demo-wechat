/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
Page({
    /** 外部 mixin 引入 **/
    mixins: [require('../mixin/themeChanged')],
    data: {
        url: '',
    },
    onLoad: function (options) {
        this.setData({
            url: options.url,
        });
    },
});
