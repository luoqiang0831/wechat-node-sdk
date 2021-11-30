import express from 'express'
import cookieParser from 'cookie-parser'
import interceptor from './middlewares/interceptor.js'
import arrRoutes from './routers.js'

const app = express()
const router = express.Router()
// 设置静态资源地址
app.use(express.json({ limit: '1mb' }))
app.use(
  express.urlencoded({
    extended: true
  })
)
app.use('/public', express.static('public'))
app.use('/docs', express.static('docs'))
app.use(cookieParser())

app.get('/favicon.png', (req, res) => res.end())
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  // res.header('X-Powered-By', ' 3.2.1')
  //这里可以对应的做一些权限控制、请求拦截处理
  interceptor(req, res, next)
})
for (const route of arrRoutes) {
  let module = await import(route.component)
  app.use(route.path, module.default)
}
app.use(router)

app.listen(3002, () => {
  console.log('Web server started at port 3002!')
})

export default app
