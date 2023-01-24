// pages/problem/problem.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showNum:false,
        showKey:false,
        /* 是否收藏 */
        star:[
            {
                icon:'../../images/problem/pro-star.png',
                text:'收藏'
            },
            {
                icon:'../../images/problem/pro-star-fill.png',
                text:'收藏'
            }
        ],
        /* 题目答案是否展示 */
        showAnswer:false,
        /* 回答正确或者错误 */
        resultIcon:false,
        judgePage:false
    },
    /* 关闭答题卡 */
    onCloseNum(e){
        this.setData({
            showNum:false
        })
    },
    /* 打开答题卡 */
    openNum(e){
        this.setData({
            showNum:true
        })
    },
    /* 收藏操作 */
    getStar(e){
        let star=this.data.star
        let last=star.pop()
        star.unshift(last)
        this.setData({
            star
        })
    },
    /* 选择答案操作 */
    getAnswer(e){
        this.setData({
            showAnswer:true
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