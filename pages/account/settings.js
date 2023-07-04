/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../api/api';
import { fresnsConfig, fresnsLang, fresnsAccount, fresnsUser, fresnsUserPanel } from '../../api/tool/function';
import { getTimezoneIndex, formattedDate } from '../../utils/fresnsUtilities';
import { base64_encode } from '../../libs/base64/base64';

Page({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../../mixins/themeChanged'),
    require('../../mixins/loginInterceptor'),
    require('../../mixins/sendVerifyCode'),
    require('../../mixins/fresnsExtensions'),
    require('../../mixins/fresnsCallback'),
  ],

  /** 页面的初始数据 **/
  data: {
    fresnsConfig: null,
    fresnsLang: null,
    fresnsAccount: null,
    fresnsUser: null,
    fresnsUserPanel: null,

    // 选项
    genderOptions: [],
    limitOptions: [],
    settingTypeArr: [],
    settingTypeIndex: 0,
    settingTypeSelect: null,

    // 初始数据
    initialTimezoneIndex: 0,
    endDate: null,

    // 修改层
    showModifyDialog: false,
    showSubmitBtn: true,
    modifyDialogTitle: null,
    modifyDialogValue: null,
    modifyDialogEvent: null,
    modifyDialogNewValue: null,
    modifyDialogHeight: 0,
    bioLength: 0,
    verifyIdentityRequired: false, // 是否要验证身份（修改手机或邮箱时，如果账号已有，则需要先验证身份）
    verifyIdentityPassed: true, // 身份验证是否通过
    btnLoading: false,

    // 手机区号选项
    countryCodeRange: [],
    countryCodeIndex: null,

    // 密码选项
    passwordHasNumber: false,
    passwordHasLowercase: false,
    passwordHasUppercase: false,
    passwordHasSymbols: false,

    // 账号修改资料
    codeType: null,
    verifyCode: null,
    newEmail: null,
    newPhone: null,
    newCountryCode: null,
    newVerifyCode: null,
    currentPassword: null,
    newPassword: null,
    currentWalletPassword: null,
    newWalletPassword: null,
  },

  /** 监听页面加载 **/
  onLoad: async function () {
    wx.setNavigationBarTitle({
      title: await fresnsConfig('menu_account_settings'),
    });

    const fsLang = await fresnsLang();

    const genderOptions = [fsLang.settingGenderNull, fsLang.settingGenderMale, fsLang.settingGenderFemale];
    const limitOptions = [
      fsLang.settingAllowAll,
      fsLang.settingAllowMyFollow,
      fsLang.settingAllowMyFollowAndVerified,
      fsLang.settingAllowNotAll,
    ];
    const utc = await fresnsConfig('utc');
    const userTimeZone = await fresnsUser('detail.timezone');
    const userBirthday = await fresnsUser('detail.birthday');

    let formatBirthday = '';
    if (userBirthday) {
      formatBirthday = formattedDate(userBirthday);
    }

    const [defaultCode, codeArray] = await Promise.all([
      fresnsConfig('send_sms_default_code'),
      fresnsConfig('send_sms_supported_codes'),
    ]);
    const countryCodeRange = codeArray.length === 1 ? [defaultCode] : codeArray;

    const passwordStrength = await fresnsConfig('password_strength');

    this.setData({
      fresnsConfig: await fresnsConfig(),
      fresnsLang: fsLang,
      fresnsAccount: await fresnsAccount('detail'),
      fresnsUser: await fresnsUser('detail'),
      fresnsUserPanel: await fresnsUserPanel(),
      genderOptions: genderOptions,
      limitOptions: limitOptions,
      initialTimezoneIndex: getTimezoneIndex(utc, userTimeZone),
      endDate: formattedDate(),
      formattedBirthday: formatBirthday,
      countryCodeRange: countryCodeRange,
      countryCodeIndex: countryCodeRange.indexOf(defaultCode),
      passwordHasNumber: passwordStrength.includes('number'),
      passwordHasLowercase: passwordStrength.includes('lowercase'),
      passwordHasUppercase: passwordStrength.includes('uppercase'),
      passwordHasSymbols: passwordStrength.includes('symbols'),
    });
  },

  /** 重新加载账号详情 **/
  reloadFresnsAccount: async function () {
    console.log('fresnsAccount');
    wx.removeStorageSync('fresnsAccount');

    this.setData({
      fresnsAccount: await fresnsAccount('detail'),
    });
  },

  /** 重新加载用户详情 **/
  reloadFresnsUser: async function () {
    console.log('reloadFresnsUser');
    wx.removeStorageSync('fresnsUser');

    this.setData({
      fresnsUser: await fresnsUser('detail'),
    });
  },

  // 修改头像
  modifyAvatar: async function () {
    wx.showNavigationBarLoading();

    const uid = this.data.fresnsUser.uid;
    console.log('modifyAvatar', uid);

    wx.chooseMedia({
      count: 1,
      mediaType: 'image',
      sizeType: 'compressed',

      success: async (res) => {
        const tempFile = res.tempFiles[0];
        console.log('modifyAvatar', tempFile);

        const resultRes = await fresnsApi.common.commonUploadFile(tempFile.tempFilePath, {
          tableName: 'users',
          tableColumn: 'avatar_file_id',
          tableKey: uid,
          type: 'image',
          uploadMode: 'file',
          file: tempFile.tempFilePath,
        });

        console.log('modifyAvatar', resultRes.code, resultRes.message, resultRes.data);
        if (resultRes.code === 0) {
          this.reloadFresnsUser();
        }
      },
    });

    wx.hideNavigationBarLoading();
  },

  // 修改性别
  modifyGender: async function (e) {
    console.log('modifyGender', e);

    const value = Number(e.detail.value) + 1;
    console.log('modifyGender value', value);

    const userEditRes = await fresnsApi.user.userEdit({
      gender: value,
    });

    if (userEditRes.code === 0) {
      this.reloadFresnsUser();
    }
  },

  // 修改生日
  modifyBirthday: async function (e) {
    console.log('modifyBirthday', e);

    const value = e.detail.value;
    const userEditRes = await fresnsApi.user.userEdit({
      birthday: value,
    });

    if (userEditRes.code === 0) {
      this.reloadFresnsUser();

      this.setData({
        formattedBirthday: value,
      });
    }
  },

  // 修改私信限制
  modifyConversationLimit: async function (e) {
    console.log('modifyConversationLimit', e);

    const value = Number(e.detail.value) + 1;
    console.log('modifyConversationLimit value', value);

    const userEditRes = await fresnsApi.user.userEdit({
      conversationLimit: value,
    });

    if (userEditRes.code === 0) {
      this.reloadFresnsUser();
    }
  },

  // 修改评论限制
  modifyCommentLimit: async function (e) {
    console.log('modifyCommentLimit', e);

    const value = Number(e.detail.value) + 1;
    console.log('modifyCommentLimit value', value);

    const userEditRes = await fresnsApi.user.userEdit({
      commentLimit: value,
    });

    if (userEditRes.code === 0) {
      this.reloadFresnsUser();
    }
  },

  // 修改时区
  modifyTimezone: async function (e) {
    console.log('modifyTimezone', e);

    const value = Number(e.detail.value);
    const utc = await fresnsConfig('utc');

    const timezone = utc[value].value;

    console.log('modifyTimezone value', value, timezone);

    const userEditRes = await fresnsApi.user.userEdit({
      timezone: timezone,
    });

    if (userEditRes.code === 0) {
      this.reloadFresnsUser();

      this.setData({
        initialTimezoneIndex: value,
      });
    }
  },

  // 显示修改框
  showModifyDialog: function (e) {
    this.setData({
      showModifyDialog: true,
      modifyDialogTitle: e.currentTarget.dataset.title,
      modifyDialogValue: e.currentTarget.dataset.value,
      modifyDialogEvent: e.currentTarget.dataset.event,
    });

    const fresnsAccount = this.data.fresnsAccount;
    const fresnsLang = this.data.fresnsLang;

    let showSubmitBtn = true;
    let codeType = null;
    let verifyIdentityRequired = false; // 是否要验证身份（修改手机或邮箱时，如果账号已有，则需要先验证身份）
    let verifyIdentityPassed = true; // 身份验证是否通过
    let modifyDialogNewValue = e.currentTarget.dataset.value;

    let settingTypeArr = [];

    switch (e.currentTarget.dataset.event) {
      case 'editPhone':
        showSubmitBtn = fresnsAccount.phone ? false : true;
        codeType = 'sms';
        verifyIdentityRequired = fresnsAccount.phone ? true : false;
        verifyIdentityPassed = fresnsAccount.phone ? false : true;
        modifyDialogNewValue = fresnsAccount.phone ? 'modifyAccountPhone' : 'setAccountPhone';
        break;

      case 'editEmail':
        showSubmitBtn = fresnsAccount.email ? false : true;
        codeType = 'email';
        verifyIdentityRequired = fresnsAccount.email ? true : false;
        verifyIdentityPassed = fresnsAccount.email ? false : true;
        modifyDialogNewValue = fresnsAccount.email ? 'modifyAccountEmail' : 'setAccountEmail';
        break;

      case 'editPassword':
        modifyDialogNewValue = 'modifyAccountLoginPassword';

        if (fresnsAccount.hasPassword) {
          settingTypeArr.push({
            code: 'password',
            name: fresnsLang.passwordCurrent,
          });
        }
        if (fresnsAccount.phone) {
          settingTypeArr.push({
            code: 'sms',
            name: fresnsLang.smsVerifyCode,
          });
        }
        if (fresnsAccount.email) {
          settingTypeArr.push({
            code: 'email',
            name: fresnsLang.emailVerifyCode,
          });
        }

        codeType = settingTypeArr.length ? settingTypeArr[0].code : null;
        showSubmitBtn = settingTypeArr.length ? true : false;
        break;

      case 'editWalletPassword':
        modifyDialogNewValue = 'modifyAccountWalletPassword';

        if (fresnsAccount.wallet.hasPassword) {
          settingTypeArr.push({
            code: 'password',
            name: fresnsLang.passwordCurrent,
          });
        }
        if (fresnsAccount.phone) {
          settingTypeArr.push({
            code: 'sms',
            name: fresnsLang.smsVerifyCode,
          });
        }
        if (fresnsAccount.email) {
          settingTypeArr.push({
            code: 'email',
            name: fresnsLang.emailVerifyCode,
          });
        }

        codeType = settingTypeArr.length ? settingTypeArr[0].code : null;
        showSubmitBtn = settingTypeArr.length ? true : false;
        break;

      default:
        modifyDialogNewValue = e.currentTarget.dataset.value;
    }

    this.setData({
      showSubmitBtn: showSubmitBtn,
      codeType: codeType == 'password' ? null : codeType,
      verifyIdentityRequired: verifyIdentityRequired,
      verifyIdentityPassed: verifyIdentityPassed,
      modifyDialogNewValue: modifyDialogNewValue,
      settingTypeArr: settingTypeArr,
      settingTypeSelect: settingTypeArr.length ? settingTypeArr[0].code : null,
    });
  },

  // 键盘高度发生变化的时候触发
  handleKeyboard: function (e) {
    this.setData({
      modifyDialogHeight: e.detail.height + 50,
    });
  },

  // 键盘输入时触发
  handleInput: function (e) {
    this.setData({
      modifyDialogNewValue: e.detail.value,
    });
  },

  // 切换修改方式
  onEditPickerChange: function (e) {
    const settingTypeArr = this.data.settingTypeArr;
    const value = e.detail.value;
    const select = settingTypeArr[value];
    const typeCode = select.code;

    this.setData({
      settingTypeIndex: value,
      settingTypeSelect: typeCode,
      codeType: typeCode,
      verifyCode: null,
    });
  },

  // 输入验证码
  inputVerifyCode: function (e) {
    this.setData({
      verifyCode: e.detail.value,
    });
  },

  // 输入邮箱
  inputNewEmail: function (e) {
    this.setData({
      newEmail: e.detail.value,
    });
  },

  // 输入新手机号
  inputNewPhone: function (e) {
    this.setData({
      newPhone: e.detail.value,
    });
  },

  // 输入新手机号的国际区号
  inputNewCountryCode: function (e) {
    const countryCodeRange = this.data.countryCodeRange;
    const value = e.detail.value;
    const idxStr = +value;

    this.setData({
      newCountryCode: countryCodeRange[idxStr],
    });
  },

  // 输入新验证码
  inputNewVerifyCode: function (e) {
    this.setData({
      newVerifyCode: e.detail.value,
    });
  },

  // 输入当前登录密码
  inputCurrentPassword: function (e) {
    this.setData({
      currentPassword: base64_encode(e.detail.value),
    });
  },

  // 输入新登录密码
  inputNewPassword: function (e) {
    this.setData({
      newPassword: base64_encode(e.detail.value),
    });
  },

  // 输入当前钱包密码
  inputCurrentWalletPassword: function (e) {
    this.setData({
      currentWalletPassword: base64_encode(e.detail.value),
    });
  },

  // 输入新钱包密码
  inputNewWalletPassword: function (e) {
    this.setData({
      newWalletPassword: base64_encode(e.detail.value),
    });
  },

  // 身份验证
  verifyIdentity: async function (e) {
    const codeType = this.data.codeType;
    const verifyCode = this.data.verifyCode;

    if (!verifyCode) {
      wx.showToast({
        title: (await fresnsLang('verifyCode')) + ': ' + (await fresnsLang('errorEmpty')), // 验证码不能为空
        icon: 'none',
      });

      return;
    }

    this.setData({
      btnLoading: true,
    });

    const resultRes = await fresnsApi.account.accountVerifyIdentity({
      type: codeType,
      verifyCode: verifyCode,
    });

    if (resultRes.code === 0) {
      wx.showToast({
        title: await fresnsLang('success'),
        icon: 'success',
      });

      this.setData({
        showSubmitBtn: true,
        verifyIdentityRequired: false,
        verifyIdentityPassed: true,
        isSendWaiting: false,
        waitingRemainSeconds: 0,
      });

      // 初始化发信配置
      wx.setStorageSync('fresnsSendConfig', {
        sendWaiting: false,
        expiresTime: null,
      });
    }

    this.setData({
      btnLoading: false,
    });
  },

  // 发送验证码
  sendVerifyCode: async function (e) {
    const type = e.currentTarget.dataset.type;
    const useType = e.currentTarget.dataset.useType;
    const templateId = e.currentTarget.dataset.templateId;
    const account = e.currentTarget.dataset.account;
    const countryCode = e.currentTarget.dataset.countryCode || (await fresnsConfig('send_sms_default_code'));
    console.log('type', type);
    console.log('useType', useType);
    console.log('templateId', templateId);
    console.log('account', account);
    console.log('countryCode', countryCode);

    this.fresnsSend(type, useType, templateId, account, countryCode);
  },

  // 提交修改
  submitChange: async function (e) {
    console.log('submitChange', e);

    // editKey: username,nickname,bio
    const editKey = e.currentTarget.dataset.editKey;
    const editValue = e.currentTarget.dataset.editValue;

    console.log('submitChange', editKey, editValue);

    if (
      editKey == 'editPhone' ||
      editKey == 'editEmail' ||
      editKey == 'editPassword' ||
      editKey == 'editWalletPassword'
    ) {
      const {
        codeType,
        verifyCode,
        newPhone,
        newCountryCode,
        newEmail,
        newVerifyCode,
        currentPassword,
        newPassword,
        currentWalletPassword,
        newWalletPassword,
      } = this.data;

      let params = {};
      switch (editValue) {
        case 'setAccountPhone':
          // 设置手机号码（当前账号无手机号码）
          params = {
            newPhone: newPhone,
            newCountryCode: newCountryCode || (await fresnsConfig('send_sms_default_code')),
            newVerifyCode: newVerifyCode,
          };
          break;

        case 'modifyAccountPhone':
          // 修改手机号码
          params = {
            codeType: 'sms',
            verifyCode: verifyCode,
            newPhone: newPhone,
            newCountryCode: newCountryCode || (await fresnsConfig('send_sms_default_code')),
            newVerifyCode: newVerifyCode,
          };
          break;

        case 'setAccountEmail':
          // 设置邮箱（当前账号无邮箱）
          params = {
            newEmail: newEmail,
            newVerifyCode: newVerifyCode,
          };
          break;

        case 'modifyAccountEmail':
          // 修改邮箱
          params = {
            codeType: 'email',
            verifyCode: verifyCode,
            newEmail: newEmail,
            newVerifyCode: newVerifyCode,
          };
          break;

        case 'modifyAccountLoginPassword':
          // 修改登录密码
          params = {
            codeType: codeType,
            verifyCode: verifyCode,
            currentPassword: currentPassword,
            newPassword: newPassword,
          };
          break;

        case 'modifyAccountWalletPassword':
          // 修改钱包密码
          params = {
            codeType: codeType,
            verifyCode: verifyCode,
            currentWalletPassword: currentWalletPassword,
            newWalletPassword: newWalletPassword,
          };
          break;

        default:
          return;
      }

      // 修改账号信息
      const accountEditRes = await fresnsApi.account.accountEdit(params);

      if (accountEditRes.code === 0) {
        this.reloadFresnsAccount();

        this.setData({
          showModifyDialog: false,
        });

        wx.showToast({
          title: accountEditRes.message,
          icon: 'none',
        });
      }

      return;
    }

    // 修改用户信息
    const userEditRes = await fresnsApi.user.userEdit({
      [editKey]: editValue,
    });

    if (userEditRes.code === 0) {
      this.reloadFresnsUser();

      this.setData({
        showModifyDialog: false,
      });

      wx.showToast({
        title: userEditRes.message,
        icon: 'none',
      });
    }
  },
});
