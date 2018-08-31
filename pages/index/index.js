var app = getApp()
Page({
  data: {
    allCourses: [],
    selectedCourses: [],
    channels: [],
    selectedChannel: {},
    courseHeight: 800,
    index: 0,
    newOrder: {
      marketChannelCategory: null,
      classCategories: []
    },
    birthday: null,
    scheduleDate: null
  },

  onLoad: function (options) {
    // app.getUserInfo()
    this.getAllChannels()
    this.getAllClassCategories()
  },

  bindDateChange: function(e) {

    this.setData({ birthday: e.detail.value})
    console.log(e.detail.value)
  },

  bindScheduleDateChange: function (e) {

    this.setData({ scheduleDate: e.detail.value })
    console.log(e.detail.value)
  },
  interestedCourseChange: function (e) {
    if (!e.detail.value || e.detail.value.length < 1) {
      return
    }
    var selectedCourses = e.detail.value
    var courses = [];
    for (var i = 0; i < selectedCourses.length; i++) {
      console.debug(selectedCourses[i])
      var courseId = selectedCourses[i]
      for (var j = 0; j < this.data.allCourses.length; j++) {
        var singleCourse = this.data.allCourses[j]
        if (courseId == singleCourse.id) {
          courses.push(singleCourse)
        }
      }
    }

    this.setData({
      selectedCourses: courses
    })
  },

  channelChange: function (e) {

    this.setData({ index: e.detail.value })
    var selectedChannel = this.data.channels[this.data.index]
    this.setData({
      selectedChannel: selectedChannel
    })

  },

  getAllChannels: function () {
    wx.request({
      url: app.globalData.baseUrl + '/api/market-channel-categories',
      success: (res) => {

        wx.hideLoading();

        this.setData({
          channels: res.data,
          index: 0,
          selectedChannel: res.data[0]
        })
      }
    })
  },
  getAllClassCategories: function () {
    wx.request({
      url: app.globalData.baseUrl + '/api/class-categories',
      success: (res) => {

        wx.hideLoading();

        this.setData({
          allCourses: res.data,
          courseHeight: res.data.length * 100
        })

      }
    })
  },

  showUserAuthrozationFailed: function() {
    wx.showModal({
      title: '用户状态未授权',
      content: '请授权同意，朴真书院需要微信信息关联您的学习情况',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          wx.openSetting({
            success: function success(res) {
              console.log('调用openSetting方法success:', res);
            },
            fail: function (res) {
              console.log('调用openSetting方法fail:', res);
            }, complete: function (res) {
              console.log('调用openSetting方法complete:', res);
            }
          });
        }
      }
    })
  },
  submitNewOrder: function (e) {

    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          //用户授权过之后获取用户信息
          wx.getUserInfo({
            success: userInfoRes => {

              // wx.setStorageSync("userInfo", userInfoRes)
              this.handleNewOrder(e, userInfoRes)
            }
          })
          
        } else {
          this.showUserAuthrozationFailed()
        }
      },
      fail: res => {
        
      }
    })
  },

  handleNewOrder: function (e, userInfoRes) {
    
    var order = e.detail.value

    if (!order.personName) {
      wx.showModal({
        title: '操作失败',
        content: '请输入姓名',
        showCancel: false
      })
      return
    }

    if (!order.contactPhoneNumber) {
      wx.showModal({
        title: '操作失败',
        content: '请输入手机号码',
        showCancel: false
      })
      return
    }
    const agentId = wx.getStorageSync("agentId")
    order.marketChannelCategory = this.data.selectedChannel
    order.classCategories = this.data.selectedCourses
    order.id = null
    order.status = "新单"
    order.agentId = agentId
    if (!this.data.scheduleDate) {
      wx.showModal({
        title: '操作失败',
        content: '请选择预约日期',
        showCancel: false
      })
      return
    }
    if (this.data.birthday) {
      order.birthday = this.convertLocalDateFromServer(this.data.birthday)
    }
    if (this.data.scheduleDate) {
      order.scheduleDate = this.convertLocalDateFromServer(this.data.scheduleDate)
    }

    order.sourceType = "WeChat";
    wx.request({
      url: app.globalData.baseUrl + '/api/free-class-records',
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      data: order,
      success: (res) => {
        console.debug(res)
        if (res.statusCode == 201) {

          this.submitUserWechatInfo(res.data, userInfoRes)

          // wx.showToast({
          //   title: '恭喜您预约成功！',
          //   icon: 'success',
          //   duration: 2000
          // })
        } else {
          var message = "预约失败！";

          if (res.data.detail) {
            message = res.data.detail;
          }

          wx.showModal({
            title: '提示',
            content: message,
            showCancel: false
          })

        }
      }
    })
  },

  submitUserWechatInfo: function (savedNewOrder, userInfoRes) {

    const code = wx.getStorageSync('code')
    const storedUser = userInfoRes
    var wechatuser = storedUser.userInfo
    wechatuser.code = code
    wechatuser.encryptedData = storedUser.encryptedData
    wechatuser.iv = storedUser.iv
    wechatuser.id = null
    wechatuser.newOrders = [savedNewOrder]
   
    wx.request({
      url: app.globalData.baseUrl + '/api/new-order-wechat-user-infos/migrate',
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      data: wechatuser,
      success: (res) => {
        wx.navigateTo({
          url: 'submit-success?pn=' + savedNewOrder.contactPhoneNumber
        })
      }
    })
  },
  convertLocalDateFromServer: function(date) {
    if(date) {
      var dateString = date.split('-');
      var birthday = new Date();
      birthday.setFullYear(dateString[0], dateString[1] - 1, dateString[2]);
      return birthday
    }
    return null;
  }
})
