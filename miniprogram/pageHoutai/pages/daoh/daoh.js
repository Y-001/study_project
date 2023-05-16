// pageHoutai/pages/daoh/daoh.js
const db=wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        auth:0,
        userInfo:{},
    },
    toTeacher(){
        wx.navigateTo({
          url: '/pageHoutai/pages/teacher/teacher',
        })
    },
    toReview(){
        wx.navigateTo({
          url: '/pageHoutai/pages/review/review',
        })
    },
    toPublishbank(){
        wx.navigateTo({
          url: '/pageHoutai/pages/publishbank/publishbank',
        })
    },
    toTclassify(){
        wx.navigateTo({
          url: '/pageHoutai/pages/tclassify/tclassify',
        })
    },
    toTbank(){
        wx.navigateTo({
          url: '/pageHoutai/pages/tbank/tbank',
        })
    },
    toRole(){
        wx.navigateTo({
          url: '/pageHoutai/pages/role/role',
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let userInfo=JSON.parse(wx.getStorageSync('userInfo'))
        this.setData({
            userInfo
        })
        db.collection('authoritys').where({
            openid:wx.getStorageSync('openid')
        }).get().then(res=>{
            this.setData({
                auth:res.data[0].role
            })
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