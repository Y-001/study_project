// pageStudy/pages/xcqd2/xcqd2.js
import { dateFormat } from '../../../utils/index'
const db = wx.cloud.database()
const _ = db.command
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        //已签到天数
        num: 0,
        //是否签过
        active: false,
    },
    signup() {
        if(this.data.active) return
        const _this = this
        let now = new Date().getTime();
        let day = dateFormat(now);
        db.collection('users').where({
            _openid: wx.getStorageSync('openid')
        }).update({
            data: {
                signlist: _.push(day)
            }
        }).then(res => {
            wx.showToast({
                title: '签到成功',
                icon: 'none'
            })
            this.setData({
                active: true
            })
            _this.onLoad()
        })
    },

/**
 * 生命周期函数--监听页面加载
 */
onLoad(options) {
    let now = new Date().getTime();
    let day = dateFormat(now);
    //获取签到列表
    db.collection('users').where({
        _openid: wx.getStorageSync('openid')
    }).get().then(res => {
        // console.log(res.data[0].signlist)
        if ('signlist' in res.data[0]) {
            let active = res.data[0].signlist.includes(day)
            // console.log(active)
            // console.log(res.data[0].signlist)
            let list = res.data[0].signlist
            this.setData({
                list: list,
                active: active,
                num: res.data[0].signlist.length
            })
        }
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