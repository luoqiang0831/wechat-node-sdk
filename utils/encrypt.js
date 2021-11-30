import crypto from 'crypto'
import { formatQueryAndXML } from './common.js'
/**
 * @sha1加密模块 (加密固定,不可逆)
 * @param str string 要加密的字符串
 * @retrun string 加密后的字符串
 * */
export const SHA1 = function (str) {
  var sha1 = crypto.createHash('sha1') //定义加密方式:md5不可逆,此处的md5可以换成任意hash加密的方法名称；
  sha1.update(str)
  var res = sha1.digest('hex') //加密后的值d
  return res
}

/**
 * 微信支付签名 根据传入的json对象和支付key,进行签名并返回结果
 * @param {*} dt
 * @param {*} key
 */
export function paySign(dt, key) {
  var str = formatQueryAndXML(dt, 'str') + '&key=' + key
  return crypto
    .createHash('md5')
    .update(str, 'utf8')
    .digest('hex')
    .toUpperCase()
}

export default crypto
