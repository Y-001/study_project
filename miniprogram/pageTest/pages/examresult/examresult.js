// pageTest/pages/examresult/examresult.js
const db = wx.cloud.database()
const _ = db.command
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        examresult: [],
        rightnum: 0,
        rightrate: 0,
        usetime: 0,
        score: 0,
        id:'',
        name:''
    },
    toExamRecord(){
        let {id}=this.data
        wx.redirectTo({
          url: '/pageTest/pages/examrecord/examrecord?id='+id,
        })
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let userInfo = JSON.parse(wx.getStorageSync('userInfo'));
        this.setData({
            userInfo
        })
        let id = options.id
        this.setData({
            id
        })
        db.collection('testexams').doc(id).get().then(res => {
            let name=res.data.classify
            let examresult = res.data.answerArr
            // ?️ 获取完整分钟数
            let minutes = Math.floor(res.data.continuetime/1000 / 60);
            // ?️ 获得剩余的秒数
            let seconds = Math.floor(res.data.continuetime/1000 % 60);
            if(seconds<10){
                seconds='0'+seconds
            }
            let usetime = minutes+":"+seconds
            let rightnum = res.data.rightnum
            let rightrate = 0;
            let score = res.data.score;
            
            rightrate = score / 25 *100
            this.setData({
                rightnum, score, rightrate,usetime,name
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