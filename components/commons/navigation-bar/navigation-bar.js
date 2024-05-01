Component({
  /** 组件的配置选项 **/
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
  },

  /** 组件的属性列表 **/
  properties: {
    background: {
      type: String,
      value: '',
    },
    color: {
      type: String,
      value: '',
    },
    title: {
      type: String,
      value: '',
    },
    backButton: {
      type: Boolean,
      value: true,
    },
    homeButton: {
      type: Boolean,
      value: false,
    },
    customRoute: {
      type: Boolean,
      value: false,
    },
    loading: {
      type: Boolean,
      value: false,
    },
    // back 为 true 的时候，返回的页面深度
    delta: {
      type: Number,
      value: 1,
    },
  },

  /** 组件的初始数据 **/
  data: {},

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached() {
    },
  },

  /** 组件功能 **/
  methods: {
    goBack() {
      const delta = this.data.delta;
      wx.navigateBack({
        delta: delta,
        fail() {
          wx.reLaunch({
            url: '/pages/posts/index',
          });
        },
      });
    },

    goHome() {
      wx.reLaunch({
        url: '/pages/posts/index',
      });
    },
  },
});
