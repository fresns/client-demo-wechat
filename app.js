/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */

import './libs/Mixins'
import { globalInfo } from './handler/globalInfo'

const themeListeners = []

App({
  globalData: {
    theme: 'light', // dark
  },
  async onLaunch (options) {
    await globalInfo.init()
  },
  themeChanged (theme) {
    this.globalData.theme = theme
    themeListeners.forEach((listener) => {
      listener(theme)
    })
  },
  watchThemeChange (listener) {
    if (themeListeners.indexOf(listener) < 0) {
      themeListeners.push(listener)
    }
  },
  unWatchThemeChange (listener) {
    const index = themeListeners.indexOf(listener)
    if (index > -1) {
      themeListeners.splice(index, 1)
    }
  },
})
