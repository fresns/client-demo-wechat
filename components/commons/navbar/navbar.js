Component({
  /** 组件的配置选项 **/
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },

  /** 组件的属性列表 **/
  properties: {
    title: {
      type: String,
      value: ''
    },
    theme: {
      type: String,
      value: 'light'
    },
    background: {
      type: String,
      value: ''
    },
    color: {
      type: String,
      value: ''
    },
    backButton: {
      type: Boolean,
      value: true
    },
    homeButton: {
      type: Boolean,
      value: false,
    },
    loading: {
      type: Boolean,
      value: false
    },
    animated: {
      // 显示隐藏的时候 opacity 动画效果
      type: Boolean,
      value: true
    },
    show: {
      // 显示隐藏导航，隐藏的时候 navigation-bar 的高度占位还在
      type: Boolean,
      value: true
    },
    // back 为 true 的时候，返回的页面深度
    delta: {
      type: Number,
      value: 1
    },
  },

  /** 组件的初始数据 **/
  data: {
    displayStyle: ''
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached() {
      const animated = this.data.animated;
      const show = this.data.show;
      let displayStyle = '';
      if (animated) {
        displayStyle = `opacity: ${show ? '1' : '0'};transition:opacity 0.5s;`;
      } else {
        displayStyle = `display: ${show ? '' : 'none'}`;
      }
      this.setData({
        displayStyle
      })
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
})
