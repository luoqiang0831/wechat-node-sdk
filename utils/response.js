import chalk from 'chalk'

/**
 * 封装返回数据
 * @param {错误code} errcode
 * @param {返回数据} data
 * @param {错误信息} errmsg
 * @returns
 */
export const resJson = (errcode, data, errmsg) => {
  // 默认标准 0是成功 其他是失败
  // 999 是未知错误
  const responseResult = {
    errcode,
    data,
    errmsg
  }
  if (errcode !== 0) {
    console.log(chalk.red(responseResult))
  }
  return responseResult
}
