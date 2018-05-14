var app = getApp()

Page({
  data: {
    ads: []
  },
  onLoad: function() {
    this.loadAllAds()
  },

  loadAllAds: function() {
    wx.request({
      url: app.globalData.baseUrl + '/api/ads?status.equals=true&sort=sequence%2Casc',
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        this.setData({
          ads: res.data
        })
      }
    })
  }
})
