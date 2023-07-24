/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsConfig, fresnsLang } from '../../api/tool/function';

const app = getApp();

Component({
  /** 组件的属性列表 **/
  properties: {
    user: Object,
    items: Object,
  },

  /** 组件的初始数据 **/
  data: {
    userFollowerName: '',
    userFollowingName: '',

    buttonIcons: {
      more: '/assets/interaction/content-more.png',
      moreActive: '/assets/interaction/content-more.png',
    },

    actionGroups: [],
    showActionSheet: false,
  },

  /** 组件数据字段监听器 **/
  observers: {
    user: async function (user) {
      if (!user) {
        return;
      }

      // buttonIcons
      const checkButtonIcons = user.operations && user.operations.buttonIcons;
      if (!checkButtonIcons) {
        return;
      }

      const ButtonIconsArr = user.operations.buttonIcons;
      const moreItem = ButtonIconsArr.find((item) => item.code === 'more');

      const buttonIcons = {
        more: moreItem ? moreItem.imageUrl : '/assets/interaction/content-more.png',
        moreActive: moreItem ? moreItem.imageActiveUrl : undefined,
      };

      this.setData({
        buttonIcons: buttonIcons,
      });
    },

    items: async function (items) {
      if (!items) {
        return;
      }

      // 管理扩展
      if (items.manages && items.manages.length > 0) {
        let actionGroups = [];

        for (let i = 0; i < items.manages.length; i++) {
          const plugin = items.manages[i];
          actionGroups.push({
            text: plugin.name,
            type: 'default',
            value: plugin.url,
          });
        }

        this.setData({
          actionGroups: actionGroups,
        });
      }
    },
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached: async function () {
      const userFollowerName = await fresnsConfig('user_follower_name');
      const userFollowingName = await fresnsLang('userFollowing');

      this.setData({
        userFollowerName: userFollowerName,
        userFollowingName: userFollowingName,
      });
    },
  },

  /** 组件功能 **/
  methods: {
    // 评论框显示
    onClickMore() {
      this.setData({
        showActionSheet: true,
      });
    },

    // 评论框隐藏
    actionClickMore(e) {
      const value = e.detail.value;
      const user = this.data.user;

      const fresnsExtensions = {
        type: 'user',
        scene: 'manage',
        postMessageKey: 'fresnsUserManage',
        uid: user.uid,
        title: 'Fresns Manage',
        url: value,
      };

      app.globalData.fresnsExtensions = fresnsExtensions;

      wx.navigateTo({
        url: '/pages/webview',
      });

      this.setData({
        showActionSheet: false,
      });
    },
  },
});
