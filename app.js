//app.js
App({
  onLaunch: function () {
    
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        this.globalData.code = res.code
        console.debug(res)
        wx.setStorage({
          key: 'code',
          data: res.code,
        })
      }
    })
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          
    //     }
    //   }
    // })
  },
  //https://mis.puzhenchina.com/
  globalData: {
    userInfo: null,
    code: null,
    baseUrl: "https://mis.puzhenchina.com"
  },
  
  getUserInfo: function (cb) {
    var that = this
    wx.authorize({
      scope: 'scope.userInfo',
      success(response) {
        console.debug(response)
        wx.getUserInfo({
          success: res => {
            this.globalData.userInfo = res
            console.debug(this.globalData)

            wx.setStorageSync("userInfo", res)
            if (this.userInfoReadyCallback) {
              this.userInfoReadyCallback(res)
            }

            cb()
          }
        })
      },
      fail: function (response) {
        console.debug(response)
      }
    })
  }
})