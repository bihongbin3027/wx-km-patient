// 存入localStorage属性名
const localName = 'ydcf'

// 设置title
export function documentTitle(title) {
  document.title = title
}

// 获取url参数
export function urlParse(ht) {
  let url = ht ? ht : (window.location.search || window.location.hash)
  if (url) {
    url = url.substr(url.indexOf('?') + 1); //字符串截取，比我之前的split()方法效率高 
  }
  // 创建一个对象，用于存name，和value   
  let result = {}
  let queryString = url || window.location.search.substring(1)
  let re = /([^&=]+)=([^&]*)/g
  let m = null
  // exec()正则表达式的匹配
  // eslint-disable-next-line
  while (m = re.exec(queryString)) {
    // 使用 decodeURIComponent() 对编码后的 URI 进行解码 
    result[decodeURIComponent(m[1])] = decodeURIComponent(m[2])
  }
  return result
}

// 设置localStorage
export function saveToLocal(id, key, value) {
  let store = window.localStorage[localName]
  if (!store) {
    store = {}
    store[id] = {}
  } else {
    store = JSON.parse(store)
    if (!store[id]) {
      store[id] = {}
    }
  }
  store[id][key] = value
  window.localStorage[localName] = JSON.stringify(store)
}

// 读取localStorage
export function loadFromLocal(id, key, def) {
  let store = window.localStorage[localName]
  if (!store) {
    return def
  }
  store = JSON.parse(store)[id]
  if (!store) {
    return def
  }
  let ret = store[key]
  return ret || def
}

// 格式化时间
export function formatDate(time, formatStr) {
  let formatTime = ''
  // time参数ios有bug，只能传毫秒，不能传时间格式的字符串
  let now = time ? new Date(time) : new Date()
  let year = now.getFullYear()
  let month = now.getMonth() + 1
  let day = now.getDate()
  let week = now.getDay()
  let hour = now.getHours()
  let min = now.getMinutes()
  let sec = now.getSeconds()
  let weekArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  // 处理个位数
  month = month < 10 ? '0' + month : month
  day = day < 10 ? '0' + day : day
  min = min < 10 ? '0' + min : min
  sec = sec < 10 ? '0' + sec : sec
  // 如果只有一个参数的时候，用12小时表示
  if (arguments.length === 1) {
    if (hour > 12) {
      hour -= 12
    }
    hour = hour < 10 ? '0' + hour : hour
  } else if (arguments.length === 2 && arguments[1] === 24) {
    hour = hour < 10 ? '0' + hour : hour
  }
  // 根据参数返回值
  switch (formatStr) {
    case '年-月-日':
    formatTime = `${year}年${month}月${day}日`
    break
    case 'MM-DD':
      formatTime = `${month}-${day}`
      break
    case 'YYYY-MM-DD':
      formatTime = `${year}-${month}-${day}`
      break
    case 'YYYY/MM/DD hh:mm:ss':
      formatTime = `${year}-${month}-${day} ${hour}:${min}:${sec}`
      break
    case 'WW':
      formatTime = weekArr[week]
      break
    default:
  }
  return formatTime
}

/**
 ** 加法函数，用来得到精确的加法结果
 ** 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
 ** 调用：accAdd(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
export function accAdd(arg1, arg2) {
  var r1, r2, m, c
  try {
    r1 = arg1.toString().split(".")[1].length
  }
  catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split(".")[1].length
  }
  catch (e) {
    r2 = 0
  }
  c = Math.abs(r1 - r2)
  m = Math.pow(10, Math.max(r1, r2))
  if (c > 0) {
    var cm = Math.pow(10, c)
    if (r1 > r2) {
      arg1 = Number(arg1.toString().replace(".", ""))
      arg2 = Number(arg2.toString().replace(".", "")) * cm
    } else {
      arg1 = Number(arg1.toString().replace(".", "")) * cm
      arg2 = Number(arg2.toString().replace(".", ""))
    }
  } else {
    arg1 = Number(arg1.toString().replace(".", ""))
    arg2 = Number(arg2.toString().replace(".", ""))
  }
  return (arg1 + arg2) / m
}

/**
 ** 减法函数，用来得到精确的减法结果
 ** 说明：javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。
 ** 调用：accSub(arg1,arg2)
 ** 返回值：arg1减去arg2的精确结果
 **/
export function accSub(arg1, arg2) {
  var r1, r2, m, n
  try {
    r1 = arg1.toString().split(".")[1].length
  }
  catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split(".")[1].length
  }
  catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2)) //last modify by deeka //动态控制精度长度
  n = (r1 >= r2) ? r1 : r2
  return ((arg1 * m - arg2 * m) / m).toFixed(n)
}

/**
 ** 乘法函数，用来得到精确的乘法结果
 ** 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
 ** 调用：accMul(arg1,arg2)
 ** 返回值：arg1乘以 arg2的精确结果
 **/
export function accMul(arg1, arg2) {
  var m = 0, s1 = arg1.toString(), s2 = arg2.toString()
  try {
    m += s1.split(".")[1].length
  }
  catch (e) {
  }
  try {
    m += s2.split(".")[1].length
  }
  catch (e) {
  }
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}

/**
 ** 除法函数，用来得到精确的除法结果
 ** 说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
 ** 调用：accDiv(arg1,arg2)
 ** 返回值：arg1除以arg2的精确结果
 **/
export function accDiv(arg1, arg2) {
  var t1 = 0, t2 = 0, r1, r2
  try {
    t1 = arg1.toString().split(".")[1].length
  }
  catch (e) {
  }
  try {
    t2 = arg2.toString().split(".")[1].length
  }
  catch (e) {
  }
  r1 = Number(arg1.toString().replace(".", ""))
  r2 = Number(arg2.toString().replace(".", ""))
  return (r1 / r2) * Math.pow(10, t2 - t1)
}
