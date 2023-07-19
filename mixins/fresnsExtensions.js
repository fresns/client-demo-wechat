/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../api/api';
import { getPluginAuthorization } from '../api/tool/helper';
import { repPluginUrl } from '../utils/fresnsUtilities';

const app = getApp();

module.exports = {
  /** 监听页面显示 **/
  onShow: async function () {
    this.fresnsCallback();
  },

  // 前往扩展
  fresnsExtensions: async function (e) {
    console.log('fresnsExtensions', e);

    const type = e.currentTarget.dataset.type || '';
    const scene = e.currentTarget.dataset.scene || '';
    const postMessageKey = e.currentTarget.dataset.postMessageKey || '';
    const callbackUlid = e.currentTarget.dataset.callbackUlid || '';
    const aid = e.currentTarget.dataset.aid || '';
    const uid = e.currentTarget.dataset.uid || '';
    const rid = e.currentTarget.dataset.rid || '';
    const gid = e.currentTarget.dataset.gid || '';
    const pid = e.currentTarget.dataset.pid || '';
    const cid = e.currentTarget.dataset.cid || '';
    const fid = e.currentTarget.dataset.fid || '';
    const eid = e.currentTarget.dataset.eid || '';
    const plid = e.currentTarget.dataset.plid || '';
    const clid = e.currentTarget.dataset.clid || '';
    const connectPlatformId = e.currentTarget.dataset.connectPlatformId || '';
    const uploadInfo = e.currentTarget.dataset.uploadInfo || '';
    const locationInfo = e.currentTarget.dataset.locationInfo || '';

    const url = e.currentTarget.dataset.url;
    const title = e.currentTarget.dataset.title;

    // callback variables
    const urlParams = {
      authorization: await getPluginAuthorization(),
      type: type,
      scene: scene,
      postMessageKey: postMessageKey,
      callbackUlid: callbackUlid,
      aid: aid,
      uid: uid,
      rid: rid,
      gid: gid,
      pid: pid,
      cid: cid,
      fid: fid,
      eid: eid,
      plid: plid,
      clid: clid,
      connectPlatformId: connectPlatformId,
      uploadInfo: uploadInfo,
      locationInfo: locationInfo,
    };

    const newUrl = repPluginUrl(url, urlParams);

    console.log('fresnsExtensions', newUrl);

    app.globalData.extensionsUrl = newUrl;
    app.globalData.extensionsTitle = title;
  },

  // 扩展回调
  fresnsCallback: async function () {
    const fresnsCallback = wx.getStorageSync('fresnsCallback');
    console.log('fresnsCallback getStorageSync', fresnsCallback);

    if (!fresnsCallback) {
      return;
    }

    if (fresnsCallback.code !== 0) {
      wx.showToast({
        title: '[' + fresnsCallback.code + '] ' + fresnsCallback.message,
        icon: 'none',
        duration: 3000,
      });

      // 处理完毕，清空回调信息
      console.log('fresnsCallback removeStorageSync', 'code != 0');
      wx.removeStorageSync('fresnsCallback');

      return;
    }

    wx.showNavigationBarLoading();

    const dataHandler = fresnsCallback.action.dataHandler;
    const data = fresnsCallback.data;

    switch (fresnsCallback.action.postMessageKey) {
      case 'reload':
        // 重新载入，小程序不支持重载页面
        break;

      // 用户管理
      case 'fresnsUserManage':
        switch (dataHandler) {
          case 'add':
            this.onAddUser(data);
            break;

          case 'remove':
            this.onRemoveUser(data.uid);
            break;

          case 'reload':
            this.onChangeUser(data);
            break;

          default:
          // code
        }
        break;

      // 帖子管理
      case 'fresnsPostManage':
        switch (dataHandler) {
          case 'add':
            this.onAddPost(data);
            break;

          case 'remove':
            this.onRemovePost(data.pid);
            break;

          case 'reload':
            this.onChangePost(data);
            break;

          default:
          // code
        }
        break;

      // 评论管理
      case 'fresnsCommentManage':
        switch (dataHandler) {
          case 'add':
            this.onAddComment(data);
            break;

          case 'remove':
            this.onRemoveComment(data.cid);
            break;

          case 'reload':
            this.onChangeComment(data);
            break;

          default:
          // code
        }
        break;

      // 编辑器上传文件
      case 'fresnsEditorUpload':
        const type = this.data.type;
        const draftDetail = this.data.draftDetail;

        const detailRes = await fresnsApi.editor.editorDetail({
          type: type,
          draftId: draftDetail.id,
        });

        if (detailRes.code === 0) {
          draftDetail.files = detailRes.data.detail.files;

          this.setData({
            draftDetail: draftDetail,
          });
        }
        break;

      // 设置页操作账号互联
      case 'fresnsConnect':
        this.reloadFresnsAccount();
        break;

      default:
      // code
    }

    if (fresnsCallback.action.windowClose) {
      // 关闭打开的窗口或 Modal
      // 微信小程序无法控制 web-view
      // 所有此功能在微信小程序里不起作用
    }

    if (fresnsCallback.action.redirectUrl) {
      wx.navigateTo({
        url: fresnsCallback.action.redirectUrl,
      });
    }

    // 处理完毕，清空回调信息
    console.log('fresnsCallback removeStorageSync', 'end');
    wx.removeStorageSync('fresnsCallback');

    wx.hideNavigationBarLoading();
  },
};
