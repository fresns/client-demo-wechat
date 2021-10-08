/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import { globalInfo } from '../configs/fresnsGlobalInfo'
import { getCurPage } from '../util/getCurPage'
import interceptorRoutes from '../configs/fresnsLoginInterceptor'

module.exports = {
  onLoad: async function () {
    if (interceptorRoutes.includes(getCurPage().route)) {
      await globalInfo.awaitLogin()
    }
  },
}
