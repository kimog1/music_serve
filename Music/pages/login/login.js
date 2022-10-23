import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {},


  //获取输入的手机号和密码
  handleInput(event) {
    // let type=event.currentTarget.id; // 1. 通过设置的id 传值
    let type = event.currentTarget.dataset.type; // 2. 通过data-type 传值
    this.setData({
      [type]: event.detail.value // [type]: value
    })
  },
  //登录的回调
  async login() {
    // 1. 收集表单项的数据
    let {
      phone,
      password
    } = this.data;
    // 2. 前端验证 : 不能为空，号码正确
    if (!phone) {
      // 提醒用户
      wx.showToast({
        title: "用户名不能为空！",
        icon: "none"
      });
      return;
    }
    // 正则表达式：号码正确
    let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
    if (!phoneReg.test(phone)) {
      // 提醒用户
      wx.showToast({
        title: "手机号格式错误！！",
        icon: "none"
      });
      return;
    }
    // 验证密码
    if (!password) {
      // 提醒用户
      wx.showToast({
        title: "密码不能为空！！",
        icon: "none"
      });
      return;
    }
    // 发送请求
    let data = await request('/login/cellphone', {
      phone,
      password
    }, 'POST')
    if (data.code == 200) {
      wx.showToast({
        title: "登录成功！"
      });
      // 将用户信息存储到本地
      wx.setStorageSync("userInfo", JSON.stringify(data.profile));
      // 跳转个人中心
      wx.reLaunch({
        url: "/pages/personal/personal"
      });
    } else if (data.code == 400) {
      wx.showToast({
        title: "手机号错误 ！",
        icon: "none"
      });
    } else if (data.code == 502) {
      wx.showToast({
        title: "密码错误 ！",
        icon: "none"
      });
    } else {
      wx.showToast({
        title: "登录失败，请重新登陆 ！",
        icon: "none"
      });
    }
  },

})