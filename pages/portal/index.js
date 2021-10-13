/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import { getConfigItemValue } from '../../api/tool/replace-key'

Page({
  mixins: [
    require('../../mixin/themeChanged'),
  ],
  data: {
    //content: null,
    content: '<div class="weui-article" style="padding-top: 50px; padding-bottom: 300px;"><div class="weui-article__p" style="margin:20px 10px;">门户是主程序规划的 SDK 级别的功能，通过插件生成门户的内容，然后小程序读取并解析输出。</div><div class="weui-article__p" style="margin:20px 10px;">可在小程序后台配置“门户”名称，比如命名为首页、发现、导读等等。</div><div class="weui-article__p" style="margin:20px 10px;">门户功能类似于电商「店铺装修」功能，所以运用场景取决于安装的插件。</div></div>'
  },
  // 预留，待实现
  // onLoad: async function (options) {
  //   const value = await getConfigItemValue('portal_8')
  //   this.setData({
  //     // FIXME
  //     content: value.replaceAll('view', 'div'),
  //   })
  // },
  /** 右上角菜单-分享给好友 **/
  onShareAppMessage: function () {
    return {
      title: 'Fresns',
    }
  },
  /** 右上角菜单-分享到朋友圈 **/
  onShareTimeline: function () {
    return {
      title: 'Fresns',
    }
  },
})
