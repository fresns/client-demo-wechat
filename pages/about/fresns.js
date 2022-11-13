/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
Page({
    mixins: [require('../../mixin/themeChanged')],
    data: {},
    /** 复制公众号 **/
    tapCopyMP: function () {
        wx.setClipboardData({
            data: 'FresnsCN',
            success: function (res) {
                wx.showToast({
                    title: '公众号复制成功',
                });
            },
        });
    },
    /** 右上角菜单-分享给好友 **/
    onShareAppMessage: function () {
        return {
            title: 'Fresns 免费开源的全端产品解决方案',
        };
    },
    /** 右上角菜单-分享到朋友圈 **/
    onShareTimeline: function () {
        return {
            title: 'Fresns 免费开源的全端产品解决方案',
        };
    },
});
