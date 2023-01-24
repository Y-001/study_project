Page({

    /**
     * 页面的初始数据
     */
    data: {
        value:'',
        books:[
            {
                image:'../../images/test_img3.jpg',
                name:'本草纲目',
                author:'李时珍',
                desc:'简介你有啥不啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊'
            },
            {
                image:'../../images/test_img2.jpg',
                name:'wuyu',
                author:'nihao',
                desc:'简介你有啥不啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊'
            }
        ],
    },
    toSearch(){
        wx.navigateTo({
          url: '../search/search',
        })
    },
    toRead(e){
        wx.navigateTo({
          url: '../read/read',
        })
    },
   

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        if (typeof this.getTabBar === 'function' && this.getTabBar()) {
            this.getTabBar().setData({
                select: 0
            })
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})