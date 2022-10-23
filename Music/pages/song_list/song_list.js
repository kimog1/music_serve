import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    ids: [],
    songs: [],
    coverImgUrl: '',
    scrollHeight:'',
    userinfo: {
      userPic: '',
      userName: ''
    },
    currentSong:{
      picUrl:'',
      name:'',
      singer:'',
    }
  },

  //获取歌单详情
  async getSongList() {
    let id = this.data.id
    let res = await request('/playlist/detail', {
      id
    }, 'POST')
    let ids = res.playlist.trackIds.map(item => {
      return Number(item.id)
    })
    ids = ids.join(',')
    this.setData({
      ids,
      coverImgUrl: res.playlist.coverImgUrl,
      ['userinfo.userPic']: res.playlist.creator.avatarUrl,
      ['userinfo.userName']: res.playlist.creator.nickname
    })
    const appInstance = getApp()
    appInstance.globalData.songList = ids
    this.getSongDetail(ids)
  },
  //获取单曲详情
  async getSongDetail(ids) {
    let res = await request('/song/detail', {
      ids
    }, 'POST')
    let songs = res.songs
    this.setData({
      songs
    })
  },
  //播放歌曲
  playMusic(e) {
    //获取点击歌曲信息并保存
    const $data =  e.currentTarget.dataset
    const data = $data.item
    this.setData({
      ['currentSong.picUrl']:data.al.picUrl,
      ['currentSong.name']:data.name,
      ['currentSong.singer']:data.ar[0].name,
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
    let id = options.id
    this.setData({
      id
    })
    this.getSongList()
    //初始化当前点击歌曲
    let currentSong=wx.getStorageSync('currentSong')
    this.setData({
      ['currentSong.picUrl']:currentSong.al.picUrl,
      ['currentSong.name']:currentSong.name,
      ['currentSong.singer']:currentSong.ar[0].name,
    })
    //计算scroll-view的高度
    const windowWidth = wx.getSystemInfoSync().windowWidth;
    const windowHeight = wx.getSystemInfoSync().windowHeight;
    const scroll_height = 750*windowHeight/windowWidth-(400+20+40+52)
    this.setData({
      scrollHeight:scroll_height
    })
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