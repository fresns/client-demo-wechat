/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../../sdk/services';
import { fresnsLang } from '../../../sdk/helpers/configs';
import { callPageFunction } from '../../../sdk/utilities/toolkit';

Component({
  /** 组件的属性列表 **/
  properties: {
    hashtag: {
      type: Object,
      value: null,
    },
  },

  /** 组件的初始数据 **/
  data: {
    buttonIcons: {
      like: 'https://assets.fresns.cn/communities/interaction/like.png',
      likeActive: 'https://assets.fresns.cn/communities/interaction/like-active.png',
      dislike: 'https://assets.fresns.cn/communities/interaction/dislike.png',
      dislikeActive: 'https://assets.fresns.cn/communities/interaction/dislike-active.png',
      follow: 'https://assets.fresns.cn/communities/interaction/follow.png',
      followActive: 'https://assets.fresns.cn/communities/interaction/follow-active.png',
      block: 'https://assets.fresns.cn/communities/interaction/block.png',
      blockActive: 'https://assets.fresns.cn/communities/interaction/block-active.png',
    },
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached: async function () {
      const hashtag = this.data.hashtag;

      // buttonIcons
      const checkButtonIcons = hashtag.operations && hashtag.operations.buttonIcons;
      if (!checkButtonIcons) {
        return;
      }

      const ButtonIconsArr = hashtag.operations.buttonIcons;
      const likeItem = ButtonIconsArr.find((item) => item.code === 'like');
      const dislikeItem = ButtonIconsArr.find((item) => item.code === 'dislike');
      const followItem = ButtonIconsArr.find((item) => item.code === 'follow');
      const blockItem = ButtonIconsArr.find((item) => item.code === 'block');

      const buttonIcons = {
        like: likeItem ? likeItem.imageUrl : 'https://assets.fresns.cn/communities/interaction/like.png',
        likeActive: likeItem
          ? likeItem.imageActiveUrl
          : 'https://assets.fresns.cn/communities/interaction/like-active.png',
        dislike: dislikeItem ? dislikeItem.imageUrl : 'https://assets.fresns.cn/communities/interaction/dislike.png',
        dislikeActive: dislikeItem
          ? dislikeItem.imageActiveUrl
          : 'https://assets.fresns.cn/communities/interaction/dislike-active.png',
        follow: followItem ? followItem.imageUrl : 'https://assets.fresns.cn/communities/interaction/follow.png',
        followActive: followItem
          ? followItem.imageActiveUrl
          : 'https://assets.fresns.cn/communities/interaction/follow-active.png',
        block: blockItem ? blockItem.imageUrl : 'https://assets.fresns.cn/communities/interaction/block.png',
        blockActive: blockItem
          ? blockItem.imageActiveUrl
          : 'https://assets.fresns.cn/communities/interaction/block-active.png',
      };

      this.setData({
        buttonIcons: buttonIcons,
      });
    },
  },

  /** 组件功能 **/
  methods: {
    // 赞
    onClickHashtagLike: async function () {
      const hashtag = this.data.hashtag;
      const initialHashtag = JSON.parse(JSON.stringify(this.data.hashtag)); // 拷贝一个小组初始数据

      if (hashtag.interaction.likeStatus) {
        hashtag.interaction.likeStatus = false; // 取消赞
        hashtag.likeCount = hashtag.likeCount ? hashtag.likeCount - 1 : hashtag.likeCount; // 计数减一
      } else {
        hashtag.interaction.likeStatus = true; // 赞
        hashtag.likeCount = hashtag.likeCount ? hashtag.likeCount + 1 : hashtag.likeCount; // 计数加一

        if (hashtag.interaction.dislikeStatus) {
          hashtag.interaction.dislikeStatus = false; // 取消踩
          hashtag.dislikeCount = hashtag.dislikeCount ? hashtag.dislikeCount - 1 : hashtag.dislikeCount; // 计数减一
        }
      }

      // mixins/fresnsInteraction.js
      callPageFunction('onChangeHashtag', hashtag);

      const resultRes = await fresnsApi.user.mark({
        markType: 'like',
        type: 'hashtag',
        fsid: hashtag.htid,
      });

      // 接口请求失败，数据还原
      if (resultRes.code != 0) {
        callPageFunction('onChangeHashtag', initialHashtag);
      }
    },

    // 踩
    onClickHashtagDislike: async function () {
      const hashtag = this.data.hashtag;
      const initialHashtag = JSON.parse(JSON.stringify(this.data.hashtag)); // 拷贝一个小组初始数据

      if (hashtag.interaction.dislikeStatus) {
        hashtag.interaction.dislikeStatus = false; // 取消踩
        hashtag.dislikeCount = hashtag.dislikeCount ? hashtag.dislikeCount - 1 : hashtag.dislikeCount; // 计数减一
      } else {
        hashtag.interaction.dislikeStatus = true; // 踩
        hashtag.dislikeCount = hashtag.dislikeCount ? hashtag.dislikeCount + 1 : hashtag.dislikeCount; // 计数加一

        if (hashtag.interaction.likeStatus) {
          hashtag.interaction.likeStatus = false; // 取消赞
          hashtag.likeCount = hashtag.likeCount ? hashtag.likeCount - 1 : hashtag.likeCount; // 计数减一
        }
      }

      // mixins/fresnsInteraction.js
      callPageFunction('onChangeHashtag', hashtag);

      const resultRes = await fresnsApi.user.mark({
        markType: 'dislike',
        type: 'hashtag',
        fsid: hashtag.htid,
      });

      // 接口请求失败，数据还原
      if (resultRes.code != 0) {
        callPageFunction('onChangeHashtag', initialHashtag);
      }
    },

    // 关注
    onClickHashtagFollow: async function () {
      const hashtag = this.data.hashtag;
      const initialHashtag = JSON.parse(JSON.stringify(this.data.hashtag)); // 拷贝一个小组初始数据

      if (hashtag.interaction.followStatus) {
        hashtag.interaction.followStatus = false; // 取消关注
        hashtag.followCount = hashtag.followCount ? hashtag.followCount - 1 : hashtag.followCount; // 计数减一
      } else {
        hashtag.interaction.followStatus = true; // 关注
        hashtag.followCount = hashtag.followCount ? hashtag.followCount + 1 : hashtag.followCount; // 计数加一

        if (hashtag.interaction.blockStatus) {
          hashtag.interaction.blockStatus = false; // 取消屏蔽
          hashtag.blockCount = hashtag.blockCount ? hashtag.blockCount - 1 : hashtag.blockCount; // 计数减一
        }
      }

      // mixins/fresnsInteraction.js
      callPageFunction('onChangeHashtag', hashtag);

      const resultRes = await fresnsApi.user.mark({
        markType: 'follow',
        type: 'hashtag',
        fsid: hashtag.htid,
      });

      // 接口请求失败，数据还原
      if (resultRes.code != 0) {
        callPageFunction('onChangeHashtag', initialHashtag);
      }
    },

    // 屏蔽
    onClickHashtagBlock: async function () {
      const hashtag = this.data.hashtag;
      const initialHashtag = JSON.parse(JSON.stringify(this.data.hashtag)); // 拷贝一个小组初始数据

      // 取消屏蔽
      if (hashtag.interaction.blockStatus) {
        hashtag.interaction.blockStatus = false; // 取消屏蔽
        hashtag.blockCount = hashtag.blockCount ? hashtag.blockCount - 1 : hashtag.blockCount; // 计数减一

        // mixins/fresnsInteraction.js
        callPageFunction('onChangeHashtag', hashtag);

        const resultRes = await fresnsApi.user.mark({
          markType: 'block',
          type: 'hashtag',
          fsid: hashtag.htid,
        });

        // 接口请求失败，数据还原
        if (resultRes.code != 0) {
          callPageFunction('onChangeHashtag', initialHashtag);
        }

        return;
      }

      // 屏蔽操作，二次确认
      wx.showModal({
        title: hashtag.interaction.blockName,
        cancelText: await fresnsLang('cancel'),
        confirmText: await fresnsLang('confirm'),

        success: async (res) => {
          // 确认
          if (res.confirm) {
            hashtag.interaction.blockStatus = true; // 屏蔽
            hashtag.blockCount = hashtag.blockCount ? hashtag.blockCount + 1 : hashtag.blockCount; // 计数加一

            if (hashtag.interaction.followStatus) {
              hashtag.interaction.followStatus = false; // 取消关注
              hashtag.followCount = hashtag.followCount ? hashtag.followCount - 1 : hashtag.followCount; // 计数减一
            }

            // mixins/fresnsInteraction.js
            callPageFunction('onChangeHashtag', hashtag);

            const resultRes = await fresnsApi.user.mark({
              markType: 'block',
              type: 'hashtag',
              fsid: hashtag.htid,
            });

            // 接口请求失败，数据还原
            if (resultRes.code != 0) {
              callPageFunction('onChangeHashtag', initialHashtag);
            }
          }
        },
      });
    },
  },
});
