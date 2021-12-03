<div align="center">
  <img src="https://github.com/luoqiang0831/wechat-node-sdk/blob/main/public/favicon.png" width="128" alt="logo" />
  <h1>wxchat-node-sdk</h1>
  <p>基于 Node+Express 对接微信相关 API 接口 实现微信支付、微信推送、签名及回调通知等接口.</p>
  <!-- <p>
    <a href="https://github.com/luoqiang0831/wechat-node-sdk/stargazers" target="_black">
      <img src="https://img.shields.io/github/stars/luoqiang0831/wechat-node-sdk?color=%23ffba15&logo=github&style=flat-square" alt="stars" />
    </a>
    <a href="https://github.com/luoqiang0831" target="_black">
      <img src="https://img.shields.io/badge/Author-%20luoqiang0831%20-7289da.svg?&logo=github&style=flat-square" alt="author" />
    </a>
  </p> -->
</div>
<br />

## 官方文档 & Demo 演示

> **文档**：[https://luoqiang0831.github.io/wechat-node-sdk/](查看文档)

> **演示**：[https://abc.junxun365.com/wx/](demo 地址)

<br />

### 环境要求

> 需要安装 node express

### 部署运行

> 需配置 utils/constants.js 微信 appid secret 等信息

```javascript
$ git clone https://github.com/luoqiang0831/wechat-node-sdk
$ npm install
### 运行
$ npm run dev
```

服务器启动默认端口为 3002 、启动之后就可以开启接口服务.

**目录结构**

```javascript
├─ bin  // 启动文件
├─ config   // 数据库配置文件
├─ middlewares  // 中间件
├─ public   // 静态资源
├─ routes   // 路由映射文件
│  ├─ api   // 接口相关
│  └─ web   // 页面相关
├─ utils    // 基类函数
├─ views    // 静态页面相关
├─ app.js   // 启动入口
├─ nginx.conf   // nginx配置
├─ routers.js   // 路由配置
└─ TICKET.json  // 全局的accesstoken等信息 持久化保存

```

## 🙏🙏🙏 点个 Star

**如果对您有帮助, 可以在 [Github](https://github.com/luoqiang0831/wechat-node-sdk) 上面帮我点个`star`, 支持一下作者,你的支持更是我不竭的动力**
