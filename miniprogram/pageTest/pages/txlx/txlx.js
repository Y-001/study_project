// pages/txlx/txlx.js
const db=wx.cloud.database()
const _=db.command
const $ = db.command.aggregate
Page({

    /**
     * 页面的初始数据
     */
    data: {
        classify:"",
        dnum:0,
        tnum:0
    },
    toShunXu(e){
        let {type}=e.currentTarget.dataset
        wx.navigateTo({
          url: '/pageTest/pages/shunxu/shunxu?type='+type+'&classify='+encodeURIComponent(this.data.classify),
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        let classify=decodeURIComponent(options.classify)
        this.setData({
            classify
        })
        let res=await db.collection('testbanks').aggregate()
        .match({
            classify:classify
        })
        .group({
          _id: '$type',
          num: $.sum(1)
        })
        .end()
        let dnum,tnum
        res.list.forEach(item=>{
            if(item._id==0){
                dnum=item.num
            }
            if(item._id==3){
                tnum=item.num
            }
        })
        this.setData({
            dnum,
            tnum
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