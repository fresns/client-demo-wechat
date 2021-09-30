Component({
  properties: {
    member: Object,
  },
  data: {},
  lifetimes: {
    attached () {
      console.log('profile-member,', this.data)
    },
  },
  methods: {},
  observers: {
    member: function (member) {
      console.log('observer member', member)
    }
  }
})
