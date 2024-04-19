/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../../api/api';
import { fresnsCodeMessage, fresnsLang } from '../../../api/tool/function';
import { cacheGet, callPageFunction, strUploadInfo } from '../../../utils/fresnsUtilities';

const app = getApp();

Component({
  /** 组件的属性列表 **/
  properties: {
    type: String,
    draftId: String,
    config: Object,
  },

  /** 组件的初始数据 **/
  data: {
    fresnsLang: null,

    editorType: null,
    usageType: null,
    tableName: null,
    uploadInfo: {},

    showStickerBox: false,
    stickerTabs: [],
    stickers: [],
    imageWidth: 24,
    imageHeight: 24,

    // 扩展
    showActionSheet: false,
    extends: [],
  },

  /** 组件数据字段监听器 **/
  observers: {
    // 上传参数配置
    'type, draftId': async function (type, draftId) {
      let editorType;
      let usageType;
      let tableName;
      switch (type) {
        case 'comment':
          editorType = 'commentEditor';
          usageType = 8;
          tableName = 'comment_logs';
          break;
        default:
          editorType = 'postEditor';
          usageType = 7;
          tableName = 'post_logs';
      }
      const uploadInfo = strUploadInfo(usageType, tableName, 'id', draftId);

      this.setData({
        editorType: editorType,
        usageType: usageType,
        tableName: tableName,
        uploadInfo: uploadInfo,
      });
    },

    // 扩展菜单配置
    config: async function (config) {
      const extendList = config.extend.list;

      let items = [];

      if (extendList.length > 0) {
        for (let i = 0; i < extendList.length; i++) {
          const plugin = extendList[i];
          items.push({
            text: plugin.name,
            value: plugin.url,
          });
        }
      }

      this.setData({
        extends: items,
      });
    },
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
            count: item.stickers ? item.stickers.length : 0,
            stickers: item.stickers ?? [],
          }))
        : [];

      this.setData({
        fresnsLang: await fresnsLang(),
        stickerTabs: stickerTabs,
        stickers: stickerTabs && stickerTabs.length ? stickerTabs[0].stickers : [],
      });
    },
  },

  /** 组件功能 **/
  methods: {
    // 工具栏
    onClickToolBar: function (e) {
      const { tool } = e.currentTarget.dataset;
      const { draftId, config, fresnsLang, editorType, usageType, tableName, uploadInfo } = this.data;

      // 表情
      if (tool == 'sticker') {
        const stickerTabs = this.data.stickerTabs;

        this.setData({
          stickers: stickerTabs && stickerTabs.length ? stickerTabs[0].stickers : [],
          showStickerBox: !this.data.showStickerBox,
        });
      }

      // 图片
      if (tool == 'image') {
        // 插件页上传
        if (config.image.uploadForm == 'plugin') {
          const fresnsExtensions = {
            type: 'editor',
            scene: editorType,
            postMessageKey: 'fresnsEditorUpdate',
            plid: draftId,
            clid: draftId,
            uploadInfo: uploadInfo.image,
            title: fresnsLang.editorUpload,
            url: config.image.uploadUrl,
          };

          app.globalData.fresnsExtensions = fresnsExtensions;

          wx.navigateTo({
            url: '/pages/webview',
          });

          return;
        }

        // 直接上传
        return setTimeout(() => {
          this.onSelectImageOrVideo('image', usageType, tableName, draftId, config.image);
        }, 100);
      }

      // 视频
      if (tool == 'video') {
        // 插件页上传
        if (config.video.uploadForm == 'plugin') {
          const fresnsExtensions = {
            type: 'editor',
            scene: editorType,
            postMessageKey: 'fresnsEditorUpdate',
            plid: draftId,
            clid: draftId,
            uploadInfo: uploadInfo.video,
            title: fresnsLang.editorUpload,
            url: config.video.uploadUrl,
          };

          app.globalData.fresnsExtensions = fresnsExtensions;

          wx.navigateTo({
            url: '/pages/webview',
          });

          return;
        }

        // 直接上传
        return setTimeout(() => {
          this.onSelectImageOrVideo('video', usageType, tableName, draftId, config.video);
        }, 100);
      }

      // 音频
      if (tool == 'audio') {
        // 插件页上传
        if (config.audio.uploadForm == 'plugin') {
          const fresnsExtensions = {
            type: 'editor',
            scene: editorType,
            postMessageKey: 'fresnsEditorUpdate',
            plid: draftId,
            clid: draftId,
            uploadInfo: uploadInfo.audio,
            title: fresnsLang.editorUpload,
            url: config.audio.uploadUrl,
          };

          app.globalData.fresnsExtensions = fresnsExtensions;

          wx.navigateTo({
            url: '/pages/webview',
          });

          return;
        }

        // 直接上传
        return setTimeout(() => {
          this.onSelectFile('audio', usageType, tableName, draftId, config.audio);
        }, 100);
      }

      // 文档
      if (tool == 'document') {
        // 插件页上传
        if (config.document.uploadForm == 'plugin') {
          const fresnsExtensions = {
            type: 'editor',
            scene: editorType,
            postMessageKey: 'fresnsEditorUpdate',
            plid: draftId,
            clid: draftId,
            uploadInfo: uploadInfo.document,
            title: fresnsLang.editorUpload,
            url: config.document.uploadUrl,
          };

          app.globalData.fresnsExtensions = fresnsExtensions;

          wx.navigateTo({
            url: '/pages/webview',
          });

          return;
        }

        // 直接上传
        return setTimeout(() => {
          this.onSelectFile('document', usageType, tableName, draftId, config.document);
        }, 100);
      }

      // 标题
      if (tool == 'title') {
        return callPageFunction('switchShowTitleInput');
      }

      // 艾特
      if (tool == 'mention') {
        return callPageFunction('showMentionDialog');
      }

      // 话题
      if (tool == 'hashtag') {
        return callPageFunction('showHashtagDialog');
      }

      // 扩展
      if (tool == 'extend') {
        return this.setData({
          showActionSheet: true,
        });
      }
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
    onTabsClick: function (e) {
      const index = e.detail.value;
      const stickerTabs = this.data.stickerTabs;

      this.setData({
        stickers: stickerTabs[index].stickers,
      });
    },

    // 插入表情
    onSelectSticker: function (e) {
      const { code } = e.target.dataset;

      callPageFunction('onContentInsert', code);

      this.setData({
        showStickerBox: false,
      });
    },

    // 上传图片或视频
    onSelectImageOrVideo: function (fileType, usageType, tableName, draftId, fileConfig) {
      const type = fileType + 's';
      const extensionsArray = fileConfig.extensions.split(',');

      wx.chooseMedia({
        count: fileConfig.uploadNumber,
        mediaType: fileType,
        sizeType: 'compressed',
        maxDuration: fileConfig.maxTime || 10,

        success: async (res) => {
          const tempFiles = res.tempFiles;
          callPageFunction('onAddFiles', type, tempFiles);

          const uploadPromises = tempFiles.map(async (tempFile) => {
            // 判断文件扩展名 extensionsArray

            // 判断时长
            if (fileType == 'video') {
              let duration = tempFile.duration;

              if (duration > fileConfig.maxTime) {
                wx.showToast({
                  title: await fresnsCodeMessage(36114),
                  icon: 'none',
                  duration: 2000,
                });

                return;
              }
            }

            // 上传
            const response = await fresnsApi.common.commonUploadFile(tempFile.tempFilePath, {
              usageType: usageType,
              tableName: tableName,
              tableColumn: 'id',
              tableId: draftId,
              type: fileType,
              uploadMode: 'file',
              file: tempFile.tempFilePath,
            });

            if (response.code === 0) {
              callPageFunction('onRepFile', type, tempFile.tempFilePath, response.data);
            }

            return response;
          });

          console.log('uploadPromises', uploadPromises);
        },
      });
    },

    // 上传文件
    onSelectFile: function (fileType, usageType, tableName, draftId, fileConfig) {
      const type = fileType + 's';
      const extensionsArray = fileConfig.extensions.split(',');

      wx.chooseMessageFile({
        count: fileConfig.uploadNumber,
        type: 'file',
        extension: extensionsArray,

        success: async (res) => {
          const tempFiles = res.tempFiles;
          callPageFunction('onAddFiles', type, tempFiles);

          const uploadPromises = tempFiles.map(async (tempFile) => {
            // 上传
            const response = await fresnsApi.common.commonUploadFile(tempFile.tempFilePath, {
              usageType: usageType,
              tableName: tableName,
              tableColumn: 'id',
              tableId: draftId,
              type: fileType,
              uploadMode: 'file',
              file: tempFile.tempFilePath,
            });

            if (response.code === 0) {
              callPageFunction('onRepFile', type, tempFile.tempFilePath, response.data);
            }

            return response;
          });

          console.log('uploadPromises', uploadPromises);
        },
      });
    },

    // 选择扩展
    onClickExpand: function (e) {
      console.log('onClickExpand', e);
    },
  },
});
