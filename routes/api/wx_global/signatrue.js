import express from "express";
import moment from "moment";
import { SHA1 } from "../../../utils/encrypt.js";
import { APP_ID } from "../../../utils/constants.js";
import { resJson } from "../../../utils/response.js";
import { getTicket } from "./tools.js";

const app = express();

// 获取微信注册相关信息
const combineTicket = function (curUrl) {
  return new Promise(async (resolve, reject) => {
    let nonceStr = Math.random().toString(36).substr(2); // 随机字符串
    let timestamp = moment().unix(); // 获取时间戳，数值类型
    console.log("获得到url：" + decodeURIComponent(curUrl));
    try {
      const jsapi_ticket = await getTicket();
      let signature = SHA1(
        `jsapi_ticket=${jsapi_ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${decodeURIComponent(
          curUrl
        )}`
      );
      resolve({
        appid: APP_ID,
        nonceStr,
        timestamp,
        signature,
      });
    } catch (err) {
      reject(err);
    }
  });
};

// 获取Signture
const getSignatrue = async (req, res) => {
  const { url } = req.body || {};
  if (!url || url === "") {
    res.send(resJson(999, null, "缺少url参数！"));
    res.end();
    return;
  }
  let data = {};
  try {
    data = await combineTicket(url);
  } catch (e) {
    console.log(e);
    data = resJson(999, null, "获取Signatrue 异常");
  }

  res.send(data);
  res.end();
};

app.post("/signatrue", function (req, res) {
  getSignatrue(req, res);
});

export default app;
