import { getCurPage } from '../../util/getCurPage'

Component({
  properties: {
    member: Object,
  },
  data: {
    curRoute: '',
  },
  lifetimes: {
    attached () {
      this.setData({
        curRoute: getCurPage().route,
      })
    },
  },
  methods: {},
})
