![logo](https://github.com/luoqiang0831/wechat-node-sdk/blob/main/public/favicon.png)

# wxchat-node-sdk

**微信 node-sdk**

> 基于 Node+Express 对接微信相关 API 接口 实现微信支付、微信推送、签名及回调通知等接口.

**源代码目录结构**
**[地址](https://github.com/luoqiang0831/wechat-node-sdk)**

<a href="https://luoqiang0831.github.io/wechat-node-sdk/">查看文档</a> <a href="https://abc.junxun365.com/">demo 演示</a>

<!-- ![project.png](https://i.loli.net/2017/12/07/5a28ea5c3468d.png) -->

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

> 如果对您有帮助，请 Star 支持一下,你的赞赏更是我不竭的动力

<!-- ![赞赏一下呗](https://www.junxun365.com/upload/images/zfb_pay.jpg) -->
