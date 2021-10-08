/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import { globalInfo } from '../configs/fresnsGlobalInfo'

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
