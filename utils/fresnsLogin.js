/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../api/api';
import { cachePut } from './fresnsUtilities';

export class FresnsLogin {
  // 登录账号
  async loginAccount(params) {
    const loginRes = await fresnsApi.account.accountLogin(params);

    if (loginRes.code != 0) {
      return loginRes;
    }

    wx.setStorageSync('aid', loginRes.data.sessionToken.aid);
    wx.setStorageSync('aidToken', loginRes.data.sessionToken.token);

    cachePut('fresnsAccount', loginRes.data, 5);

    const user = loginRes.data.detail.users[0];

    if (loginRes.data.detail.users.length > 1 || user.hasPassword) {
      wx.redirectTo({
        url: '/pages/account/users',
      });

      return;
    }

    return await this.loginUser({
      uidOrUsername: user.uid,
    });
  }

  // 登录用户
  async loginUser(params, isRedirect = true) {
    const loginRes = await fresnsApi.user.userAuth(params);

    console.log('user auth', loginRes);

    if (loginRes.code != 0) {
      return loginRes;
    }

    wx.setStorageSync('uid', loginRes.data.sessionToken.uid);
    wx.setStorageSync('uidToken', loginRes.data.sessionToken.token);

    cachePut('fresnsUser', loginRes.data, 5);

    if (isRedirect) {
      wx.redirectTo({
        url: '/pages/account/index',
      });
    }

    return;
  }

  // 退出登录
  async logout() {
    await fresnsApi.account.accountLogout();

    wx.removeStorageSync('aid');
    wx.removeStorageSync('aidToken');
    wx.removeStorageSync('uid');
    wx.removeStorageSync('uidToken');
    wx.removeStorageSync('fresnsAccount');
    wx.removeStorageSync('fresnsUser');
    wx.removeStorageSync('fresnsUserPanels');

    return;
  }

  // 微信自动登录
  async wechatAutoLogin() {
    // console.log('Wechat Auto Login');
    // wx.login({
    //   success: async (res) => {
    //     let wechatCode = res.code
    //     if (wechatCode) {
    //       console.log('WeChat Auto Code', wechatCode);
    //       await this.connectLoginHandle('wechat', wechatCode, false, false);
    //     }
    //   }
    // })
  }

  // 微信登录
  async wechatLogin(autoRegister = false) {
    wx.login({
      success: async (res) => {
        const wechatCode = res.code;
        console.log('WeChat Code', wechatCode);

        if (wechatCode) {
          await this.connectLoginHandle('wechat', wechatCode, autoRegister);
        } else {
          wx.showToast({
            title: '[10001] ' + res.errMsg,
            icon: 'none',
            duration: 2000,
          });
        }
      },
    });
  }

  // App 微信登录
  async appWechatLogin(autoRegister = false) {
    wx.weixinAppLogin({
      success: async (res) => {
        const wechatCode = res.code;
        console.log('App WeChat Code', wechatCode);

        if (wechatCode) {
          await this.connectLoginHandle('app', wechatCode, autoRegister);
        } else {
          wx.showToast({
            title: '[10001] ' + res.errMsg,
            icon: 'none',
            duration: 2000,
          });
        }
      },
    });
  }

  // 互联登录处理功能
  async connectLoginHandle(type, code, autoRegister = false, isRedirect = true) {
    let loginRes;

    switch (type) {
      case 'wechat':
        loginRes = await fresnsApi.wechatLogin.oauth({
          code: code,
          autoRegister: autoRegister,
        });
        break;

      case 'app':
        loginRes = await fresnsApi.wechatLogin.oauthApp({
          code: code,
          autoRegister: autoRegister,
        });
        break;

      case 'apple':
        loginRes = await fresnsApi.wechatLogin.oauthApple({
          code: code,
          autoRegister: autoRegister,
        });
        break;

      default:
        return;
    }

    if (loginRes.code != 0) {
      wx.hideNavigationBarLoading();

      if (loginRes.code == 31502 && isRedirect) {
        wx.redirectTo({
          url: '/pages/account/wechat-login/check-sign' + '?type=' + type,
        });
      }

      return;
    }

    wx.setStorageSync('aid', loginRes.data.sessionToken.aid);
    wx.setStorageSync('aidToken', loginRes.data.sessionToken.token);

    cachePut('fresnsAccount', loginRes.data, 5);

    const user = loginRes.data.detail.users[0];

    if (loginRes.data.detail.users.length > 1 || user.hasPassword) {
      if (isRedirect) {
        wx.redirectTo({
          url: '/pages/account/users',
        });

        return;
      }

      return;
    }

    return await this.loginUser(
      {
        uidOrUsername: user.uid,
      },
      isRedirect
    );
  }

  // 苹果账号登录
  async appleLogin(autoRegister = false) {
    wx.appleLogin({
      success: async (res) => {
        const appleCode = res.code;
        console.log('Apple Code', appleCode);

        if (appleCode) {
          await this.connectLoginHandle('apple', appleCode, autoRegister);
        } else {
          wx.showToast({
            title: '[10001] ' + res.errMsg,
            icon: 'none',
            duration: 2000,
          });
        }
      },
    });
  }
}

export const fresnsLogin = new FresnsLogin();
