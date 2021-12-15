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
import { payRequest, queryOrder } from './payTools.js'
import chalk from 'chalk'
const app = express()
/**
 * 微信支付回调
 * @param {*} req
 * @param {*} res
 */
function wxPayNotify(req, res) {
  req.setEncoding('utf8')
  req.on('data', function (resultXML, call) {
    // 处理回调数据
    xmlreader.read(resultXML, (err, result) => {
      const { xml } = result
      if (err || xml.return_code.text() != 'SUCCESS') {
        console.log(chalk.red(err || xml.return_msg.text()))
        // res.send(resJson(999, null, err || xml.return_msg.text()))
      } else {
        // 提取回调数据
        const dt = {
          nonce_str: xml.nonce_str.text(),
          openid: xml.openid.text(),
          total_fee: xml.total_fee.text(),
          transaction_id: xml.transaction_id.text(),
          out_trade_no: xml.out_trade_no.text(),
          time_end: xml.time_end.text()
        }
        // do something here ...
        console.log(chalk.green(`支付成功通知！openid:${dt.openid}`))
        console.log(dt)
      }
    })
  })
  req.on('end', function (db) {
    db
  })
}
/**
 * 创建支付单号
 * @param {*} req
 * @param {*} res
 * @returns
 */
async function createPay(req, res) {
  const { openid, desc, orderNo, amount } = req.body || {}
  let errorMsg
  if (!openid) {
    errorMsg = resJson(999, null, 'openid不能为空！')
  } else if (!orderNo) {
    errorMsg = resJson(999, null, 'orderNo不能为空！')
  } else if (!amount) {
    errorMsg = resJson(999, null, 'amount不能为空！')
  }

  if (errorMsg) {
    res.send(errorMsg)
    res.end()
    return
  }

  const payResult = await payRequest({
    openid,
    desc,
    orderNo,
    amount,
    pay_key: Date.now(),
    attach: '测试订单' // 附加信息
  }).catch((msg) => {
    res.send(resJson(0, null, msg || '支付返回异常！'))
  })

  if (payResult) {
    res.send(resJson(0, payResult, '支付签名成功！'))
  }

  res.end()
}

async function queryOrderFn(req, res) {
  const { transNo } = req.body || {}

  if (!transNo) {
    res.send(resJson(998, null, 'transNo为必传参数！'))
    res.end()
    return
  }

  const result = await queryOrder(transNo).catch((msg) => {
    res.send(resJson(0, null, msg || '查询订单异常！'))
  })

  if (result) {
    res.send(resJson(0, result, '查询成功！'))
  }
  res.end()
}
// 微信支付后通知(微信主动发起)
app.post('/notify', function (req, res) {
  wxPayNotify(req, res)
})

// 微信订单查询
app.post('/queryOrder', function (req, res) {
  queryOrderFn(req, res)
})

app.post('/create', function (req, res) {
  createPay(req, res)
})

export default app
