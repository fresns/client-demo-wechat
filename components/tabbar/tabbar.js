/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import Api from '../../api/api';
import { globalInfo } from '../../configs/fresnsGlobalInfo';

Component({
    properties: {
        activeLabel: String,
    },

    /**
     * 组件的初始数据
     */
    data: {
        tabs: [
            {
                label: 'portal',
                text: '门户',
                route: '/pages/portal/index',
                iconPath: 'https://cdn.fresns.cn/configs/tabbar/default_home.png',
                selectedIconPath: 'https://cdn.fresns.cn/configs/tabbar/default_home_active.png',
            },
            {
                label: 'user',
                text: '用户',
                route: '/pages/users/index',
                iconPath: 'https://cdn.fresns.cn/configs/tabbar/default_user.png',
                selectedIconPath: 'https://cdn.fresns.cn/configs/tabbar/default_user_active.png',
            },
            {
                label: 'group',
                text: '小组',
                route: '/pages/groups/index',
                iconPath: 'https://cdn.fresns.cn/configs/tabbar/default_group.png',
                selectedIconPath: 'https://cdn.fresns.cn/configs/tabbar/default_group_active.png',
            },
            {
                label: 'hashtags',
                text: '话题',
                route: '/pages/hashtags/index',
                iconPath: 'https://cdn.fresns.cn/configs/tabbar/default_hashtag.png',
                selectedIconPath: 'https://cdn.fresns.cn/configs/tabbar/default_hashtag_active.png',
            },
            {
                label: 'post',
                text: '帖子',
                route: '/pages/posts/index',
                iconPath: 'https://cdn.fresns.cn/configs/tabbar/default_post.png',
                selectedIconPath: 'https://cdn.fresns.cn/configs/tabbar/default_post_active.png',
            },
            {
                label: 'comment',
                text: '评论',
                route: '/pages/comments/index',
                iconPath: 'https://cdn.fresns.cn/configs/tabbar/default_comment.png',
                selectedIconPath: 'https://cdn.fresns.cn/configs/tabbar/default_comment_active.png',
            },
            {
                label: 'message',
                text: '消息',
                route: '/pages/messages/index',
                iconPath: 'https://cdn.fresns.cn/configs/tabbar/default_message.png',
                selectedIconPath: 'https://cdn.fresns.cn/configs/tabbar/default_message_active.png',
            },
            {
                label: 'account',
                text: '我',
                route: '/pages/account/index',
                iconPath: 'https://cdn.fresns.cn/configs/tabbar/default_account.png',
                selectedIconPath: 'https://cdn.fresns.cn/configs/tabbar/default_account_active.png',
            },
        ],
    },
    lifetimes: {
        attached: async function () {
            if (!globalInfo.isLogin()) {
                return;
            }

            const infoOverviewRes = await Api.info.infoOverview();
            if (infoOverviewRes.code === 0) {
                const { tabs } = this.data;
                tabs.forEach((tab) => {
                    if (tab.text === '消息') {
                        const notifyUnread = infoOverviewRes.data.notifyUnread;
                        let res = 0;
                        Object.getOwnPropertyNames(notifyUnread).forEach((key) => {
                            res += notifyUnread[key];
                        });
                        tab.badge = res;
                    }
                });

                this.setData({
                    tabs: this.data.tabs,
                });
            }
        },
    },
    /**
     * 组件的方法列表
     */
    methods: {},
});
