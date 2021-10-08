/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import { getCurPage } from '../../util/getCurPage'
import Api from '../../api/api'

Component({
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    curRoute: null,
    tabs: [
      {
        text: '门户',
        route: '/pages/portal/index',
        iconPath: 'https://cdn.fresns.cn/configs/tabbar/default_home.png',
        selectedIconPath: 'https://cdn.fresns.cn/configs/tabbar/default_home_active.png',
      },
      {
        text: '成员',
        route: '/pages/members/index',
        iconPath: 'https://cdn.fresns.cn/configs/tabbar/default_member.png',
        selectedIconPath: 'https://cdn.fresns.cn/configs/tabbar/default_member_active.png',
      },
      {
        text: '小组',
        route: '/pages/groups/index',
        iconPath: 'https://cdn.fresns.cn/configs/tabbar/default_group.png',
        selectedIconPath: 'https://cdn.fresns.cn/configs/tabbar/default_group_active.png',
      },
      {
        text: '话题',
        route: '/pages/hashtags/index',
        iconPath: 'https://cdn.fresns.cn/configs/tabbar/default_hashtag.png',
        selectedIconPath: 'https://cdn.fresns.cn/configs/tabbar/default_hashtag_active.png',
      },
      {
        text: '帖子',
        route: '/pages/posts/index',
        iconPath: 'https://cdn.fresns.cn/configs/tabbar/default_post.png',
        selectedIconPath: 'https://cdn.fresns.cn/configs/tabbar/default_post_active.png',
      },
      {
        text: '评论',
        route: '/pages/comments/index',
        iconPath: 'https://cdn.fresns.cn/configs/tabbar/default_comment.png',
        selectedIconPath: 'https://cdn.fresns.cn/configs/tabbar/default_comment_active.png',
      },
      {
        text: '消息',
        route: '/pages/messages/index',
        iconPath: 'https://cdn.fresns.cn/configs/tabbar/default_message.png',
        selectedIconPath: 'https://cdn.fresns.cn/configs/tabbar/default_message_active.png',
      },
      {
        text: '我',
        route: '/pages/user/index',
        iconPath: 'https://cdn.fresns.cn/configs/tabbar/default_user.png',
        selectedIconPath: 'https://cdn.fresns.cn/configs/tabbar/default_user_active.png',
      },
    ],
  },
  lifetimes: {
    attached: async function () {
      const curRoute = getCurPage().route
      this.setData({ curRoute: '/' + curRoute })

      const infoOverviewRes = await Api.info.infoOverview()
      if (infoOverviewRes.code === 0) {
        const { tabs } = this.data
        tabs.forEach(tab => {
          if (tab.text === '消息') {
            const notifyUnread = infoOverviewRes.data.notifyUnread
            let res = 0
            Object.getOwnPropertyNames(notifyUnread).forEach(key => {
              res += notifyUnread[key]
            })
            tab.badge = res
          }
        })

        this.setData({
          tabs: this.data.tabs,
        })
      }
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {},
})
