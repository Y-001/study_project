const db = wx.cloud.database()
const _ = db.command
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 单选还是填空
        type:0,
        // 当前哪个页面
        pageType: '',
        // 是不是错题页面
        isCuoti: false,
        // 是不是收藏页面
        isStar: true,
        // 答对 打错数组
        answerArr: [],
        // 展示底部还是答题卡弹窗
        showNum: false,
        /* 是否收藏 */
        star: [
            {
                icon: '../../images/problem/pro-star.png',
                text: '收藏'
            },
            {
                icon: '../../images/problem/pro-star-fill.png',
                text: '已收藏'
            }
        ],
        // 轮播图当前索引
        current: 0,
        // 值为0禁止切换动画
        swiperDuration: "250",
        currentIndex: 0,
        // 当前题库
        classify: '',
        testlist: [],
        // 正确和错误的题数
        rightNum: 0,
        errorNum: 0,
    },
    jisuanNum(answerArr) {
        console.log(answerArr)
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
    // 每道题打完之后的结果
    getAnswerStatus(e) {
        let answerStatus = e.detail
        // console.log(answerStatus)
        let { answerArr } = this.data
        if (answerArr.length > 0) {
            let status=true
            for (let i = 0; i < answerArr.length; i++) {
                if (answerArr[i].index == answerStatus.index) {
                    answerArr[i] = answerStatus
                    console.log('进来')
                    status=false
                }
            }
            if(status)  answerArr.push(answerStatus)
        } else {
            answerArr.push(answerStatus)
        }
        this.setData({
            answerArr
        })
        this.jisuanNum(answerArr)
        // console.log(answerArr)
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
    /* 收藏操作 */
    getStar(e) {
        let star = this.data.star
        let { testlist, currentIndex } = this.data
        const addData = testlist[currentIndex]
        if (star[0].text == '收藏') {
            delete addData._openid
            db.collection("teststars").add({
                data: addData
            }).then(res => {
                wx.showToast({
                    title: '收藏成功',
                    icon: 'none'
                })
                let last = star.pop()
                star.unshift(last)
                this.setData({
                    star
                })
            }).catch(res => {
                wx.showToast({
                    title: '收藏失败',
                    icon: 'none'
                })
            })
        }
        if (star[0].text == '已收藏') {
            db.collection("teststars").doc(testlist[currentIndex]._id).remove({}).then(res => {
                wx.showToast({
                    title: '取消收藏成功',
                    icon: 'none'
                })
                let last = star.pop()
                star.unshift(last)
                this.setData({
                    star
                })
            }).catch(res => {
                wx.showToast({
                    title: '取消收藏失败',
                    icon: 'none'
                })
            })
        }
    },
    // 获取收藏状态
    getStarStatus(id) {
        let { star } = this.data
        db.collection('teststars').doc(id).get().then(res => {
            // console.log(res)
            if (res.data) {
                if (star[0].text == '收藏') {
                    let last = star.pop()
                    star.unshift(last)
                    this.setData({
                        star
                    })
                }
            }
        }).catch(err=>{
            // console.log(err)
            if (star[0].text == '已收藏') {
                let last = star.pop()
                star.unshift(last)
                this.setData({
                    star
                })
            }
        })
    },

    // 获取子组件传来的题号
    goIndex(e) {
        let { index } = e.currentTarget.dataset
        // console.log(e.detail)
        this.setData({
            currentIndex: index,
            current: index,
            showNum: false
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
        try {
            this.getStarStatus(that.data.testlist[current]._id)
        } catch (error) {
            console.log(error)
        }
        // console.log(this.data.testlist[current]._id)
        if (current == 0) {
            wx.showToast({
                title: "已经是第一题了",
                icon: "none"
            })
            // return
        }

        if (current == this.data.testlist.length - 1) {
            // wx.showModal({
            //     title: "提示",
            //     content: "您已经答完所有题，是否退出？",
            // })
            wx.showToast({
                title: "已经是最后一题了",
                icon: "none"
            })
            // return
        }
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let that = this
        let classify=decodeURIComponent(options.classify)
        let type=options?.type
        console.log(options)
        that.setData({
            swiperHeight: wx.getSystemInfoSync().windowHeight,
            classify:classify,
            // pageType: '顺序练习'
        })
        if(type ==0 || type==3){
            if(type==0){
                this.setData({
                    pageType:'单选题',
                    type:type
                })
                //更换导航栏名字
            wx.setNavigationBarTitle({
                title: '单选题型练习',
                fail: function () {
                    //todo 显示错误页面
                }
            });
            }else if(type==3){
                this.setData({
                    pageType:'填空题',
                    type:type
                })
                wx.setNavigationBarTitle({
                    title: '填空题型练习',
                    fail: function () {
                        //todo 显示错误页面
                    }
                });
            }
            db.collection('testbanks').where({
                classify: this.data.classify,
                type:Number(this.data.type)
            }).get().then(res => {
                this.setData({
                    testlist: res.data
                })
            })
        }else{
            this.setData({
                pageType:'顺序练习',
            })
            db.collection('testbanks').where({
                classify: this.data.classify,
            }).get().then(res => {
                // console.log(res.data)
                this.setData({
                    testlist: res.data
                })
            })
        }
        // 获取结果数组answerArr
        db.collection("testhistorys").where({
            _openid: wx.getStorageSync('openid'),
            pageType: this.data.pageType,
            classify: this.data.classify
        }).get().then(res => {
            if (res.data.length > 0) {
                // console.log(res)
                let answerArr = res.data[0].answerArr
                let currentIndex = res.data[0].currentIndex
                this.jisuanNum(answerArr)
                this.setData({
                    answerArr,
                    currentIndex,
                    current: currentIndex
                })
            }
            try {
                this.getStarStatus(this.data.testlist[this.data.currentIndex]._id)
            } catch (error) {
                console.log(error)
            }
            // console.log(this.data.testlist[this.data.currentIndex]._id)
        })
        // 获取当前题目收藏状态
        // this.getStarStatus()


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
        // console.log(this.data)
        let { pageType, classify, answerArr, currentIndex } = this.data
        const addData = { pageType, classify, answerArr, currentIndex }
        db.collection("testhistorys").where({
            _openid: wx.getStorageSync('openid'),
            pageType:pageType
        }).get().then(res => {
            if (res.data.length <= 0) {
                db.collection("testhistorys").add({
                    data: addData
                })
                    .then(res => {
                        console.log(res)
                    })
                    .catch(err => {
                        console.log(err)
                    })
            } else {
                db.collection("testhistorys").where({
                    _openid: wx.getStorageSync('openid'),
                    pageType: pageType,
                    classify: classify
                }).update({
                    data: {
                        answerArr, currentIndex
                    }
                }).then(res => {
                    console.log(res)
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
        // console.log(this.data)
        let { pageType, classify, answerArr, currentIndex } = this.data
        const addData = { pageType, classify, answerArr, currentIndex }
        db.collection("testhistorys").where({
            _openid: wx.getStorageSync('openid'),
            pageType:pageType
        }).get().then(res => {
            if (res.data.length <= 0) {
                db.collection("testhistorys").add({
                    data: addData
                })
                    .then(res => {
                        console.log('插入成功')
                    })
            } else {
                db.collection("testhistorys").where({
                    _openid: wx.getStorageSync('openid'),
                    pageType: pageType,
                    classify: classify
                }).update({
                    data: {
                        answerArr, currentIndex
                    }
                }).then(res => {
                    console.log('更新成功')
                })
            }
        })
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