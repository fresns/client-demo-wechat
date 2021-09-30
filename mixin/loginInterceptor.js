import { globalInfo } from '../handler/globalInfo'
import { getCurPage } from '../util/getCurPage'
import interceptorRoutes from '../loginInterceptor'

module.exports = {
  onLoad: async function () {
    if (interceptorRoutes.includes(getCurPage().route)) {
      await globalInfo.awaitLogin()
    }
  },
}
