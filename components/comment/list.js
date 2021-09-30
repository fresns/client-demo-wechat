/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */

import { callPageFunction } from '../../util/callPageFunction'

Component({
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    fsui: String,
    comment: Object,
  },
  attached: async function () {
    console.log('this comment data:', this.data)
  },
  /**
   * 组件的初始数据
   */
  data: {},
  /**
   * 组件的方法列表
   */
  methods: {
    onClickLike: async function (e) {
      callPageFunction('onClickLike', e)
    },
  },
})
