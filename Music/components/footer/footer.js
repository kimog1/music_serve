import request from '../../utils/request'
Component({
  //使用全局icon
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    currentSong: {}, //当前歌曲
    isMusicPlay: {}, //查看歌曲是否在播放
    isPlay: '', //是否播放
    song_url: '' //歌曲地址
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toPlayMusic() {
      wx.navigateTo({
        url: '/pages/play_music/play_music',
      })
    },
    //点击暂停播放
    controlPlay() {
      let isPlay = !this.data.isPlay
      this.setData({
        isPlay
      })
      let id = this.data.currentSong.id
      let name = this.data.currentSong.name
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

    //封装改变状态的函数
    changePlayState(isPlay) {
      this.setData({
        isPlay
      })
      this.appInstance.globalData.isMusicPlay = isPlay
    },

    onshow() {
      console.log('onshow');
    }
  },
  // lifetimes: {
  //   attached() {
  //     console.log('attached');
  //     //初始化当前点击歌曲
  //     let currentSong = wx.getStorageSync('currentSong')
  //     this.setData({
  //       currentSong,
  //     })
  //     this.appInstance = getApp()
  //     this.BackgroundAudioManager = wx.getBackgroundAudioManager()
  //     // 打开网页时判断歌曲是否播放
  //     if (this.appInstance.globalData.isMusicPlay && this.appInstance.globalData.musicId === currentSong.id) {
  //       this.setData({
  //         isPlay: true
  //       })
  //     }
  //     //后台播放和页面一致
  //     this.BackgroundAudioManager.onPlay(() => {
  //       this.changePlayState(true)
  //       //修改全局变量
  //     })
  //     this.BackgroundAudioManager.onPause(() => {
  //       this.changePlayState(false)
  //     })
  //     this.BackgroundAudioManager.onStop(() => {
  //       this.changePlayState(false)
  //     })
  //   }
  // },
  pageLifetimes: {
    show: function () {
      console.log('show');
      //初始化当前点击歌曲
      let currentSong = wx.getStorageSync('currentSong')
      this.setData({
        currentSong,
      })
      this.appInstance = getApp()
      this.BackgroundAudioManager = wx.getBackgroundAudioManager()
      // 打开网页时判断歌曲是否播放
      if (this.appInstance.globalData.isMusicPlay && this.appInstance.globalData.musicId === currentSong.id) {
        this.setData({
          isPlay: true
        })
      }
      //后台播放和页面一致
      this.BackgroundAudioManager.onPlay(() => {
        this.changePlayState(true)
        //修改全局变量
      })
      this.BackgroundAudioManager.onPause(() => {
        this.changePlayState(false)
      })
      this.BackgroundAudioManager.onStop(() => {
        this.changePlayState(false)
      })
    }
  }
})