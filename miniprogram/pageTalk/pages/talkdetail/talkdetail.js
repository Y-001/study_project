// pages/talkdetail/talkdetail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
         /* 是否展示底部弹出层 */
         write: false,
         submit:false,
         comment:"",
    },
    /* 发布评论按钮 */
    submiteComment(e){
        this.onClose()
    },
    /* input写评论 */
    writeComment(e){
        //console.log(e.detail.value)
        if(timer) clearTimeout(timer);
        timer=setTimeout(()=>{
            this.setData({
                submit:true,
                comment:e.detail.value
            })
        },1000)
    },
    /* 展示弹出层 */
    showWrite(e){
        this.setData({
            write:true
        })
    },
    /* 关闭弹出层 */
    onClose() {
        this.setData({ 
            write: false,
            submit:false,
            comment:''
        });
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