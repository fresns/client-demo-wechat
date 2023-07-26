/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../../api/api';
import { callPageFunction } from '../../../utils/fresnsUtilities';
import { fresnsLang } from '../../../api/tool/function';

Component({
  /** 组件的属性列表 **/
  properties: {
    user: Object,
  },

  /** 组件的初始数据 **/
  data: {
    buttonIcons: {
      like: '/assets/interaction/like.png',
      likeActive: '/assets/interaction/like-active.png',
      dislike: '/assets/interaction/dislike.png',
      dislikeActive: '/assets/interaction/dislike-active.png',
      follow: '/assets/interaction/follow.png',
      followActive: '/assets/interaction/follow-active.png',
      block: '/assets/interaction/block.png',
      blockActive: '/assets/interaction/block-active.png',
      more: '/assets/interaction/content-more.png',
      moreActive: '/assets/interaction/content-more.png',
    },
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
      const likeItem = ButtonIconsArr.find((item) => item.code === 'like');
      const dislikeItem = ButtonIconsArr.find((item) => item.code === 'dislike');
      const followItem = ButtonIconsArr.find((item) => item.code === 'follow');
      const blockItem = ButtonIconsArr.find((item) => item.code === 'block');
      const moreItem = ButtonIconsArr.find((item) => item.code === 'more');

      const buttonIcons = {
        like: likeItem ? likeItem.imageUrl : '/assets/interaction/like.png',
        likeActive: likeItem ? likeItem.imageActiveUrl : '/assets/interaction/like-active.png',
        dislike: dislikeItem ? dislikeItem.imageUrl : '/assets/interaction/dislike.png',
        dislikeActive: dislikeItem ? dislikeItem.imageActiveUrl : '/assets/interaction/dislike-active.png',
        follow: followItem ? followItem.imageUrl : '/assets/interaction/follow.png',
        followActive: followItem ? followItem.imageActiveUrl : '/assets/interaction/follow-active.png',
        block: blockItem ? blockItem.imageUrl : '/assets/interaction/block.png',
        blockActive: blockItem ? blockItem.imageActiveUrl : '/assets/interaction/block-active.png',
        more: moreItem ? moreItem.imageUrl : '/assets/interaction/content-more.png',
        moreActive: moreItem ? moreItem.imageActiveUrl : undefined,
      };

      this.setData({
        buttonIcons: buttonIcons,
      });
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
        user.stats.likeMeCount = user.stats.likeMeCount ? user.stats.likeMeCount - 1 : user.stats.likeMeCount; // 计数减一
      } else {
        user.interaction.likeStatus = true; // 赞
        user.stats.likeMeCount = user.stats.likeMeCount + 1; // 计数加一

        if (user.interaction.dislikeStatus) {
          user.interaction.dislikeStatus = false; // 取消踩
          user.stats.dislikeMeCount = user.stats.dislikeMeCount
            ? user.stats.dislikeMeCount - 1
            : user.stats.dislikeMeCount; // 计数减一
        }
      }

      // mixins/fresnsInteraction.js
      callPageFunction('onChangeUser', user);

      const resultRes = await fresnsApi.user.userMark({
        interactionType: 'like',
        markType: 'user',
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
        user.stats.dislikeMeCount = user.stats.dislikeMeCount
          ? user.stats.dislikeMeCount - 1
          : user.stats.dislikeMeCount; // 计数减一
      } else {
        user.interaction.dislikeStatus = true; // 踩
        user.stats.dislikeMeCount = user.stats.dislikeMeCount + 1; // 计数加一

        if (user.interaction.likeStatus) {
          user.interaction.likeStatus = false; // 取消赞
          user.stats.likeMeCount = user.stats.likeMeCount ? user.stats.likeMeCount - 1 : user.stats.likeMeCount; // 计数减一
        }
      }

      // mixins/fresnsInteraction.js
      callPageFunction('onChangeUser', user);

      const resultRes = await fresnsApi.user.userMark({
        interactionType: 'dislike',
        markType: 'user',
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
        user.stats.followMeCount = user.stats.followMeCount ? user.stats.followMeCount - 1 : user.stats.followMeCount; // 计数减一
      } else {
        user.interaction.followStatus = true; // 关注
        user.stats.followMeCount = user.stats.followMeCount + 1; // 计数加一

        if (user.interaction.blockStatus) {
          user.interaction.blockStatus = false; // 取消屏蔽
          user.stats.blockMeCount = user.stats.blockMeCount ? user.stats.blockMeCount - 1 : user.stats.blockMeCount; // 计数减一
        }
      }

      // mixins/fresnsInteraction.js
      callPageFunction('onChangeUser', user);

      const resultRes = await fresnsApi.user.userMark({
        interactionType: 'follow',
        markType: 'user',
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
        user.stats.blockMeCount = user.stats.blockMeCount ? user.stats.blockMeCount - 1 : user.stats.blockMeCount; // 计数减一

        // mixins/fresnsInteraction.js
        callPageFunction('onChangeUser', user);

        const resultRes = await fresnsApi.user.userMark({
          interactionType: 'block',
          markType: 'user',
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
            user.stats.blockMeCount = user.stats.blockMeCount + 1; // 计数加一

            if (user.interaction.followStatus) {
              user.interaction.followStatus = false; // 取消关注
              user.stats.followMeCount = user.stats.followMeCount
                ? user.stats.followMeCount - 1
                : user.stats.followMeCount; // 计数减一
            }

            // mixins/fresnsInteraction.js
            callPageFunction('onChangeUser', user);

            const resultRes = await fresnsApi.user.userMark({
              interactionType: 'block',
              markType: 'user',
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
