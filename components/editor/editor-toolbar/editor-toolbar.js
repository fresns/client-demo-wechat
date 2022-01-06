/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import { callPageFunction } from '../../../util/callPageFunction'
import Api from '../../../api/api'

Component({
  properties: {
    // 编辑器
    editorConfig: Object,
    tableId: String
  },
  data: {
    showType: null,
    emojisList: null,

    onMemberTextChange: null,
    onHashtagsTextChange: null,
    tabs: [],
  },
  tempMembers: null,
  tempHashtags: null,
  lifetimes: {
    attached: async function () {
      const that = this
      this.setData({
        // 成员搜索
        onMemberTextChange: async function (search) {
          if (!search) return

          const tipsRes = await Api.info.infoInputTips({
            queryType: 1,
            queryKey: search,
          })
          that.tempMembers = tipsRes.data
          return tipsRes.data.map(v => ({
            text: v.nickname + " @" + v.name,
            value: v.name,
            id: v.id
          }))
        },
        // 话题搜索
        onHashtagsTextChange: async function (search) {
          if (!search) return

          const tipsRes = await Api.info.infoInputTips({
            queryType: 3,
            queryKey: search,
          })
          that.tempHashtags = tipsRes.data
          return tipsRes.data.map(v => ({
            text: v.name,
            id: v.id
          }))
        },
      })

      const emojisRes = await Api.info.infoEmojis()
      const emojisList = emojisRes.data.list
      this.setData({
        emojisList: emojisList,
        tabs: emojisList.map(item => ({
          title: item.name,
          name: item.name,
          image: item.image,
          count: item.count,
          emoji: item.emoji,
        })),
      })
    },
  },
  methods: {
    onClickToolBar: function (e) {
      const { type } = e.currentTarget.dataset
      const { tableId } = this.data

      if (['audio', 'doc'].includes(type)) {
        return wx.showToast({
          title: '由于小程序限制，请到网站或 App 操作上传',
          icon: 'none',
        })
      }
      if ('image' === type) {
        return setTimeout(() => {
          this._onSelectImage(tableId)
        }, 100)
      }
      if ('video' === type) {
        return setTimeout(() => {
          this._onSelectVideo(tableId)
        }, 100)
      }
      if ('title' === type) {
        return callPageFunction('switchTitleInputShow')
      }
      this.setData({ showType: type || null })
    },
    onSearchMembers: function (e) {
      const { id } = e.detail.item
      callPageFunction('onSelectMember', this.tempMembers?.find(v => v.id === id))
      this.setData({ showType: null })
    },
    onSearchHashtags: function (e) {
      const { id } = e.detail.item
      callPageFunction('onSelectHashtags', this.tempHashtags?.find(v => v.id === id))
      this.setData({ showType: null })
    },
    /**
     * emoji 选择回调
     * @param e
     */
    onSelectEmoji: function (e) {
      const { emoji } = e.target.dataset
      this.setData({ showType: null })
      callPageFunction('onSelectEmoji', emoji)
    },
    /**
     * 选择图片
     */
    _onSelectImage: function (tableId) {
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: async (res) => {
          const { tempFilePaths, tempFiles } = res
          const uploadRes = await Api.editor.editorUpload(tempFilePaths[0], {
            type: 1,
            tableType: 8,
            tableId,
            tableName: 'post_logs',
            tableField: 'files_json',
            mode: 1,
            file: tempFilePaths[0],
          })
          const resultFile = uploadRes.data.files[0]
          callPageFunction('onAddedFile', resultFile)
          this.setData({ showType: null })
        },
      })
    },
    /**
     * 选择视频
     */
    _onSelectVideo: function (tableId) {
      wx.chooseVideo({
        success: async (res) => {
          const { duration, tempFilePath, thumbTempFilePath, width, height, size } = res
          const uploadRes = await Api.editor.editorUpload(tempFilePath, {
            type: 2,
            tableType: 8,
            tableName: 'post_logs',
            tableField: 'files_json',
            tableId: tableId,
            mode: 1,
            file: tempFilePath,
          })

          const resultFile = uploadRes.data.files[0]
          callPageFunction('onAddedFile', resultFile)
          this.setData({ showType: null })
        },
      })
    },
    /**
     * 点击扩展
     */
    onClickExpand: async function (e) {
      const { expand } = e.target.dataset
      callPageFunction('onSelectExpand', expand)
    },
    nothing: function () { },
  },
})
