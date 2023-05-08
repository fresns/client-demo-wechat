/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../../api/api';
import { fresnsConfig } from '../../../api/tool/function';
import { cachePut, cacheGet, repPluginUrl, strUploadInfo } from '../../../utils/fresnsUtilities';
import { callPageFunction } from '../../../utils/fresnsCallback';

Component({
  /** 组件的属性列表 **/
  properties: {
    type: String,
    draftId: String,
    config: Object,
    bottom: Number,
  },

  /** 组件的初始数据 **/
  data: {
    fresnsLang: null,
    toolbarBottom: 0,

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
      let usageType;
      let tableName;
      switch (type) {
        case 'comment':
          usageType = 8;
          tableName = 'comment_logs';
          break;
        default:
          usageType = 7;
          tableName = 'post_logs';
      }
      const uploadInfo = strUploadInfo(usageType, tableName, 'id', draftId);

      this.setData({
        usageType: usageType,
        tableName: tableName,
        uploadInfo: uploadInfo,
      })
    },

    // 扩展菜单配置
    'config': async function (config) {
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
      })
    },

    // 工具栏位置
    'bottom': async function (bottom) {
      console.log('Toolbar Bottom', bottom);

      this.setData({
        toolbarBottom: bottom,
      })
    },
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached: async function () {
      const fresnsStickers = cacheGet('fresnsStickers');

      let stickers = fresnsStickers?.data;
      if (!stickers) {
        const stickersRes = await fresnsApi.global.globalStickers();
  
        if (stickersRes.code === 0) {
          cachePut('fresnsStickers', stickersRes.data);

          stickers = stickersRes.data;
        }
      }

      const stickerTabs = stickers ? stickers.map((item) => ({
        title: item.name,
        image: item.image,
        active: item.code,
        count: item.stickers.length,
        stickers: item.stickers,
      })) : [];

      this.setData({
        fresnsLang: await fresnsConfig('language_pack_contents'),
        stickerTabs: stickerTabs,
        stickers: stickerTabs[0].stickers,
      });
    },
  },

  /** 组件功能 **/
  methods: {
    // 工具栏
    onClickToolBar: function (e) {
      const { tool } = e.currentTarget.dataset;
      const { draftId, config, tableName, uploadInfo } = this.data;
      const postMessageKey = 'fileUploadDone';

      // 表情
      if (tool == 'sticker') {
        const stickerTabs = this.data.stickerTabs;

        this.setData({
          stickers: stickerTabs[0].stickers,
          showStickerBox: !this.data.showStickerBox,
        });
      }

      // 图片
      if (tool == 'image') {
        if (config.image.uploadForm == 'plugin') {
          const uploadUrl = repPluginUrl(config.image.uploadUrl, {
            uploadInfo: uploadInfo.image,
            postMessageKey: postMessageKey,
          });

          wx.navigateTo({
            url: '/pages/webview?url=' + uploadUrl
          })

          return
        }

        return setTimeout(() => {
          this.onSelectImageOrVideo('image', tableName, draftId, config.image);
        }, 100);
      }

      // 视频
      if (tool == 'video') {
        if (config.video.uploadForm == 'plugin') {
          const uploadUrl = repPluginUrl(config.video.uploadUrl, {
            uploadInfo: uploadInfo.video,
            postMessageKey: postMessageKey,
          });

          wx.navigateTo({
            url: '/pages/webview?url=' + uploadUrl
          })

          return
        }

        return setTimeout(() => {
          this.onSelectImageOrVideo('video', tableName, draftId, config.video);
        }, 100);
      }

      // 音频和文档
      if (tool == 'audio' || tool == 'document') {
        return wx.showToast({
          title: "小程序里不支持上传，请到网站或 App 操作上传",
          icon: "none",
        });
      }

      // 标题
      if (tool == 'title') {
        console.log('toolbar title');
        return callPageFunction('switchShowTitleInput');
      }

      // 艾特
      if (tool == 'mention') {
        return callPageFunction('switchShowMentionDialog');
      }

      // 话题
      if (tool == 'hashtag') {
        return callPageFunction('switchShowHashtagDialog');
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

      callPageFunction('onContentInsert', code);

      this.setData({
        showStickerBox: false
      })
    },

    // 上传图片或视频
    onSelectImageOrVideo: function (fileType, tableName, draftId, fileConfig) {
      const type = fileType + 's';

      wx.chooseMedia({
        count: fileConfig.uploadNumber,
        mediaType: fileType,
        sizeType: 'compressed',
        maxDuration: fileConfig.maxTime || 10,

        success: async (res) => {
          const tempFiles = res.tempFiles;
          callPageFunction('onAddFiles', type, tempFiles);

          // const uploadPromises = tempFiles.map(tempFile => {
          //   return fresnsApi.common.commonUploadFile(
          //     tempFile.path,
          //     {
          //       tableName: tableName,
          //       tableColumn: 'id',
          //       tableId: draftId,
          //       type: fileType,
          //       uploadMode: 'file',
          //       file: tempFile.path,
          //   });
          // });
        },
      });
    },

    // 选择扩展
    onClickExpand: function (e) {
      console.log('onClickExpand', e);
    },
  },
});
