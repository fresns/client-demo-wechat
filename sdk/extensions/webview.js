/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsLang } from '../helpers/configs';
import { makeAccessToken, repAppUrl } from '../helpers/extensions';

const app = getApp();

Page({
  /** 页面的初始数据 **/
  data: {
    theme: '',
    mode: '', // 模式(care：关怀模式)

    title: null,
    url: null,
  },

  /** 监听页面加载 **/
  onLoad: async function (options) {
    wx.setNavigationBarTitle({
      title: await fresnsLang('loading'),
    });

    const url = options.url;

    if (url) {
      this.setData({
        theme: app.globalData.theme,
        mode: app.globalData.mode,
        url: url,
      });

      return;
    }

    const navigatorData = app.globalData.navigatorData;

    console.log('web-view options', options);
    console.log('web-view navigatorData', navigatorData);

    let appUrl = navigatorData?.url;

    if (!appUrl) {
      wx.setNavigationBarTitle({
        title: await fresnsLang('errorUnavailable'),
      });

      return;
    }

    const title = navigatorData?.title || '';

    wx.showNavigationBarLoading();

    wx.showLoading({
      title: await fresnsLang('loading'),
    });

    // callback variables
    // https://docs.fresns.com/zh-Hans/clients/reference/callback/variables.html
    if (navigatorData) {
      const urlParams = {
        accessToken: await makeAccessToken(), // 访问令牌
        postMessageKey: navigatorData.postMessageKey || '', // 回调标识
        redirectUrl: navigatorData.redirectUrl || '', // 重定向页面
        connectPlatformId: navigatorData.connectPlatformId || '', // 互联 IP
        aid: navigatorData.aid || '', // 账户 ID
        uid: navigatorData.uid || '', // 用户 ID
        rid: navigatorData.rid || '', // 角色 ID
        gid: navigatorData.gid || '', // 小组 ID
        htid: navigatorData.htid || '', // 话题 ID
        gtid: navigatorData.gtid || '', // 地理 ID
        pid: navigatorData.pid || '', // 帖子 ID
        cid: navigatorData.cid || '', // 评论 ID
        fid: navigatorData.fid || '', // 文件 ID
        eid: navigatorData.eid || '', // 内容扩展 ID
        hpid: navigatorData.hpid || '', // 历史帖子 ID
        hcid: navigatorData.hcid || '', // 历史评论 ID
        viewType: navigatorData.viewType || '', // 视图类型
        draftType: navigatorData.draftType || '', // 草稿类型
        draftOptions: navigatorData.draftOptions || '', // 草稿选项
        did: navigatorData.did || '', // 草稿 ID
        uploadInfo: navigatorData.uploadInfo || '', // 上传参数信息
        mapInfo: navigatorData.mapInfo || '', // 地图信息
        parameter: navigatorData.parameter || '', // 自定义信息
      };

      appUrl = repAppUrl(appUrl, urlParams);
    }

    this.setData({
      theme: app.globalData.theme,
      mode: app.globalData.mode,
      title: title,
      url: appUrl,
    });
  },

  /** 监听页面显示 **/
  onShow: async function () {
    setTimeout(() => {
      console.log('setTimeout eventLoadPage');
      this.eventLoadPage(); // 额外加一个定时，解决 App 端 bindload 不生效问题
    }, 2000);
  },

  /** 监听页面隐藏 **/
  onHide: function () {
    app.globalData.navigatorData = {};
  },

  /** 监听页面退出 **/
  onUnload: function () {
    app.globalData.navigatorData = {};
  },

  /** Web View 加载完成 **/
  eventLoadPage: function () {
    wx.hideNavigationBarLoading();

    wx.hideLoading();

    const title = this.data.title;

    if (title) {
      wx.setNavigationBarTitle({
        title: title,
      });
    }
  },

  /** Web View 回调消息 **/
  eventCallbackMessage: function (e) {
    console.log('fresnsCallbackMessage', e);

    const messageData = e.detail.data[0];

    const fresnsCallbackMessage = JSON.parse(messageData);

    wx.setStorageSync('fresnsCallbackMessage', fresnsCallbackMessage);
  },
});
