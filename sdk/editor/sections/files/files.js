/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../../services/api';
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
    files: {
      type: Object,
      value: {
        images: [],
        videos: [],
        audios: [],
        documents: [],
      },
    },
  },

  /** 组件的初始数据 **/
  data: {
    images: [],
    videos: [],
    audios: [],
    documents: [],

    imageUrls: [],
  },

  /** 组件数据字段监听器 **/
  observers: {
    files: function (files) {
      let urls = [];
      if (files.images) {
        urls = files.images.map((image) => image.imageBigUrl);
      }

      this.setData({
        images: files.images,
        videos: files.videos,
        audios: files.audios,
        documents: files.documents,
        imageUrls: urls,
      });
    },
  },

  /** 组件功能 **/
  methods: {
    // 文件菜单
    handleFiles: async function (e) {
      const draftType = this.data.type;
      const did = this.data.did;
      const { type, fid, filePath, url } = e.currentTarget.dataset;

      let itemList = [await fresnsLang('delete')];
      let imageUrls = [];
      if (type == 'image') {
        itemList = [await fresnsLang('view'), await fresnsLang('delete')];
        imageUrls = this.data.imageUrls;
      }

      const self = this;
      const typeKey = type + 's';
      const files = this.data[typeKey];

      wx.showActionSheet({
        itemList: itemList,
        success: async (res) => {
          const tapIndex = res.tapIndex;

          if (type == 'image' && tapIndex == 0) {
            wx.previewImage({
              current: url,
              urls: imageUrls,
            });

            return;
          }

          // delete
          if (!fid) {
            const newFiles = files.filter((file) => file.filePath !== filePath); // 仅保留与给定 filePath 不同的文件

            self.setData({
              [typeKey]: newFiles,
            });

            return;
          }

          const resultRes = await fresnsApi.editor.draftUpdate(draftType, did, { deleteFile: fid });

          if (resultRes.code == 0) {
            const newFiles = files.filter((file) => file.fid !== fid); // 仅保留与给定 fid 不同的文件

            self.setData({
              [typeKey]: newFiles,
            });
          }
        },
      });
    },
  },
});
