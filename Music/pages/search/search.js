import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotList: {}, //热搜榜数据
    historySearch: '', //搜索记录
    keyword: ''
  },

  //热搜榜请求
  async getHotTop() {
    let {
      data
    } = await request('/search/hot/detail')
    this.setData({
      hotList: data
    })
  },
  //点击搜索
  goSearch(e) {
    let keyword = e.currentTarget.dataset.item
    if (keyword.searchWord) {
      keyword = keyword.searchWord
    }
    this.setData({
      keyword
    })
  },
  //垃圾桶
  clearHistory() {
    wx.removeStorageSync('historySearch')
    this.setData({
      historySearch: ''
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getHotTop()

  },

  onShow() {
    //获取历史搜索纪律
    this.setData({
      historySearch: (wx.getStorageSync('historySearch') || [].map(item => {
        return {
          item
        }
      }))
    })
  }
})