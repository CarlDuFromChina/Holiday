// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {

  },

  onLoad() {
    this.getNews();
  },

  getNews() {
      wx.request({
        url: '/api/',
        method: 'GET',
        data: {

        },
        success: resp => {
            console.log(resp)
        }
      })
  }
})
