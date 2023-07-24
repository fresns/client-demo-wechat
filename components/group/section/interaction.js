/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../../api/api';
import { callPageFunction } from '../../../utils/fresnsUtilities';

Component({
  /** 组件的属性列表 **/
  properties: {
    group: Object,
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
    },
  },

  /** 组件数据字段监听器 **/
  observers: {
    group: async function (group) {
      if (!group) {
        return;
      }

      // buttonIcons
      const checkButtonIcons = group.operations && group.operations.buttonIcons;
      if (!checkButtonIcons) {
        return;
      }

      const ButtonIconsArr = group.operations.buttonIcons;
      const likeItem = ButtonIconsArr.find((item) => item.code === 'like');
      const dislikeItem = ButtonIconsArr.find((item) => item.code === 'dislike');
      const followItem = ButtonIconsArr.find((item) => item.code === 'follow');
      const blockItem = ButtonIconsArr.find((item) => item.code === 'block');

      const buttonIcons = {
        like: likeItem ? likeItem.imageUrl : '/assets/interaction/like.png',
        likeActive: likeItem ? likeItem.imageActiveUrl : '/assets/interaction/like-active.png',
        dislike: dislikeItem ? dislikeItem.imageUrl : '/assets/interaction/dislike.png',
        dislikeActive: dislikeItem ? dislikeItem.imageActiveUrl : '/assets/interaction/dislike-active.png',
        follow: followItem ? followItem.imageUrl : '/assets/interaction/follow.png',
        followActive: followItem ? followItem.imageActiveUrl : '/assets/interaction/follow-active.png',
        block: blockItem ? blockItem.imageUrl : '/assets/interaction/block.png',
        blockActive: blockItem ? blockItem.imageActiveUrl : '/assets/interaction/block-active.png',
      };

      this.setData({
        buttonIcons: buttonIcons,
      });
    },
  },

  /** 组件功能 **/
  methods: {
    // 赞
    onClickGroupLike: async function () {
      const group = this.data.group;
      const initialGroup = JSON.parse(JSON.stringify(this.data.group)); // 拷贝一个小组初始数据

      if (group.interaction.likeStatus) {
        group.interaction.likeStatus = false; // 取消赞
        group.likeCount = group.likeCount ? group.likeCount - 1 : group.likeCount; // 计数减一
      } else {
        group.interaction.likeStatus = true; // 赞
        group.likeCount = group.likeCount + 1; // 计数加一

        if (group.interaction.dislikeStatus) {
          group.interaction.dislikeStatus = false; // 取消踩
          group.dislikeCount = group.dislikeCount ? group.dislikeCount - 1 : group.dislikeCount; // 计数减一
        }
      }

      // mixins/fresnsInteraction.js
      callPageFunction('onChangeGroup', group);

      const resultRes = await fresnsApi.user.userMark({
        interactionType: 'like',
        markType: 'group',
        fsid: group.gid,
      });

      // 接口请求失败，数据还原
      if (resultRes.code != 0) {
        callPageFunction('onChangeGroup', initialGroup);
      }
    },

    // 踩
    onClickGroupDislike: async function () {
      const group = this.data.group;
      const initialGroup = JSON.parse(JSON.stringify(this.data.group)); // 拷贝一个小组初始数据

      if (group.interaction.dislikeStatus) {
        group.interaction.dislikeStatus = false; // 取消踩
        group.dislikeCount = group.dislikeCount ? group.dislikeCount - 1 : group.dislikeCount; // 计数减一
      } else {
        group.interaction.dislikeStatus = true; // 踩
        group.dislikeCount = group.dislikeCount + 1; // 计数加一

        if (group.interaction.likeStatus) {
          group.interaction.likeStatus = false; // 取消赞
          group.likeCount = group.likeCount ? group.likeCount - 1 : group.likeCount; // 计数减一
        }
      }

      // mixins/fresnsInteraction.js
      callPageFunction('onChangeGroup', group);

      const resultRes = await fresnsApi.user.userMark({
        interactionType: 'dislike',
        markType: 'group',
        fsid: group.gid,
      });

      // 接口请求失败，数据还原
      if (resultRes.code != 0) {
        callPageFunction('onChangeGroup', initialGroup);
      }
    },

    // 关注
    onClickGroupFollow: async function () {
      const group = this.data.group;
      const initialGroup = JSON.parse(JSON.stringify(this.data.group)); // 拷贝一个小组初始数据

      if (group.interaction.followStatus) {
        group.interaction.followStatus = false; // 取消关注
        group.followCount = group.followCount ? group.followCount - 1 : group.followCount; // 计数减一
      } else {
        group.interaction.followStatus = true; // 关注
        group.followCount = group.followCount + 1; // 计数加一

        if (group.interaction.blockStatus) {
          group.interaction.blockStatus = false; // 取消屏蔽
          group.blockCount = group.blockCount ? group.blockCount - 1 : group.blockCount; // 计数减一
        }
      }

      // mixins/fresnsInteraction.js
      callPageFunction('onChangeGroup', group);

      const resultRes = await fresnsApi.user.userMark({
        interactionType: 'follow',
        markType: 'group',
        fsid: group.gid,
      });

      // 接口请求失败，数据还原
      if (resultRes.code != 0) {
        callPageFunction('onChangeGroup', initialGroup);
      }
    },

    // 屏蔽
    onClickGroupBlock: async function () {
      const group = this.data.group;
      const initialGroup = JSON.parse(JSON.stringify(this.data.group)); // 拷贝一个小组初始数据

      if (group.interaction.blockStatus) {
        group.interaction.blockStatus = false; // 取消屏蔽
        group.blockCount = group.blockCount ? group.blockCount - 1 : group.blockCount; // 计数减一
      } else {
        group.interaction.blockStatus = true; // 屏蔽
        group.blockCount = group.blockCount + 1; // 计数加一

        if (group.interaction.followStatus) {
          group.interaction.followStatus = false; // 取消关注
          group.followCount = group.followCount ? group.followCount - 1 : group.followCount; // 计数减一
        }
      }

      // mixins/fresnsInteraction.js
      callPageFunction('onChangeGroup', group);

      const resultRes = await fresnsApi.user.userMark({
        interactionType: 'block',
        markType: 'group',
        fsid: group.gid,
      });

      // 接口请求失败，数据还原
      if (resultRes.code != 0) {
        callPageFunction('onChangeGroup', initialGroup);
      }
    },
  },
});
