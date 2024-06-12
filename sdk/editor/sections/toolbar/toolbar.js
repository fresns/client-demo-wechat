/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../../services/api';
import { fresnsLang, fresnsEditor } from '../../../helpers/configs';

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
  },

  /** 组件的初始数据 **/
  data: {
    fresnsLang: null,
    config: {},

    stickerDialog: false,
    stickers: [],
    currentIndex: 0,
    currentStickers: [],
    imageWidth: {},
    imageHeight: {},

    extendDialog: false,
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached: async function () {
      const type = this.data.type;
      const config = await fresnsEditor[type]('editor');

      const stickers = await fresnsEditor.stickers();

      this.setData({
        fresnsLang: await fresnsLang(),
        config: config,
        stickers: stickers,
        currentStickers: stickers[0]?.stickers,
      });
    },
  },

  /** 组件功能 **/
  methods: {
    // 工具栏
    onClickToolBar: async function (e) {
      const tool = e.currentTarget.dataset.tool;
      const type = this.data.type;
      const did = this.data.did;
      const config = this.data.config;

      switch (tool) {
        // 表情
        case 'sticker':
          this.setData({
            stickerDialog: !this.data.stickerDialog,
          });
          break;

        // 图片
        case 'image':
          switch (config.image.uploadMethod) {
            // API 上传
            case 'api':
              this.onApiUpload(`${type}Draft`, did, 'image', config.image);
              break;

            // 插件页上传
            case 'page':
              this.onPluginPageUpload(config.image.uploadAppUrl, `${type}Draft,${did},image`);
              break;

            // s3 sdk
            case 'sdk':
              wx.showToast({
                title: '小程序无法使用 S3 上传，你可以访问我们的网站上传',
                icon: 'none',
              });
              break;
          }
          break;

        // 视频
        case 'video':
          switch (config.video.uploadMethod) {
            // API 上传
            case 'api':
              this.onApiUpload(`${type}Draft`, did, 'video', config.video);
              break;

            // 插件页上传
            case 'page':
              this.onPluginPageUpload(config.video.uploadAppUrl, `${type}Draft,${did},video`);
              break;

            // s3 sdk
            case 'sdk':
              wx.showToast({
                title: '小程序无法使用 S3 上传，你可以访问我们的网站上传',
                icon: 'none',
              });
              break;
          }
          break;

        // 音频
        case 'audio':
          switch (config.audio.uploadMethod) {
            // API 上传
            case 'api':
              this.onApiUpload(`${type}Draft`, did, 'audio', config.audio);
              break;

            // 插件页上传
            case 'page':
              this.onPluginPageUpload(config.audio.uploadAppUrl, `${type}Draft,${did},audio`);
              break;

            // s3 sdk
            case 'sdk':
              wx.showToast({
                title: '小程序无法使用 S3 上传，你可以访问我们的网站上传',
                icon: 'none',
              });
              break;
          }
          break;

        // 文档
        case 'document':
          switch (config.document.uploadMethod) {
            // API 上传
            case 'api':
              this.onApiUpload(`${type}Draft`, did, 'document', config.document);
              break;

            // 插件页上传
            case 'page':
              this.onPluginPageUpload(config.document.uploadAppUrl, `${type}Draft,${did},document`);
              break;

            // s3 sdk
            case 'sdk':
              wx.showToast({
                title: '小程序无法使用 S3 上传，你可以访问我们的网站上传',
                icon: 'none',
              });
              break;
          }
          break;

        // 标题
        case 'title':
          this.triggerEvent('eventDialogShow', { type: 'title' });
          break;

        // 艾特
        case 'mention':
          this.triggerEvent('eventDialogShow', { type: 'mention' });
          break;

        // 话题
        case 'hashtag':
          this.triggerEvent('eventDialogShow', { type: 'hashtag' });
          break;

        // 扩展
        case 'extend':
          this.setData({
            extendDialog: true,
          });
          break;
      }
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

      this.triggerEvent('eventInsertContent', { value: code });

      this.setData({
        stickerDialog: false,
      });
    },

    // 关闭表情窗口
    closeStickerDialog() {
      this.setData({
        stickerDialog: false,
      });
    },

    // 关闭扩展功能窗口
    closeExtendDialog() {
      this.setData({
        extendDialog: false,
      });
    },

    // API 上传
    onApiUpload: async function (usageType, usageFsid, fileType, uploadConfig) {
      switch (fileType) {
        // 图片
        case 'image':
          this.onSelectImageOrVideo(usageType, usageFsid, fileType, uploadConfig);
          break;

        // 视频
        case 'video':
          this.onSelectImageOrVideo(usageType, usageFsid, fileType, uploadConfig);
          break;

        // 音频
        case 'audio':
          wx.showToast({
            title: '待开发',
            icon: 'none',
          });
          break;

        // 文档
        case 'document':
          wx.showToast({
            title: '待开发',
            icon: 'none',
          });
          break;
      }
    },

    // 插件页上传
    onPluginPageUpload: async function (uploadAppUrl, uploadInfo) {
      // 扩展 Web-View 数据
      const navigatorData = {
        title: await fresnsLang('upload'),
        url: uploadAppUrl,
        uploadInfo: uploadInfo,
        postMessageKey: 'fresnsEditorUpload',
      };

      // 将链接数据赋予到全局数据中
      const app = getApp();
      app.globalData.navigatorData = navigatorData;

      // 访问扩展页面选择用户
      wx.navigateTo({
        url: '/sdk/extensions/webview',
      });
    },

    // API 上传: 图片或视频
    onSelectImageOrVideo: function (usageType, usageFsid, fileType, uploadConfig) {
      const extensionsArray = uploadConfig.extensions.split(',');

      wx.chooseMedia({
        count: uploadConfig.maxUploadNumber,
        mediaType: fileType,
        sourceType: ['album', 'camera'],
        maxDuration: uploadConfig.maxDuration || 10,
        sizeType: 'compressed',

        success: async (res) => {
          const tempFiles = res.tempFiles;

          // 将文件添加到视图中
          this.triggerEvent('eventAddFiles', { fileType, tempFiles });

          tempFiles.map(async (tempFile) => {
            // 判断文件扩展名 extensionsArray

            // 判断时长
            if (fileType == 'video') {
              let duration = tempFile.duration;

              if (duration > uploadConfig.maxDuration) {
                wx.showToast({
                  title: await fresnsLang('uploadWarningMaxDuration'),
                  icon: 'none',
                  duration: 2000,
                });

                // 上传失败，删除视图
                this.triggerEvent('eventUpdateFile', {
                  fileType: fileType,
                  filePath: tempFile.tempFilePath,
                  fid: null,
                  updateType: 'delete',
                });

                return;
              }
            }

            // 开始上传，更新状态
            this.triggerEvent('eventUpdateFile', {
              fileType: fileType,
              filePath: tempFile.tempFilePath,
              fid: null,
              updateType: 'upload',
            });

            // 上传
            const response = await fresnsApi.common.fileUpload({
              usageType: usageType,
              usageFsid: usageFsid,
              type: fileType,
              file: tempFile.tempFilePath,
            });

            if (response.code != 0) {
              // 上传失败，删除视图
              this.triggerEvent('eventUpdateFile', {
                fileType: fileType,
                filePath: tempFile.tempFilePath,
                fid: null,
                updateType: 'delete',
              });
            }

            // 上传完成，更新状态
            this.triggerEvent('eventUpdateFile', {
              fileType: fileType,
              filePath: tempFile.tempFilePath,
              fid: response.data.fid,
              updateType: 'done',
            });
          });
        },
      });
    },

    // 前往扩展页面
    goToExtendPage: function (e) {
      const type = this.data.type;
      const did = this.data.did;

      const name = e.currentTarget.dataset.name;
      const url = e.currentTarget.dataset.url;

      // 扩展 Web-View 数据
      const navigatorData = {
        title: name,
        url: url,
        draftType: type,
        did: did,
        postMessageKey: 'expandEdit',
      };

      // 将链接数据赋予到全局数据中
      const app = getApp();
      app.globalData.navigatorData = navigatorData;

      // 访问扩展页面选择用户
      wx.navigateTo({
        url: '/sdk/extensions/webview',
      });
    },
  },
});
