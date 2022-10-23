import request from '../../utils/request'
import dayjs from '../../utils/dayjs.min'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ids: '', //歌单所有歌的id
    song: {}, //当前歌的详情
    song_url: '', //当前歌曲的链接
    isPlay: false, //是否播放
    statusBarHeight: '', //状态栏高度
    statusBarTop: '', //状态按钮高度
    totalTime: '', //歌曲总时长
    max: 0, //滑块最大值
    value: 0, //进度条进程
    currentTime: 0, //当前时长
    flag: false //是否在拖动滑块
  },
  //控制播放
  controlPlay() {
    let isPlay = !this.data.isPlay
    let id = this.data.song.id
    let name = this.data.song.name
    this.getMusic(isPlay, id, name)
  },

  //获取歌曲链接
  async getMusic(isPlay, id, name) {
    if (isPlay) {
      if (!this.data.song_url) {
        let {
          data
        } = await request('/song/url', {
          id
        })
        let song_url = data[0].url
        this.setData({
          song_url
        })
        this.BackgroundAudioManager.src = song_url
        this.BackgroundAudioManager.title = name
      }
      this.BackgroundAudioManager.play()
    } else {
      //暂停音乐
      this.BackgroundAudioManager.pause()
    }
  },

  //获取单曲详情
  async getSongDetail(id) {
    let {
      songs
    } = await request(`/song/detail?ids=${id}`)
    this.setData({
      song: songs[0]
    })
    wx.setStorageSync('currentSong', songs[0])
    this.getMusic(true, songs[0].id, songs[0].name)
  },
  
  //切歌函数
  checkMusic(e) {
    //关闭当前音乐
    this.BackgroundAudioManager.stop()
    this.setData({
      song_url: ''
    })
    let model = ''
    if (e === 'timeOver') {
      model = 'next'
    } else {
      model = e.currentTarget.id
    }
    const ids = this.data.ids
    const id = this.data.song.id.toString()
    if (model === 'next') {
      let next_id = ids[parseInt(ids.indexOf(id)) + 1]
      this.getSongDetail(next_id)
    } else if (model === 'pre') {
      let pre_id = ids[parseInt(ids.indexOf(id)) - 1]
      this.getSongDetail(pre_id)
    }
  },
  //拖动滑块
  changing(e) {
    let currentTime = e.detail.value
    currentTime = dayjs(currentTime * 1000).format("mm:ss")
    console.log(currentTime);
    this.setData({
      currentTime,
      flag: true,
    })
  },
  //滑动后执行
  changed(e) {
    let currentTime = e.detail.value
    this.setData({
      flag: false,
    })
    this.BackgroundAudioManager.seek(currentTime)
    this.BackgroundAudioManager.play()
  },
  //返回上一级函数
  back() {
    wx.navigateBack({
      delta: 1,
    })
  },

  //封装改变状态的函数
  changePlayState(isPlay) {
    this.setData({
      isPlay
    })
    this.appInstance.globalData.isMusicPlay = isPlay
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let song = wx.getStorageSync('currentSong')
    this.appInstance = getApp()
    const ids = this.appInstance.globalData.songList.split(',')
    this.setData({
      song,
      ids
    })
    this.controlPlay()
    if (this.appInstance.globalData.isMusicPlay && this.appInstance.globalData.musicId === song.id) {
      this.setData({
        isPlay: true
      })
    }
    //后台播放和页面一致
    this.BackgroundAudioManager = wx.getBackgroundAudioManager()
    this.BackgroundAudioManager.onPlay(() => {
      this.changePlayState(true)
      //修改全局变量
      this.appInstance.globalData.musicId = song.id
    })
    this.BackgroundAudioManager.onPause(() => {
      this.changePlayState(false)
    })
    this.BackgroundAudioManager.onStop(() => {
      this.changePlayState(false)
    })
    this.BackgroundAudioManager.onEnded(() => {
      this.checkMusic('timeOver')
    })

    //获取状态栏高度
    wx.getSystemInfo({
      success: res => {
        let custom = wx.getMenuButtonBoundingClientRect().top;
        let statusBarHeight = custom.bottom + custom.top - res.statusBarHeight;
        this.setData({
          statusBarHeight,
          statusBarTop: custom
        })
      },
    });

    //获取进度条数据
    setInterval(() => {
      if (this.data.flag === false) { //滑块没有拖动
        let totalTime = dayjs(this.BackgroundAudioManager.duration * 1000).format('mm:ss')
        let max = parseInt(this.BackgroundAudioManager.duration)
        let currentTime = dayjs(this.BackgroundAudioManager.currentTime * 1000).format('mm:ss')
        let value = parseInt(this.BackgroundAudioManager.currentTime)
        this.setData({
          totalTime,
          max,
          currentTime,
          value
        })
      }
    }, 1000)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // let song = wx.getStorageSync('currentSong')
    // this.setData({
    //   song
    // })
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