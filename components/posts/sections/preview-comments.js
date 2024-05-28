/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsLang } from '../../../sdk/helpers/configs';
import { fresnsViewProfilePath } from '../../../sdk/helpers/profiles';

Component({
  /** 组件的属性列表 **/
  properties: {
    pid: {
      type: String,
      value: null,
    },
    commentCount: {
      type: Number,
      value: 0,
    },
    previewComments: {
      type: Array,
      value: [],
    },
  },

  /** 组件的初始数据 **/
  data: {
    contentTopComment: '热评',
    modifierCount: '已',
    contentCommentCountDesc: '条回复',
    processedComments: [],
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached: async function () {
      const userProfilePath = await fresnsViewProfilePath();
      const userDeactivate = await fresnsLang('userDeactivate');
      const authorAnonymous = await fresnsLang('contentAuthorAnonymous');

      const previewComments = this.data.previewComments;

      const processedComments = previewComments.map(comment => {
        let nicknameHTML = `<a href="${userProfilePath + comment.author.fsid}" class="nickname-link" style="display:flex;">@${comment.author.nickname}</a>`;

        if (!comment.author.status) {
          nicknameHTML = `<span class="nickname-text">@${userDeactivate}</span>`;
        }
        if (comment.isAnonymous) {
          nicknameHTML = `<span class="nickname-text">@${authorAnonymous}</span>`;
        }

        const content = comment.content || ''; // 确保 content 不为 null 或 undefined
        const displayContent = content.length > 40 ? content.slice(0, 40) + '...' : content;

        const processedContent = nicknameHTML + ': ' + displayContent;

        return {
          ...comment,
          processedContent
        };
      });

      this.setData({
        contentTopComment: await fresnsLang('contentTopComment'),
        modifierCount: await fresnsLang('modifierCount'),
        contentCommentCountDesc: await fresnsLang('contentCommentCountDesc'),
        processedComments: processedComments,
      });
    },
  },
});
