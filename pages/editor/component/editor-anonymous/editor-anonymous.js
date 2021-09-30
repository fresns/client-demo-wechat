import { callPageFunction } from '../../../../util/callPageFunction'

Component({
  properties: {
    isAnonymous: Number,
  },
  data: {
    isEnableAnonymous: false,
  },
  methods: {
    bindSwitchAnonymous: function (e) {
      const { value } = e.detail
      const isAnonymous = value.length > 0
      this.setData({
        isEnableAnonymous: isAnonymous,
      })
      callPageFunction('onSwitchAnonymous', isAnonymous)
    },
  },
  observers: {
    'isAnonymous': function (params) {
      this.setData({
        isEnableAnonymous: !!params,
      })
    },
  },
})
