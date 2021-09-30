import { globalInfo } from '../../handler/globalInfo'
import { navigateToSignin } from '../../util/navigateToSignin'
import appConfig from '../../appConfig'
import sign from './sign'

export function request (options) {
  return new Promise(async (resolve, reject) => {
    const { url, data = {} } = options

    Object.getOwnPropertyNames(data).forEach(dataKey => {
      if (!data[dataKey]) {
        delete data[dataKey]
      }
    })

    const header = Object.assign({
        platform: appConfig.platform,
        version: '1.0.0',
        versionInt: 1,
        appId: appConfig.appId,
        timestamp: parseInt(new Date().valueOf() / 1000 + ''),
      },
      globalInfo.langTag && { langTag: globalInfo.langTag },
      globalInfo.timezone && { timezone: globalInfo.timezone },
      globalInfo.uid && { uid: globalInfo.uid },
      globalInfo.mid && { mid: globalInfo.mid },
      globalInfo.token && { token: globalInfo.token },
      globalInfo.deviceInfo && { deviceInfo: JSON.stringify(globalInfo.deviceInfo) },
    )

    wx.request({
      method: 'POST',
      header: Object.assign(header, {
        sign: await sign(header, appConfig.appSecret),
      }),
      url: appConfig.apiHost + url,
      data: data,
      success: res => {
        const { code, message } = res.data

        if (code !== 0) {
          wx.showToast({
            title: message,
            icon: 'none',
          })
        }

        if ([30111, 30112].includes(code)) {
          navigateToSignin()
          resolve(res.data)
          return
        }

        resolve(res.data)
      },
      fail: (res) => {
        reject(res)
      },
    })
  })
}

export function uploadFile (filePath, options) {
  return new Promise(async (resolve, reject) => {
    const { url, data = {} } = options

    Object.getOwnPropertyNames(data).forEach(dataKey => {
      if (!data[dataKey]) {
        delete data[dataKey]
      }
    })

    const header = Object.assign({
        platform: appConfig.platform,
        version: '1.0.0',
        versionInt: 1,
        appId: appConfig.appId,
        timestamp: parseInt(new Date().valueOf() / 1000 + ''),
      },
      globalInfo.langTag && { langTag: globalInfo.langTag },
      globalInfo.timezone && { timezone: globalInfo.timezone },
      globalInfo.uid && { uid: globalInfo.uid },
      globalInfo.mid && { mid: globalInfo.mid },
      globalInfo.token && { token: globalInfo.token },
      globalInfo.deviceInfo && { deviceInfo: JSON.stringify(globalInfo.deviceInfo) },
    )

    wx.uploadFile({
      header: Object.assign(header, {
        sign: await sign(header, appConfig.appSecret),
      }),
      url: appConfig.apiHost + url,
      filePath: filePath,
      name: 'file',
      formData: data,
      success: res => {
        if (res.data.code !== 0) {
          // TODO 临时增加此处异常 code 的 toast 提示
          wx.showToast({
            title: res.data.message,
            icon: 'none',
          })
        }
        resolve(res.data)
      },
      fail: (res) => {
        reject(res)
      },
    })
  })
}
