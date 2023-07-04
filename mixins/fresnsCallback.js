/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../api/api';

module.exports = {
  /** 监听页面显示 **/
  onShow: async function () {
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

    switch (fresnsCallback.action.postMessageKey) {
      case 'reload':
        //  重新载入，小程序不支持重载页面
        break;
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
