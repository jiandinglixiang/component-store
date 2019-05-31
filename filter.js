import Vue from 'vue'
import { formatTimeStamp, timeFmt, weekFormatting } from './util'

Vue.filter('dateFormat', function (value, fmt) {
  return timeFmt(formatTimeStamp(value), fmt)
})

Vue.filter('dateFormatDay', function (value, fmt, type) {
  const date = new Date()
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  const time = formatTimeStamp(value)
  const date2 = new Date(time * 1000)
  const time2 = time - date.getTime() / 1000
  const Month = date2.getMonth() < 10 ? '0' + (date2.getMonth() + 1) : (date2.getMonth() + 1)
  const DATE = date2.getDate() < 10 ? '0' + date2.getDate() : date2.getDate()
  const Hours = date2.getHours() < 10 ? '0' + date2.getHours() : date2.getHours()
  const Minutes = date2.getMinutes() < 10 ? '0' + date2.getMinutes() : date2.getMinutes()
  if (time2 > 0 && time2 <= 86399) {
    if (type === 3651) return `${Month}月${DATE}日 今天`
    return `今天  ${Hours}:${Minutes}`
  } else if (time2 > 86399 && time2 <= 172799) {
    if (type === 3651) return `${Month}月${DATE}日 明天`
    return `明天  ${Hours}:${Minutes}`
  } else if (time2 > 172799 && time2 < 259199) {
    if (type === 3651) return `${Month}月${DATE}日 后天`
    return `后天  ${Hours}:${Minutes}`
  } else {
    if (type === 3651) return `${Month}月${DATE}日 ${weekFormatting(date2.getDay())}`
    return timeFmt(formatTimeStamp(value), fmt)
  }
})

Vue.filter('numFilter', function (value) {
  if (value) {
    let realVal = Number(value).toFixed(2)
    return realVal
  }
})

Vue.filter('phoneNumFormat', function (value) {
  if (value) {
    const v = value.substr(0, 3) + '****' + value.substr(7)
    return v
  }
})

// 局部的过滤器
export function status (value) {
  if (value * 1 === 0) {
    return '未开始'
  } else if (value * 1 === 1) {
    return '进行中'
  }
  return '已结束'
}

export function score (value, left, def) {
  if (!value) return def || '0'
  const arr = value.split(',')
  if (left) {
    return arr[0] || def || '0'
  } else {
    return arr[1] || def || '0'
  }
}

export function InitScore (value) {
  if (!value || value * 1 === 0) return `全局`
  const arr = ['十', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  value = value.toString()
  if (value < 10) {
    return `第${arr[value]}局`
  } else if (value < 20) {
    return `第十${arr[value[1]]}局`
  } else if (value < 100) {
    return `第${arr[value[0]]}十${arr[value[1]]}局`
  } else {
    return `第${value}局`
  }
}
