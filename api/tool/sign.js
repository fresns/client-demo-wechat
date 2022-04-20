/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import appConfig from '../../configs/fresnsConfig'
import { globalInfo } from '../../configs/fresnsGlobalInfo'

const md5 = require('../../libs/md5/md5')
const { base64_encode } = require('../../libs/base64/base64')

/**
 * 签名生成
 * @param header
 * @param appSecret
 * @return {Promise<string>}
 */
export async function sign (header, appSecret) {
  const strA = [
    'platform',
    'version',
    'appId',
    'timestamp',
    'aid',
    'uid',
    'token',
  ].filter(v => header[v]).sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0))
  const stringSignTemp = strA.map(key => `${key}=${header[key]}`).join('&') + `&key=${appSecret}`
  return md5(stringSignTemp)
}

/**
 * 插件签名生成
 * @param header
 * @param appSecret
 * @return {Promise<string>}
 */
export async function pluginSign (header, appSecret) {
  const strA = [
    'platform',
    'version',
    'appId',
    'timestamp',
    'aid',
    'uid',
    'token',
  ].sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0))
  const stringSignTemp = strA.map(key => `${key}=${header[key]}`).join('&') + `&key=${appSecret}`
  const signValue = md5(stringSignTemp)
  const encryptStrTemp = strA + `&sign=${signValue}`
  return encodeURIComponent(base64_encode(encryptStrTemp))
}

export async function getSign () {
  const header = Object.assign({
      platform: appConfig.platform,
      version: '1.0.0',
      appId: appConfig.appId,
      timestamp: parseInt(new Date().valueOf() / 1000 + ''),
    },
    globalInfo.aid && { aid: globalInfo.aid },
    globalInfo.uid && { uid: globalInfo.uid },
    globalInfo.token && { token: globalInfo.token },
  )
  return await sign(header, appConfig.appSecret)
}

export async function getPluginSign () {
  const header = Object.assign({
      platform: appConfig.platform,
      version: '1.0.0',
      appId: appConfig.appId,
      timestamp: parseInt(new Date().valueOf() / 1000 + ''),
    },
    globalInfo.aid && { aid: globalInfo.aid },
    globalInfo.uid && { uid: globalInfo.uid },
    globalInfo.token && { token: globalInfo.token },
  )
  return await pluginSign(header, appConfig.appSecret)
}
