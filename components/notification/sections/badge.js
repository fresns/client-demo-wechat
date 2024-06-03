/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsConfig, fresnsLang } from '../../../sdk/helpers/configs';

Component({
  /** 组件的属性列表 **/
  properties: {
    notification: {
      type: Object,
      value: null,
    },
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

      const type = notification.type;
      const actionType = notification.actionType;
      const actionTarget = notification.actionTarget;
      const isMention = notification.isMention;

      // 通知类型
      let typeName = '';
      switch (type) {
        case 1:
          // 系统
          typeName = await fresnsConfig('channel_notifications_systems_name');
          break;

        case 2:
          // 推荐
          typeName = await fresnsConfig('channel_notifications_recommends_name');
          break;

        case 3:
          // 点赞了你
          typeName = await fresnsLang('notificationLiked');
          break;

        case 4:
          // 踩了你
          typeName = await fresnsLang('notificationDisliked');
          break;

        case 5:
          // 关注了你
          typeName = await fresnsLang('notificationFollowed');
          break;

        case 6:
          // 屏蔽了你
          typeName = await fresnsLang('notificationBlocked');
          break;

        case 7:
          // 提及了你
          typeName = await fresnsLang('notificationMentioned');
          break;

        case 8:
          // 评论了你
          typeName = await fresnsLang('notificationCommented');
          break;

        case 9:
          // 引用了你
          typeName = await fresnsLang('notificationQuoted');
          break;

        default:
        // code
      }

      // 触发对象
      let actionTargetName = '';
      switch (actionTarget) {
        case 1:
          // 用户
          actionTargetName = await fresnsConfig('user_name');
          break;

        case 2:
          // 小组
          actionTargetName = await fresnsConfig('group_name');
          break;

        case 3:
          // 话题
          actionTargetName = await fresnsConfig('hashtag_name');
          break;

        case 4:
          // 地理
          actionTargetName = await fresnsConfig('geotag_name');
          break;

        case 5:
          // 帖子
          actionTargetName = await fresnsConfig('post_name');
          break;

        case 6:
          // 评论
          actionTargetName = await fresnsConfig('comment_name');
          break;

        default:
        // code
      }

      // 触发事件
      let actionTypeName = '';
      switch (actionType) {
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
          actionTypeName = (await fresnsLang('setting')) + ' (' + (await fresnsLang('contentSticky')) + ')';
          break;

        case 9:
          // 设精
          actionTypeName = (await fresnsLang('setting')) + ' (' + (await fresnsLang('contentDigest')) + ')';
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
      if (isMention) {
        mentionName = '(' + (await fresnsLang('notificationFromContentMentionYou')) + ')';
      }

      // 组装提示文本
      let badgeName = typeName + ': ' + actionTargetName + mentionName;
      if (type === 1 || type === 2) {
        badgeName = actionTargetName + ': ' + actionTypeName;
      }

      this.setData({
        typeName: typeName,
        badgeName: badgeName,
      });
    },
  },
});
