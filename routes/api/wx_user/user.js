import express from 'express'
import {
  APP_ID,
  APP_SECRET,
  Wx_User_AccessToken_Api
} from '../../../utils/constants.js'
import { get } from '../../../utils/fetch.js'
import { resJson } from '../../../utils/response.js'
import { getGlobalAccessToken } from '../wx_global/tools.js'
import conn from '../../../config/dbs.js'
import chalk from 'chalk'
// const mongoose = require('mongoose')
const app = express()
/**
 * 获取user所必须的accessToken 有效期为2小时
 * @param {*} code 授权时获得的code
 * @param {*} scope snsapi_base 静默授权,snsapi_userinfo 用户授权
 * @returns
 */
async function getUserAccessToken(code, scope = 'snsapi_base') {
  return new Promise((resolve, reject) => {
    if (!code) reject({ errmsg: '获取 access token 时 code不能为空  ' })
    // if (!scope) console.warn('此次默认为 静默授权方式 获取access token')
    get(
      `${Wx_User_AccessToken_Api}?appid=${APP_ID}&secret=${APP_SECRET}&code=${code}&grant_type=authorization_code`
    ).then(async (res) => {
      if (res.errcode) {
        // 获取失败
        reject(res)
      } else {
        console.log('成功获取: ', res)
        const { access_token, openid, scope } = res
        if (scope === 'snsapi_userinfo') {
          // 自动判断静默授权 和用户授权
          // 获取完整的用户信息返回
          const userInfo = await getRemoteUserInfo(access_token, openid)
          // 获取用户信息是否错误
          if (userInfo.errcode) reject(userInfo)
          else resolve(userInfo)
        } else {
          resolve(res)
        }
      }
    })
  })
}

/**
 * 重新获取accessToken 有效时间更长 为30天
 * @param {*} refresh_token 获取accessToken时返回的
 * @returns
 */
async function refreshUserAccessToken(refresh_token) {
  return new Promise((resolve, reject) => {
    if (!refresh_token)
      reject({ errmsg: '重新获取 access token 时 refresh_token不能为空' })
    get(
      `https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=${APP_ID}&grant_type=refresh_token&refresh_token=${refresh_token}`
    ).then((res) => {
      console.log('成功刷新accessToken: ', res)
      resolve(res)
    })
  })
}

/**
 * 检查accessToken是否有效
 * @param {*} access_token
 * @param {*} openid
 * @returns
 */
async function checkUserAccessToken(access_token, openid) {
  return new Promise((resolve, reject) => {
    if (!access_token)
      reject({ errmsg: '检查 access token 时 access_token不能为空' })
    get(
      ` https://api.weixin.qq.com/sns/auth?access_token=${access_token}&openid=${openid}`
    ).then((res) => {
      console.log('检测accessToken: ', res) //{ "errcode":0,"errmsg":"ok"} 代表成功
      resolve(res)
    })
  })
}

/**
 * snsapi_userinfo 时获取用户相关信息
 * @param {*} accessToken 网页授权接口调用凭证,注意：此access_token与基础支持的access_token不同
 * @param {*} openid
 * @param {*} lang 返回国家地区语言版本，zh_CN 简体(默认)，zh_TW 繁体，en 英语
 * @returns
 */
async function getRemoteUserInfo(accessToken, openid, lang = 'zh_CN') {
  return new Promise((resolve, reject) => {
    if (!accessToken) reject({ errmsg: '获取用户信息时 accessToken不能为空' })
    if (!openid) reject({ errmsg: '获取用户信息时 openid不能为空' })
    get(
      `https://api.weixin.qq.com/sns/userinfo?access_token=${accessToken}&openid=${openid}&lang=${lang}`
    ).then((res) => {
      console.log('成功获取: ', res)
      resolve(res)
    })
  })
}

/**
 * 根据openid 获取用户相关信息包含(unionid)
 * @param {*} accessToken
 * @param {*} openid
 * @param {*} lang
 * @returns
 */
async function queryUserInfo(openid, lang = 'zh_CN') {
  return new Promise(async (resolve, reject) => {
    const access_token = await getGlobalAccessToken() // 全局的accesstoken
    if (!access_token)
      reject({ errmsg: '拉取用户信息时 accessToken获取失败！' })
    if (!openid) reject({ errmsg: '拉取用户信息时 openid不能为空' })
    get(
      `https://api.weixin.qq.com/cgi-bin/user/info?access_token=${access_token}&openid=${openid}&lang=${lang}`
    ).then((res) => {
      if (res.errcode && res.errcode !== 0) {
        reject(res)
      } else {
        console.log('成功获取: ')
        console.log(res)
        resolve(res)
      }
    })
  })
}

/**
 * 静默授权 获取openid
 * @param {*} req
 * @param {*} res
 */
async function getOpenid(req, res) {
  const { code } = req.query
  if (!code) {
    res.send({ errmsg: 'code 不能为空！' })
    res.end()
  }
  getUserAccessToken(code, 'snsapi_base').then(
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
  const { openid } = req.body
  if (!openid) {
    res.send({ errmsg: 'openid 不能为空！' })
    res.end()
  }
  const result = await queryUserInfo(openid).catch(({ errmsg }) => {
    res.send(resJson(999, null, errmsg || '获取unionId 错误！'))
    res.end()
  })

  if (result) {
    res.send(resJson(0, result, ''))
    res.end()
  }
}

/**
 * 用户授权 获取用户信息
 * @param {*} req
 * @param {*} res
 */
async function getUserInfo(req, res) {
  const { code } = req.query
  if (!code) {
    res.send({ errmsg: 'code 不能为空！' })
    res.end()
    return
  }

  getUserAccessToken(code, 'snsapi_userinfo').then(
    (reuslt) => {
      const { access_token, expires_in, refresh_token, ...rest } = reuslt
      res.send(resJson(0, rest, ''))
      res.end()
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

app.get('/getUserInfo', function (req, res) {
  getUserInfo(req, res)
})

export default app
