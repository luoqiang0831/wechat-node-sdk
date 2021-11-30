import xmlreader from 'xmlreader'
import request from 'request'
import { APP_ID, MCH_ID, PAY_KEY } from '../../../utils/constants.js'
import { formatQueryAndXML, randomStr } from '../../../utils/common.js'
import { paySign } from '../../../utils/encrypt.js'
import { resJson } from '../../../utils/response.js'
import chalk from 'chalk'

const unified_url = 'https://api.mch.weixin.qq.com/pay/unifiedorder' //统一下单接口，固定值
const payParams = {
  appid: APP_ID, //应用程序编号
  mch_id: MCH_ID, //商户编号
  pay_key: PAY_KEY, //微信商户平台-->账户设置-->API安全-->密钥设置
  spbill_create_ip: '139.196.93.21', //你的nodejs后端程序运行的服务器的公网IP
  //由你的nodejs服务提供的公网(可外网访问)接口，微信服务在支付完成后, 回调该接口通知支付状态
  notify_url: 'https://abc.junxun365.com/wx/pay/notify', // 本数据仅为示例,实际根据需要填写
  trade_type: 'JSAPI' //统一下单服务类型,小程序对应"JSAPI", 如果是app应用,则为"APP"
  // :'https://api.mch.weixin.qq.com/v3/pay/transactions/h5'
}

/**
 * 微信支付函数
 * @param {*} reqParams
 * @returns
 */
export const payRequest = (reqParams) => {
  const { desc, openid, orderNo, amount, attach } = reqParams
  let dt = {
    // 注意, 这里的对象属性不能缺，名称也不能改，切记！
    ...payParams,
    attach, //支付说明，非固定值，自己根据实际情况写 附加数据
    body: desc, //商品说明等内容
    nonce_str: randomStr(), //随机字符串
    openid: openid, //当前付款微信账号的唯一标识
    out_trade_no: orderNo, //订单编号
    total_fee: amount * 100 //订单金额，不建议从前端传进来 支付宝支付不同，微信支付是以分为单位
  }
  dt = {
    ...dt,
    sign: paySign(dt, payParams.pay_key) //生成下单签名
  }

  const xmlData = formatQueryAndXML(dt, 'xml')
  return new Promise((reslove, reject) => {
    request(
      {
        url: unified_url,
        method: 'POST',
        body: xmlData
      },
      function (err, response, body) {
        if (!err && response.statusCode == 200) {
          xmlreader.read(body.toString('utf-8'), function (errors, response) {
            if (errors) {
              reject(resJson(999, null, errors))
            } else {
              const { xml } = response

              // 返回数据是否失败
              if (xml.return_code.text() === 'FAIL') {
                console.log(chalk.red('支付请求信息错误！'))
                console.log(xml.return_code.text(), xml.return_msg.text())
                console.log(dt)
                reject(xml.return_msg.text())
              } else {
                // transNo: dt.out_trade_no, // 只有订单号
                let rt = {
                  // 注意, 这里的对象属性不能缺，名称也不能改，切记！
                  appId: xml.appid.text(),
                  nonceStr: xml.nonce_str.text(),
                  package: 'prepay_id=' + xml.prepay_id.text(),
                  signType: 'MD5',
                  timeStamp: `${parseInt(new Date().getTime() / 1000, 10)}` //必须字符串，否则前端调不起支付页面
                }

                rt = {
                  ...rt,
                  transNo: dt.out_trade_no, // 自定义订单号
                  sign: paySign(rt, payParams.pay_key)
                }
                // 再次签名, 生成前端调起支付页面需要的参数对象
                reslove(rt)
              }
            }
          })
        } else {
          reject(resJson(999, null, err))
        }
      }
    )
  })
}

/**
 * 微信订单查询(默认是商户自定义订单号)
 * @param {*} req
 * @param {*} res
 */
export const queryOrder = (transNo) => {
  let params = {
    appid: APP_ID,
    mch_id: MCH_ID,
    out_trade_no: transNo,
    nonce_str: randomStr()
  }

  params = { ...params, sign: paySign(params, PAY_KEY) }
  const xmlData = formatQueryAndXML(params, 'xml')
  return new Promise((reslove, reject) => {
    request(
      {
        url: 'https://api.mch.weixin.qq.com/pay/orderquery',
        method: 'POST',
        body: xmlData
      },
      function (err, response, body) {
        if (!err && response.statusCode == 200) {
          xmlreader.read(body.toString('utf-8'), function (errors, response) {
            if (errors) {
              reject(resJson(999, null, errors))
            } else {
              const { xml } = response

              // 返回数据是否失败
              if (
                xml.return_code.text() === 'SUCCESS' &&
                xml.result_code.text() === 'SUCCESS'
              ) {
                const detail = {
                  transNo,
                  openid: xml.openid.text(),
                  // device_info: xml.device_info.text(),
                  is_subscribe: xml.is_subscribe.text(),
                  trade_state: xml.trade_state.text(),
                  bank_type: xml.bank_type.text(),
                  total_fee: xml.total_fee.text() / 100,
                  time_end: xml.time_end.text(),

                  trade_state_desc: xml.trade_state_desc.text()
                }
                reslove(detail)
              } else {
                console.log(chalk.red('查询订单信息错误！'))
                console.log(xml.return_code.text(), xml.return_msg.text())
                reject(xml.return_msg.text())
              }
            }
          })
        } else {
          reject(resJson(999, null, err))
        }
      }
    )
  })
}
