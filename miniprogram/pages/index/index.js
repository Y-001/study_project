import {ajax} from '../../utils/index';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        background: ['../../images/book_lb1.jpg', '../../images/book_lb2.jpg', '../../images/book_lb3.jpg'],
        indicatorDots: true,
        vertical: false,
        autoplay: false,
        interval: 2000,
        duration: 500
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
    onLoad: async function (options) {
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