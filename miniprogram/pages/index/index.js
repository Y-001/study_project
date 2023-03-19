import { dateFormat } from '../../utils/index'
const db = wx.cloud.database()
const _ = db.command
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 轮播图配置
        background: ['../../images/book_lb1.jpg', '../../images/book_lb2.jpg', '../../images/book_lb3.jpg'],
        indicatorDots: true,
        vertical: false,
        autoplay: false,
        interval: 2000,
        duration: 500,
        // 经典收藏的列表
        starList: [],
        //学习计划
        studyplan:{},
    },
    toXcjh() {//计划
        wx.navigateTo({
            url: '/pageStudy/pages/xcjh/xcjh',
        })
    },
    toXcqd() {//签到
        wx.navigateTo({
            url: '/pageStudy/pages/xcqd/xcqd',
        })
    },
    toXcsj() {//数据
        wx.navigateTo({
            url: '/pageStudy/pages/xcsj/xcsj',
        })
    },
    toNote() {
        wx.navigateTo({
            url: '/pageNote/pages/notes/notes',
        })
    },
    toTest() {
        wx.switchTab({
            url: '/pages/question/question',
        })
    },
    toDetail() {
        wx.navigateTo({
            url: '/pageRead/pages/detail/detail',
        })
    },
    toStore() {
        wx.switchTab({
            url: '/pages/store/store',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let _this=this
        let openid = wx.getStorageSync('openid')
        if (!openid) {
            wx.cloud.callFunction({ //  调用云函数获取openid
                name: 'getOpenid',
                complete: res => {
                    //   openid = res.result.openid;
                    // console.log(res)
                    wx.setStorageSync('openid', res.result.openid)
                }
            })
        }
        //获取收藏经典列表
        db.collection('bookstars').where({
            _openid: wx.getStorageSync('openid')
        }).get().then(res => {
            res.data.forEach(item => {
                item.createtime = dateFormat(item.createtime)
            })
            this.setData({
                starList: res.data
            })
        })
        //获取学习计划
        db.collection('users').where({
            _openid:wx.getStorageSync('openid')
        }).get().then(res=>{
            // console.log(res.data)
            _this.setData({
                studyplan:res.data[0].studyplan
            })
        })
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