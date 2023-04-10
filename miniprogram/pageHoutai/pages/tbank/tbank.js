// pageHoutai/pages/tbank/tbank.js
const db=wx.cloud.database()
const _=db.command
Page({

    /**
     * 页面的初始数据
     */
    data: {
        testList:[],
        id:0,
    },
    // 新增修改题目
    editTest(e){
        let {id}=e.currentTarget.dataset
        this.setData({
            id
        })
        wx.navigateTo({
          url: '/pageHoutai/pages/editbank/editbank?id='+id,
        })
    },
    // 获取题目列表
    getTestList(){
        db.collection('testbanks').get().then(res=>{
            this.setData({
                testList:res.data
            })
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getTestList()
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