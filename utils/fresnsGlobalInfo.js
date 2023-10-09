/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../api/api';
import { fresnsConfig } from '../api/tool/function';
import { fresnsLogin } from './fresnsLogin';
import { cacheGet, cachePut } from './fresnsUtilities';
import { base64_encode } from '../libs/base64/base64';

export class GlobalInfo {
  clientName = 'FresnsWeChat';
  clientVersion = '2.6.0';
  theme = null;

  // 处理用户主页路径
  async userHomePath() {
    const itHomeList = await fresnsConfig('it_home_list');

    const typeMapping = {
      it_posts: '/pages/profile/posts?fsid=',
      it_comments: '/pages/profile/comments?fsid=',
      user_likers: '/pages/profile/interactions/likers?fsid=',
      user_dislikers: '/pages/profile/interactions/dislikers?fsid=',
      user_followers: '/pages/profile/interactions/followers?fsid=',
      user_blockers: '/pages/profile/interactions/blockers?fsid=',
      it_like_users: '/pages/profile/likes/users?fsid=',
      it_like_groups: '/pages/profile/likes/groups?fsid=',
      it_like_hashtags: '/pages/profile/likes/hashtags?fsid=',
      it_like_posts: '/pages/profile/likes/posts?fsid=',
      it_like_comments: '/pages/profile/likes/comments?fsid=',
      it_dislike_users: '/pages/profile/dislikes/users?fsid=',
      it_dislike_groups: '/pages/profile/dislikes/groups?fsid=',
      it_dislike_hashtags: '/pages/profile/dislikes/hashtags?fsid=',
      it_dislike_posts: '/pages/profile/dislikes/posts?fsid=',
      it_dislike_comments: '/pages/profile/dislikes/comments?fsid=',
      it_follow_users: '/pages/profile/following/users?fsid=',
      it_follow_groups: '/pages/profile/following/groups?fsid=',
      it_follow_hashtags: '/pages/profile/following/hashtags?fsid=',
      it_follow_posts: '/pages/profile/following/posts?fsid=',
      it_follow_comments: '/pages/profile/following/comments?fsid=',
      it_block_users: '/pages/profile/blocking/users?fsid=',
      it_block_groups: '/pages/profile/blocking/groups?fsid=',
      it_block_hashtags: '/pages/profile/blocking/hashtags?fsid=',
      it_block_posts: '/pages/profile/blocking/posts?fsid=',
      it_block_comments: '/pages/profile/blocking/comments?fsid=',
    };

    return typeMapping[itHomeList] || '/pages/profile/posts?fsid=';
  }

  get langTag() {
    return wx.getStorageSync('langTag') || 'zh-Hans';
  }

  get deviceInfo() {
    const deviceInfoBase64 = wx.getStorageSync('deviceInfoBase64');

    if (deviceInfoBase64) {
      return deviceInfoBase64;
    }

    const defaultDeviceInfo = base64_encode('{"agent":"WeChat","networkIpv4":"127.0.0.1"}');

    return defaultDeviceInfo;
  }

  get aid() {
    return wx.getStorageSync('aid') || null;
  }

  get aidToken() {
    return wx.getStorageSync('aidToken') || null;
  }

  get uid() {
    return wx.getStorageSync('uid') || null;
  }

  get uidToken() {
    return wx.getStorageSync('uidToken') || null;
  }

  get accountLogin() {
    return Boolean(this.aid && this.aidToken);
  }

  get userLogin() {
    return Boolean(this.aid && this.aidToken && this.uid && this.uidToken);
  }

  // 初始化配置
  async init() {
    // system info
    const systemInfo = wx.getSystemInfoSync();

    // app info
    const appInfo = {
      isApp: systemInfo.host.env == 'SAAASDK',
      isWechat: systemInfo.host.env == 'WeChat',
      platform: systemInfo.platform,
      hasNewVersion: false,
      apkUrl: '',
    };
    wx.setStorageSync('appInfo', appInfo);

    // device info
    const getIpInfo = await fresnsApi.common.commonIpInfo();
    if (getIpInfo.code === 0) {
      const networkInfo = wx.getNetworkType();
      const ipInfo = getIpInfo.data;

      const deviceInfo = {
        agent: 'WeChat',
        type: 'Mobile', // Desktop, Mobile, Tablet, Bot
        mac: null,
        brand: systemInfo.brand,
        model: systemInfo.model,
        platformName: systemInfo.system,
        platformVersion: null,
        browserName: systemInfo.platform,
        browserVersion: systemInfo.version,
        browserEngine: systemInfo.host.env,
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

    // theme
    this.theme = systemInfo.theme;

    // lang tag
    var storageLangTag = wx.getStorageSync('langTag');
    if (!storageLangTag) {
      const systemLang = systemInfo.language || 'zh_CN';

      let langTag = systemLang;
      if (systemLang === 'zh_CN') {
        langTag = 'zh-Hans';
      }
      if (systemLang === 'zh_TW') {
        langTag = 'zh-Hant';
      }
      wx.setStorageSync('langTag', langTag);
    }

    // wechat auto login
    if (!globalInfo.accountLogin) {
      await fresnsLogin.wechatAutoLogin();
    }

    // stickers
    const fresnsStickers = cacheGet('fresnsStickers');
    if (!fresnsStickers) {
      const stickersRes = await fresnsApi.global.globalStickers();

      if (stickersRes.code === 0) {
        cachePut('fresnsStickers', stickersRes.data ?? []);
      }
    }
  }
}

export const globalInfo = new GlobalInfo();
