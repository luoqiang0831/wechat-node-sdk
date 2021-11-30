import express from 'express'
import ejs from 'ejs'
const app = express()
const ejscode = ejs.__express

// 这里也可以配置识别HTML
app.engine('ejs', ejscode) // 配置识别ejs模板
app.set('view engine', 'ejs') // 设置模板扩展名后缀自动添加
app.set('views', './views/web') // 设置模板路径

app.get('/', function (req, res) {
  // res.header("Content-Type:text/html; charset=utf-8");
  res.render('index', {
    title: '微信Api Demo'
  })
})

export default app
