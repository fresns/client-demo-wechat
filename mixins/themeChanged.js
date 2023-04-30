/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { globalInfo } from '../utils/fresnsGlobalInfo';

module.exports = {
  data: {
    theme: '',
  },

  themeChanged (theme) {
    this.setData({
      theme,
    })
  },

  onLoad () {
    const app = getApp()
    this.themeChanged(globalInfo.theme)
    app.watchThemeChange(this.themeChanged)
  },
  
  onUnload () {
    getApp().unWatchThemeChange(this.themeChanged)
  },
}
