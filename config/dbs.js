import MYSQL from 'mysql' // 调用MySQL模块
// 创建一个connection
const connection = MYSQL.createConnection({
  host: '127.0.0.1', // 主机
  user: 'root', // MySQL认证用户名
  password: '',
  port: '3306',
  database: 'dbs',
  charset: 'UTF8_GENERAL_CI'
})

export default connection
