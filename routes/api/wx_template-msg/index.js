import express from 'express'
import xmlreader from 'xmlreader'
import { resJson } from '../../../utils/response.js'
import {
  APP_ID,
  APP_SECRET,
  Wx_User_AccessToken_Api
} from '../../../utils/constants.js'
import { get, post } from '../../../utils/fetch.js'
import conn from '../../../config/dbs.js'
import { getGlobalAccessToken } from '../wx_global/tools.js'
import chalk from 'chalk'
const app = express()

/**
 * 微信模板消息发送
 * @param {*} req
 * @param {*} res
 */
async function sendMsg(req, res) {
  const { openid, msg = {} } = req.body || {}
  if (!openid) {
    res.send(resJson(999, null, 'openid参数为必传字段！'))
    res.end()
    return
  }
  const accessToken = await getGlobalAccessToken()
  post(
    `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${accessToken}`,
    {
      touser: openid, // 用户ID
      template_id: 'RdOjUqZRkbAMC7Z9bEvtLap9jyxehLRcbgq2ygWmuXw', // 模板ID
      url: 'https://www.junxun365.com/', // 点击跳转URL地址
      // topcolor: '#e82665',
      data: {
        keyword1: {
          value: '驾照科目一考试成绩',
          color: '#22b108' // 文字颜色
        },
        keyword2: {
          value: msg.name || '',
          color: '#22b108' // 文字颜色
        },
        keyword3: {
          value: msg.num || 0,
          color: '#22b108' // 文字颜色
        },
        remark: {
          value: '请于xx-xx 来我校补考。',
          color: '#FA5151' // 文字颜色
        }
      }
    }
  ).then(({ errcode, errmsg, msgid }) => {
    if (errcode === 0) {
      res.send(resJson(0, msgid, '发送成功！'))
    } else {
      console.log(chalk.red('模板消息发送失败！'))
      console.log(errcode, errmsg)
      res.send(resJson(errcode, null, errmsg))
    }
    res.end()
  })
}

// 微信模板消息发送
app.post('/sendMsg', function (req, res) {
  sendMsg(req, res)
})

export default app
