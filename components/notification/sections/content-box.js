/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsViewProfilePath } from '../../../sdk/helpers/profiles';

Component({
  /** 组件的属性列表 **/
  properties: {
    actionTarget: {
      type: Number,
      value: 1,
    },
    actionInfo: {
      type: Object,
      value: null,
    },
  },

  /** 组件的初始数据 **/
  data: {
    url: null,
    avatar: null,
    content: null,
    groupName: null,
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached: async function () {
      const actionTarget = this.data.actionTarget;
      const actionInfo = this.data.actionInfo;

      let url = null;
      let avatar = null;
      let content = null;
      let groupName = null;

      switch (actionTarget) {
        case 1:
          // 用户
          url =  await fresnsViewProfilePath(actionInfo.fsid),
          avatar = actionInfo.avatar;
          content = actionInfo.nickname + ': ' + actionInfo.bio;
          break;

        case 2:
          // 小组
          url = '/pages/groups/detail?gid=' + actionInfo.gid;
          avatar = actionInfo.cover;
          content = actionInfo.description;
          break;

        case 3:
          // 话题
          url = '/pages/hashtags/detail?htid=' + actionInfo.htid;
          avatar = actionInfo.cover;
          content = actionInfo.name;
          break;

        case 4:
          // 地理
          url = '/pages/geotags/detail?gtid=' + actionInfo.gtid;
          avatar = actionInfo.cover;
          content = actionInfo.name;
          break;

        case 5:
          // 帖子
          url = '/pages/posts/detail?pid=' + actionInfo.pid;
          avatar = actionInfo.author.avatar;
          content = actionInfo.title || actionInfo.content;
          groupName = actionInfo.group ? actionInfo.group.name : null;
          break;

        case 6:
          // 评论
          url = '/pages/comments/detail?cid=' + actionInfo.cid;
          avatar = actionInfo.author.avatar;
          content = actionInfo.content;
          break;

        default:
        // code
      }

      const summaries = content.length > 26 ? content.slice(0, 26) + '...' : content;

      this.setData({
        url: url,
        avatar: avatar,
        content: summaries,
        groupName: groupName,
      });
    },
  },
});
