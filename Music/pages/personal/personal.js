import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',
    like_list: ''
  },
  //登录
  toLogin() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  //登出
  out() {
    wx.clearStorageSync()
    wx.showToast({
      title: '退出登录成功',
      icon: 'success',
      duration: 2000,
      success: () => {
        wx.reLaunch({
          url: '/pages/index/index',
        })
      }
    })
  },
  //获取喜欢歌单
  async getLikeList() {
    let uid = this.data.userInfo.userId
    let res = await request('/user/playlist', {
      uid
    }, 'POST')
    let like_list = res.playlist[0]
    this.setData({
      like_list
    })
  },
  //跳转歌单
  goDetail() {
    wx.navigateTo({
      // 在 url 进行传递歌单id
      url: '/pages/song_list/song_list?id=' + this.data.like_list.id,
    })
  },
  onLoad(options) {
    let userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        userInfo: JSON.parse(userInfo)
      })
      this.getLikeList()
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getLikeList()
  },
})