// app.js
import http from './utils/http.js';

App({
  onLaunch() {
    // 展示本地存储能力
    const user = wx.getStorageSync('user')
    if (!user) {
      // 登录
      wx.login({
        success: res => {
          http.get('/api/mini_program/login?code=' + res.code).then(resp => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            wx.setStorageSync('user', {
              code: res.code,
              token: resp.token
            })
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null
  }
})
