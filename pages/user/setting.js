/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import { globalInfo } from '../../configs/fresnsGlobalInfo'
import Api from '../../api/api'
import { getConfigItemValue } from '../../api/tool/replace-key'
import Base64 from "../../util/base64"

Page({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../../mixin/themeChanged'),
    require('../../mixin/loginInterceptor'),
  ],
  data: {
    user: null,
    member: null,

    // 验证码类型
    codeType: null,
    // 验证码
    verifyCode: null,
    // user 修改弹出层
    showModifyDialog: false,
    // user 弹出层标题
    modifyDialogTitle: null,
    // user 弹出层 value
    modifyDialogValue: null,
    // user 弹出层 触发 event
    modifyDialogEvent: null,
    // 性别
    genders: [
      '保密',
      '男',
      '女',
    ],
    // 会话设置
    dialogLimits: [
      '允许所有成员',
      '仅允许我关注的成员',
      '我关注的成员和已认证的成员',
    ],
    // 时区
    utc: null,
    // 时区选中 index
    utcIndex: null,
    // 语言
    languageMenus: null,
    // 语言选中index
    languageMenusIndex: null,
    // 已经验证码验证
    verifyCodeVerified: false,
    // 验证码等待中
    isVerifyCodeWaiting: false,
    waitingRemainSeconds: 60,
    // 验证码
    verifyCode: '',
    // 新验证码
    newVerifyCode: '',
    // 修改后新手机号
    newPhoneNumber: null,
    // 修改后的邮箱
    newEmail: null,
    // 修改登录密码方式
    modifyPwdType: "1",
    // 密码
    password: '',
    // 二次确认密码
    confirmPassword: '',
    // 当前密码
    currentPassword: '',
    // 修改钱包密码方式
    modifyWalletPwdType: "1",
    // 当前钱包密码
    currentWalletPassword: '',
    // 钱包密码
    walletPassword: '',
    // 二次确认钱包密码
    confirmWalletPassword: ''
  },
  onLoad: async function () {
    await this.loadUserInfo()
    await this.loadConfig()
  },
  loadConfig: async function () {
    const utc = await getConfigItemValue("utc");
    const languageMenus = await getConfigItemValue("language_menus");
    const [defaultCode, codeArray] = await Promise.all(
      [
        getConfigItemValue('send_sms_code'),
        getConfigItemValue('send_sms_code_more'),
      ],
    )
    let utcIndex, languageMenusIndex, mobileAreaRange, mobileAreaIndex, modifyPwdType, modifyWalletPwdType;
    mobileAreaRange = codeArray;
    mobileAreaIndex = codeArray.indexOf(defaultCode + '');

    utc.find((o, i) => {
      if (o.value === this.data.member.timezone) {
        utcIndex = i;
      }
    });
    languageMenus.find((o, i) => {
      if (o.langTag === this.data.member.language) {
        languageMenusIndex = i;
      }
    });
    modifyPwdType = this.data.user.password ? '1' : '2';
    modifyWalletPwdType = this.data.user.wallet.password ? '1' : '2';
    this.setData({
      utc,
      utcIndex,
      languageMenus,
      languageMenusIndex,
      mobileAreaRange,
      mobileAreaIndex,
      modifyPwdType,
      modifyWalletPwdType
    })
  },
  loadUserInfo: async function () {
    await globalInfo.awaitLogin()
    const [userDetailRes, memberDetailRes] = await Promise.all([
      Api.user.userDetail(),
      Api.member.memberDetail({
        viewMid: globalInfo.mid,
      }),
    ])
    if (userDetailRes.code === 0 && memberDetailRes.code === 0) {
      this.setData({
        user: userDetailRes.data,
        member: memberDetailRes.data.detail,
      })
    }
  },

  onMobileAreaPickerChange: function (e) {
    const idxStr = e.detail.value
    this.setData({
      mobileAreaIndex: +idxStr,
    })
  },

  onModifyPwdType: function (e) {
    this.setData({
      modifyPwdType: e.detail.value,
    })
  },

  onModifyWalletPwdType: function (e) {
    this.setData({
      modifyWalletPwdType: e.detail.value,
    })
  },

  onPasswordChange: function (e) {
    const value = e.detail.value
    this.setData({
      password: value,
    })
  },
  onConfirmPasswordChange: function (e) {
    const value = e.detail.value
    this.setData({
      confirmPassword: value,
    })
  },

  onCurrentPasswordChange: function (e) {
    const value = e.detail.value
    this.setData({
      currentPassword: value,
    })
  },
  onCurrentWalletPasswordChange: function (e) {
    const value = e.detail.value
    this.setData({
      currentWalletPassword: value,
    })
  },

  onWalletPasswordChange: function (e) {
    const value = e.detail.value
    this.setData({
      walletPassword: value,
    })
  },

  onConfirmWalletPassword: function (e) {
    const value = e.detail.value
    this.setData({
      confirmWalletPassword: value,
    })
  },



  /**
   * 发送验证码
   */
  sendVerifyCode: async function (e) {
    const { mobileAreaRange, mobileAreaIndex, isVerifyCodeWaiting, waitingRemainSeconds, user, newPhoneNumber, newEmail } = this.data
    if (isVerifyCodeWaiting) {
      wx.showToast({
        title: `发送冷却中 ${waitingRemainSeconds}s`,
        icon: 'none',
      })
      return
    }
    let params = null;
    switch (e.currentTarget.dataset.type) {
      case "oldPhone":
        params = {
          type: 2,
          useType: user.phone ? 4 : 3,
          templateId: 4,
          account: user.phone,
          countryCode: user.countryCode ?? + mobileAreaRange[mobileAreaIndex],
        }
        break;
      case "newPhone":
        if (!newPhoneNumber) {
          wx.showToast({
            title: `请输入新的手机号！`,
            icon: 'none',
          })
          return
        }
        params = {
          type: 2,
          useType: 1,
          templateId: 3,
          account: newPhoneNumber,
          countryCode: + mobileAreaRange[mobileAreaIndex],
        }
        break;
      case 'oldEmail':
        params = {
          type: 1,
          useType: 4,
          templateId: 4,
          account: user.email,
          countryCode: user.countryCode ?? + mobileAreaRange[mobileAreaIndex],
        }
        break;
      case 'newEmail':
        if (!newEmail) {
          wx.showToast({
            title: `请输入新的手机号！`,
            icon: 'none',
          })
          return
        }
        params = {
          type: 1,
          useType: user.email ? 1 : 3,
          templateId: user.email ? 3 : 4,
          account: newEmail,
          countryCode: user.countryCode ?? + mobileAreaRange[mobileAreaIndex],
        }
        break;
      case 'emailEditPwd':
        params = {
          type: 1,
          useType: 4,
          templateId: 5,
          account: user.email,
        }
        break;
      case 'phoneEditPwd':
        params = {
          type: 2,
          useType: 4,
          templateId: 5,
          account: user.phone,
          countryCode: user.countryCode,
        }
        break;
    }
    const sendVerifyRes = await Api.info.infoSendVerifyCode(params)

    if (sendVerifyRes.code === 0) {
      this.setData({ isVerifyCodeWaiting: true, waitingRemainSeconds: 60 })

      const interval = setInterval(() => {
        const now = this.data.waitingRemainSeconds - 1
        this.setData({
          waitingRemainSeconds: now,
          isVerifyCodeWaiting: now > 0,
        })
        if (now <= 0) {
          clearInterval(interval)
        }
      }, 1000)

      wx.showToast({
        title: '验证码发送成功',
        icon: 'none',
      })
    }
  },

  onVerifyCodeChange: function (e) {
    const value = e.detail.value
    this.setData({
      verifyCode: value
    })
  },

  onNewVerifyCodeChange: function (e) {
    const value = e.detail.value
    this.setData({
      newVerifyCode: value
    })
  },

  onNewPhoneNumberChange: function (e) {
    const value = e.detail.value
    this.setData({
      newPhoneNumber: value
    })
  },

  onNewEmailChange: function (e) {
    const value = e.detail.value
    this.setData({
      newEmail: value
    })
  },

  userVerification: async function (e) {
    const { verifyCode } = this.data;
    const codeType = e.currentTarget.dataset.codeType
    if (!verifyCode) {
      wx.showToast({
        title: '请输入验证码！',
        icon: 'none',
      })
      return
    }
    const userVerificationRes = await Api.user.userVerification({
      verifyCode,
      codeType
    })
    if (userVerificationRes.code === 0) {
      this.setData({
        isVerifyCodeWaiting: false,
        waitingRemainSeconds: 0,
        verifyCodeVerified: true
      })
    }
  },

  // 显示修改 member 弹出层
  showModifyDialog: async function (e) {
    this.setData({
      showModifyDialog: true,
      modifyDialogTitle: e.currentTarget.dataset.title,
      modifyDialogValue: e.currentTarget.dataset.value,
      modifyDialogEvent: e.currentTarget.dataset.event,
    })
  },

  onModifyDialogChange: function (e) {
    const value = e.detail.value
    this.setData({
      modifyDialogValue: value
    })
  },
  /**
   * member 头像
   */
  chooseImage: async function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: async function (res) {
        wx.showLoading({
          title: '图片上传中',
        })
        const { tempFilePaths, tempFiles } = res
        const uploadRes = await Api.editor.editorUpload(tempFilePaths[0], {
          type: 1,
          tableType: 6,
          tableName: 'members',
          tableField: 'avatar_file_id',
          mode: 1,
          tableId: that.data.member.mid,
          file: tempFilePaths[0],
        })
        const resultFile = uploadRes.data.files[0]
        const memberEditRes = await Api.member.memberEdit({
          avatarUrl: resultFile.imageAvatarUrl,
          avatarFid: resultFile.fid,
        })

        if (memberEditRes.code === 0) {
          that.setData({
            'member.avatar': resultFile.imageAvatarUrl
          })
          wx.showToast({
            title: '修改成功！',
          })
        }
        wx.hideLoading()
      },
      complete: async function (e) {

      }
    })
  },
  /**
   * member 成员昵称
   */
  modifyNickname: async function (e) {
    const memberEditRes = await Api.member.memberEdit({
      nickname: this.data.modifyDialogValue,
    })
    if (memberEditRes.code === 0) {
      this.setData({
        'member.nickname': this.data.modifyDialogValue
      })
      wx.showToast({
        title: '修改成功！',
      })
      this.setData({
        showModifyDialog: false
      })
    }
  },
  /**
   * member 成员名
   */
  modifyMName: async function (e) {
    const value = e.detail.value
    const memberEditRes = await Api.member.memberEdit({
      mname: this.data.modifyDialogValue,
    })
    if (memberEditRes.code === 0) {
      this.setData({
        'member.mname': this.data.modifyDialogValue
      })
      wx.showToast({
        title: '修改成功！',
      })
      this.setData({
        showModifyDialog: false
      })
    }
  },
  /**
   * member 简介
   */
  modifyBio: async function (e) {
    const memberEditRes = await Api.member.memberEdit({
      bio: this.data.modifyDialogValue,
    })
    if (memberEditRes.code === 0) {
      this.setData({
        'member.bio': this.data.modifyDialogValue
      })
      wx.showToast({
        title: '修改成功！',
      })
      this.setData({
        showModifyDialog: false
      })
    }
  },
  /**
   * member 性别
   */
  modifyGender: async function (e) {
    const value = e.detail.value;
    const memberEditRes = await Api.member.memberEdit({
      gender: value,
    })
    if (memberEditRes.code === 0) {
      this.setData({
        'member.gender': value
      })
      wx.showToast({
        title: '修改成功！',
      })
      this.setData({
        showModifyDialog: false
      })
    }
  },
  /**
   * member 生日
   */
  modifyBirthday: async function (e) {
    const value = e.detail.value
    const memberEditRes = await Api.member.memberEdit({
      birthday: value
    })
    if (memberEditRes.code === 0) {
      this.setData({
        'member.birthday': value
      })
      wx.showToast({
        title: '修改成功！',
      })
      this.setData({
        showModifyDialog: false
      })
    }
  },
  /**
   * member 会话设置
   */
  modifyDialogLimit: async function (e) {
    const value = Number(e.detail.value) + 1
    const memberEditRes = await Api.member.memberEdit({
      dialogLimit: value,
    })
    if (memberEditRes.code === 0) {
      this.setData({
        'member.dialogLimit': value
      })
      wx.showToast({
        title: '修改成功！',
      })
      this.setData({
        showModifyDialog: false
      })
    }
  },
  /**
   * member 时区
   */
  modifyTimezone: async function (e) {
    const value = this.data.utc[e.detail.value].value
    const memberEditRes = await Api.member.memberEdit({
      timezone: value,
    })
    if (memberEditRes.code === 0) {
      this.setData({
        'member.timezone': value,
        'utcIndex': e.detail.value
      })
      wx.showToast({
        title: '修改成功！',
      })
      this.setData({
        showModifyDialog: false
      })
    }
  },
  /**
   * member 偏好语言
   */
  modifyLanguage: async function (e) {
    const value = this.data.languageMenus[e.detail.value].langTag
    const memberEditRes = await Api.member.memberEdit({
      language: value,
    })
    if (memberEditRes.code === 0) {
      this.setData({
        'member.language': value,
        'languageMenusIndex': e.detail.value
      })
      wx.showToast({
        title: '修改成功！',
      })
      this.setData({
        showModifyDialog: false
      })
    }
  },
  /**
   * user 手机号码
   */
  modifyUserPhone: async function (e) {
    const { newPhoneNumber, verifyCode, mobileAreaRange, mobileAreaIndex, newVerifyCode } = this.data;
    const memberEditRes = await Api.user.userEdit({
      newVerifyCode,
      verifyCode,
      editPhone: newPhoneNumber,
      editCountryCode: +mobileAreaRange[mobileAreaIndex],
      codeType: 2
    })
    if (memberEditRes.code === 0) {
      this.setData({
        'user.phone': +mobileAreaRange[mobileAreaIndex] + '' + newPhoneNumber,
        'isVerifyCodeWaiting': false,
        'verifyCodeVerified': false,
        'waitingRemainSeconds': 0,
        'verifyCode': '',
        'newVerifyCode': '',
        'newPhoneNumber': null
      })
      wx.showToast({
        title: '修改成功！',
      })
      this.setData({
        showModifyDialog: false
      })
    }

  },
  /**
   * user 邮箱
   */
  modifyUserEmail: async function (e) {
    const { newEmail, verifyCode, newVerifyCode } = this.data;
    const memberEditRes = await Api.user.userEdit({
      newVerifyCode,
      verifyCode,
      editEmail: newEmail,
      codeType: 1
    })
    if (memberEditRes.code === 0) {
      this.setData({
        'user.email': newEmail,
        'isVerifyCodeWaiting': false,
        'verifyCodeVerified': false,
        'waitingRemainSeconds': 0,
        'verifyCode': '',
        'newVerifyCode': '',
        'newEmail': null
      })
      wx.showToast({
        title: '修改成功！',
      })
      this.setData({
        showModifyDialog: false
      })
    }
  },
  /**
   * user 登录密码
   */
  modifyUserLoginPassword: async function (e) {
    const { modifyPwdType, currentPassword, password, confirmPassword, verifyCode } = this.data
    let params = null;
    if (!password) {
      wx.showToast({
        title: '请输入新密码！',
      })
      return
    }
    if (password !== confirmPassword) {
      wx.showToast({
        title: '两次密码填写不一致',
      })
      return
    }

    switch (modifyPwdType) {
      case "1":
        params = {
          password: Base64.encode(currentPassword),
          editPassword: Base64.encode(password),
        }
        break;
      case "2":
      case "3":
        if (!verifyCode) {
          wx.showToast({
            title: '请输入验证码！',
          })
          return
        }
        params = {
          editPassword: Base64.encode(password),
          verifyCode,
          codeType: modifyPwdType === 3 ? 2 : 1
        }
        break;
    }
    const memberEditRes = await Api.user.userEdit(params)
    if (memberEditRes.code === 0) {
      this.setData({
        currentPassword: '',
        password: '',
        confirmPassword: '',
        showModifyDialog: false,
        verifyCode: '',
        waitingRemainSeconds: 0,
        'user.password': Base64.encode(password),
      })
      wx.showToast({
        title: '修改成功！',
      })
    }
  },
  /**
   * user 钱包密码
   */
  modifyUserWalletPassword: async function (e) {
    const { modifyWalletPwdType, currentWalletPassword, walletPassword, confirmWalletPassword, verifyCode } = this.data
    let params = null;
    if (!walletPassword) {
      wx.showToast({
        title: '请输入新密码！',
      })
      return
    }
    if (walletPassword !== confirmWalletPassword) {
      wx.showToast({
        title: '两次密码填写不一致',
      })
      return
    }
    switch (modifyWalletPwdType) {
      case "1":
        params = {
          walletPassword: Base64.encode(currentWalletPassword),
          editWalletPassword: Base64.encode(walletPassword),
        }
        break;
      case "2":
      case "3":
        if (!verifyCode) {
          wx.showToast({
            title: '请输入验证码！',
          })
          return
        }
        params = {
          editWalletPassword: Base64.encode(walletPassword),
          verifyCode,
          codeType: modifyWalletPwdType === 3 ? 2 : 1
        }
        break;
    }
    const memberEditRes = await Api.user.userEdit(params)
    if (memberEditRes.code === 0) {
      this.setData({
        currentWalletPassword: '',
        walletPassword: '',
        confirmWalletPassword: '',
        showModifyDialog: false,
        verifyCode: '',
        waitingRemainSeconds: 0,
        'user.wallet.password': Base64.encode(walletPassword),
      })
      wx.showToast({
        title: '修改成功！',
      })
    }
  },
})
