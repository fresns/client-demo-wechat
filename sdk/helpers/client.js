/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import envConfig from '../../env';
import { fresnsApi } from '../services/api';
import { base64_encode } from '../utilities/base64';
import { versionCompare } from '../utilities/toolkit';

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

// 检测版本
export async function checkVersion() {
  const appBaseInfo = fresnsClient.appBaseInfo;

  const fresnsStatus = await fresnsApi.global.status();

  const clientInfo = fresnsStatus?.client?.mobile[appBaseInfo.platform];

  if (clientInfo?.version) {
    appBaseInfo.hasApp = true;
    appBaseInfo.appUrl = clientInfo?.appStore || clientInfo?.googlePlay;
    appBaseInfo.downloadUrl = clientInfo?.downloads?.apk;
  }

  if (appBaseInfo.isWechat) {
    // 是微信小程序
    return appBaseInfo;
  }

  const checkVersion = versionCompare(fresnsClient.version, clientInfo?.version);

  console.log('Auto Check Version', fresnsClient.version, clientInfo?.version, checkVersion);

  if (clientInfo?.version == fresnsClient.version || checkVersion != -1) {
    appBaseInfo.hasNewVersion = false;
    appBaseInfo.newVersion = '';
    appBaseInfo.newVersionDescribe = '';

    wx.setStorageSync('appBaseInfo', appBaseInfo);

    return appBaseInfo;
  }

  const langTag = fresnsClient.langTag;

  appBaseInfo.hasNewVersion = true;
  appBaseInfo.newVersion = clientInfo.version;
  appBaseInfo.newVersionDescribe = clientInfo.describe[langTag] || clientInfo.describe.default;

  wx.setStorageSync('appBaseInfo', appBaseInfo);

  return appBaseInfo;
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
    return envConfig?.clientPlatformId || 11; // https://docs.fresns.com/zh-hans/clients/reference/dictionary/platforms.html
  }

  // version
  get version() {
    return envConfig?.clientVersion || '3.0.0';
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
    const appBaseInfoStorage = wx.getStorageSync('appBaseInfo');

    if (appBaseInfoStorage) {
      return appBaseInfoStorage;
    }

    const appBaseInfo = wx.getAppBaseInfo();

    let appDeviceInfo;
    if (appBaseInfo.host.env == 'WeChat') {
      appDeviceInfo = wx.getDeviceInfo();
    } else {
      appDeviceInfo = wx.getSystemInfoSync();
    }

    const appBaseInfoArr = {
      isWeb: false,
      isApp: appBaseInfo.host.env == 'SAAASDK',
      isWechat: appBaseInfo.host.env == 'WeChat',
      platform: appDeviceInfo.platform,
      hasApp: false,
      appUrl: '',
      downloadUrl: '',
      hasNewVersion: false,
      newVersion: '',
      newVersionDescribe: '',
    };

    wx.setStorageSync('appBaseInfo', appBaseInfoArr);

    return appBaseInfoArr;
  }

  // enableApiQuic
  get enableApiQuic() {
    return envConfig?.enableApiQuic || false;
  }

  // enableWeChatLogin
  get enableWeChatLogin() {
    return envConfig?.enableWeChatLogin || false;
  }

  // enableWeChatAutoLogin
  get enableWeChatAutoLogin() {
    return envConfig?.enableWeChatAutoLogin || false;
  }

  // enableSharePoster
  get enableSharePoster() {
    return envConfig?.enableSharePoster || false;
  }

  // mpId
  get mpId() {
    return envConfig?.mpId || '';
  }
}

export const fresnsClient = new clientInfo();
