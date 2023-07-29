/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../api/api';
import { fresnsLang } from '../../api/tool/function';

Page({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../../mixins/globalConfig'),
    require('../../mixins/checkSiteMode'),
    require('../../mixins/loginInterceptor'),
  ],

  /** 页面的初始数据 **/
  data: {
    conversationId: null,
    messages: [],
    page: 1,
    loadingStatus: false,
    loadingTipType: 'none',
    isReachBottom: false,

    title: null,
    actionGroups: [],
    showActionSheet: false,
  },

  /** 监听页面加载 **/
  onLoad: async function (options) {
    const conversationId = options.id;
    const userDeactivate = await fresnsLang('userDeactivate');

    this.setData({
      conversationId: conversationId,
    });

    const resultRes = await fresnsApi.message.conversationDetail({
      conversationId: conversationId,
      whitelistKeys: 'avatar,nickname,status',
    });

    let title = resultRes.message;
    if (resultRes.code === 0) {
      title = resultRes.data.user.status ? resultRes.data.user.nickname : userDeactivate;

      // 标对话为已读
      await fresnsApi.message.conversationMarkAsRead({
        type: 'conversation',
        conversationId: conversationId,
      });
    }

    wx.setNavigationBarTitle({
      title: title,
    });

    await this.loadFresnsPageData();
  },

  /** 加载列表数据 **/
  loadFresnsPageData: async function () {
    if (this.data.isReachBottom) {
      return;
    }

    this.setData({
      loadingStatus: true,
    });

    wx.showNavigationBarLoading();

    const resultRes = await fresnsApi.message.conversationMessages({
      pageListDirection: 'oldest',
      conversationId: this.data.conversationId,
      whitelistKeys: 'avatar,nickname,status',
      page: this.data.page,
    });

    if (resultRes.code === 0) {
      const { paginate, list } = resultRes.data;
      const isReachBottom = paginate.currentPage === paginate.lastPage;
      let tipType = 'none';
      if (isReachBottom && paginate.lastPage > 1) {
        tipType = this.data.messages ? 'page' : 'empty';
      }

      this.setData({
        messages: list.concat(this.data.messages),
        page: this.data.page + 1,
        loadingTipType: tipType,
        isReachBottom: isReachBottom,
      });
    }

    wx.hideNavigationBarLoading();
    this.setData({
      loadingStatus: false,
    });
  },

  /** 监听用户下拉动作 **/
  onPullDownRefresh: async function () {
    await this.loadFresnsPageData();
  },

  // 显示删除菜单
  onClickDelete: async function (e) {
    const id = e.currentTarget.dataset.id;
    const content = e.currentTarget.dataset.content;

    const actionGroups = [
      {
        text: await fresnsLang('delete'),
        type: 'warn',
        value: id,
      },
    ];

    this.setData({
      title: content,
      actionGroups: actionGroups,
      showActionSheet: true,
    });
  },

  // 操作删除
  actionClickDelete: async function (e) {
    const id = e.detail.value;

    if (id) {
      const resultRes = await fresnsApi.message.conversationDelete({
        type: 'message',
        messageIds: id.toString(),
      });

      if (resultRes.code == 0) {
        const messages = this.data.messages;

        const idx = messages.findIndex((value) => value.id === id);

        if (idx >= 0) {
          messages.splice(idx, 1);

          this.setData({
            messages: messages,
          });
        }
      }
    }

    this.setData({
      showActionSheet: false,
    });
  },
});
