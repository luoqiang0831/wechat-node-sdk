import moment from 'moment'
import {
  APP_ID,
  APP_SECRET,
  TICKET_PATH,
  Wx_AccessToken_Api
} from '../../../utils/constants.js'
import { get, post } from '../../../utils/fetch.js'
import fs from 'fs'
import chalk from 'chalk'

/**
 * 获取全局accessToken
 * @returns
 */
export const getAccessToken = function () {
  return new Promise((reslove, reject) => {
    get(
      `${Wx_AccessToken_Api}?grant_type=client_credential&appid=${APP_ID}&secret=${APP_SECRET}`
    )
      .then((result) => {
        let token = result.access_token
        if (token && token !== '') {
          reslove(result)
        } else {
          reject(result)
        }
      })
      .catch((res) => {
        reject(res)
      })
  })
}

/**
 * 检查Ticket是否过期
 */
export const checkTicketInvalid = () => {
  const tickets = JSON.parse(fs.readFileSync(TICKET_PATH, 'utf-8') || '{}')

  if (tickets.dead_time && moment().isBefore(moment(tickets.dead_time)))
    return true
  return false
}

/**
 * 获取jsapi_ticket 每日限请求100000次，有效期都是7200秒（2小时）
 * @param {*} token
 * @returns
 */
export const getJsapiTicket = function (token) {
  return new Promise((reslove, reject) => {
    get(
      'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' +
        token +
        '&type=jsapi'
    ).then((result) => {
      if (result.errcode === 0) {
        reslove(result)
      } else {
        reject(result)
      }
    })
  })
}
/**
 * 更新全局的token和ticket
 * @returns
 */
export const pullGlobalTicketAndToken = async () => {
  const { access_token } = await getAccessToken()
  return new Promise(async (reslove, reject) => {
    if (access_token) {
      const { ticket, errcode, errmsg } = await getJsapiTicket(access_token)
      if (errcode === 0) {
        // 存储当前 ticket
        const ticketData = {
          jsapi_ticket: ticket,
          access_token: access_token,
          dead_time: Date.now() + 1000 * 60 * 60 * 1 //失效时间 默认加了一个小时
        }

        /* 这里是将在这个同级目录下创建一个json文件用来存储jsapi_ticket，和请求时间，用于下次接口被调用的过期校验。*/
        fs.writeFile(TICKET_PATH, JSON.stringify(ticketData), function (err) {
          console.log(
            chalk.green(
              `全局AccessToken,jsapiTicket写入成功,有效期截止到:${moment(
                ticketData.dead_time
              ).format('YYYY-MM-DD hh:mm:ss')}`
            )
          )
          if (err) console.error(err)
        })

        reslove(ticketData)
      } else {
        console.log(chalk.red('全局AccessToken,jsapiTicket 获取失败！'), {
          errmsg,
          errcode
        })
        reject({
          errcode
        })
      }
    }
  })
}

/**
 * 读取全局信息 包含ticket 和accesstoken等
 * @returns
 */
export const getGlobalInfo = () => {
  return new Promise(async (reslove, reject) => {
    if (checkTicketInvalid()) {
      const result = JSON.parse(fs.readFileSync(TICKET_PATH, 'utf-8') || '{}')
      reslove(result)
    } else {
      const result = await pullGlobalTicketAndToken()
      reslove(result)
    }
  })
}
/**
 * 获取全局Ticket
 * @returns
 */
export const getTicket = async () => {
  const { jsapi_ticket } = await getGlobalInfo()
  return jsapi_ticket
}

/**
 * 获取全局的accessToken
 * @returns
 */
export const getGlobalAccessToken = async () => {
  const { access_token } = await getGlobalInfo()
  return access_token
}
