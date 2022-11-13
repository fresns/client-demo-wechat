/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import Api from '../../api/api';
import { globalInfo } from '../../configs/fresnsGlobalInfo';

Page({
    mixins: [require('../../mixin/themeChanged'), require('../../mixin/loginInterceptor')],
    data: {
        user: null,
        loginUser: null,
        loginUserCommon: null,
        languageDialog: false,
    },
    onLoad: async function (options) {
        await this.loadUserInfo();
    },
    loadUserInfo: async function () {
        await globalInfo.awaitLogin();
        const [accountDetailRes, userDetailRes] = await Promise.all([
            Api.account.userDetail(),
            Api.user.userDetail({
                viewUid: globalInfo.uid,
            }),
        ]);
        if (accountDetailRes.code === 0 && userDetailRes.code === 0) {
            this.setData({
                account: accountDetailRes.data,
                loginUser: userDetailRes.data.detail,
                loginUserCommon: userDetailRes.data.common,
            });
        }
    },
    showLanguageDialog: function () {
        this.setData({
            languageDialog: true,
        });
    },
    hideLanguageDialog: function () {
        this.setData({
            languageDialog: false,
        });
    },
    selectLanguage: async function () {},
    onClickLogout: async function () {
        await globalInfo.logout();
    },
    /**
     * 下拉刷新
     */
    onPullDownRefresh: async function () {
        await this.loadUserInfo();
        wx.stopPullDownRefresh();
    },
});
