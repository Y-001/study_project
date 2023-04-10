// pageTest/pages/beiti/beiti.js
const db = wx.cloud.database()
const _ = db.command
var startime, endtime
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 倒计时的时间
        // time: 10 * 60 * 1000,
        time: 60 * 1000,
        // 轮播图当前索引
        current: 0,
        // 值为0禁止切换动画
        swiperDuration: "250",
        currentIndex: 0,
        // 当前题库
        classify: '',
        testlist: [],
        pageType: '',
        // 答对 打错数组
        answerArr: [],
        // 用户信息
        userInfo:{},
        // 防止重复提交
        chongfu:false
    },
    // 每道题打完之后的结果
    getAnswerStatus(e) {
        let answerStatus = e.detail
        // console.log(answerStatus)
        let { answerArr } = this.data
        if (answerArr.length > 0) {
            let status = true
            for (let i = 0; i < answerArr.length; i++) {
                if (answerArr[i].index == answerStatus.index) {
                    answerArr[i] = answerStatus
                    console.log('进来')
                    status = false
                }
            }
            if (status) answerArr.push(answerStatus)
        } else {
            answerArr.push(answerStatus)
        }
        this.setData({
            answerArr
        })
        // console.log(answerArr)
    },
    // 交卷
    tiJiao(e) {
        let _this = this
        let { type } = e.currentTarget.dataset
        let { answerArr, testlist } = this.data
        if (!type) {
            if (answerArr.length != testlist.length) {
                wx.showModal({
                    title: '提示',
                    content: '题目没有作答完毕，确认提交试卷？',
                    success(res) {
                        if (res.confirm) {
                            console.log('用户点击确定')
                            _this.toEaxmBank()
                            _this.setData({
                                chongfu:true
                            })
                        } else if (res.cancel) {
                            console.log('用户点击取消')
                        }
                    }
                })
            } else  {
                this.toEaxmBank();
                this.setData({
                    chongfu:true
                })
            }
        } else {
            if(!this.data.chongfu){
                wx.showToast({
                    title: '考试时间已到，强制收卷',
                    icon: 'none'
                })
                setTimeout(() => {
                    this.toEaxmBank()
                }, 1000)
            }
        }
    },
    // 放到考试记录数据库
    toEaxmBank() {
        let { answerArr, testlist, classify, time,userInfo } = this.data
        let createtime = new Date().getTime()
        let continuetime = createtime - startime
        if (continuetime > time) continuetime = time
        let rightnum = 0
        let score = 0;
        answerArr.forEach(item => {
            if (item.value == true) {
                rightnum += 1;
                score += 5;
            }
        })
        let addData = { answerArr, testlist, createtime, classify, continuetime,userInfo,rightnum,score }
        db.collection('testexams').add({
            data: addData
        }).then(res => {
            console.log('插入模拟考试记录成功')
            let id = res._id
            wx.reLaunch({
                url: '/pageTest/pages/examresult/examresult?id=' + id,
            })
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


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let userInfo = JSON.parse(wx.getStorageSync('userInfo'));
        let classify = decodeURIComponent(options.classify);
        console.log(classify)
        let that = this
        let pageType = '模拟考试';
        // console.log(options)
        that.setData({
            swiperHeight: wx.getSystemInfoSync().windowHeight,
            pageType: pageType,
            classify,
            userInfo
        })
        db.collection('testbanks').aggregate().match({
            classify
        })
            .sample({
                size: 5
            })
            .end()
            .then(res => {
                // console.log(res.list)
                this.setData({
                    testlist: res.list
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
        startime = new Date().getTime()
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