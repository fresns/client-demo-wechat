/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../sdk/services/api';
import { fresnsConfig, fresnsLang, fresnsEditor } from '../../sdk/helpers/configs';
import { fresnsAuth } from '../../sdk/helpers/profiles';
import { callPageFunction, callPrevPageFunction } from '../../sdk/utilities/toolkit';

Component({
  /** 组件的属性列表 **/
  properties: {
    commentPid: {
      type: String,
      value: null,
    },
    commentCid: {
      type: String,
      value: null,
    },
    nickname: {
      type: String,
      value: null,
    },
  },

  /** 组件的初始数据 **/
  data: {
    userLogin: true,
    loginBtnText: '',
    fsConfig: {},
    fsLang: {},
    editorConfig: {},

    publishCommentName: '回复',
    content: '',
    imagePath: null,
    isEnableAnonymous: false,

    mentionDialogShow: false,
    hashtagDialogShow: false,

    contentLength: 0,
    contentCursorPosition: 0,

    stickerDialog: false,
    stickers: [],
    currentIndex: 0,
    currentStickers: [],
    imageWidth: {},
    imageHeight: {},
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached: async function () {
      // 登录按钮文字
      let loginBtnText = await fresnsLang('accountLoginOrRegister'); // 登录或注册
      const registerStatus = await fresnsConfig('account_register_status');
      if (!registerStatus) {
        loginBtnText = await fresnsLang('accountLoginGoTo'); // 前往登录
      }

      const stickers = await fresnsEditor.stickers();

      this.setData({
        userLogin: fresnsAuth.userLogin,
        loginBtnText: loginBtnText,
        fsLang: {
          errorNoLogin: await fresnsLang('errorNoLogin'),
          content: await fresnsLang('editorContent'),
          anonymous: await fresnsLang('editorAnonymous'),
        },
        editorConfig: await fresnsEditor.comment('editor'),
        stickers: stickers,
        currentStickers: stickers[0]?.stickers,
        publishCommentName: await fresnsConfig('publish_comment_name'),
      });
    },
  },

  /** 组件所在页面的生命周期函数 **/
  pageLifetimes: {
    show: function () {
      this.setData({
        userLogin: fresnsAuth.userLogin,
      });
    },
  },

  /** 组件功能 **/
  methods: {
    // 登录
    toLoginPage: function () {
      wx.navigateTo({
        url: '/pages/me/login/index',
        routeType: 'wx://cupertino-modal-inside',
      });
    },

    // 监听插入内容
    eventInsertContent(e) {
      const value = e.detail.value;

      const content = this.data.content || '';
      const cursorPosition = this.data.contentCursorPosition;

      const prevCharacter = content.charAt(cursorPosition - 1); // 获取光标前的一个字符
      const firstCharacterOfText = value.charAt(0); // 获取插入文本的第一个字符

      let newText = value;
      if (prevCharacter === firstCharacterOfText) {
        // 如果两个字符一样，避免重复，去除一个
        newText = value.slice(1);
      }

      const newContent = content.slice(0, cursorPosition) + newText + content.slice(cursorPosition);

      this.setData({
        content: newContent,
        contentCursorPosition: cursorPosition + value.length,
      });
    },

    // 监听窗口显示
    eventDialogShow: function (e) {
      const type = e.detail.type;

      switch (type) {
        case 'mention':
          const mentionDialogShow = this.data.mentionDialogShow;

          this.setData({
            mentionDialogShow: !mentionDialogShow,
          });
          break;

        case 'hashtag':
          const hashtagDialogShow = this.data.hashtagDialogShow;

          this.setData({
            hashtagDialogShow: !hashtagDialogShow,
          });
          break;
      }
    },

    // 键盘输入时触发
    handleInput: function (e) {
      const editorConfig = this.data.editorConfig;

      const value = e.detail.value;
      const cursorPosition = e.detail.cursor;

      this.setData({
        content: value,
        contentLength: value.replaceAll('\n', '').length,
        contentCursorPosition: cursorPosition,
      });

      const prevCharacter = value.charAt(cursorPosition - 1);

      if (editorConfig.mention.status && prevCharacter === '@') {
        this.triggerEvent('eventCommentBoxHeight', { height: 0 });

        this.setData({
          mentionDialogShow: true,
        });
      }

      if (editorConfig.hashtag.status && prevCharacter === '#') {
        this.triggerEvent('eventCommentBoxHeight', { height: 0 });

        this.setData({
          hashtagDialogShow: true,
        });
      }
    },

    // 输入框失去焦点时触发
    handleBlur: function (e) {
      const value = e.detail.value;
      const cursorPosition = e.detail.cursor;

      const height = e.detail.height;
      this.triggerEvent('eventCommentBoxHeight', { height: height });

      this.setData({
        contentLength: value.replaceAll('\n', '').length,
        contentCursorPosition: cursorPosition,
      });
    },

    // 键盘高度发生变化的时候触发
    handleKeyboard: function (e) {
      const height = e.detail.height;

      this.triggerEvent('eventCommentBoxHeight', { height: height });
    },

    // 显示艾特
    onMention: function () {
      this.triggerEvent('eventCommentBoxHeight', { height: 0 });

      this.setData({
        mentionDialogShow: true,
      });
    },

    // 显示话题
    onHashtag: function () {
      this.triggerEvent('eventCommentBoxHeight', { height: 0 });

      this.setData({
        hashtagDialogShow: true,
      });
    },

    // 切换匿名状态
    onSwitchAnonymous: function (e) {
      const value = e.detail.value;

      const isAnonymous = value.length > 0;
      this.setData({
        isEnableAnonymous: isAnonymous,
      });
    },

    // 显示表情
    onStickers: function () {
      this.setData({
        stickerDialog: !this.data.stickerDialog,
      });
    },

    // 表情尺寸
    loadImageSize: function (e) {
      const index = e.currentTarget.dataset.index;

      const originalWidth = e.detail.width;
      const originalHeight = e.detail.height;

      // 将表情图缩小一倍显示
      const halfWidth = originalWidth / 2;
      const halfHeight = originalHeight / 2;

      const imageWidth = this.data.imageWidth;
      const imageHeight = this.data.imageHeight;

      imageWidth[index] = halfWidth;
      imageHeight[index] = halfHeight;

      this.setData({
        imageWidth: imageWidth,
        imageHeight: imageHeight,
      });
    },

    // 切换表情
    switchStickers: function (e) {
      const index = e.currentTarget.dataset.index;

      const stickers = this.data.stickers;
      const currentStickers = stickers[index].stickers;

      this.setData({
        currentIndex: index,
        currentStickers: currentStickers,
      });
    },

    // 插入表情
    onSelectSticker: function (e) {
      const code = e.currentTarget.dataset.code;

      const content = this.data.content || '';
      const cursorPosition = this.data.contentCursorPosition;

      const newContent = content.slice(0, cursorPosition) + code + content.slice(cursorPosition);

      this.setData({
        stickerDialog: false,
        content: newContent,
        contentCursorPosition: cursorPosition + code.length,
      });
    },

    // 选择图片
    onSelectImage: function () {
      const self = this;

      const editorConfig = this.data.editorConfig;
      const extensions = editorConfig.image.extensions;

      wx.chooseMedia({
        count: 1,
        mediaType: 'image',
        sizeType: 'compressed',

        success(res) {
          const tempFilePath = res.tempFiles[0].tempFilePath;

          // 判断文件扩展名
          const extensionsArray = extensions.split(',');

          self.setData({
            imagePath: tempFilePath,
          });
        },
      });
    },

    // 管理图片
    onManageImage: async function () {
      const self = this;

      const imagePath = this.data.imagePath;

      const itemList = [await fresnsLang('view'), await fresnsLang('delete')];

      wx.showActionSheet({
        itemList: itemList,
        success(res) {
          const tapIndex = res.tapIndex;

          if (tapIndex == 0) {
            wx.previewImage({
              urls: [imagePath],
            });

            return;
          }

          // delete
          self.setData({
            imagePath: '',
          });
        },
      });
    },

    // 提交回复
    onClickSubmit: async function () {
      const submitRes = await fresnsApi.editor.publish('comment', {
        commentPid: this.data.commentPid,
        commentCid: this.data.commentCid,
        content: this.data.content,
        isAnonymous: this.data.isEnableAnonymous,
        image: this.data.imagePath,
      });

      // 禁止发表
      if (submitRes.code == 36104) {
        wx.showModal({
          title: submitRes.message,
          content: submitRes.data.join(' | '),
          confirmText: await fresnsConfig('channel_me_settings_name'),
          success(res) {
            if (res.confirm) {
              // 去设置页
              wx.redirectTo({
                url: '/pages/me/settings',
              });
            }
          },
        });

        return;
      }

      // 发表成功，待审核
      if (submitRes.code == 38200) {
        wx.showModal({
          title: submitRes.message,
          cancelText: await fresnsConfig('channel_me_drafts_name'), // 草稿箱
          confirmText: await fresnsLang('know'), // 知道了
          success(res) {
            if (res.confirm) {
              // 知道了
              this.triggerEvent('eventCommentBoxHide');
            } else if (res.cancel) {
              // 去草稿箱
              wx.redirectTo({
                url: '/pages/me/drafts?type=comment',
              });
            }
          },
        });
      }

      // 发表成功
      if (submitRes.code === 0) {
        const data = {
          commentPid: this.data.commentPid,
          commentCid: this.data.commentCid,
          newCid: submitRes.data.fsid,
        };

        this.triggerEvent('eventCommentBoxHide');

        // mixins/fresnsInteraction.js
        callPageFunction('onPublishCommentAction', data);
        callPrevPageFunction('onPublishCommentAction', data);

        wx.showToast({
          title: submitRes.message,
          icon: 'none',
        });
      }

      if (submitRes.code === 0 || submitRes.code == 38200) {
        this.setData({
          content: '',
          imagePath: null,
          isEnableAnonymous: false,
          contentLength: 0,
          contentCursorPosition: 0,
        });

        this.triggerEvent('eventCommentBoxHide');
      }
    },
  },
});
