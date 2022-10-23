export default (url, data = {}, method = "GET") => {
  return new Promise((resolve, rejuect) => {
    wx.request({
      url:`http://localhost:3000${url}`,
      data,
      method,
      success: (res) => {
        resolve(res.data)
      },
      fail: (err) => {
        rejuect(err)
      }
    })
  })
}