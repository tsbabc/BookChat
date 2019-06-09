const keyUser = 'user';

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const now = () => {
  return parseInt(new Date().getTime() / 1000)
}

const toTimestamp = t => {
  return parseInt(new Date(t).getTime() / 1000)
}

const relativeTime = t => {

  let timestamp = toTimestamp(t)
  let n = now()
  let diff = n - timestamp


  let minute = 60;
  let hour = minute * 60;
  let day = hour * 24;
  let month = day * 30;

  let monthC = diff / month;
  let dayC = diff / day;
  let hourC = diff / hour;
  let minC = diff / minute;

  if (monthC > 12) {
    return parseInt(monthC / 12) + " 年前";
  } else if (monthC >= 1) {
    return parseInt(monthC) + " 月前";
  } else if (dayC >= 1) {
    return parseInt(dayC) + " 天前";
  } else if (hourC >= 1) {
    return parseInt(hourC) + " 小时前";
  } else if (minC >= 1) {
    return parseInt(minC) + " 分钟前";
  }
  return '刚刚';
}

const clearUser = () => {
  wx.setStorageSync(keyUser, '{}')
}

const setUser = (user) => {
  wx.setStorageSync(keyUser, JSON.stringify(user))
}

const getUser = () => {
  try {
    var value = wx.getStorageSync(keyUser)
    if (value) {
      return JSON.parse(value)
    }
  } catch (e) {
    // Do something when catch error
    console.log(e)
    return {}
  }
}

const getToken = () => {
  let user = getUser()
  if (user && user.token != undefined) {
    return user.token
  }
  return ""
}

// 只有请求结果返回 200 的时候，才会resolve，否则reject
const request = (api, params = {}, method = "GET", header = {}) => {
  return new Promise(function(resolve, reject) {
    if (!header["content-type"]) {
      header["content-type"] = "application/json"
    }

    if (method.toUpperCase() == 'POST') header["content-type"] = "application/x-www-form-urlencoded"

    let token = getToken()
    if (token) header['authorization'] = token

    wx.request({
      url: api,
      data: params,
      method: method,
      header: header,
      success: function(res) {
        if (res.statusCode == 200) {
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: function(err) {
        reject(err)
      }
    })
  });
}

const loading = (title) => {
  title = title ? title : '玩命加载中...'
  wx.showLoading({
    title: title,
  })
}

const toastError = (content) => {
  wx.showToast({
    title: content,
    // image: '../../assets/images/error.png',
    icon: 'none',
    duration: 3000
  })
}

const toastSuccess = (content) => {
  wx.showToast({
    title: content,
    image: '../../assets/images/success.png',
    duration: 2000
  })
}


module.exports = {
  formatTime,
  now,
  toTimestamp,
  relativeTime,
  request,
  loading,
  toastError,
  toastSuccess,
  setUser,
  clearUser,
  getUser,
  getToken,
}