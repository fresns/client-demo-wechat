/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../api/api';
import { globalInfo } from './fresnsGlobalInfo';
import { cachePut } from './fresnsUtilities';

export class FresnsLogin {
  // 登录账号
  async loginAccount(params) {
    const loginRes = await fresnsApi.account.accountLogin(params);

    if (loginRes.code != 0) {
      return loginRes;
    }

    wx.setStorageSync('aid', loginRes.data.detail.aid);
    wx.setStorageSync('aidToken', loginRes.data.sessionToken.token);

    cachePut('fresnsAccount', loginRes.data, 5);

    const user = loginRes.data.detail.users[0];

    if (loginRes.data.detail.users.length > 1 || user.hasPassword) {
      wx.redirectTo({
        url: '/pages/account/users',
      });
    }

    return await this.loginUser({
      uidOrUsername: user.uid.toString(),
    });
  }

  // 登录用户
  async loginUser(params) {
    const loginRes = await fresnsApi.user.userAuth(params);

    if (loginRes.code != 0) {
      return loginRes;
    }

    wx.setStorageSync('uid', loginRes.data.detail.uid);
    wx.setStorageSync('uidToken', loginRes.data.sessionToken.token);

    cachePut('fresnsUser', loginRes.data, 5);

    return loginRes;
  }

  // 退出登录
  async logout() {
    await fresnsApi.account.accountLogout();

    wx.removeStorageSync('aid');
    wx.removeStorageSync('aidToken');
    wx.removeStorageSync('uid');
    wx.removeStorageSync('uidToken');

    wx.setStorageSync('fresnsAccount', {
      langTag: globalInfo.langTag,
      data: {},
      expiresTime: 0,
    });

    wx.setStorageSync('fresnsUser', {
      langTag: globalInfo.langTag,
      data: {},
      expiresTime: 0,
    });

    wx.redirectTo({
      url: 'pages/account/index',
    });
  }
}

export const fresnsLogin = new FresnsLogin();
