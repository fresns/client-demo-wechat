/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */

import dayjs from '../../../libs/dayjs/dayjs.min'
import Api from '../../../api/api'
import appConfig from '../../../appConfig'
import { globalInfo } from '../../../handler/globalInfo'
import { getConfigsByItemTag, getConfigItemValue } from '../../../api/tool/replace-key'

const chooseLocation = requirePlugin('chooseLocation')
const Type = {
  Post: 'POST',
  Comment: 'COMMENt',
}

Page({
  mixins: [
    require('../../../mixin/loginInterceptor'),
  ],
  data: {
    // 是否可以使用编辑器
    isEnable: true,
    // 编辑器类型
    type: Type.Post,

    currentDraft: null,
    draftTitle: '',
    draftContent: '',
    // 是否主动选择地址
    manualSelectLocation: false,
    draftLocation: null,
    draftAnonymous: 0,
    draftFiles: [
      {
        fid: '1',
        // 1.图片 / 2.视频 / 3.音频 / 4.文档
        type: 1,
        name: 'aa.jpg',
        extension: 'jpg',
        imageRatioUrl: 'https://img2.baidu.com/it/u=3043039063,2684560819&fm=26&fmt=auto',
      },
      {
        fid: '2',
        // 1.图片 / 2.视频 / 3.音频 / 4.文档
        type: 1,
        name: 'aa.jpg',
        extension: 'jpg',
        imageRatioUrl: 'https://img2.baidu.com/it/u=3043039063,2684560819&fm=26&fmt=auto',
      },
      {
        fid: '3',
        // 1.图片 / 2.视频 / 3.音频 / 4.文档
        type: 2,
        name: 'aa.jpg',
        extension: 'jpg',
        imageRatioUrl: 'https://img2.baidu.com/it/u=3043039063,2684560819&fm=26&fmt=auto',
        videoCover: 'https://img2.baidu.com/it/u=3043039063,2684560819&fm=26&fmt=auto',
        videoGif: 'https://img2.baidu.com/it/u=3043039063,2684560819&fm=26&fmt=auto',
        videoUrl: '',
      },
      {
        fid: '4',
        // 1.图片 / 2.视频 / 3.音频 / 4.文档
        type: 2,
        name: 'aa.jpg',
        extension: 'jpg',
        imageRatioUrl: 'https://img2.baidu.com/it/u=3043039063,2684560819&fm=26&fmt=auto',
        videoCover: 'https://img2.baidu.com/it/u=3043039063,2684560819&fm=26&fmt=auto',
        videoGif: 'https://img2.baidu.com/it/u=3043039063,2684560819&fm=26&fmt=auto',
        videoUrl: '',
      },
      {
        fid: '5',
        // 1.图片 / 2.视频 / 3.音频 / 4.文档
        type: 3,
        name: 'aa.jpg',
        extension: 'jpg',
        imageRatioUrl: 'https://img2.baidu.com/it/u=3043039063,2684560819&fm=26&fmt=auto',
        audioUrl: 'https://img2.baidu.com/it/u=3043039063,2684560819&fm=26&fmt=auto'
      },
      {
        fid: '6',
        // 1.图片 / 2.视频 / 3.音频 / 4.文档
        type: 4,
        name: 'aa.jpg',
        extension: 'jpg',
        imageRatioUrl: 'https://img2.baidu.com/it/u=3043039063,2684560819&fm=26&fmt=auto',

      },
    ],

    // 工具栏表情列表
    emojisList: null,

    /**
     * 获取全局配置 /api/fresns/info/configs 传参 itemTag = editorPosts
     * post_email_verify = true 则判断 /api/fresns/user/detail 接口 phone 参数是否有值
     * post_phone_verify = true 则判断 /api/fresns/user/detail 接口 email 参数是否有值
     * post_prove_verify = true 则判断 /api/fresns/user/detail 接口 verifyStatus 参数是否有值
     * post_limit_type = true 展示以下内容
     * post_limit_type
     * post_limit_period_start 或 post_limit_cycle_start
     * post_limit_period_end 或 post_limit_cycle_end
     * post_limit_rule
     * post_limit_prompt
     * post_limit_whitelist 如果当前成员的主角色在此列表，则 post_limit_type 不展示。
     * post_editor_group 是否开启小组
     * post_editor_title 是否开启标题
     * post_editor_emoji 是否开启表情
     * post_editor_image 是否开启图片
     * post_editor_video 是否开启视频
     * post_editor_audio 是否开启音频
     * post_editor_doc 是否开启文档
     * post_editor_expand 是否开启扩展功能
     * post_editor_lbs 是否开启定位
     * post_editor_anonymous 是否开启匿名
     * post_editor_group_required 小组是否必选
     * post_editor_title_view 标题输入框是否强显示
     * post_editor_title_required 标题是否必填
     * post_editor_title_word_count 标题字数限制
     * post_editor_word_count 帖子字数限制
     */
    editorConfigMap: null,
    // 话题显示类型
    hashtagShowType: null,
    // 扩展
    extensions: null,
    // 禁止词
    stopWords: null,
    // 是否显示草稿选择器
    isShowDraftSelector: false,
    // 现在的草稿
    drafts: null,
  },
  editorContext: null,
  updateTimer: null,
  onLoad: async function (options) {
    wx.createSelectorQuery().select('#editor').context((res) => {
      this.editorContext = res.context
    }).exec()

    // TODO
    // const editorConfigRes = await Api.editor.editorConfigs({
    //   type: 1,
    // })
    // console.log(editorConfigRes)

    await this._authorityCheck()
    const result = await getConfigItemValue('hashtag_show')
    this.setData({
      hashtagShowType: result,
    })

    const extensionRes = await Api.info.infoExtensions({
      type: 3,
      scene: 1,
    })
    if (extensionRes.code === 0) {
      this.setData({
        extensions: extensionRes.data.list,
      })
    }

    const stopWordsRes = await Api.info.infoStopWords()
    if (stopWordsRes.code === 0) {
      this.setData({
        stopWords: stopWordsRes.data.list,
      })
    }

    await this.getDrafts()
    // await this.createDraft()
    await this.getEmojis()
  },
  onShow: async function () {
    if (!this.updateTimer) {
      this.updateTimer = setInterval(() => {
        // this.updateTitleAndContent()
      }, 10000)
    }

    const location = chooseLocation.getLocation()
    if (location === null || this.data.manualSelectLocation === false) {
      this.setData({
        draftLocation: null,
      })
      return
    }

    const { latitude, longitude, province, city, district, address } = location
    this.setData({
      draftLocation: {
        'isLbs': 1,
        'mapId': 5,
        'latitude': latitude,
        'longitude': longitude,
        'scale': null,
        'poi': null,
        'poiId': null,
        'nation': null,
        'province': province,
        'city': city,
        'district': district,
        'adcode': null,
        'address': address,
      },
    })
  },
  onHide: async function () {
    if (this.updateTimer) {
      clearInterval(this.updateTimer)
      this.updateTimer = null
    }
  },
  _authorityCheck: async function () {
    const { isPublicMode, loginUser, loginMember } = globalInfo

    // 如果是私有模式，当成员过期后不可使用编辑器
    if (!isPublicMode && loginMember.expiredTime && (dayjs(loginMember.expiredTime).isBefore(dayjs()))) {
      return false
    }

    // 获取帖子配置
    const itemValue = await getConfigsByItemTag('editorPosts')
    this.setData({
      editorConfigMap: itemValue.reduce((res, val) => {
        res[val.itemKey] = val
        return res
      }, {}),
    })

    // 基于下发配置，做系列判断
    const { editorConfigMap } = this.data

    // 邮箱判断
    if (editorConfigMap['post_email_verify']?.itemValue === true) {
      if (!loginUser.email) {
        return false
      }
    }

    // 手机号判断
    if (editorConfigMap['post_phone_verify']?.itemValue === true) {
      if (!loginUser.phone) {
        return false
      }
    }

    // 用户认证状态判断
    if (editorConfigMap['post_prove_verify']?.itemValue === true) {
      if (!loginUser.verifyStatus) {
        return false
      }
    }

    // 时间段判断
    if (editorConfigMap['post_limit_status']?.itemValue === true) {
      if (editorConfigMap['post_limit_type']?.itemValue === 1) {
        if (
          dayjs().isBefore(dayjs(editorConfigMap['post_limit_period_start'])) ||
          dayjs().isAfter(dayjs(editorConfigMap['post_limit_period_end']))
        ) {
          return false
        }
      }

      if (editorConfigMap['post_limit_type']?.itemValue === 2) {
        // FIXME 根据返回字段设定精准匹配
        if (
          dayjs().isBefore(dayjs(editorConfigMap['post_limit_cycle_start'])) ||
          dayjs().isAfter(dayjs(editorConfigMap['post_limit_cycle_end']))
        ) {
          return false
        }
      }
    }

    return true
  },
  getDrafts: async function () {
    const draftRes = await Api.editor.editorLists({
      type: 1,
      status: 1,
    })
    if (draftRes.code === 0) {
      this.setData({
        isShowDraftSelector: true,
        drafts: draftRes.data.list,
      })
    }
  },
  getEmojis: async function () {
    const emojisRes = await Api.info.infoEmojis()
    this.setData({
      emojisList: emojisRes.data.list,
    })
    console.log(this.data.emojisList)
  },
  /**
   * 创建新的草稿
   * @returns {Promise<void>}
   */
  createDraft: async function () {
    const createRes = await Api.editor.editorCreate({
      type: 1,
    })
    console.log('createRes:', createRes)
  },
  /**
   * 当 editor 内容变更时触发
   * @returns {Promise<void>}
   */
  onEditorInput: async function (e) {
    const { text } = e.detail
    console.log('cccc', text)
    this.setData({
      draftContent: text,
    })
  },
  /**
   * 更新草稿内容
   * @returns {Promise<void>}
   */
  updateDraft: async function () {
    const {
      draftTitle, draftContent, draftLocation, draftAnonymous,
      currentDraft,
    } = this.data
    const updateRes = await Api.editor.editorUpdate({
      logType: 1,
      logId: currentDraft.id,
      // type: '',
      // gid: '',
      title: draftTitle,
      content: draftContent,
      isMarkdown: 0,
      isAnonymous: draftAnonymous,
      isPluginEdit: 0,
      pluginUnikey: '',
      memberListJson: '',
      commentSetJson: '',
      allowJson: '',
      locationJson: JSON.stringify(draftLocation),
      // filesJson: '',
      extendsJson: '',
    })
    console.log('update draft:', updateRes)
  },
  /**
   * 定时更新 title 和 content
   * @returns {Promise<void>}
   */
  updateTitleAndContent: async function () {
    const {
      draftTitle, draftContent, currentDraft,
    } = this.data
    const updateRes = await Api.editor.editorUpdate({
      logType: 1,
      logId: currentDraft.id,
      // type: '',
      // gid: '',
      title: draftTitle || '',
      content: draftContent || '',
    })
    console.log('update draft:', updateRes)
  },
  /**
   * 提交草稿内容
   * @returns {Promise<void>}
   */
  submitDraft: async function () {
    Api.editor.editorSubmit({
      type: 1,
      logId: '',
      deviceInfo: '',
    })
  },
  /**
   * 删除草稿
   */
  deleteDraft: async function () {
    const deleteRes = await Api.editor.editorDelete({
      type: 1,
      logId: this.data.currentDraft.id,
      deleteType: 1,
    })
    if (deleteRes.code === 0) {
      this.setData({
        isShowDraftSelector: true,
        currentDraft: null,
      })
    }
  },
  /**
   * 删除草稿附属文件
   */
  deleteDraftAttachedFile: async function () {
    Api.editor.editorDelete({
      type: 1,
      logId: this.data.currentDraft.id,
      deleteType: 2,
      deleteUuid: '',
    })
  },
  /**
   * 删除扩展内容
   */
  deleteDraftExtension: async function () {
    Api.editor.editorDelete({
      type: 1,
      logId: this.data.currentDraft.id,
      deleteType: 3,
      deleteUuid: '',
    })
  },
  /**
   * 草稿选择
   * @param draft
   */
  onSelectDraftCb: function (draft) {
    this.setData({
      isShowDraftSelector: false,
      currentDraft: draft,
      draftTitle: draft.title,
      draftContent: draft.content,
    })
    this.editorContext.setContents({
      html: draft.content,
    })
  },
  /**
   * 标题变更
   * @param title
   */
  onTitleChangeCb: function (title) {
    this.setData({
      draftTitle: title,
    })
  },
  /**
   * 选择 emoji 表情
   * @param emoji
   */
  onSelectEmoji: function (emoji) {
    this.editorContext.insertText({
      text: `[${emoji.code}]`,
    })
  },
  /**
   * 选择用户
   * @param member
   */
  onSelectMember: function (member) {
    member = {
      mname: 'xfduan',
    }
    this.editorContext.insertText({
      text: `@${member.mname} `,
    })
  },
  /**
   * 选择话题
   * @param hashtags
   */
  onSelectHashtags: function (hashtags) {
    let text = `#${hashtags.hname} `
    if (this.data.hashtagShowType === 1) {
      text = `#${hashtags.hname} `
    }
    if (this.data.hashtagShowType === 2) {
      text = `#${hashtags.hname}#`
    }
    this.editorContext.insertText({
      text: text,
    })
  },
  /**
   * 选择地址
   */
  onSelectLocation: function () {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({ manualSelectLocation: true })

        const { longitude, latitude } = res
        const location = JSON.stringify({
          latitude: latitude,
          longitude: longitude,
        })
        const { tencentMapKey, tencentMapReferer } = appConfig
        wx.navigateTo({
          url: `plugin://chooseLocation/index?key=${tencentMapKey}&referer=${tencentMapReferer}&location=${location}`,
        })
      },
    })
  },
  /**
   * 切换是否匿名
   * @param isSelected
   */
  onSwitchAnonymous: function (isSelected) {
    this.setData({
      draftAnonymous: isSelected ? 1 : 0,
    })
    this.updateDraft()
  },
  /**
   * 页面事件捕捉
   * @param e
   */
  onClickEditor: function (e) {
    const editorToolbar = this.selectComponent('#editor-toolbar')
    editorToolbar.setData({
      showType: null,
    })
  },
})
