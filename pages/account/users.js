/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsConfig, fresnsAccount } from '../../api/tool/function';
import { fresnsLogin } from '../../utils/fresnsLogin';

Page({
    /** 外部 mixin 引入 **/
    mixins: [require('../../mixins/themeChanged'), require('../../mixins/loginInterceptor')],

    /** 页面的初始数据 **/
    data: {
        fresnsLang: null,

        users: [],
        // 密码输入框是否可见
        isPasswordDialogVisible: false,
        // 输入的密码
        password: '',
        currentUser: '',
    },

    /** 监听页面加载 **/
    onLoad: async function () {
        wx.setNavigationBarTitle({
            title: await fresnsConfig('menu_account_users'),
        });

        const users = await fresnsAccount('detail.users');

        this.setData({
            users: users,
        });
    },

    /**
     * 选择用户
     * @param e
     * @return {Promise<void>}
     */
    selectUserUser: async function (e) {
        const { user } = e.currentTarget.dataset;
        if (user.hasPassword) {
            this.setData({
                isPasswordDialogVisible: true,
                currentUser: user,
            });
        } else {
            await fresnsLogin.loginUser({
                uidOrUsername: user.uid.toString(),
            });
            wx.redirectTo({
                url: '/pages/account/index',
            });
        }
    },
    /**
     * 密码修改监听函数
     * @param e
     * @return {*}
     */
    onInputPassword: function (e) {
        const { value } = e.detail;
        this.setData({
            password: value,
        });
        return value;
    },
    /**
     * 提交密码
     * @param e
     * @return {Promise<void>}
     */
    onSubmitPassword: async function (e) {
        const { currentUser } = this.data;
        try {
            const selectUserRes = await fresnsLogin.loginUser({
                uidOrUsername: currentUser.uid.toString(),
                password: this.data.password,
            });
            const { message, code } = selectUserRes;
            if (code === 0) {
                this.setData({
                    isPasswordDialogVisible: false,
                    password: '',
                });
                wx.redirectTo({
                    url: '/pages/user/index',
                });
            }
        } catch (e) {
            console.error(e.message);
        }
    },
});
