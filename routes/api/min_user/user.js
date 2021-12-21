import express from 'express'
import {
  MIN_APP_ID,
  MIN_APP_SECRET,
  Wx_User_AccessToken_Api
} from '../../../utils/constants.js'
import { get } from '../../../utils/fetch.js'
import { resJson } from '../../../utils/response.js'
import { getGlobalAccessToken } from '../wx_global/tools.js'
// const mongoose = require('mongoose')
const app = express()
/**
 * 获取openid 和unionid
 * @param {*} code 授权时获得的code
 * @returns
 */
async function getUserSession(code) {
  return new Promise((resolve, reject) => {
    if (!code) reject(resJson(999, null, 'code不能为空!'))
    get(
      `https://api.weixin.qq.com/sns/jscode2session?appid=${MIN_APP_ID}&secret=${MIN_APP_SECRET}&js_code=${code}&grant_type=authorization_code`
    ).then(async (res) => {
      if (res.errcode !== 0) {
        console.log('小程序获取openid失败: ', res)
        // 获取失败
        reject(resJson(errcode, null, errmsg))
      } else {
        console.log('小程序获取openid成功: ', res)
        resolve(res)
      }
    })
  })
}
/**
 * 获取openid
 * @param {*} req
 * @param {*} res
 */
async function getOpenid(req, res) {
  const { code } = req.query
  if (!code) {
    res.send({ errmsg: 'code 不能为空！' })
    res.end()
  }
  getUserSession(code).then(
    ({ openid }) => {
      // TODO
      res.send(resJson(0, { openid }, ''))
      res.end()
      // 关闭数据库
      // closeConn()
      // })
    },
    (error) => {
      res.send(error)
      res.end()
    }
  )
}

/**
 * 获取UnionId
 * @param {*} req
 * @param {*} res
 */
async function getUnionId(req, res) {
  const { code } = req.query
  if (!code) {
    res.send({ errmsg: 'code 不能为空！' })
    res.end()
  }
  getUserSession(code).then(
    ({ unionid }) => {
      // TODO
      res.send(resJson(0, { unionid }, ''))
      res.end()
      // 关闭数据库
      // closeConn()
      // })
    },
    (error) => {
      res.send(error)
      res.end()
    }
  )
}

app.get('/getOpenId', function (req, res) {
  getOpenid(req, res)
})

app.post('/getUnionId', function (req, res) {
  getUnionId(req, res)
})

export default app
