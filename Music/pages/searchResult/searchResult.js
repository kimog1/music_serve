import request from '../../utils/request'
Page({

  data: {
    keyword: '', //搜索关键词
    songs: {}, //搜索结果
  },

  //请求search
  async getSearchResult(e) {
    if (e !== undefined) {
      this.setData({
        keyword: e.detail
      })
    }
    let keyword = this.data.keyword
    let {
      result
    } = await request(`/search?keywords=${keyword}`)
    this.setData({
      songs: result.songs
    })
  },

  //点击播放音乐
  playMusic(e) {
    //获取点击歌曲信息并保存
    const $data = e.currentTarget.dataset
    const data = $data.item
    this.setData({
      ['currentSong.picUrl']: data.al.picUrl,
      ['currentSong.name']: data.name,
      ['currentSong.singer']: data.ar[0].name,
    })
    wx.setStorageSync('currentSong', data)
    //跳转到播放页面
    wx.navigateTo({
      url: '/pages/play_music/play_music',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //接收传递歌单id
    this.setData({
      keyword: options.keyword
    })
    this.getSearchResult()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

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