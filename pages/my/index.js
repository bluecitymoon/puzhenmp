const app = getApp()

Page({
	data: {
    score:0,
    score_sign_continuous:0,
    userInfo: null,
    balance: 0,
    taken: 0
  },
	onLoad() {
    const user = wx.getStorageSync("userInfo")
    this.setData({
      userInfo: user
    })
	}
  
})