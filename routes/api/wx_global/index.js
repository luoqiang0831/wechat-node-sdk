import express from 'express'
import { SHA1 } from '../../../utils/encrypt.js'
import { GLOBAL_COUSTOM_TOKEN } from '../../../utils/constants.js'
import chalk from 'chalk'

const app = express()

/**
 * 微信推送消息接收
 */
export const global_notify = (req, res) => {
  //signature微信加密签名 timestamp时间戳 nonce随机数
  const { signature, timestamp, nonce, echostr } = req.query || {}
  console.log(chalk.green('微信消息推送信息:'))
  console.log(req.query)
  let keys = [GLOBAL_COUSTOM_TOKEN, timestamp, nonce].sort()

  const encryptParams = keys.join('') //拼接字符串

  /**
   * 利用jssha进行sha1加密
   * 必须使用此方式才可以进行加密否则报错不生效
   */
  const cryptoStr = SHA1(encryptParams)

  if (signature === cryptoStr) {
    res.send(echostr)
  } else {
    res.end('error')
  }
  res.end()
}

app.get('/notify', function (req, res) {
  global_notify(req, res)
})

export default app
