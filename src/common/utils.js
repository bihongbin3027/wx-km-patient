/**
 * Created by alan on 2017/6/22.
 */
/**
 * 解析url参数
 * @example ?id=12345&a=b
 * @return Object {id:12345,a:b}
 */

export function urlParse() {
  let url = window.location.search;
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g;
  let arr = url.match(reg);
  // ['?id=12345', '&a=b']
  if (arr) {
    arr.forEach((item) => {
      let tempArr = item.substring(1).split('=');
      /*编码decodeURIComponent*/
      let key = decodeURIComponent(tempArr[0]);
      let val = decodeURIComponent(tempArr[1]);
      obj[key] = val;
    });
  }
  return obj;
};

export function formatDate(date, fmt) {
  if (/([y|Y]+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
};

function padLeftZero(str) {
  return ('00' + str).substr(str.length);
}

export function formatUrl(url) {
  var obj = {},
    queryStr = url.substr(url.lastIndexOf('?') + 1, url.length),
    arr = queryStr.split('&');
    console.log(url)
    for (var i = 0, len = arr.length; i < len; i++) {
      var tmp = arr[i].split('=');
      obj[tmp[0]] = tmp[1];
    }
  return obj;
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
