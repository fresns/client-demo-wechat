/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../sdk/services';
import { fresnsLang } from '../sdk/helpers/configs';
import { fresnsLogin } from '../sdk/helpers/login';
import { getCurrentPageUrl } from '../sdk/utilities/toolkit';

module.exports = {
  /** 监听页面显示 **/
  onShow: async function () {
    this.handleCallbackMessage(); // 处理回调消息
  },

  /** 处理回调消息 **/
  handleCallbackMessage: async function () {
    // 读取回调消息
    const callbackMessage = wx.getStorageSync('fresnsCallbackMessage');
    console.log('callbackMessage getStorageSync', callbackMessage);

    // 消息为空
    if (!callbackMessage) {
      return;
    }

    // 错误码处理
    if (callbackMessage.code !== 0) {
      // 提示
      wx.showToast({
        title: '[' + callbackMessage.code + '] ' + callbackMessage.message,
        icon: 'none',
        duration: 2000,
      });

      // 提示完毕，清空回调消息
      console.log('callbackMessage removeStorageSync', 'code != 0');
      wx.removeStorageSync('fresnsCallbackMessage');

      return;
    }

    // 回调参数
    const dataHandler = callbackMessage.action.dataHandler;
    const data = callbackMessage.data;

    // 分类功能
    switch (callbackMessage.action.postMessageKey) {
      // 重载（回调后只刷新当前页面）
      case 'reload':
        const currentPageUrl = getCurrentPageUrl();
        wx.redirectTo({
          url: currentPageUrl,
          fail: function (res) {
            console.error('刷新失败', res);
          },
        });
        break;

      // 登录
      case 'fresnsAccountSign':
        wx.showLoading({
          title: await fresnsLang('accountLoggingIn'), // 登录中
        });

        const loginRes = await fresnsLogin.login(data.loginToken);

        if (loginRes.code != 0) {
          // 登录失败
          wx.hideLoading();

          wx.showToast({
            title: '[' + loginRes.code + '] ' + loginRes.message,
            icon: 'none',
            duration: 3000,
          });

          return;
        }

        // 登录成功
        wx.navigateBack({
          // 从登录页后退
          fail() {
            // 后退失败，直接进入个人中心
            wx.reLaunch({
              url: '/pages/me/index',
            });
          },
        });
        break;

      // 用户管理
      case 'fresnsUserManage':
        switch (dataHandler) {
          case 'add':
            this.onAddUser(data);
            break;

          case 'remove':
            this.onRemoveUser(data.uid);
            break;

          case 'reload':
            this.onChangeUser(data);
            break;

          default:
          // code
        }
        break;

      // 帖子管理
      case 'fresnsPostManage':
        switch (dataHandler) {
          case 'add':
            this.onAddPost(data);
            break;

          case 'remove':
            this.onRemovePost(data.pid);
            break;

          case 'reload':
            this.onChangePost(data);
            break;

          default:
          // code
        }
        break;

      // 评论管理
      case 'fresnsCommentManage':
        switch (dataHandler) {
          case 'add':
            this.onAddComment(data);
            break;

          case 'remove':
            this.onRemoveComment(data.cid);
            break;

          case 'reload':
            this.onChangeComment(data);
            break;

          default:
          // code
        }
        break;

      // 编辑器更新草稿
      case 'fresnsEditorUpdate':
        // 合并编辑器里所有回调功能，统一采用再请求草稿，全量更新
        // 如果有细化需求，也可以拆分编辑器里各个 post-message-key
        const type = this.data.type;
        const draftDetail = this.data.draftDetail;

        const detailRes = await fresnsApi.editor.draftDetail(type, draftDetail.did);

        if (detailRes.code === 0) {
          draftDetail.files = detailRes.data.detail.files;

          this.setData({
            draftDetail: draftDetail,
          });
        }
        break;

      // 设置页操作账号互联
      case 'fresnsConnect':
        this.reloadAccountData(); // 重载账号信息
        break;

      // 设置页操作扩展资料
      case 'fresnsProfileExtension':
        this.reloadUserData(); // 重载用户信息
        break;

      default:
      // code
    }

    // 关闭打开的窗口或 Modal
    if (callbackMessage.action.windowClose) {
      // 小程序发送消息必须要后退一页才能成功接收。
      // 后退一页已经完成关闭窗口，所以这一步不需要处理关闭窗口。
    }

    // 重定向页面
    if (callbackMessage.action.redirectUrl) {
      wx.redirectTo({
        url: callbackMessage.action.redirectUrl,
      });
    }

    // 处理完毕，清空回调信息
    console.log('callbackMessage removeStorageSync', 'end');
    wx.removeStorageSync('fresnsCallbackMessage');
  },
};
