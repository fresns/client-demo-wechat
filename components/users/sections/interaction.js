/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../../sdk/services/api';
import { fresnsLang } from '../../../sdk/helpers/configs';
import { callPageFunction } from '../../../sdk/utilities/toolkit';

Component({
  /** 组件的属性列表 **/
  properties: {
    user: {
      type: Object,
      value: null,
    },
  },

  /** 组件的初始数据 **/
  data: {
    buttonIcons: {
      like: '/assets/images/interaction/like.png',
      likeActive: '/assets/images/interaction/like-active.png',
      dislike: '/assets/images/interaction/dislike.png',
      dislikeActive: '/assets/images/interaction/dislike-active.png',
      follow: '/assets/images/interaction/follow.png',
      followActive: '/assets/images/interaction/follow-active.png',
      block: '/assets/images/interaction/block.png',
      blockActive: '/assets/images/interaction/block-active.png',
      more: '/assets/images/interaction/content-more.png',
      moreActive: '/assets/images/interaction/content-more.png',
    },
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
        const likeItem = buttonIconsArr.find((item) => item.code === 'like');
        const dislikeItem = buttonIconsArr.find((item) => item.code === 'dislike');
        const followItem = buttonIconsArr.find((item) => item.code === 'follow');
        const blockItem = buttonIconsArr.find((item) => item.code === 'block');
        const moreItem = buttonIconsArr.find((item) => item.code === 'more');

        const buttonIcons = {
          like: likeItem ? likeItem.imageUrl : '/assets/images/interaction/like.png',
          likeActive: likeItem ? likeItem.imageActiveUrl : '/assets/images/interaction/like-active.png',
          dislike: dislikeItem ? dislikeItem.imageUrl : '/assets/images/interaction/dislike.png',
          dislikeActive: dislikeItem ? dislikeItem.imageActiveUrl : '/assets/images/interaction/dislike-active.png',
          follow: followItem ? followItem.imageUrl : '/assets/images/interaction/follow.png',
          followActive: followItem ? followItem.imageActiveUrl : '/assets/images/interaction/follow-active.png',
          block: blockItem ? blockItem.imageUrl : '/assets/images/interaction/block.png',
          blockActive: blockItem ? blockItem.imageActiveUrl : '/assets/images/interaction/block-active.png',
          more: moreItem ? moreItem.imageUrl : '/assets/images/interaction/content-more.png',
          moreActive: moreItem ? moreItem.imageActiveUrl : undefined,
        };

        this.setData({
          buttonIcons: buttonIcons,
        });
      }
    },
  },

  /** 组件功能 **/
  methods: {
    // 赞
    onClickUserLike: async function () {
      const user = this.data.user;
      const initialUser = JSON.parse(JSON.stringify(this.data.user)); // 拷贝一个用户初始数据

      if (user.interaction.likeStatus) {
        user.interaction.likeStatus = false; // 取消赞
        user.stats.likerCount = user.stats.likerCount ? user.stats.likerCount - 1 : user.stats.likerCount; // 计数减一
      } else {
        user.interaction.likeStatus = true; // 赞
        user.stats.likerCount = user.stats.likerCount ? user.stats.likerCount + 1 : user.stats.likerCount; // 计数加一

        if (user.interaction.dislikeStatus) {
          user.interaction.dislikeStatus = false; // 取消踩
          user.stats.dislikerCount = user.stats.dislikerCount ? user.stats.dislikerCount - 1 : user.stats.dislikerCount; // 计数减一
        }
      }

      // mixins/fresnsInteraction.js
      callPageFunction('onChangeUser', user);

      const resultRes = await fresnsApi.user.mark({
        markType: 'like',
        type: 'user',
        fsid: user.uid,
      });

      // 接口请求失败，数据还原
      if (resultRes.code != 0) {
        callPageFunction('onChangeUser', initialUser);
      }
    },

    // 踩
    onClickUserDislike: async function () {
      const user = this.data.user;
      const initialUser = JSON.parse(JSON.stringify(this.data.user)); // 拷贝一个用户初始数据

      if (user.interaction.dislikeStatus) {
        user.interaction.dislikeStatus = false; // 取消踩
        user.stats.dislikerCount = user.stats.dislikerCount ? user.stats.dislikerCount - 1 : user.stats.dislikerCount; // 计数减一
      } else {
        user.interaction.dislikeStatus = true; // 踩
        user.stats.dislikerCount = user.stats.dislikerCount ? user.stats.dislikerCount + 1 : user.stats.dislikerCount; // 计数加一

        if (user.interaction.likeStatus) {
          user.interaction.likeStatus = false; // 取消赞
          user.stats.likerCount = user.stats.likerCount ? user.stats.likerCount - 1 : user.stats.likerCount; // 计数减一
        }
      }

      // mixins/fresnsInteraction.js
      callPageFunction('onChangeUser', user);

      const resultRes = await fresnsApi.user.mark({
        markType: 'dislike',
        type: 'user',
        fsid: user.uid,
      });

      // 接口请求失败，数据还原
      if (resultRes.code != 0) {
        callPageFunction('onChangeUser', initialUser);
      }
    },

    // 关注
    onClickUserFollow: async function () {
      const user = this.data.user;
      const initialUser = JSON.parse(JSON.stringify(this.data.user)); // 拷贝一个用户初始数据

      if (user.interaction.followStatus) {
        user.interaction.followStatus = false; // 取消关注
        user.stats.followerCount = user.stats.followerCount ? user.stats.followerCount - 1 : user.stats.followerCount; // 计数减一
      } else {
        user.interaction.followStatus = true; // 关注
        user.stats.followerCount = user.stats.followerCount ? user.stats.followerCount + 1 : user.stats.followerCount; // 计数加一

        if (user.interaction.blockStatus) {
          user.interaction.blockStatus = false; // 取消屏蔽
          user.stats.blockerCount = user.stats.blockerCount ? user.stats.blockerCount - 1 : user.stats.blockerCount; // 计数减一
        }
      }

      // mixins/fresnsInteraction.js
      callPageFunction('onChangeUser', user);

      const resultRes = await fresnsApi.user.mark({
        markType: 'follow',
        type: 'user',
        fsid: user.uid,
      });

      // 接口请求失败，数据还原
      if (resultRes.code != 0) {
        callPageFunction('onChangeUser', initialUser);
      }
    },

    // 屏蔽
    onClickUserBlock: async function () {
      const user = this.data.user;
      const initialUser = JSON.parse(JSON.stringify(this.data.user)); // 拷贝一个用户初始数据

      // 取消屏蔽
      if (user.interaction.blockStatus) {
        user.interaction.blockStatus = false; // 取消屏蔽
        user.stats.blockerCount = user.stats.blockerCount ? user.stats.blockerCount - 1 : user.stats.blockerCount; // 计数减一

        // mixins/fresnsInteraction.js
        callPageFunction('onChangeUser', user);

        const resultRes = await fresnsApi.user.mark({
          markType: 'block',
          type: 'user',
          fsid: user.uid,
        });

        // 接口请求失败，数据还原
        if (resultRes.code != 0) {
          callPageFunction('onChangeUser', initialUser);
        }

        return;
      }

      // 屏蔽操作，二次确认
      wx.showModal({
        title: user.interaction.blockName,
        cancelText: await fresnsLang('cancel'),
        confirmText: await fresnsLang('confirm'),

        success: async (res) => {
          // 确认
          if (res.confirm) {
            user.interaction.blockStatus = true; // 屏蔽
            user.stats.blockerCount = user.stats.blockerCount ? user.stats.blockerCount + 1 : user.stats.blockerCount; // 计数加一

            if (user.interaction.followStatus) {
              user.interaction.followStatus = false; // 取消关注
              user.stats.followerCount = user.stats.followerCount
                ? user.stats.followerCount - 1
                : user.stats.followerCount; // 计数减一
            }

            // mixins/fresnsInteraction.js
            callPageFunction('onChangeUser', user);

            const resultRes = await fresnsApi.user.mark({
              markType: 'block',
              type: 'user',
              fsid: user.uid,
            });

            // 接口请求失败，数据还原
            if (resultRes.code != 0) {
              callPageFunction('onChangeUser', initialUser);
            }
          }
        },
      });
    },
  },
});
