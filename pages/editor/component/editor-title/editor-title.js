import { callPageFunction } from '../../../../util/callPageFunction'

Component({
  properties: {
    // 默认标题
    defaultTitle: String,
    // 标题是否强显示
    isHighlight: Boolean,
    // 标题是否必填
    isRequired: Boolean,
    // 标题长度限制
    limitLength: Number,
    // 标题变更回调
    onTitleChangeCb: String,
  },
  data: {
    title: '',
  },
  lifetimes: {
    attached: function () {
      console.log('cccc', this.data)
      this.setData({
        title: this.data.defaultTitle,
      })
    },
  },
  methods: {
    bindInput: function (e) {
      const { value } = e.detail
      this.setData({
        title: value,
      })
      callPageFunction(this.data.onTitleChangeCb, value)
      return value
    },
  },
  observers: {
    'defaultTitle': function (nDefaultTitle) {
      this.setData({
        title: nDefaultTitle,
      })
    },
  },
})
