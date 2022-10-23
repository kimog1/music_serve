// components/search.js
Component({
  //使用全局icon
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    isShow: '',
    keyword: {
      type: String,
      value: '',
      observer(val) {
        val
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    titleName: '网易云音乐', //导航栏名称
    statusBarHeight: '', //状态栏高度
    statusBarTop: '', //状态按钮
    searchKeyword: '', //搜索关键词
    historySearch: [], //历史搜索
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //点击事件触发函数
    toSearch() {
      const pages = getCurrentPages()
      const route = pages[pages.length - 1].route
      if (route !== 'pages/search/search' && route !== 'pages/searchResult/searchResult') {
        wx.navigateTo({
          url: '/pages/search/search',
        })
      }
    },
    //回车事件触发函数
    goSearch(e) {
      const pages = getCurrentPages()
      const route = pages[pages.length - 1].route
      if (route == 'pages/search/search') {
        this.saveSearch(e.detail.value)
        //跳转到searchResult页面
        wx.navigateTo({
          url: `/pages/searchResult/searchResult?keyword=${e.detail.value}`,
        })
      } else if (route == 'pages/searchResult/searchResult') {
        // 子传父
        this.triggerEvent("searchKeyword", e.detail.value)
      } else {
        wx.navigateTo({
          url: '/pages/search/search',
        })
      }
    },
    //搜索记录保存
    saveSearch(value) {
      //获取历史搜索纪律
      this.setData({
        historySearch: (wx.getStorageSync('historySearch') || [].map(item => {
          return {
            item
          }
        }))
      })
      let historySearch = this.data.historySearch
      //将记录传给父组件
      this.triggerEvent("historySearch", historySearch)
      if (historySearch == '') {
        wx.setStorageSync("historySearch", [value]);
      } else {
        if (historySearch.indexOf(value) !== -1) {
          historySearch.splice(historySearch.indexOf(value), 1)
        }
        let newHistorySearch = [value].concat(historySearch)
        wx.setStorageSync("historySearch", newHistorySearch);
      }
    },
    toBack() {
      wx.navigateBack()
    }
  },

  observers: {
    keyword(val) {
      if (val !== '') {
        this.saveSearch(val)
        wx.navigateTo({
          url: `/pages/searchResult/searchResult?keyword=${val}`,
        })
      }
    }
  },

  attached() {
    //获取状态栏高度
    wx.getSystemInfo({
      success: res => {
        let custom = wx.getMenuButtonBoundingClientRect();
        let statusBarHeight = custom.bottom + custom.top - res.statusBarHeight;
        this.setData({
          statusBarHeight,
          statusBarTop: custom.top
        })
      },
    });
  }
})