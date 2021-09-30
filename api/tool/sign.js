const md5 = require('../../libs/md5/md5')
const { base64_encode } = require('../../libs/base64/base64')

/**
 * 签名生成
 * @param header
 * @param appSecret
 * @return {Promise<string>}
 */
async function sign (header, appSecret) {
  const strA = [
    'platform',
    'version',
    'versionInt',
    'appId',
    'timestamp',
    'uid',
    'mid',
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
async function pluginSign (header, appSecret) {
  const strA = [
    'platform',
    'version',
    'versionInt',
    'appId',
    'timestamp',
    'uid',
    'mid',
    'token',
  ].sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0))
  const stringSignTemp = strA.map(key => `${key}=${header[key]}`).join('&') + `&key=${appSecret}`
  const signValue = md5(stringSignTemp)
  const encryptStrTemp = strA + `&sign=${signValue}`
  return encodeURIComponent(base64_encode(encryptStrTemp))
}

module.exports = sign