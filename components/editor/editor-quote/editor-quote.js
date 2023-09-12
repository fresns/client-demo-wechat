/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../../api/api';
import { fresnsLang } from '../../../api/tool/function';
import { callPageFunction } from '../../../utils/fresnsUtilities';

Component({
  /** 组件的属性列表 **/
  properties: {
    quotedPid: {
      type: String,
      value: null,
    },
  },

  /** 组件的初始数据 **/
  data: {
    quotedPost: {},
    newContent: '',
    showActionSheet: false,
    actionGroups: [],
  },

  /** 组件数据字段监听器 **/
  observers: {
    quotedPid: async function (quotedPid) {
      if (!quotedPid) {
        return;
      }

      const resultRes = await fresnsApi.post.postDetail({
        pid: quotedPid,
        whitelistKeys: 'pid,title,content,isAnonymous,author.avatar,author.nickname,author.status,group.gname',
      });

      if (resultRes.code != 0) {
        return;
      }

      const post = resultRes.data.detail;

      let nickname = post.author.nickname;
      if (!post.author.status) {
        nickname = await fresnsLang('userDeactivate');
      }
      if (post.isAnonymous) {
        nickname = await fresnsLang('contentAuthorAnonymous');
      }

      const summaries = post.title || post.content;

      const newContent = nickname + ': ' + summaries;

      this.setData({
        quotedPost: post,
        newContent: newContent,
        actionGroups: [
          {
            text: await fresnsLang('delete'),
            type: 'warn',
            value: 'delete',
          },
        ],
      });
    },
  },

  /** 组件功能 **/
  methods: {
    onQuoteMenu() {
      this.setData({
        showActionSheet: true,
      });
    },

    clickQuoteMenu: function (e) {
      const value = e.detail.value;

      if (value == 'delete') {
        callPageFunction('onQuoteChange');
      }

      this.setData({
        showActionSheet: false,
      });
    },
  },
});
