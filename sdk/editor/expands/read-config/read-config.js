/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsLang } from '../../../helpers/configs';

Component({
  /** 组件的属性列表 **/
  properties: {
    type: {
      type: String,
      value: 'post',
    },
    did: {
      type: String,
      value: null,
    },
    readConfig: {
      type: Object,
      value: {},
    },
  },

  /** 组件的初始数据 **/
  data: {
    fresnsLang: null,
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached: async function () {
      this.setData({
        fresnsLang: await fresnsLang(),
      });
    },
  },

  /** 组件功能 **/
  methods: {
    onClickModify: async function (e) {
      const type = this.data.type;
      const did = this.data.did;
      const readConfig = this.data.readConfig;

      // 扩展 Web-View 数据
      const navigatorData = {
        title: await fresnsLang('editorReadConfigTitle'),
        url: readConfig.appUrl,
        draftType: type,
        did: did,
        postMessageKey: 'expandEdit',
      };

      // 将链接数据赋予到全局数据中
      const app = getApp();
      app.globalData.navigatorData = navigatorData;

      // 访问扩展页面选择用户
      wx.navigateTo({
        url: '/sdk/extensions/webview',
      });
    },
  },
});
