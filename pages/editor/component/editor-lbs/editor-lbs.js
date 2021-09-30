import { callPageFunction } from '../../../../util/callPageFunction'

Component({
  properties: {
    location: Object,
  },
  data: {
    address: null,
  },
  methods: {
    handleClickAddLocation: async function () {
      callPageFunction('onSelectLocation')
    },
  },
  observers: {
    'location': function (params) {
      this.setData({
        address: params?.address,
      })
    },
  },
})
