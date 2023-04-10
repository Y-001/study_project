// pageTest/pages/beiti/beiti.js
const db=wx.cloud.database()
const _=db.command
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 轮播图当前索引
        current: 0,
        // 值为0禁止切换动画
        swiperDuration: "250",
        currentIndex: 0,
        // 当前题库
        classify:'',
        testlist:[],
        pageType:'',
        answerArr:[],
        // 展示底部还是答题卡弹窗
        showNum: false,
        // 正确和错误的题数
        rightNum: 0,
        errorNum: 0,
    },
    // 回到题库页面
    toQuestion(){
        wx.switchTab({
          url: '/pages/question/question',
        })
    },
    // 计算正确和错误的题数
    jisuanNum(answerArr) {
        // console.log(answerArr)
        let numR = 0, numE = 0
        answerArr.forEach(function (item) {
            if (item.value == true) {
                numR++
            }
            if (item.value == false) {
                numE++
            }
        })
        this.setData({
            rightNum: numR,
            errorNum: numE
        })
    },
    /* 关闭答题卡 */
    onCloseNum(e) {
        this.setData({
            showNum: false
        })
    },
    /* 打开答题卡 */
    openNum(e) {
        this.setData({
            showNum: true
        })
    },
    

    // 轮播图变化
    swiperChange(e) {
        let that = this
        // console.log(e.detail)
        let current = e.detail.current
        that.setData({
            currentIndex: current
        })
        if (current == -1) {
            wx.showToast({
                title: "已经是第一题了",
                icon: "none"
            })
            return
        }

        if (current == -2) {
            wx.showModal({
                title: "提示",
                content: "您已经答完所有题，是否退出？",
            })
            return
        }
    },
    // 改变题号
    goIndex(e) {
        let { index } = e.currentTarget.dataset
        // console.log(e.detail)
        this.setData({
            currentIndex: index,
            current: index,
            showNum: false
        })
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let that = this
        // console.log(options)
        let id=options.id
        that.setData({
            swiperHeight: wx.getSystemInfoSync().windowHeight,
        })
            db.collection('testexams').doc(id).get().then(res=>{
                // console.log(res.data)
                let answerArr=res.data.answerArr
                this.setData({
                    testlist:res.data.testlist,
                    classify:res.data.classify,
                    answerArr:answerArr
                })
                this.jisuanNum(answerArr)
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