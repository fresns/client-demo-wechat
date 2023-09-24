/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { globalInfo } from '../../../utils/fresnsGlobalInfo';
import { fresnsConfig, fresnsUserPanel } from '../../../api/tool/function';

Component({
  /** 组件的属性列表 **/
  properties: {
    activeLabel: String,
  },

  /** 组件的初始数据 **/
  data: {
    tabs: [
      {
        label: 'portal',
        text: '门户',
        textKey: 'menu_portal_name',
        pagePath: '/pages/portal/index',
        iconPath: '/assets/tabbar/home.png',
        selectedIconPath: '/assets/tabbar/home-active.png',
      },
      {
        label: 'users',
        text: '用户',
        textKey: 'menu_user_name',
        pagePath: '/pages/users/index',
        iconPath: '/assets/tabbar/users.png',
        selectedIconPath: '/assets/tabbar/users-active.png',
      },
      {
        label: 'groups',
        text: '小组',
        textKey: 'menu_group_name',
        pagePath: '/pages/groups/index',
        iconPath: '/assets/tabbar/groups.png',
        selectedIconPath: '/assets/tabbar/groups-active.png',
      },
      {
        label: 'hashtags',
        text: '话题',
        textKey: 'menu_hashtag_name',
        pagePath: '/pages/hashtags/index',
        iconPath: '/assets/tabbar/hashtags.png',
        selectedIconPath: '/assets/tabbar/hashtags-active.png',
      },
      {
        label: 'posts',
        text: '帖子',
        textKey: 'menu_post_name',
        pagePath: '/pages/posts/index',
        iconPath: '/assets/tabbar/posts.png',
        selectedIconPath: '/assets/tabbar/posts-active.png',
      },
      {
        label: 'comments',
        text: '评论',
        textKey: 'menu_comment_name',
        pagePath: '/pages/comments/index',
        iconPath: '/assets/tabbar/comments.png',
        selectedIconPath: '/assets/tabbar/comments-active.png',
      },
      {
        label: 'notifications',
        text: '消息',
        textKey: 'menu_notifications',
        pagePath: '/pages/notifications/index',
        iconPath: '/assets/tabbar/notifications.png',
        selectedIconPath: '/assets/tabbar/notifications-active.png',
        badge: 0,
      },
      {
        label: 'messages',
        text: '私信',
        textKey: 'menu_conversations',
        pagePath: '/pages/messages/index',
        iconPath: '/assets/tabbar/messages.png',
        selectedIconPath: '/assets/tabbar/messages-active.png',
        badge: 0,
      },
      {
        label: 'account',
        text: '我',
        textKey: 'menu_account',
        pagePath: '/pages/account/index',
        iconPath: '/assets/tabbar/account.png',
        selectedIconPath: '/assets/tabbar/account-active.png',
      },
    ],
    current: null,
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached: async function () {
      const { tabs, activeLabel } = this.data;
      const index = tabs.findIndex((tab) => tab.label == activeLabel);

      let unreadNotifications = 0;
      let unreadMessages = 0;

      if (globalInfo.userLogin) {
        unreadNotifications = await fresnsUserPanel('unreadNotifications.all');
        unreadMessages = await fresnsUserPanel('conversations.unreadMessages');
      }

      const promises = tabs.map(async (tab) => await fresnsConfig(tab.textKey));
      const tabTexts = await Promise.all(promises);

      tabs.forEach((tab, index) => {
        tab.text = tabTexts[index];

        if (tab.label === 'notifications') {
          tab.badge = unreadNotifications;
        }

        if (tab.label === 'messages') {
          tab.badge = unreadMessages;
        }
      });

      this.setData(
        {
          current: index,
          tabs: tabs,
        },
        () => {
          console.log('tabs', this.data.tabs); // 在回调函数中读取最新的 tabs 数据
        }
      );
    },
  },

  /** 组件功能 **/
  methods: {
    onChange(e) {
      wx.reLaunch({
        url: e.detail.item.pagePath,
      });

      this.setData({
        current: e.detail.index,
      });
    },
  },
});
