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
    geotag: {
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
    },
  },

  /** 组件数据字段监听器 **/
  observers: {
    geotag: async function (geotag) {
      if (!geotag) {
        return;
      }

      // buttonIcons
      const checkButtonIcons = geotag.operations && geotag.operations.buttonIcons;
      if (!checkButtonIcons) {
        return;
      }

      const buttonIconsArr = geotag.operations.buttonIcons;
      if (buttonIconsArr.length > 0) {
        const likeItem = buttonIconsArr.find((item) => item.code === 'like');
        const dislikeItem = buttonIconsArr.find((item) => item.code === 'dislike');
        const followItem = buttonIconsArr.find((item) => item.code === 'follow');
        const blockItem = buttonIconsArr.find((item) => item.code === 'block');

        const buttonIcons = {
          like: likeItem ? likeItem.imageUrl : '/assets/images/interaction/like.png',
          likeActive: likeItem ? likeItem.imageActiveUrl : '/assets/images/interaction/like-active.png',
          dislike: dislikeItem ? dislikeItem.imageUrl : '/assets/images/interaction/dislike.png',
          dislikeActive: dislikeItem ? dislikeItem.imageActiveUrl : '/assets/images/interaction/dislike-active.png',
          follow: followItem ? followItem.imageUrl : '/assets/images/interaction/follow.png',
          followActive: followItem ? followItem.imageActiveUrl : '/assets/images/interaction/follow-active.png',
          block: blockItem ? blockItem.imageUrl : '/assets/images/interaction/block.png',
          blockActive: blockItem ? blockItem.imageActiveUrl : '/assets/images/interaction/block-active.png',
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
    onClickgeotagLike: async function () {
      const geotag = this.data.geotag;
      const initialgeotag = JSON.parse(JSON.stringify(this.data.geotag)); // 拷贝一个小组初始数据

      if (geotag.interaction.likeStatus) {
        geotag.interaction.likeStatus = false; // 取消赞
        geotag.likeCount = geotag.likeCount ? geotag.likeCount - 1 : geotag.likeCount; // 计数减一
      } else {
        geotag.interaction.likeStatus = true; // 赞
        geotag.likeCount = geotag.likeCount ? geotag.likeCount + 1 : geotag.likeCount; // 计数加一

        if (geotag.interaction.dislikeStatus) {
          geotag.interaction.dislikeStatus = false; // 取消踩
          geotag.dislikeCount = geotag.dislikeCount ? geotag.dislikeCount - 1 : geotag.dislikeCount; // 计数减一
        }
      }

      // mixins/fresnsInteraction.js
      callPageFunction('onChangegeotag', geotag);

      const resultRes = await fresnsApi.user.mark({
        markType: 'like',
        type: 'geotag',
        fsid: geotag.gtid,
      });

      // 接口请求失败，数据还原
      if (resultRes.code != 0) {
        callPageFunction('onChangegeotag', initialgeotag);
      }
    },

    // 踩
    onClickgeotagDislike: async function () {
      const geotag = this.data.geotag;
      const initialgeotag = JSON.parse(JSON.stringify(this.data.geotag)); // 拷贝一个小组初始数据

      if (geotag.interaction.dislikeStatus) {
        geotag.interaction.dislikeStatus = false; // 取消踩
        geotag.dislikeCount = geotag.dislikeCount ? geotag.dislikeCount - 1 : geotag.dislikeCount; // 计数减一
      } else {
        geotag.interaction.dislikeStatus = true; // 踩
        geotag.dislikeCount = geotag.dislikeCount ? geotag.dislikeCount + 1 : geotag.dislikeCount; // 计数加一

        if (geotag.interaction.likeStatus) {
          geotag.interaction.likeStatus = false; // 取消赞
          geotag.likeCount = geotag.likeCount ? geotag.likeCount - 1 : geotag.likeCount; // 计数减一
        }
      }

      // mixins/fresnsInteraction.js
      callPageFunction('onChangegeotag', geotag);

      const resultRes = await fresnsApi.user.mark({
        markType: 'dislike',
        type: 'geotag',
        fsid: geotag.gtid,
      });

      // 接口请求失败，数据还原
      if (resultRes.code != 0) {
        callPageFunction('onChangegeotag', initialgeotag);
      }
    },

    // 关注
    onClickgeotagFollow: async function () {
      const geotag = this.data.geotag;
      const initialgeotag = JSON.parse(JSON.stringify(this.data.geotag)); // 拷贝一个小组初始数据

      if (geotag.interaction.followStatus) {
        geotag.interaction.followStatus = false; // 取消关注
        geotag.followCount = geotag.followCount ? geotag.followCount - 1 : geotag.followCount; // 计数减一
      } else {
        geotag.interaction.followStatus = true; // 关注
        geotag.followCount = geotag.followCount ? geotag.followCount + 1 : geotag.followCount; // 计数加一

        if (geotag.interaction.blockStatus) {
          geotag.interaction.blockStatus = false; // 取消屏蔽
          geotag.blockCount = geotag.blockCount ? geotag.blockCount - 1 : geotag.blockCount; // 计数减一
        }
      }

      // mixins/fresnsInteraction.js
      callPageFunction('onChangegeotag', geotag);

      const resultRes = await fresnsApi.user.mark({
        markType: 'follow',
        type: 'geotag',
        fsid: geotag.gtid,
      });

      // 接口请求失败，数据还原
      if (resultRes.code != 0) {
        callPageFunction('onChangegeotag', initialgeotag);
      }
    },

    // 屏蔽
    onClickgeotagBlock: async function () {
      const geotag = this.data.geotag;
      const initialgeotag = JSON.parse(JSON.stringify(this.data.geotag)); // 拷贝一个小组初始数据

      // 取消屏蔽
      if (geotag.interaction.blockStatus) {
        geotag.interaction.blockStatus = false; // 取消屏蔽
        geotag.blockCount = geotag.blockCount ? geotag.blockCount - 1 : geotag.blockCount; // 计数减一

        // mixins/fresnsInteraction.js
        callPageFunction('onChangegeotag', geotag);

        const resultRes = await fresnsApi.user.mark({
          markType: 'block',
          type: 'geotag',
          fsid: geotag.gtid,
        });

        // 接口请求失败，数据还原
        if (resultRes.code != 0) {
          callPageFunction('onChangegeotag', initialgeotag);
        }

        return;
      }

      // 屏蔽操作，二次确认
      wx.showModal({
        title: geotag.interaction.blockName,
        cancelText: await fresnsLang('cancel'),
        confirmText: await fresnsLang('confirm'),

        success: async (res) => {
          // 确认
          if (res.confirm) {
            geotag.interaction.blockStatus = true; // 屏蔽
            geotag.blockCount = geotag.blockCount ? geotag.blockCount + 1 : geotag.blockCount; // 计数加一

            if (geotag.interaction.followStatus) {
              geotag.interaction.followStatus = false; // 取消关注
              geotag.followCount = geotag.followCount ? geotag.followCount - 1 : geotag.followCount; // 计数减一
            }

            // mixins/fresnsInteraction.js
            callPageFunction('onChangegeotag', geotag);

            const resultRes = await fresnsApi.user.mark({
              markType: 'block',
              type: 'geotag',
              fsid: geotag.gtid,
            });

            // 接口请求失败，数据还原
            if (resultRes.code != 0) {
              callPageFunction('onChangegeotag', initialgeotag);
            }
          }
        },
      });
    },
  },
});
