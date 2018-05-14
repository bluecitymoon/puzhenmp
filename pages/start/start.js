//login.js
//获取应用实例
var app = getApp();
Page({
  data: {
    remind: '加载中',
    angle: 0,
    userInfo: {},
    background: ['http://www.puzhenchina.com/images/1.jpg',               'http://www.puzhenchina.com/images/2.jpg', 'http://www.puzhenchina.com/images/3.jpg'],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: false,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0
  },
  goToIndex:function(){
    wx.switchTab({
      url: '/pages/index/index',
    });
  },
  onLoad:function(options){
    if (options.agentId) {
      wx.setStorageSync("agentId", options.agentId)

      console.debug(options)
    } else {
      wx.showToast({
        title: '欢迎来到朴真书院！',
        icon: 'success',
        duration: 2000
      })
    }
  },
  onShow:function(){

  },
  onReady: function(){
    var that = this;
    setTimeout(function(){
      that.setData({
        remind: ''
      });
    }, 1000);
    wx.onAccelerometerChange(function(res) {
      var angle = -(res.x*30).toFixed(1);
      if(angle>14){ angle=14; }
      else if(angle<-14){ angle=-14; }
      if(that.data.angle !== angle){
        that.setData({
          angle: angle
        });
      }
    });
  }
});