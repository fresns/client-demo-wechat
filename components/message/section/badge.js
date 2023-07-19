/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsConfig, fresnsLang } from '../../../api/tool/function';

Component({
  /** 组件的属性列表 **/
  properties: {
    notification: Object,
  },

  /** 组件的初始数据 **/
  data: {
    typeName: null,
    badgeName: null,
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached: async function () {
      const notification = this.data.notification;

      // 通知类型
      let typeName = '';
      switch (notification.type) {
        case 1:
          // 系统
          typeName = await fresnsConfig('menu_notifications_systems');
          break;

        case 2:
          // 推荐
          typeName = await fresnsConfig('menu_notifications_recommends');
          break;

        case 3:
          // 点赞了你
          typeName = await fresnsLang('notificationLike');
          break;

        case 4:
          // 踩了你
          typeName = await fresnsLang('notificationDislike');
          break;

        case 5:
          // 关注了你
          typeName = await fresnsLang('notificationFollow');
          break;

        case 6:
          // 屏蔽了你
          typeName = await fresnsLang('notificationBlock');
          break;

        case 7:
          // 提及了你
          typeName = await fresnsLang('notificationMention');
          break;

        case 8:
          // 评论了你
          typeName = await fresnsLang('notificationComment');
          break;

        case 9:
          // 引用了你
          typeName = await fresnsLang('notificationQuote');
          break;

        default:
          // code
      }

      // 触发对象
      let actionObjectName = '';
      switch (notification.actionObject) {
        case 1:
          // 用户
          actionObjectName = await fresnsConfig('user_name');
          break;

        case 2:
          // 小组
          actionObjectName = await fresnsConfig('group_name');
          break;

        case 3:
          // 话题
          actionObjectName = await fresnsConfig('hashtag_name');
          break;

        case 4:
          // 帖子
          actionObjectName = await fresnsConfig('post_name');
          break;

        case 5:
          // 评论
          actionObjectName = await fresnsConfig('comment_name');
          break;

        default:
          // code
      }

      // 触发事件
      let actionTypeName = '';
      switch (notification.actionType) {
        case 6:
          // 编辑
          actionTypeName = await fresnsLang('modify');
          break;

        case 7:
          // 删除
          actionTypeName = await fresnsLang('delete');
          break;

        case 8:
          // 置顶
          actionTypeName = (await fresnsLang('setting')) + '（' + (await fresnsLang('contentSticky')) + '）';
          break;

        case 9:
          // 设精
          actionTypeName = (await fresnsLang('setting')) + '（' + (await fresnsLang('contentDigest')) + '）';
          break;

        case 10:
          // 管理
          actionTypeName = await fresnsLang('setting');
          break;

        default:
          // code
      }

      // 是否为提及通知（别人内容里提及了我，然后互动通知的我）
      let mentionName = '';
      if (notification.isMention) {
        mentionName = '(' + (await fresnsLang('notificationFromContentMentionYou')) + ')';
      }

      // 组装提示文本
      let badgeName = typeName + ': ' + actionObjectName + mentionName;
      if (notification.type === 1 || notification.type === 2) {
        badgeName = actionObjectName + ': ' + actionTypeName;
      }

      this.setData({
        typeName: typeName,
        badgeName: badgeName,
      });
    },
  },
});
