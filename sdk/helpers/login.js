/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../services';
import { fresnsClient } from './client';
import { fresnsLang } from './configs';
import { fresnsAuth } from './profiles';
import { cachePut, clearCache } from './cache';

class login {
  // 登录
  async login(loginToken) {
    const loginRes = await fresnsApi.account.login({ loginToken });

    if (loginRes.code != 0) {
      return loginRes;
    }

    wx.setStorageSync('aid', loginRes.data.authToken.aid);
    wx.setStorageSync('aidToken', loginRes.data.authToken.aidToken);
    wx.setStorageSync('uid', loginRes.data.authToken.uid);
    wx.setStorageSync('uidToken', loginRes.data.authToken.uidToken);

    cachePut('fresnsAccountData', loginRes.data, 5);

    const userRes = await fresnsApi.user.detail(loginRes.data.authToken.uid);

    if (userRes.code == 0) {
      cachePut('fresnsUserData', userRes.data, 5);
    }

    return userRes;
  }

  // 切换用户
  async switchUser(uidOrUsername, pin = null, deviceToken = null) {
    const loginRes = await fresnsApi.user.login({
      uidOrUsername,
      pin,
      deviceToken,
    });

    if (loginRes.code != 0) {
      return loginRes;
    }

    wx.setStorageSync('aid', loginRes.data.authToken.aid);
    wx.setStorageSync('aidToken', loginRes.data.authToken.aidToken);
    wx.setStorageSync('uid', loginRes.data.authToken.uid);
    wx.setStorageSync('uidToken', loginRes.data.authToken.uidToken);

    const userRes = await fresnsApi.user.detail(uidOrUsername);

    if (userRes.code == 0) {
      cachePut('fresnsUserData', userRes.data, 5);
    }

    return userRes;
  }

  // 退出登录
  async logout() {
    await fresnsApi.account.logout();

    wx.removeStorageSync('aid');
    wx.removeStorageSync('aidToken');
    wx.removeStorageSync('uid');
    wx.removeStorageSync('uidToken');
    wx.removeStorageSync('fresnsAccountData');
    wx.removeStorageSync('fresnsUserData');
    clearCache('fresnsCacheOverviewTags');

    return;
  }

  // 微信自动登录
  async wechatAutoLogin() {
    if (!fresnsClient.enableWeChatAutoLogin || fresnsAuth.userLogin) {
      console.log('WeChat Auto Login', '功能状态', fresnsClient.enableWeChatAutoLogin);
      console.log('WeChat Auto Login', '用户登录状态', fresnsAuth.userLogin);
      return;
    }

    wx.login({
      success: async (res) => {
        const wechatCode = res.code;

        console.log('WeChat Auto Login', '微信 Code', wechatCode);
        if (wechatCode) {
          await this.connectLoginHandle('wechat', wechatCode, false, false);
        }
      },
    });
  }

  // 微信登录
  async wechatLogin(autoRegister = false) {
    // 登录状态
    wx.showLoading({
      title: await fresnsLang('accountLoggingIn'), // 登录中
    });

    // 登录处理
    wx.login({
      success: async (res) => {
        const wechatCode = res.code;

        if (wechatCode) {
          await this.connectLoginHandle('wechat', wechatCode, autoRegister);
        } else {
          wx.hideLoading();
          wx.showToast({
            title: '[' + res.errCode + '] ' + res.errMsg,
            icon: 'none',
          });
        }
      },
      fail(res) {
        wx.hideLoading();
        wx.showToast({
          title: '[' + res.errCode + '] ' + res.errMsg,
          icon: 'none',
        });
      },
    });
  }

  // App 微信登录
  async appWechatLogin(autoRegister = false) {
    // 登录状态
    wx.showLoading({
      title: await fresnsLang('accountLoggingIn'), // 登录中
    });

    // 登录处理
    wx.miniapp.login({
      success: async (res) => {
        const wechatCode = res.code;

        if (wechatCode) {
          await this.connectLoginHandle('app', wechatCode, autoRegister);
        } else {
          wx.hideLoading();
          wx.showToast({
            title: '[' + res.errCode + '] ' + res.errMsg,
            icon: 'none',
          });
        }
      },
      fail(res) {
        wx.hideLoading();
        wx.showToast({
          title: '[' + res.errCode + '] ' + res.errMsg,
          icon: 'none',
        });
      },
    });
  }

  // 苹果账号登录
  async appleLogin(autoRegister = false) {
    // 登录状态
    wx.showLoading({
      title: await fresnsLang('accountLoggingIn'), // 登录中
    });

    // 登录处理
    wx.appleLogin({
      success: async (res) => {
        const appleCode = res.code;

        if (appleCode) {
          await this.connectLoginHandle('apple', appleCode, autoRegister);
        } else {
          wx.hideLoading();
          wx.showToast({
            title: '[' + res.errCode + '] ' + res.errMsg,
            icon: 'none',
          });
        }
      },
      fail(res) {
        wx.hideLoading();
        wx.showToast({
          title: '[' + res.errCode + '] ' + res.errMsg,
          icon: 'none',
        });
      },
    });
  }

  // 互联登录处理功能
  async connectLoginHandle(type, code, autoRegister = false, isRedirect = true) {
    let resultRes;

    switch (type) {
      case 'wechat':
        resultRes = await fresnsApi.plugins.wechatLogin.oauth({
          code: code,
          autoRegister: autoRegister,
        });
        break;

      case 'app':
        resultRes = await fresnsApi.plugins.wechatLogin.oauthApp({
          code: code,
          autoRegister: autoRegister,
        });
        break;

      case 'apple':
        resultRes = await fresnsApi.plugins.wechatLogin.oauthApple({
          code: code,
          autoRegister: autoRegister,
        });
        break;

      default:
        return;
    }

    if (resultRes.code != 0) {
      wx.hideLoading();

      // isRedirect 参数为自动登录准备，当是自动登录时，则不跳转，登录失败也无任何提示
      if (!isRedirect) {
        return;
      }

      // 网页授权成功，但是本站并未查询到对应的账号
      if (resultRes.code == 31502) {
        wx.redirectTo({
          url: '/pages/me/wechat-login/check-sign?type=' + type,
        });
      }

      // 当前账户有多个用户
      if (resultRes.code == 31508 || resultRes.code == 31604) {
        const navigatorData = {
          title: await fresnsLang('accountLogin'),
          url: resultRes.data.userAuthUrl,
          parameter: resultRes.data.loginToken,
          postMessageKey: 'fresnsAccountSign',
        };

        // 将链接数据赋予到全局数据中
        const app = getApp();
        app.globalData.navigatorData = navigatorData;

        // 访问扩展页面
        wx.navigateTo({
          url: '/sdk/extensions/webview',
        });
      }

      return;
    }

    const loginRes = await this.login(resultRes.data.loginToken);

    if (loginRes.code != 0) {
      wx.hideLoading();
      wx.showToast({
        title: '[' + loginRes.code + '] ' + loginRes.message,
        icon: 'none',
        duration: 3000,
      });

      return;
    }

    wx.navigateBack({
      fail() {
        // 后退失败，直接进入个人中心
        wx.reLaunch({
          url: '/pages/me/index',
        });
      },
    });

    wx.hideLoading();
  }
}

export const fresnsLogin = new login();
