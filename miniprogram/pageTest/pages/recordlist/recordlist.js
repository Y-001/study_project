// pageTest/pages/recordlist/recordlist.js

const db=wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        testbank:[]
    },
    toExamRecord(e){
        let {id}=e.currentTarget.dataset
        wx.navigateTo({
          url: '/pageTest/pages/examrecord/examrecord?id='+id,
        })
    },
     dateFormat(date) {
        date = new Date(date)
        var year = date.getFullYear();                // 年
        var month = showTime(date.getMonth() + 1);        // 月
        var week = showTime(date.getDay());           // 星期
        var day = showTime(date.getDate());          // 日
        var hours = showTime(date.getHours());         // 小时
        var minutes = showTime(date.getMinutes());    // 分钟
        var second = showTime(date.getSeconds());     // 秒
        var str = '';
        // str = str + year + '-' + month + '-' + week + '-' + day + '-' + hours + '-' + minutes + '-' + second
        str = str + year + '/' + month + '/' + day+' '+hours+':'+minutes+':'+second
        // document.write(str);
        return str
        // 封装一个不够两位数就补零的函数
        function showTime(t) {
            var time
            time = t > 10 ? t : '0' + t
            return time
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        db.collection('testexams').where({
            _openid:wx.getStorageSync('openid')
        }).get().then(res=>{
            res.data.forEach((item,index)=>{
                res.data[index].createtime=this.dateFormat(item.createtime)
            })
            this.setData({
                testbank:res.data
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