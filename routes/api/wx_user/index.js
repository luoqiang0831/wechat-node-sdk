import express from 'express'
import {
  APP_ID,
  APP_SECRET,
  Wx_AccessToken_Api
} from '../../../utils/constants.js'
import { get } from '../../../utils/fetch.js'
const app = express()

async function getUserAccessToken(req, res) {
  get(
    `${Wx_AccessToken_Api}?appid=${APP_ID}&secret=${APP_SECRET}&grant_type=client_credential`
  ).then((res) => {
    console.log(res)
    res.end('')
  })
}

app.get('/', function (req, res) {
  getUserAccessToken(req, res)
})

export default app
