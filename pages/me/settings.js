/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../sdk/services/api';
import { fresnsClient } from '../../sdk/helpers/client';
import { fresnsConfig, fresnsLang } from '../../sdk/helpers/configs';
import { fresnsAccount, fresnsUser, fresnsOverview } from '../../sdk/helpers/profiles';
import { fresnsLogin } from '../../sdk/helpers/login';

Page({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../../mixins/common'),
    require('../../mixins/fresnsCallback'),
    require('../../sdk/extensions/functions'),
  ],

  /** 页面的初始数据 **/
  data: {
    title: null,
    logo: null,
    appBaseInfo: {},

    fresnsConfig: null,
    fresnsLang: null,
    fresnsAccount: null,
    fresnsUser: null,
    fresnsOverview: null,

    userArchives: [],
    archivesMap: null,
    archiveDialog: false,
    archiveWrap: false,
    currentArchiveConfig: null,
    currentArchive: null,

    // 选项
    birthdayDisplayOptions: [],
    genderOptions: [],
    genderPronounOptions: [],
    genderPronouns: [],
    policyOptions: [],

    // dialog
    dialogShow: false,
    dialogWrap: false,

    // 修改层
    modifyDialogType: null,
    modifyDialogTitle: null,
    modifyDialogValue: null,

    modifyDialogNewValue: null,
    modifyDialogHeight: 0,

    // 互联信息
    connects: {},
    wechatMiniProgramLoginName: null,
    wechatLoginName: null,
    appleLoginName: null,
  },

  /** 监听页面加载 **/
  onLoad: async function () {
    const fsLang = await fresnsLang();

    const birthdayDisplayOptions = [
      fsLang.settingBirthdayDisplayType1,
      fsLang.settingBirthdayDisplayType2,
      fsLang.settingBirthdayDisplayType3,
      fsLang.settingBirthdayDisplayType4,
    ];

    const genderOptions = [
      fsLang.settingGenderNull,
      fsLang.settingGenderMale,
      fsLang.settingGenderFemale,
      fsLang.settingGenderCustom,
    ];
    const genderPronounOptions = [
      fsLang.settingGenderPronounOptionShe,
      fsLang.settingGenderPronounOptionHe,
      fsLang.settingGenderPronounOptionThey,
    ];
    const genderPronouns = [fsLang.she, fsLang.he, fsLang.they];

    const policyOptions = [
      fsLang.optionEveryone,
      fsLang.optionPeopleYouFollow,
      fsLang.optionPeopleYouFollowOrVerified,
      fsLang.optionNoOneIsAllowed,
    ];

    const archiveRes = await fresnsApi.global.archives('user');

    let userArchives = [];
    let archivesMap = null;
    if (archiveRes.code == 0) {
      userArchives = archiveRes.data;

      archivesMap = userArchives.reduce((acc, item) => {
        acc[item.code] = item;
        return acc;
      }, {});
    }

    const langTag = fresnsClient.langTag;

    const wechatMiniProgramLoginNameMap = {
      en: 'Sign in with WeChat Mini Program',
      'zh-Hans': '通过微信小程序登录',
      'zh-Hant': '透過 WeChat 小程式登入',
    };
    const wechatMiniProgramLoginName = wechatMiniProgramLoginNameMap[langTag] || wechatMiniProgramLoginNameMap[en];

    const wechatLoginNameMap = {
      en: 'Sign in with WeChat',
      'zh-Hans': '通过微信登录',
      'zh-Hant': '透過 WeChat 登入',
    };
    const wechatLoginName = wechatLoginNameMap[langTag] || wechatLoginNameMap[en];

    const appleLoginNameMap = {
      en: 'Sign in with Apple',
      'zh-Hans': '通过 Apple 登录',
      'zh-Hant': '透過 Apple 登入',
    };
    const appleLoginName = appleLoginNameMap[langTag] || appleLoginNameMap[en];

    const resultRes = await fresnsApi.plugins.wechatLogin.connects();

    let connects = [];
    if (resultRes.code == 0) {
      connects = resultRes.data;
    }

    this.setData({
      title: await fresnsConfig('channel_me_settings_name'),
      logo: await fresnsConfig('site_logo'),
      appBaseInfo: fresnsClient.appBaseInfo,
      fresnsConfig: await fresnsConfig(),
      fresnsLang: fsLang,
      fresnsAccount: await fresnsAccount('detail'),
      fresnsUser: await fresnsUser('detail'),
      fresnsOverview: await fresnsOverview(),
      userArchives: userArchives,
      archivesMap: archivesMap,
      birthdayDisplayOptions: birthdayDisplayOptions,
      genderOptions: genderOptions,
      genderPronounOptions: genderPronounOptions,
      genderPronouns: genderPronouns,
      policyOptions: policyOptions,
      enableWeChatLogin: fresnsClient.enableWeChatLogin,
      connects: connects,
      wechatMiniProgramLoginName: wechatMiniProgramLoginName,
      wechatLoginName: wechatLoginName,
      appleLoginName: appleLoginName,
    });
  },

  /** 重新加载用户详情 **/
  reloadFresnsUser: async function () {
    console.log('reloadFresnsUser');
    wx.removeStorageSync('fresnsUserData');

    this.setData({
      fresnsUser: await fresnsUser('detail'),
    });
  },

  // 修改头像
  modifyAvatar: async function () {
    const uid = this.data.fresnsUser.uid;

    wx.chooseMedia({
      count: 1,
      mediaType: 'image',
      sizeType: 'compressed',
      success: async (res) => {
        wx.showLoading({
          title: await fresnsLang('inProgress'), // 处理中
        });

        const tempFile = res.tempFiles[0];

        const resultRes = await fresnsApi.common.fileUpload({
          usageType: 'userAvatar',
          usageFsid: uid,
          type: 'image',
          file: tempFile.tempFilePath,
        });

        console.log('modifyAvatar', resultRes.code, resultRes.message, resultRes.data);
        if (resultRes.code === 0) {
          this.reloadFresnsUser();
        }

        wx.hideLoading();
      },
    });
  },

  // 修改生日显示方式
  modifyBirthdayDisplayType: async function (e) {
    console.log('modifyBirthdayDisplayType', e);

    const value = Number(e.detail.value) + 1;
    console.log('modifyBirthdayDisplayType value', value);

    const userEditRes = await fresnsApi.user.updateProfile({
      birthdayDisplayType: value,
    });

    if (userEditRes.code === 0) {
      this.reloadFresnsUser();
    }
  },

  // 修改性别
  modifyGender: async function (e) {
    console.log('modifyGender', e);

    const value = Number(e.detail.value) + 1;
    console.log('modifyGender value', value);

    const userEditRes = await fresnsApi.user.updateProfile({
      gender: value,
    });

    if (userEditRes.code === 0) {
      this.reloadFresnsUser();
    }
  },
  modifyGenderPronoun: async function (e) {
    console.log('modifyGenderPronoun', e);

    const value = Number(e.detail.value) + 1;
    console.log('modifyGenderPronoun value', value);

    const userEditRes = await fresnsApi.user.updateProfile({
      genderPronoun: value,
    });

    if (userEditRes.code === 0) {
      this.reloadFresnsUser();
    }
  },

  // 修改私信限制
  modifyConversationPolicy: async function (e) {
    console.log('modifyConversationPolicy', e);

    const value = Number(e.detail.value) + 1;
    console.log('modifyConversationPolicy value', value);

    const userEditRes = await fresnsApi.user.updateSetting({
      conversationPolicy: value,
    });

    if (userEditRes.code === 0) {
      this.reloadFresnsUser();
    }
  },

  // 修改评论限制
  modifyCommentPolicy: async function (e) {
    console.log('modifyCommentPolicy', e);

    const value = Number(e.detail.value) + 1;
    console.log('modifyCommentPolicy value', value);

    const userEditRes = await fresnsApi.user.updateSetting({
      commentPolicy: value,
    });

    if (userEditRes.code === 0) {
      this.reloadFresnsUser();
    }
  },

  // 显示修改框
  showModifyDialog: async function (e) {
    const type = e.currentTarget.dataset.type;

    const modifyDialogType = e.currentTarget.dataset.type;
    let modifyDialogTitle;
    let modifyDialogValue;

    if (modifyDialogType == 'username') {
      modifyDialogTitle = await fresnsConfig('user_username_name');
      modifyDialogValue = await fresnsUser('detail.username');
    }

    if (modifyDialogType == 'nickname') {
      modifyDialogTitle = await fresnsConfig('user_nickname_name');
      modifyDialogValue = await fresnsUser('detail.nickname');
    }

    if (modifyDialogType == 'bio') {
      modifyDialogTitle = await fresnsConfig('user_bio_name');
      modifyDialogValue = await fresnsUser('detail.bio');
    }

    if (modifyDialogType == 'genderCustom') {
      modifyDialogTitle = (await fresnsLang('userGender')) + ': ' + (await fresnsLang('settingGenderCustom'));
      modifyDialogValue = await fresnsUser('detail.genderCustom');
    }

    this.setData({
      dialogShow: true,
      dialogWrap: true,
      modifyDialogType: modifyDialogType,
      modifyDialogTitle: modifyDialogTitle,
      modifyDialogValue: modifyDialogValue,
      modifyDialogNewValue: modifyDialogValue,
    });
  },

  dialogClose() {
    this.setData({
      dialogShow: false,
      dialogWrap: false,
    });
  },

  // 键盘高度发生变化的时候触发
  handleKeyboard: function (e) {
    const height = e.detail.height || 0;

    console.log('handleKeyboard', height, e);

    this.setData({
      modifyDialogHeight: height,
    });
  },

  // 键盘输入时触发
  handleInput: function (e) {
    this.setData({
      modifyDialogNewValue: e.detail.value,
    });
  },

  // 提交修改
  submitChange: async function (e) {
    console.log('submitChange', e);

    // editKey: username,nickname,bio
    const editKey = this.data.modifyDialogType;
    const editValue = this.data.modifyDialogNewValue;

    console.log('submitChange', editKey, editValue);

    // 修改用户信息
    const userEditRes = await fresnsApi.user.updateProfile({
      [editKey]: editValue,
    });

    if (userEditRes.code === 0) {
      this.reloadFresnsUser();

      this.setData({
        dialogShow: false,
        dialogWrap: false,
      });

      wx.showToast({
        title: userEditRes.message,
        icon: 'none',
      });
    }
  },

  // 扩展资料编辑窗口关闭
  archiveDialogClose() {
    this.setData({
      archiveDialog: false,
      archiveWrap: false,
      currentArchiveConfig: null,
      currentArchive: null,
    });
  },

  // 扩展资料编辑窗口
  onClickArchiveEdit(e) {
    const code = e.currentTarget.dataset.code;

    const archiveConfigs = this.data.userArchives;

    const currentArchiveConfig = archiveConfigs.find((item) => item.code === code);
    const currentArchive = this.data.archivesMap[code];

    this.setData({
      archiveDialog: true,
      archiveWrap: true,
      currentArchiveConfig: currentArchiveConfig,
      currentArchive: currentArchive,
    });
  },

  // 绑定微信小程序
  onWeChatConnectMiniProgram: async function () {
    const connects = this.data.connects;

    if (connects.wechatMiniProgram) {
      wx.showToast({
        title: await fresnsLang('accountCenterTip'),
        icon: 'none',
      });

      return;
    }

    const appBaseInfo = this.data.connects;

    if (appBaseInfo.isApp) {
      wx.showToast({
        title: await fresnsLang('tipConnectWeChatMiniProgram'),
        icon: 'none',
      });

      return;
    }

    // 已登录状态请求则是绑定关联
    const loginRes = await fresnsLogin.wechatLogin();
    if (loginRes.code === 0) {
      this.reloadFresnsUser();
    }
  },

  // 绑定微信 App
  onAppConnectWeChat: async function () {
    const connects = this.data.connects;

    if (connects.wechatMobileApp) {
      wx.showToast({
        title: await fresnsLang('accountCenterTip'),
        icon: 'none',
      });

      return;
    }

    const appBaseInfo = this.data.appBaseInfo;

    if (appBaseInfo.isWechat) {
      wx.showToast({
        title: await fresnsLang('tipConnectWeChatMiniApp'),
        icon: 'none',
      });

      return;
    }

    // 已登录状态请求则是绑定关联
    const loginRes = await fresnsLogin.appWechatLogin();
    if (loginRes.code === 0) {
      this.reloadFresnsUser();
    }
  },

  // 绑定苹果账户 App
  onAppConnectApple: async function () {
    const connects = this.data.appBaseInfo;

    if (connects.apple) {
      wx.showToast({
        title: await fresnsLang('accountCenterTip'),
        icon: 'none',
      });

      return;
    }

    const appBaseInfo = this.data.appBaseInfo;

    if (appBaseInfo.isWechat) {
      wx.showToast({
        title: await fresnsLang('tipConnectWeChatMiniApp'),
        icon: 'none',
      });

      return;
    }

    // 已登录状态请求则是绑定关联
    const loginRes = await fresnsLogin.appleLogin();
    if (loginRes.code === 0) {
      this.reloadFresnsUser();
    }
  },
});
