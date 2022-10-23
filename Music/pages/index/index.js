import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    background: [],
    recommend_list: []
  },
  // 请求轮播图
  async getBanner() {
    let {
      banners
    } = await request('/banner')
    this.setData({
      background: banners
    })
  },
  //每日推荐歌单
  async getRecommendList() {
    let {
      result
    } = await request('/personalized?limit=10')
    this.setData({
      recommend_list: result
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getBanner()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.getRecommendList()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})