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
    draftType: 'post',
    draftOptions: null,
    did: null,
    fsid: null,
  },

  /** 监听页面加载 **/
  onLoad: async function (options) {
    const title = await fresnsLang('editor');

    const draftType = options.type || 'post';

    const draftOptions = {
      commentPid: options.commentPid || null, // 评论专用 | 有值表示评论该帖子
      commentCid: options.commentCid || null, // 评论专用 | 有值表示回复该评论
      quotePid: options.quotePid || null, // 帖子专用 | 引用帖子
      gid: options.gid || null, // 帖子专用
      title: options.title || null, // 帖子专用
      content: options.content || null,
      isMarkdown: options.isMarkdown || null,
      isAnonymous: options.isAnonymous || null,
      commentPolicy: options.commentPolicy || null, // 帖子专用
      commentPrivate: options.content || null,
      gtid: options.isMarkdown || null,
      locationInfo: options.locationInfo || null,
    };

    const did = options.did || null;
    const fsid = options.fsid || null;

    const editorService = await fresnsConfig(`${draftType}_editor_service`);

    // 配置了编辑器插件，跳转插件页
    if (editorService) {
      // 扩展 Web-View 数据
      const navigatorData = {
        title: title,
        url: editorService,
        draftType: draftType,
        draftOptions: JSON.stringify(draftOptions),
        did: did,
        pid: draftType == 'post' ? fsid : '', // 有值表示编辑该帖子
        cid: draftType == 'comment' ? fsid : '', // 有值表示编辑该评论
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
      draftType: draftType,
      draftOptions: draftOptions,
      did: did,
      fsid: fsid,
    });
  },
});
