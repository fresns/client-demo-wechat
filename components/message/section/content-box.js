/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsLang } from '../../../api/tool/function';
import { globalInfo } from '../../../utils/fresnsGlobalInfo';

Component({
  /** 组件的属性列表 **/
  properties: {
    actionObject: Number,
    actionInfo: Object,
  },

  /** 组件的初始数据 **/
  data: {
    url: null,
    avatar: null,
    name: null,
    content: null,
    isGroup: false,
    gname: null,

    userDeactivate: false,
    isAnonymous: false,
    userDeactivateName: null,
    userAnonymousName: null,
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached: async function () {
      const actionObject = this.data.actionObject;
      const actionInfo = this.data.actionInfo;

      let url = null;
      let avatar = null;
      let name = null;
      let content = null;
      let isGroup = false;
      let gname = null;

      let userDeactivate = false;
      let isAnonymous = false;

      switch (actionObject) {
        case 1:
          // 用户
          const userHomePath = await globalInfo.userHomePath();

          url = userHomePath + actionInfo.fsid;
          avatar = actionInfo.avatar;
          name = actionInfo.nickname;
          content = actionInfo.bio;
          break;

        case 2:
          // 小组
          url = '/pages/groups/detail?gid=' + actionInfo.gid;
          avatar = actionInfo.cover;
          name = actionInfo.gname;
          content = actionInfo.description;
          break;

        case 3:
          // 话题
          url = '/pages/hashtags/detail?hid=' + actionInfo.hid;
          avatar = actionInfo.cover;
          name = actionInfo.hname;
          content = actionInfo.description;
          break;

        case 4:
          // 帖子
          url = '/pages/posts/detail?pid=' + actionInfo.pid;
          avatar = actionInfo.author.avatar;
          name = actionInfo.author.nickname;
          content = actionInfo.content;
          isGroup = actionInfo.group ? true : false;
          gname = actionInfo.group ? actionInfo.group.gname : null;

          userDeactivate = actionInfo.author.status ? false : true;
          isAnonymous = actionInfo.isAnonymous;
          break;

        case 5:
          // 评论
          url = '/pages/comments/detail?cid=' + actionInfo.cid;
          avatar = actionInfo.author.avatar;
          name = actionInfo.author.nickname;
          content = actionInfo.content;

          userDeactivate = actionInfo.author.status ? false : true;
          isAnonymous = actionInfo.isAnonymous;
          break;

        default:
        // code
      }

      let newName = name;
      if (userDeactivate) {
        newName = await fresnsLang('userDeactivate');
      }
      if (isAnonymous) {
        newName = await fresnsLang('contentAuthorAnonymous');
      }

      const newContent = newName + ': ' + content;

      this.setData({
        url: url,
        avatar: avatar,
        content: newContent,
        isGroup: isGroup,
        gname: gname,
      });
    },
  },
});
