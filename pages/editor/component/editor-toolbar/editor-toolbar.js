import { callPageFunction } from '../../../../util/callPageFunction'
import Api from '../../../../api/api'

Component({
  properties: {
    // 表情
    emojisList: Array,
  },
  data: {
    showType: null,

    onMemberTextChange: null,
    onHashtagsTextChange: null,
    tabs: [],
  },
  lifetimes: {
    attached: function () {
      this.setData({
        onMemberTextChange: async function (search) {
          return [
            {
              text: 'text1',
            },
            {
              text: 'text2 ',
            },
          ]
        },
        onHashtagsTextChange: async function (search) {
          return [
            {
              text: 'hashtags_text1',
            },
            {
              text: 'hashtags_text2 ',
            },
          ]
        },
      })

      const { emojisList } = this.data
      this.setData({
        tabs: emojisList.map(item => ({
          title: item.name,
          emojis: item.emoji,
        })),
      })
    },
  },
  methods: {
    onClickToolBar: function (e) {
      const { type } = e.target.dataset
      if (['audio', 'doc'].includes(type)) {
        return wx.showToast({
          title: '请到网站或App操作',
          icon: 'none',
        })
      }
      this.setData({ showType: type || null })
    },
    onSearchMembers: function (e) {
      const { text } = e.detail.item
      console.log(text)
    },
    onSearchHashtags: function (e) {
      const { text } = e.detail.item
      console.log(text)
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
    onSelectImage: function (e) {
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: async (res) => {
          const { tempFilePaths, tempFiles } = res
          const uploadRes = await Api.editor.editorUpload(tempFilePaths[0], {
            type: 1,
            tableType: 8,
            tableName: 'post_logs',
            tableField: 'files_json',
            mode: 1,
            file: tempFilePaths[0],
          })
          console.log(uploadRes)
        },
      })
    },
    onSelectVideo: function (e) {
      wx.chooseVideo({
        success: async (res) => {
          const { tempFilePaths, tempFiles } = res
          // todo
        },
      })
    },
    nothing: function () {},
  },
  observers: {
    'emojisList': function (newValue) {
      this.setData({
        tabs: newValue.map(item => ({
          title: item.name,
          name: item.name,
          image: item.image,
          count: item.count,
          emoji: item.emoji,
        })),
      })
    },
  },
})
