/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsConfig, fresnsLang } from '../../sdk/helpers/configs';
import { fresnsAuth } from '../../sdk/helpers/profiles';
import { callPageFunction } from '../../sdk/utilities/toolkit';

Component({
  /** 组件的属性列表 **/
  properties: {
    user: {
      type: Object,
      value: null,
    },
    followersYouKnow: {
      type: Object,
      value: null,
    },
    items: {
      type: Object,
      value: null,
    },
  },

  /** 组件的初始数据 **/
  data: {
    fresnsLang: {},

    buttonIcons: {
      more: '/assets/images/interaction/content-more.png',
      moreActive: '/assets/images/interaction/content-more.png',
    },

    isMe: true,

    showMoreSheet: false,
  },

  /** 组件数据字段监听器 **/
  observers: {
    user: async function (user) {
      if (!user) {
        return;
      }

      // buttonIcons
      const buttonIconsArr = user.operations.buttonIcons;
      if (buttonIconsArr.length > 0) {
        const moreItem = buttonIconsArr.find((item) => item.code === 'more');

        const buttonIcons = {
          more: moreItem ? moreItem.imageUrl : '/assets/images/interaction/content-more.png',
          moreActive: moreItem ? moreItem.imageActiveUrl : undefined,
        };

        this.setData({
          buttonIcons: buttonIcons,
        });
      }

      this.setData({
        isMe: fresnsAuth.uid == user.uid,
      });
    },
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached: async function () {
      this.setData({
        followersYouFollowEnabled: await fresnsConfig('profile_followers_you_follow_enabled'),
        fresnsLang: {
          userFollowing: await fresnsLang('userFollowing'),
          userFollowersYouKnow: await fresnsLang('userFollowersYouKnow'),
          cancel: await fresnsLang('cancel'),
        },
      });
    },
  },

  /** 组件功能 **/
  methods: {
    // 显示更多菜单
    onShowMoreMenus() {
      this.setData({
        showMoreSheet: true,
      });
    },

    // 隐藏更多菜单
    onHideMoreMenus() {
      this.setData({
        showMoreSheet: false,
      });
    },

    // 回调扩展处理函数
    handleExtensionTap(e) {
      // sdk/extensions/functions
      callPageFunction('handleExtensionTap', e);
    },
  },
});
