Component({
  properties: {
    // 小组是否必选
    isRequired: Boolean,
  },
  data: {
    currentGroup: null,
    isShowChooseModal: false,
  },
  methods: {
    showChooseModal: function () {
      this.setData({
        isShowChooseModal: true,
      })
    },
    handleChooseGroup: function (e) {
      const { group } = e.target.dataset
      this.setData({
        currentGroup: group,
        isShowChooseModal: false,
      })
    },
  },
})
