/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import user from '../../api/detail/user';
import { globalInfo } from '../../configs/fresnsGlobalInfo';

Page({
    mixins: [require('../../mixin/themeChanged')],
    data: {
        users: [],
        // 密码输入框是否可见
        isPasswordDialogVisible: false,
        // 输入的密码
        password: '',
        currentUser: '',
    },
    onShow: async function () {
        const users = globalInfo.loginUser?.users;
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
        if (user.password) {
            this.setData({
                isPasswordDialogVisible: true,
                currentUser: user,
            });
        } else {
            await globalInfo.selectUser(user);
            wx.redirectTo({
                url: '/pages/user/index',
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
            const selectUserRes = await globalInfo.selectUser(currentUser, this.data.password);
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
            if (code !== 0) {
                wx.showToast({
                    title: message,
                    icon: 'none',
                });
            }
        } catch (e) {
            console.error(e.message);
        }
    },
});
