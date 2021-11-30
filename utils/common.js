/**
 * 去掉所有的html标签和&nbsp;之类的特殊符合
 * @param {*} str
 */
export function deleteHtmlTag(str) {
  str = str.replace(/<[^>]+>|&[^>]+;/g, '').trim() //
  return str
}
/**
 * 获取首个段落
 * @param {*} content 内容
 * @param {*} maxLength 最大截取
 */
export function getFirstparagraph(content = '', maxLength = 500) {
  const sybmolIndex = [',', '。', '.'] // 截断字符
  const substr = content.substr(0, maxLength)
  let _index = 0 // 默认段落截取位置

  sybmolIndex.forEach((gap) => {
    if ((_index = substr.indexOf(gap)) !== -1 && _index > 150) return false
  })

  return _index <= 0 ? substr : substr.substr(0, _index)
}

export function msg(...arg) {
  return console.log.apply(this, arg)
}

/**
 * 根据传入的json对象和格式要求，返回格式化后的结果
 * @param {*} obj
 * @param {*} format
 */
export function formatQueryAndXML(obj, format) {
  var str = '',
    keys = Object.keys(obj).sort()
  keys.forEach(function (k) {
    str +=
      format == 'str'
        ? '&' + k + '=' + obj[k]
        : format == 'xml'
        ? '<' + k + '>' + obj[k] + '</' + k + '>'
        : ''
  })
  return format == 'str'
    ? str.substr(1)
    : format == 'xml'
    ? '<xml>' + str + '</xml>'
    : ''
}

/**
 * 生成随机字符串
 * @param {*} len
 * @returns
 */
export const randomStr = (len = 15) => {
  return Math.random().toString(36).substr(2, len)
}
