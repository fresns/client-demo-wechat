/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import appConfig from '../../fresns';
import { base64_encode } from '../utilities/base64';

// 切换语言
export async function switchLangTag(langTag) {
  wx.setStorageSync('langTag', langTag);

  wx.removeStorageSync('fresnsConfigs');
  wx.removeStorageSync('fresnsLanguagePack');

  wx.removeStorageSync('fresnsAccountData');
  wx.removeStorageSync('fresnsUserData');
}

// 切换主题
export async function switchTheme(theme) {
  const app = getApp();
  if (theme == 'automatic') {
    const appBaseInfo = wx.getAppBaseInfo();
    app.globalData.theme = appBaseInfo.theme;
  } else {
    app.globalData.theme = theme;
  }

  wx.setStorageSync('theme', theme);
}

// fresnsClient
class clientInfo {
  // name
  get name() {
    return 'FresnsWeChat';
  }

  // theme
  get theme() {
    const theme = wx.getStorageSync('theme');

    if (theme) {
      return theme;
    }

    const appInfo = wx.getAppBaseInfo();

    wx.setStorageSync('theme', appInfo.theme);

    return appInfo.theme;
  }

  // platformId
  get platformId() {
    return appConfig?.clientPlatformId || 11; // https://docs.fresns.com/zh-Hans/clients/reference/dictionary/platforms.html
  }

  // version
  get version() {
    return appConfig?.clientVersion || '3.0.0';
  }

  // langTag
  get langTag() {
    const clientLangTag = wx.getStorageSync('langTag');

    if (clientLangTag) {
      return clientLangTag;
    }

    const appInfo = wx.getAppBaseInfo();

    const systemLang = appInfo.language || 'zh_CN';

    let weLangTag = systemLang;
    if (systemLang == 'zh_CN') {
      weLangTag = 'zh-Hans';
    }
    if (systemLang == 'zh_TW') {
      weLangTag = 'zh-Hant';
    }

    wx.setStorageSync('langTag', weLangTag);

    return weLangTag;
  }

  // deviceInfo
  get deviceInfo() {
    const deviceInfoBase64 = wx.getStorageSync('deviceInfoBase64');

    if (deviceInfoBase64) {
      return deviceInfoBase64;
    }

    const defaultDeviceInfo = base64_encode('{"agent":"WeChat","networkIpv4":"127.0.0.1"}');

    return defaultDeviceInfo;
  }

  // appBaseInfo
  get appBaseInfo() {
    // {
    //   isApp = false,
    //   isWechat = true,
    //   platform = "devtools",
    //   hasNewVersion = false,
    //   apkUrl = ""
    // }
    return wx.getStorageSync('appBaseInfo');
  }

  // enableApiQuic
  get enableApiQuic() {
    return appConfig?.enableApiQuic || false;
  }

  // enableWeChatLogin
  get enableWeChatLogin() {
    return appConfig?.enableWeChatLogin || false;
  }

  // enableWeChatAutoLogin
  get enableWeChatAutoLogin() {
    return appConfig?.enableWeChatAutoLogin || false;
  }
};

export const fresnsClient = new clientInfo();
