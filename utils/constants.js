import path from 'path'
/** 测试公众号 */
export const APP_ID = 'wx92f2087d83e61374' // 微信appid
export const APP_SECRET = '4ee889ac41b82d1552959c3e690eb12d' // 微信Secret
// 获取基类accesstoken接口
export const Wx_AccessToken_Api = 'https://api.weixin.qq.com/cgi-bin/token'

// 商户ID
export const MCH_ID = 'xxxxxxx'
// 商户支付秘钥( 微信商户平台-->账户设置-->API安全-->密钥设置)
export const PAY_KEY = 'xxxxxxxxxxxxxxxxx'

// 获取User 的openid 及个人信息所需的accessToken
export const Wx_User_AccessToken_Api =
  'https://api.weixin.qq.com/sns/oauth2/access_token'
// 微信全局消息通知 自定义Token
export const GLOBAL_COUSTOM_TOKEN = 'o2ANa5msjshLPDCTGJw4RyEPiGMI'
// Ticket存放路径
export const TICKET_PATH = path.join('./TICKET.json')
