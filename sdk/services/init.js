/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from './api';
import { fresnsClient } from '../helpers/client';
import { fresnsLogin } from '../helpers/login';
import { cachePut, cacheGet } from '../helpers/cache';
import { base64_encode } from '../utilities/base64';

// 小程序初始化
export async function fresnsInit() {
  // 状态
  try {
    const fresnsStatus = await fresnsApi.global.status();
    const langTag = wx.getStorageSync('langTag');

    if (!fresnsStatus.activate) {
      const deactivateDescribe = fresnsStatus.deactivateDescribe[langTag] || fresnsStatus.deactivateDescribe.default;

      wx.showModal({
        content: deactivateDescribe,
        showCancel: false,
        confirmText: false,
      });
    }
  } catch (e) {
    console.log('fresnsStatus', e);
  }

  // app base info
  const fresnsAppBaseInfo = fresnsClient.appBaseInfo;
  const appBaseInfo = wx.getAppBaseInfo();

  // 主题
  const app = getApp();
  const storageTheme = wx.getStorageSync('theme');
  if (!storageTheme || storageTheme == 'automatic') {
    app.globalData.theme = appBaseInfo.theme;
    wx.setStorageSync('theme', 'automatic');
  } else {
    app.globalData.theme = storageTheme;
  }

  // 语言标签
  const storageLangTag = wx.getStorageSync('langTag');
  if (!storageLangTag) {
    const systemLang = appBaseInfo.language || 'zh_CN';

    let langTag = systemLang;
    if (systemLang === 'zh_CN') {
      langTag = 'zh-Hans';
    }
    if (systemLang === 'zh_TW') {
      langTag = 'zh-Hant';
    }
    wx.setStorageSync('langTag', langTag);
  }

  // 设备信息
  const getIpInfo = await fresnsApi.common.ipInfo();
  if (getIpInfo.code == 0) {
    const networkInfo = wx.getNetworkType();
    const ipInfo = getIpInfo.data;

    let appDeviceInfo;
    if (appBaseInfo.host.env == 'WeChat') {
      appDeviceInfo = wx.getDeviceInfo();
    } else {
      appDeviceInfo = wx.getSystemInfoSync();
    }

    let deviceType = 'Mobile';
    if (appDeviceInfo.platform == 'windows' || appDeviceInfo.platform == 'mac') {
      deviceType = 'Desktop';
    }
    if (appDeviceInfo.model == 'iPad') {
      deviceType = 'Tablet';
    }

    const deviceInfo = {
      agent: 'WeChat',
      type: deviceType, // Desktop, Mobile, Tablet, Bot
      platformName: appDeviceInfo.system + ' ' + appBaseInfo.version,
      platformFamily: appDeviceInfo.system,
      platformVersion: appBaseInfo.version,
      browserName: appDeviceInfo.platform + ' ' + appBaseInfo.SDKVersion,
      browserFamily: appDeviceInfo.platform,
      browserVersion: appBaseInfo.SDKVersion,
      browserEngine: 'WeChat SDK Lib',
      deviceFamily: appDeviceInfo.brand,
      deviceModel: appDeviceInfo.model,
      deviceMac: null,
      appImei: null,
      appAndroidId: null,
      appOaid: null,
      appIdfa: null,
      simImsi: null,
      networkType: networkInfo.networkType,
      networkIpv4: ipInfo.networkIpv4,
      networkIpv6: ipInfo.networkIpv6,
      networkPort: ipInfo.networkPort,
      networkTimezone: ipInfo.networkTimezone,
      networkOffset: ipInfo.networkOffset,
      networkIsp: ipInfo.networkIsp,
      networkOrg: ipInfo.networkOrg,
      networkAs: ipInfo.networkAs,
      networkAsName: ipInfo.networkAsName,
      networkMobile: ipInfo.networkMobile,
      networkProxy: ipInfo.networkProxy,
      networkHosting: ipInfo.networkHosting,
      mapId: ipInfo.mapId,
      latitude: ipInfo.latitude,
      longitude: ipInfo.longitude,
      scale: ipInfo.scale,
      continent: ipInfo.continent,
      continentCode: ipInfo.continentCode,
      country: ipInfo.country,
      countryCode: ipInfo.countryCode,
      region: ipInfo.region,
      regionCode: ipInfo.regionCode,
      city: ipInfo.city,
      cityCode: ipInfo.cityCode,
      district: ipInfo.district,
      address: ipInfo.address,
      zip: ipInfo.zip,
    };

    // device info
    const deviceInfoBase64 = base64_encode(JSON.stringify(deviceInfo));

    wx.setStorageSync('deviceInfoBase64', deviceInfoBase64);
  }

  // 全局配置
  try {
    const configValue = cacheGet('fresnsConfigs');
    if (!configValue) {
      const result = await fresnsApi.global.configs();

      if (result.code == 0 && result.data) {
        const cacheMinutes = result.data.cache_minutes || 30;

        cachePut('fresnsConfigs', result.data, cacheMinutes);
      }
    }
  } catch (e) {
    console.log('fresnsConfigs', e);
  }

  // 微信自动登录
  await fresnsLogin.wechatAutoLogin();
}
