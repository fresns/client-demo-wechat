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

        await this.connectLoginHandle('wechat', wechatCode, false);
      },
    });
  }

  // 微信登录
  async wechatLogin(autoRegister = false) {
    return new Promise((resolve, reject) => {
      wx.login({
        success: async (res) => {
          try {
            const result = await this.connectLoginHandle('wechat', res.code, autoRegister);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        },
        fail: (res) => {
          reject({
            code: 30008,
            message: '[' + res.errCode + '] ' + res.errMsg,
          });
        },
      });
    });
  }

  // App 微信登录
  async appWechatLogin(autoRegister = false) {
    return new Promise((resolve, reject) => {
      wx.miniapp.login({
        success: async (res) => {
          try {
            const result = await this.connectLoginHandle('app', res.code, autoRegister);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        },
        fail: (res) => {
          reject({
            code: 30008,
            message: '[' + res.errCode + '] ' + res.errMsg,
          });
        },
      });
    });
  }

  // App 微信小程序登录
  async appWechatMiniProgramLogin(autoRegister = false) {
    return new Promise((resolve, reject) => {
      wx.getMiniProgramCode({
        success: async (res) => {
          try {
            const result = await this.connectLoginHandle('appMiniProgram', res.code, autoRegister);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        },
        fail: (res) => {
          reject({
            code: 30008,
            message: '[' + res.errCode + '] ' + res.errMsg,
          });
        },
      });
    });
  }

  // 苹果账号登录
  async appleLogin(autoRegister = false) {
    return new Promise((resolve, reject) => {
      wx.appleLogin({
        success: async (res) => {
          try {
            const result = await this.connectLoginHandle('apple', res.code, autoRegister);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        },
        fail: (res) => {
          reject({
            code: 30008,
            message: '[' + res.errCode + '] ' + res.errMsg,
          });
        },
      });
    });
  }

  // 互联登录处理功能
  async connectLoginHandle(type, code, autoRegister = false) {
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

      case 'appMiniProgram':
        resultRes = await fresnsApi.plugins.wechatLogin.oauth({
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

    // 当前账户有多个用户
    if (resultRes.code == 31508 || resultRes.code == 31604) {
      // 扩展 Web-View 数据
      const navigatorData = {
        title: await fresnsLang('accountLogin'),
        url: resultRes.data.userAuthUrl,
        parameter: resultRes.data.loginToken,
        postMessageKey: 'fresnsAccountSign',
      };

      // 将链接数据赋予到全局数据中
      const app = getApp();
      app.globalData.navigatorData = navigatorData;

      // 访问扩展页面选择用户
      wx.navigateTo({
        url: '/sdk/extensions/webview',
      });
    }

    if (resultRes.code != 0) {
      return resultRes;
    }

    const loginRes = await this.login(resultRes.data.loginToken);

    return loginRes;
  }
}

export const fresnsLogin = new login();
