/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsConfig, fresnsLang } from '../../sdk/helpers/configs';

Page({
  /** 外部 mixin 引入 **/
  mixins: [require('../../mixins/common')],

  /** 页面的初始数据 **/
  data: {
    title: null,
    type: 'post',
    did: null,
    fsid: null,
  },

  /** 监听页面加载 **/
  onLoad: async function (options) {
    const title = await fresnsLang('editor');

    const type = options.type || 'post';
    const did = options.did || null;
    const fsid = options.fsid || null;

    const editorService = await fresnsConfig(`${type}_editor_service`);

    // 配置了编辑器插件，跳转插件页
    if (editorService) {
      // 扩展 Web-View 数据
      const navigatorData = {
        title: title,
        url: editorService,
        draftType: type,
        did: did,
        pid: type == 'post' ? fsid : '',
        cid: type == 'comment' ? fsid : '',
        postMessageKey: 'fresnsEditor',
      };

      // 将链接数据赋予到全局数据中
      const app = getApp();
      app.globalData.navigatorData = navigatorData;

      // 访问扩展页面选择用户
      wx.redirectTo({
        url: '/sdk/extensions/webview',
      });

      return;
    }

    // 未配置编辑器插件，访问原本编辑器页面
    this.setData({
      title: title,
      type: type,
      did: did,
      fsid: fsid,
    });
  },
});
