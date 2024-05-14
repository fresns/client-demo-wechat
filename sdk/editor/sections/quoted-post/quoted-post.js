/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../../services';
import { fresnsLang } from '../../../helpers/configs';

Component({
  /** 组件的属性列表 **/
  properties: {
    type: {
      type: String,
      value: 'post',
    },
    did: {
      type: String,
      value: null,
    },
    quotedPid: {
      type: String,
      value: null,
    },
  },

  /** 组件的初始数据 **/
  data: {
    quotedPost: {},
    newContent: '',
  },

  /** 组件数据字段监听器 **/
  observers: {
    quotedPid: async function (quotedPid) {
      if (!quotedPid) {
        return;
      }

      const resultRes = await fresnsApi.post.detail(quotedPid, {
        filterType: 'whitelist',
        filterKeys: 'pid,title,content,isAnonymous,author,group',
        filterGroupType: 'whitelist',
        filterGroupKeys: 'gid,name',
        filterAuthorType: 'whitelist',
        filterAuthorKeys: 'avatar,nickname,status',
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
      });
    },
  },

  /** 组件功能 **/
  methods: {
    onQuoteMenu: async function () {
      const draftType = this.data.type;
      const did = this.data.did;

      const itemList = [await fresnsLang('delete')];

      wx.showActionSheet({
        itemList: itemList,
        success: async (res) => {
          const tapIndex = res.tapIndex;

          if (tapIndex != 0) {
            return;
          }

          const resultRes = await fresnsApi.editor.draftUpdate(draftType, did, { quotePid: '' });

          if (resultRes.code == 0) {
            this.setData({
              quotedPid: null,
            });
          }
        },
      });
    },
  },
});
