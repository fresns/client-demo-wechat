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
    archives: {
      type: Array,
      value: [],
    },
    archiveGroupConfigs: {
      type: Array,
      value: [],
    },
  },

  /** 组件的初始数据 **/
  data: {
    archiveAllConfigs: [],

    archivesMap: null,

    dialog: false,
    wrap: false,

    currentArchiveConfig: null,
    currentArchive: null,

    langImage: '图片',
    langVideo: '视频',
    langAudio: '音频',
    langDocument: '文档',
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached: async function () {
      const archivesMap = this.data.archives.reduce((acc, item) => {
        acc[item.code] = item;
        return acc;
      }, {});

      this.setData({
        archivesMap: archivesMap,
        langImage: await fresnsLang('image'),
        langVideo: await fresnsLang('video'),
        langAudio: await fresnsLang('audio'),
        langDocument: await fresnsLang('document'),
      });

      const type = this.data.type;

      const resultRes = await fresnsApi.global.archives(type);

      if (resultRes.code == 0) {
        this.setData({
          archiveAllConfigs: resultRes.data,
        });
      }
    },
  },

  /** 组件功能 **/
  methods: {
    close() {
      this.setData({
        dialog: false,
        wrap: false,
        currentArchiveConfig: null,
        currentArchive: null,
      });
    },

    onClickEdit(e) {
      const archiveType = e.currentTarget.dataset.archiveType;
      const code = e.currentTarget.dataset.code;

      let archiveConfigs = this.data.archiveAllConfigs;
      if (archiveType == 'group') {
        archiveConfigs = this.data.archiveGroupConfigs;
      }

      const currentArchiveConfig = archiveConfigs.find(item => item.code === code);
      const currentArchive = this.data.archivesMap[code];

      this.setData({
        dialog: true,
        wrap: true,
        currentArchiveConfig: currentArchiveConfig,
        currentArchive: currentArchive,
      });
    },
  },
});
