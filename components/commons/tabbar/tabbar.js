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
        iconPath: '/assets/images/tabbar/home.png',
        selectedIconPath: '/assets/images/tabbar/home-active.png',
      },
      {
        label: 'users',
        text: '用户',
        textKey: 'channel_user_name',
        pagePath: '/pages/users/index',
        iconPath: '/assets/images/tabbar/users.png',
        selectedIconPath: '/assets/images/tabbar/users-active.png',
      },
      {
        label: 'groups',
        text: '小组',
        textKey: 'channel_group_name',
        pagePath: '/pages/groups/index',
        iconPath: '/assets/images/tabbar/groups.png',
        selectedIconPath: '/assets/images/tabbar/groups-active.png',
      },
      {
        label: 'hashtags',
        text: '话题',
        textKey: 'channel_hashtag_name',
        pagePath: '/pages/hashtags/index',
        iconPath: '/assets/images/tabbar/hashtags.png',
        selectedIconPath: '/assets/images/tabbar/hashtags-active.png',
      },
      {
        label: 'geotags',
        text: '地理',
        textKey: 'channel_geotag_name',
        pagePath: '/pages/geotags/index',
        iconPath: '/assets/images/tabbar/geotags.png',
        selectedIconPath: '/assets/images/tabbar/geotags-active.png',
      },
      {
        label: 'posts',
        text: '帖子',
        textKey: 'channel_post_name',
        pagePath: '/pages/posts/index',
        iconPath: '/assets/images/tabbar/posts.png',
        selectedIconPath: '/assets/images/tabbar/posts-active.png',
      },
      {
        label: 'comments',
        text: '评论',
        textKey: 'channel_comment_name',
        pagePath: '/pages/comments/index',
        iconPath: '/assets/images/tabbar/comments.png',
        selectedIconPath: '/assets/images/tabbar/comments-active.png',
      },
      {
        label: 'timelines',
        text: '关注',
        textKey: 'channel_timeline_name',
        pagePath: '/pages/timelines/index',
        iconPath: '/assets/images/tabbar/timelines.png',
        selectedIconPath: '/assets/images/tabbar/timelines-active.png',
      },
      {
        label: 'nearby',
        text: '附近',
        textKey: 'channel_nearby_name',
        pagePath: '/pages/nearby/index',
        iconPath: '/assets/images/tabbar/nearby.png',
        selectedIconPath: '/assets/images/tabbar/nearby-active.png',
      },
      {
        label: 'notifications',
        text: '消息',
        textKey: 'channel_notifications_name',
        pagePath: '/pages/notifications/index',
        iconPath: '/assets/images/tabbar/notifications.png',
        selectedIconPath: '/assets/images/tabbar/notifications-active.png',
        badge: 0,
      },
      {
        label: 'conversations',
        text: '私信',
        textKey: 'channel_conversations_name',
        pagePath: '/pages/conversations/index',
        iconPath: '/assets/images/tabbar/conversations.png',
        selectedIconPath: '/assets/images/tabbar/conversations-active.png',
        badge: 0,
      },
      {
        label: 'me',
        text: '我',
        textKey: 'channel_me_name',
        pagePath: '/pages/me/index',
        iconPath: '/assets/images/tabbar/me.png',
        selectedIconPath: '/assets/images/tabbar/me-active.png',
      },
    ],
    current: null,
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached: async function () {
      const { tabs, activeLabel } = this.data;

      if (fresnsAuth.userLogin) {
        // 获取登录用户的未读消息数
        const unreadNotifications = await fresnsOverview('unreadNotifications.all');
        const unreadMessages = await fresnsOverview('conversations.unreadMessages');

        // 消息赋值
        const notificationsIdx = tabs.findIndex((value) => value.label == 'notifications');
        const conversationsIdx = tabs.findIndex((value) => value.label == 'conversations');

        tabs[notificationsIdx].badge = unreadNotifications;
        tabs[conversationsIdx].badge = unreadMessages;
      }

      const promises = tabs.map(async (tab) => await fresnsConfig(tab.textKey));
      const tabTexts = await Promise.all(promises);

      tabs.forEach((tab, idx) => {
        tab.text = tabTexts[idx];
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

    // 修改通知消息数
    onChangeUnreadNotifications: function () {
      console.log('onChangeUnreadNotifications tabbar');

      const tabs = this.data.tabs;

      const idx = tabs.findIndex((value) => value.label == 'notifications');

      if (idx == -1) {
        // 未找到记录
        return;
      }

      const newCount = tabs[idx].badge - 1;

      tabs[idx].badge = newCount;

      this.setData({
        tabs: tabs,
      });
    },

    // 修改私信消息数
    onChangeUnreadMessages: function (count = 1) {
      console.log('onChangeUnreadMessages tabbar', count);

      const tabs = this.data.tabs;

      const idx = tabs.findIndex((value) => value.label == 'conversations');

      if (idx == -1) {
        // 未找到记录
        return;
      }

      const newCount = tabs[idx].badge - count;

      tabs[idx].badge = newCount;

      this.setData({
        tabs: tabs,
      });
    },
  },
});
