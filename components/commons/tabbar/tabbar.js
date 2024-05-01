/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsConfig } from '../../../sdk/helpers/configs';
import { fresnsAuth, fresnsOverview } from '../../../sdk/helpers/profiles';

Component({
  /** 组件的属性列表 **/
  properties: {
    activeLabel: {
      type: String,
      value: 'portal',
    },
  },

  /** 组件的初始数据 **/
  data: {
    tabs: [
      {
        label: 'portal',
        text: '门户',
        textKey: 'channel_portal_name',
        pagePath: '/pages/portal/index',
        iconPath: 'https://assets.fresns.cn/communities/tabbar/home.png',
        selectedIconPath: 'https://assets.fresns.cn/communities/tabbar/home-active.png',
      },
      {
        label: 'users',
        text: '用户',
        textKey: 'channel_user_name',
        pagePath: '/pages/users/index',
        iconPath: 'https://assets.fresns.cn/communities/tabbar/users.png',
        selectedIconPath: 'https://assets.fresns.cn/communities/tabbar/users-active.png',
      },
      {
        label: 'groups',
        text: '小组',
        textKey: 'channel_group_name',
        pagePath: '/pages/groups/index',
        iconPath: 'https://assets.fresns.cn/communities/tabbar/groups.png',
        selectedIconPath: 'https://assets.fresns.cn/communities/tabbar/groups-active.png',
      },
      {
        label: 'hashtags',
        text: '话题',
        textKey: 'channel_hashtag_name',
        pagePath: '/pages/hashtags/index',
        iconPath: 'https://assets.fresns.cn/communities/tabbar/hashtags.png',
        selectedIconPath: 'https://assets.fresns.cn/communities/tabbar/hashtags-active.png',
      },
      {
        label: 'geotags',
        text: '地理',
        textKey: 'channel_geotag_name',
        pagePath: '/pages/geotags/index',
        iconPath: 'https://assets.fresns.cn/communities/tabbar/geotags.png',
        selectedIconPath: 'https://assets.fresns.cn/communities/tabbar/geotags-active.png',
      },
      {
        label: 'posts',
        text: '帖子',
        textKey: 'channel_post_name',
        pagePath: '/pages/posts/index',
        iconPath: 'https://assets.fresns.cn/communities/tabbar/posts.png',
        selectedIconPath: 'https://assets.fresns.cn/communities/tabbar/posts-active.png',
      },
      {
        label: 'comments',
        text: '评论',
        textKey: 'channel_comment_name',
        pagePath: '/pages/comments/index',
        iconPath: 'https://assets.fresns.cn/communities/tabbar/comments.png',
        selectedIconPath: 'https://assets.fresns.cn/communities/tabbar/comments-active.png',
      },
      {
        label: 'timelines',
        text: '关注',
        textKey: 'channel_timeline_name',
        pagePath: '/pages/timelines/index',
        iconPath: 'https://assets.fresns.cn/communities/tabbar/timelines.png',
        selectedIconPath: 'https://assets.fresns.cn/communities/tabbar/timelines-active.png',
        badge: 0,
      },
      {
        label: 'nearby',
        text: '附近',
        textKey: 'channel_nearby_name',
        pagePath: '/pages/nearby/index',
        iconPath: 'https://assets.fresns.cn/communities/tabbar/nearby.png',
        selectedIconPath: 'https://assets.fresns.cn/communities/tabbar/nearby-active.png',
        badge: 0,
      },
      {
        label: 'notifications',
        text: '消息',
        textKey: 'channel_notifications_name',
        pagePath: '/pages/notifications/index',
        iconPath: 'https://assets.fresns.cn/communities/tabbar/notifications.png',
        selectedIconPath: 'https://assets.fresns.cn/communities/tabbar/notifications-active.png',
        badge: 0,
      },
      {
        label: 'conversations',
        text: '私信',
        textKey: 'channel_conversations_name',
        pagePath: '/pages/conversations/index',
        iconPath: 'https://assets.fresns.cn/communities/tabbar/conversations.png',
        selectedIconPath: 'https://assets.fresns.cn/communities/tabbar/conversations-active.png',
        badge: 0,
      },
      {
        label: 'me',
        text: '我',
        textKey: 'channel_me_name',
        pagePath: '/pages/me/index',
        iconPath: 'https://assets.fresns.cn/communities/tabbar/me.png',
        selectedIconPath: 'https://assets.fresns.cn/communities/tabbar/me-active.png',
      },
    ],
    current: null,
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached: async function () {
      const { tabs, activeLabel } = this.data;

      // 计算当前页面
      const idx = tabs.findIndex((tab) => tab.label == activeLabel);

      // 获取登录用户的未读消息数
      let unreadNotifications = 0;
      let unreadMessages = 0;

      if (fresnsAuth.userLogin) {
        unreadNotifications = await fresnsOverview('unreadNotifications.all');
        unreadMessages = await fresnsOverview('conversations.unreadMessages');
      }

      // 获取服务端频道自定义命名
      const promises = tabs.map(async (tab) => await fresnsConfig(tab.textKey));
      const tabTexts = await Promise.all(promises);

      // 消息赋值
      tabs.forEach((tab, idx) => {
        tab.text = tabTexts[idx];

        if (tab.label === 'notifications') {
          tab.badge = unreadNotifications;
        }

        if (tab.label === 'messages') {
          tab.badge = unreadMessages;
        }
      });

      this.setData({
        tabs: tabs,
        current: activeLabel,
      });
    },
  },

  /** 组件功能 **/
  methods: {
    goTabPage(e) {
      const pagePath = e.currentTarget.dataset.pagePath;
      const label = e.currentTarget.id;
      console.log('goTabPage pagePath', pagePath, label);

      wx.reLaunch({
        url: pagePath,
      });

      this.setData({
        current: label,
      });
    },
  },
});
