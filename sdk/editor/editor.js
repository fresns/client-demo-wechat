/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../services';
import { fresnsConfig, fresnsEditor } from '../helpers/configs';

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
    fsid: {
      type: String,
      value: null,
    },
    options: {
      type: Object,
      value: {
        commentPid: null,
        commentCid: null,
        quotePid: null,
        gid: null,
        title: null,
        content: null,
        isMarkdown: null,
        isAnonymous: null,
        commentPolicy: null,
        commentPrivate: null,
        gtid: null,
        locationInfo: {},
        archives: [],
        extends: [],
      },
    },
  },

  /** 组件的初始数据 **/
  data: {
    editorConfig: {},
    editorTip: false,
    draftSelector: true,
    editorForm: false,
    editControls: {},
    draftDetail: {},

    titleInputShow: false,
    mentionDialogShow: false,
    hashtagDialogShow: false,

    publishBtnName: null,
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached: async function () {
      const type = this.data.type;

      let editorConfig = await fresnsEditor[type]();

      const titleConfig = editorConfig.editor.title;

      this.setData({
        editorConfig: editorConfig,
        titleInputShow: titleConfig.required ? true : titleConfig.show,
        publishBtnName: await fresnsConfig(`publish_${type}_name`),
      });
    },
  },

  /** 组件所在页面的生命周期函数 **/
  pageLifetimes: {
    show: function () {
      this.handleCallbackMessage(); // 处理回调消息
    },
  },

  /** 组件功能 **/
  methods: {
    // 监听草稿选择
    eventDraftChoose: function (e) {
      const draftData = e.detail.draftData;
      console.log('eventDraftChoose', draftData);

      let editorTip = false;
      if (draftData.editControls.isEditDraft) {
        editorTip = false;
      }

      this.setData({
        editorTip: editorTip,
        draftSelector: false,
        editorForm: true,
        editControls: draftData.editControls,
        draftDetail: draftData.detail,
        did: draftData.detail.did,
      });

      if (draftData.detail.title) {
        this.setData({
          titleInputShow: true,
        });
      }
    },

    // 监听窗口显示
    eventDialogShow: function (e) {
      const type = e.detail.type;

      switch (type) {
        case 'title':
          const titleInputShow = this.data.titleInputShow;

          this.setData({
            titleInputShow: !titleInputShow,
          });
          break;

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

    // 监听插入内容
    eventInsertContent(e) {
      const value = e.detail.value;

      const componentInstance = this.selectComponent('#content');

      componentInstance.onInsertContent(value);
    },

    // 监听添加文件
    eventAddFiles: function (e) {
      const type = e.detail.fileType + 's';
      const tempFiles = e.detail.tempFiles;

      const updatedTempFiles = tempFiles.map(file => ({
        ...file,
        duration: file.duration,

        imageRatioUrl: file.tempFilePath,
        imageSquareUrl: file.tempFilePath,
        imageBigUrl: file.tempFilePath,

        videoPosterUrl: file.thumbTempFilePath,
        videoUrl: file.tempFilePath,

        newChoice: true,
        waitingUpload: true,
        filePath: file.tempFilePath,
      }));

      const draftDetail = this.data.draftDetail;

      Array.prototype.push.apply(draftDetail.files[type], updatedTempFiles);

      this.setData({
        draftDetail: draftDetail,
      });
    },

    // 监听更新文件
    eventUpdateFile(e) {
      const type = e.detail.fileType + 's';
      const fid = e.detail.fid;
      const filePath = e.detail.filePath;
      const updateType = e.detail.updateType; // upload, done, delete

      const draftDetail = this.data.draftDetail;

      const fileArr = draftDetail.files[type];

      const index = fileArr.findIndex((fileArr) => fileArr.filePath == filePath);

      if (index == -1) {
        return;
      }

      const fileData = fileArr[index];

      switch (updateType) {
        case 'upload':
          fileData.fid = fid;
          fileData.newChoice = true;
          fileData.waitingUpload = false;

          fileArr[index] = fileData;
          break;

        case 'done':
          fileData.fid = fid;
          fileData.newChoice = false;
          fileData.waitingUpload = false;

          fileArr[index] = fileData;
          break;

        case 'delete':
          fileArr.splice(index, 1);
          break;
      }

      draftDetail.files[type] = fileArr;

      this.setData({
        draftDetail: draftDetail,
      });
    },

    // 处理回调消息
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
        // 重载草稿
        case 'reload':
          const detailRes = await fresnsApi.editor.draftDetail(type, did);

          if (detailRes.code == 0) {
            this.setData({
              editControls: detailRes.data.editControls,
              draftDetail: detailRes.data.detail,
            });
          }
          break;

        // 处理文件上传
        case 'fresnsEditorUpload':
          if (dataHandler == 'add') {
            const draftDetail = this.data.draftDetail;

            if (data.type == 1) {
              draftDetail.files.images.push(data);
            }

            if (data.type == 2) {
              draftDetail.files.videos.push(data);
            }

            if (data.type == 3) {
              draftDetail.files.audios.push(data);
            }

            if (data.type == 4) {
              draftDetail.files.documents.push(data);
            }

            this.setData({
              draftDetail: draftDetail,
            });
          }
          break;
      }

      // 处理完毕，清空回调信息
      console.log('callbackMessage removeStorageSync', 'end');
      wx.removeStorageSync('fresnsCallbackMessage');
    },
  },
});
