/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../api/api';
import { fresnsLang } from '../../api/tool/function';
import { globalInfo } from '../../utils/fresnsGlobalInfo';

Page({
  /** 外部 mixin 引入 **/
  mixins: [require('../../mixins/globalConfig')],

  /** 页面的初始数据 **/
  data: {
    showPrivacy: false,

    fresnsVersion: '2.x',
    clientVersion: '1.x',
    appInfo: {},
  },

  /** 监听页面加载 **/
  onLoad: async function () {
    wx.setNavigationBarTitle({
      title: await fresnsLang('about'),
    });

    const fresnsStatus = await fresnsApi.global.globalStatus();
    const appInfo = wx.getStorageSync('appInfo');

    this.setData({
      fresnsVersion: fresnsStatus.version,
      clientVersion: globalInfo.clientVersion,
      appInfo: appInfo,
    });
  },

  /** 复制公众号 **/
  tapCopyMP: function () {
    // 判断隐私授权
    if (wx.canIUse('getPrivacySetting')) {
      wx.getPrivacySetting({
        success: (res) => {
          if (res.needAuthorization) {
            // 需要弹出隐私协议
            this.setData({
              showPrivacy: true,
            });
          }
        },
      });
    }

    wx.setClipboardData({
      data: 'FresnsCN',
      success: function (res) {
        wx.showToast({
          title: '公众号复制成功',
        });
      },
    });
  },

  /** 右上角菜单-分享给好友 **/
  onShareAppMessage: function () {
    return {
      title: 'Fresns 免费开源的全端产品解决方案',
    };
  },

  /** 右上角菜单-分享到朋友圈 **/
  onShareTimeline: function () {
    return {
      title: 'Fresns 免费开源的全端产品解决方案',
    };
  },
});
