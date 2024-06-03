/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../sdk/services';
import { fresnsConfig } from '../../sdk/helpers/configs';
import { callPageFunction } from '../../sdk/utilities/toolkit';

Component({
  /** 组件的属性列表 **/
  properties: {
    notification: {
      type: Object,
      value: null,
    },
  },

  /** 组件的初始数据 **/
  data: {
    siteIcon: null,
    siteName: null,
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached: async function () {
      this.setData({
        siteIcon: await fresnsConfig('site_icon'),
        siteName: await fresnsConfig('site_name'),
      });
    },
  },

  /** 组件功能 **/
  methods: {
    onCheckRead: async function (e) {
      const nmid = e.currentTarget.dataset.nmid;
      const status = e.currentTarget.dataset.status;

      if (status) {
        return;
      }

      callPageFunction('onMarkRead', nmid);

      await fresnsApi.notification.markAsRead({
        type: 'choose',
        notificationIds: nmid,
      });
    },

    onClickToDetail: async function () {
      const notification = this.data.notification;

      if (notification.type === 7) {
        // 提及，在哪里提及
        switch (notification.actionObject) {
          case 1:
            // 用户
            const userHomePath = await globalInfo.userHomePath();
            wx.navigateTo({
              url: userHomePath + notification.actionInfo.fsid,
            });
            break;

          case 2:
            // 小组
            wx.navigateTo({
              url: '/pages/groups/detail?gid=' + notification.actionInfo.gid,
            });
            break;

          case 3:
            // 话题
            wx.navigateTo({
              url: '/pages/hashtags/detail?hid=' + notification.actionInfo.hid,
            });
            break;

          case 4:
            // 帖子
            wx.navigateTo({
              url: '/pages/posts/detail?pid=' + notification.actionInfo.pid,
            });
            break;

          case 5:
            // 评论
            wx.navigateTo({
              url: '/pages/comments/detail?cid=' + notification.actionInfo.cid,
            });
            break;

          default:
          // code
        }

        return;
      }

      if (!notification.contentFsid) {
        return;
      }

      switch (notification.type) {
        case 8:
          // 评论
          wx.navigateTo({
            url: '/pages/comments/detail?cid=' + notification.contentFsid,
          });
          break;

        case 9:
          // 引用
          wx.navigateTo({
            url: '/pages/posts/detail?pid=' + notification.contentFsid,
          });
          break;

        default:
        // code
      }
    },
  },
});
