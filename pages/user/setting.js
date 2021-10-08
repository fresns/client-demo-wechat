/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import { globalInfo } from '../../configs/fresnsGlobalInfo'
import Api from '../../api/api'

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
  },
  onLoad: async function () {
    await this.loadUserInfo()
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
  /**
   * member 头像
   */
  chooseImage: async function () {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: async function (res) {
        const { tempFilePaths, tempFiles } = res
        const uploadRes = await Api.editor.editorUpload(tempFilePaths[0], {
          type: 1,
          tableType: 8,
          tableName: 'post_logs',
          tableField: 'files_json',
          mode: 1,
          file: tempFilePaths[0],
        })

        const resultFile = uploadRes.data.files[0]
        const memberEditRes = await Api.member.memberDetail({
          avatarFileUrl: resultFile,
        })
      },
    })
  },
  /**
   * member 成员昵称
   */
  modifyNickname: async function (e) {
    const value = e.detail.value
    const res = await Api.member.memberEdit({
      nickname: value,
    })
  },
  /**
   * member 成员名
   */
  modifyMName: async function (e) {
    const value = e.detail.value
    const res = await Api.member.memberEdit({
      mname: value,
    })
  },
  /**
   * member 简介
   */
  modifyBio: async function (e) {
    const value = e.detail.value
    const res = await Api.member.memberEdit({
      bio: value,
    })
  },
  /**
   * member 性别
   */
  modifyGender: async function (e) {
    const value = e.detail.value
    const res = await Api.member.memberEdit({
      gender: value,
    })
  },
  /**
   * member 生日
   */
  modifyBirthday: async function (e) {
    const value = e.detail.value
    const res = await Api.member.memberEdit({
      birthday: value,
    })
  },
  /**
   * member 会话设置
   */
  modifyDialogLimit: async function (e) {
    const value = e.detail.value
    const res = await Api.member.memberEdit({
      dialogLimit: value,
    })
  },
  /**
   * member 时区
   */
  modifyTimezone: async function (e) {
    const value = e.detail.value
    const res = await Api.member.memberEdit({
      timezone: value,
    })
  },
  /**
   * member 偏好语言
   */
  modifyLanguage: async function (e) {
    const value = e.detail.value
    const res = await Api.member.memberEdit({
      language: value,
    })
  },
  /**
   * user 手机号码
   */
  modifyUserPhone: async function (e) {
    const value = e.detail.value
    const res = await Api.user.userEdit({
      editPhone: value,
    })
  },
  /**
   * user 邮箱
   */
  modifyUserEmail: async function (e) {
    const value = e.detail.value
    const res = await Api.user.userEdit({
      editEmail: value,
    })
  },
  /**
   * user 登录密码
   */
  modifyUserLoginPassword: async function (e) {
    const value = e.detail.value
    const res = await Api.user.userEdit({
      editPassword: value,
    })
  },
  /**
   * user 钱包密码
   */
  modifyUserWalletPassword: async function () {
    const value = e.detail.value
    const res = await Api.user.userEdit({
      editWalletPassword: value,
    })
  },
})
