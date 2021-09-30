import { callPageFunction } from '../../../../util/callPageFunction'

Component({
  properties: {
    // 草稿列表
    drafts: Array,
    // 草稿选择回调方法名
    onSelectDraftCb: String,
  },
  data: {},
  lifetimes: {
    attached: async function () {
      console.log('hello', this.data)
    },
  },
  methods: {
    handleClickDraft: function (e) {
      const { draft } = e.target.dataset
      callPageFunction(this.data.onSelectDraftCb, draft)
    },
  },
})
