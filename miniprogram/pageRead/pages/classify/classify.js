// pages/classify/classify.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        active: 1,
        books:[
            {
                image:'../../images/test_img3.jpg',
                name:'本草纲目',
                author:'李时珍',
                desc:'简介你有啥不啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊',
                classify:'伤寒',
                num:'180万'
            },
            {
                image:'../../images/test_img2.jpg',
                name:'wuyu',
                author:'nihao',
                desc:'简介你有啥不啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊',
                classify:'伤寒',
                num:'180万'
            }
        ],
    },
    onChange(event) {
        wx.showToast({
          title: `切换到标签 ${event.detail.name}`,
          icon: 'none',
        });
      },
    toDetail(e){
        wx.navigateTo({
          url: '/pageRead/pages/detail/detail',
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

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