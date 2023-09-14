/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../../api/api';
import { fresnsConfig, fresnsLang } from '../../../api/tool/function';
import { globalInfo } from '../../../utils/fresnsGlobalInfo';
import { cacheGet, callPageFunction, callPrevPageFunction } from '../../../utils/fresnsUtilities';

Component({
  /** 组件的属性列表 **/
  properties: {
    pid: String,
    cid: {
      type: String,
      value: '',
    },
    nickname: String,
  },

  /** 组件的初始数据 **/
  data: {
    fresnsConfig: {},
    fsLang: {},
    userLogin: false,

    showStickerBox: false,
    stickerTabs: [],
    stickers: [],
    imageWidth: 24,
    imageHeight: 24,

    content: '',
    contentLength: 0,
    contentLengthConfig: 0,
    contentCursorPosition: 0,

    imageShowActionSheet: false,
    imageActionGroups: [],
    imagePath: null,

    isEnableAnonymous: false,
    hashtagConfig: {},

    showMentionDialog: false,
    showHashtagDialog: false,
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached: async function () {
      const stickerList = cacheGet('fresnsStickers') ?? [];

      const stickerTabs = stickerList
        ? stickerList.map((item) => ({
            title: item.name,
            image: item.image,
            active: item.code,
            count: item.stickers.length,
            stickers: item.stickers,
          }))
        : [];

      const actionGroups = [
        {
          text: await fresnsLang('delete'),
          type: 'warn',
          value: 'delete',
        },
      ];

      this.setData({
        fresnsConfig: await fresnsConfig(),
        fsLang: {
          errorNoLogin: await fresnsLang('errorNoLogin'),
          accountLoginGoTo: await fresnsLang('accountLoginGoTo'),
          content: await fresnsLang('editorContent'),
          anonymous: await fresnsLang('editorAnonymous'),
        },
        userLogin: globalInfo.userLogin,
        stickerTabs: stickerTabs,
        stickers: stickerTabs && stickerTabs.length ? stickerTabs[0].stickers : [],
        imageActionGroups: actionGroups,
        contentLengthConfig: await fresnsConfig('comment_editor_content_length'),
        hashtagConfig: {
          format: await fresnsConfig('hashtag_format'),
        },
      });
    },
  },

  /** 组件功能 **/
  methods: {
    // 键盘输入时触发
    handleInput: function (e) {
      const fsConfig = this.data.fresnsConfig;

      const value = e.detail.value;
      const cursorPosition = e.detail.cursor;

      this.setData({
        content: value,
        contentLength: value.replaceAll('\n', '').length,
        contentCursorPosition: cursorPosition,
      });

      const prevCharacter = value.charAt(cursorPosition - 1);

      if (fsConfig.comment_editor_mention && prevCharacter === '@') {
        this.setData({
          showMentionDialog: !this.data.showMentionDialog,
        });
      }

      if (fsConfig.comment_editor_hashtag && prevCharacter === '#') {
        this.setData({
          showHashtagDialog: !this.data.showHashtagDialog,
        });
      }
    },

    // 点击完成按钮时触发
    handleConfirm: function (e) {
      const value = e.detail.value;

      this.setData({
        contentLength: value.replaceAll('\n', '').length,
      });
    },

    // 键盘高度发生变化的时候触发
    handleKeyboard: function (e) {
      const height = e.detail.height;

      this.triggerEvent('eventCommentBoxHeight', { height: height });
    },

    // 输入框失去焦点时触发
    handleBlur: function (e) {
      const cursorPosition = e.detail.cursor;

      this.setData({
        contentCursorPosition: cursorPosition,
      });
    },

    // 内容插入艾特和话题
    eventContentInsert: function (event) {
      const text = event.detail.data;

      this.onContentInsert(text);
    },

    // 选择表情
    onStickers: function () {
      const stickerTabs = this.data.stickerTabs;

      this.setData({
        stickers: stickerTabs && stickerTabs.length ? stickerTabs[0].stickers : [],
        showStickerBox: !this.data.showStickerBox,
      });
    },

    // 表情尺寸
    loadImageSize: function (e) {
      const originalWidth = e.detail.width;
      const originalHeight = e.detail.height;

      const halfWidth = originalWidth / 2;
      const halfHeight = originalHeight / 2;

      this.setData({
        imageWidth: halfWidth,
        imageHeight: halfHeight,
      });
    },

    // 切换表情
    onClickTab: function (e) {
      const index = e.detail.index;
      const stickerTabs = this.data.stickerTabs;

      this.setData({
        stickers: stickerTabs[index].stickers,
      });
    },

    // 插入表情
    onSelectSticker: function (e) {
      const { code } = e.target.dataset;

      this.onContentInsert(code);

      this.setData({
        showStickerBox: false,
      });
    },

    // 选择图片
    onSelectImage: function () {
      wx.chooseMedia({
        count: 1,
        mediaType: 'image',
        sizeType: 'compressed',

        success: async (res) => {
          const tempFilePath = res.tempFiles[0].tempFilePath;

          // 判断文件扩展名
          const extensions = await fresnsConfig('image_extension_names');
          const extensionsArray = extensions.split(',');

          this.setData({
            imagePath: tempFilePath,
          });
        },
      });
    },

    // 管理图片
    onManageImage: function () {
      this.setData({
        imageShowActionSheet: true,
      });
    },
    clickManageImage: function (e) {
      const value = e.detail.value;

      if (value == 'delete') {
        this.setData({
          imagePath: null,
        });
      }

      this.setData({
        imageShowActionSheet: false,
      });
    },

    // 切换匿名状态
    onSwitchAnonymous: function (e) {
      const { value } = e.detail;
      const isAnonymous = value.length > 0;
      this.setData({
        isEnableAnonymous: isAnonymous,
      });
    },

    // 内容插入新内容
    onContentInsert(text) {
      console.log('onContentInsert', text);

      const content = this.data.content;
      const cursorPosition = this.data.contentCursorPosition;

      const prevCharacter = content.charAt(cursorPosition - 1); // 光标前一个字符
      const firstCharacterOfText = text.charAt(0); // 插入文本的第一个字符

      let newText = text;
      if (prevCharacter === firstCharacterOfText) {
        // 如果两个字符一样，避免重复，去除一个
        newText = text.slice(1);
      }

      const newContent = content.slice(0, cursorPosition) + newText + content.slice(cursorPosition);

      this.setData({
        content: newContent,
        contentCursorPosition: cursorPosition + text.length,
      });
    },

    // 提交回复
    onClickSubmit: async function () {
      const submitRes = await fresnsApi.editor.editorQuickPublish(this.data.imagePath, {
        type: 'comment',
        commentPid: this.data.pid,
        commentCid: this.data.cid,
        content: this.data.content,
        isAnonymous: this.data.isEnableAnonymous ? 1 : 0,
      });

      let data = {
        commentPid: '',
        commentCid: '',
        newCid: '',
      };

      // 禁止发表
      if (submitRes.code == 36104) {
        wx.showModal({
          title: submitRes.message,
          content: submitRes.data.join(' | '),
          confirmText: await fresnsConfig('menu_account_settings'),
          success(res) {
            if (res.confirm) {
              // 去设置页
              wx.navigateTo({
                url: '/pages/account/settings',
              });
            }
          },
        });
      }

      // 发表成功，待审核
      if (submitRes.code == 38200) {
        wx.showModal({
          title: submitRes.message,
          cancelText: await fresnsConfig('menu_editor_drafts'), // 草稿箱
          confirmText: await fresnsLang('know'), // 知道了
          success(res) {
            if (res.confirm) {
              // 知道了
              this.triggerEvent('eventCommentBoxHide', { data: '' });

              // mixins/fresnsInteraction.js
              callPageFunction('onPublishCommentAction', data);
              callPrevPageFunction('onPublishCommentAction', data);
            } else if (res.cancel) {
              // 去草稿箱
              wx.redirectTo({
                url: '/pages/editor/draft-box?type=comment',
              });
            }
          },
        });
      }

      // 发表成功
      if (submitRes.code === 0) {
        this.setData({
          content: '',
          contentLength: 0,
          isEnableAnonymous: false,
        });

        data = {
          commentPid: this.data.pid,
          commentCid: this.data.cid,
          newCid: submitRes.data.fsid,
        };

        this.triggerEvent('eventCommentBoxHide', { data: '' });

        // mixins/fresnsInteraction.js
        callPageFunction('onPublishCommentAction', data);
        callPrevPageFunction('onPublishCommentAction', data);

        wx.showToast({
          title: submitRes.message,
          icon: 'none',
        });
      }
    },
  },
});
