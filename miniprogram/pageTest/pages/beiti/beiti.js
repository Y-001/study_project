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
        answerArr:[]
    },
    
    // 获取子组件传来的题号
    getChildIndex(e){
        let index = e.detail
        // console.log(e.detail)
        this.setData({
            currentIndex:index,
            current:index
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
        let that = this
        let classify=decodeURIComponent(options.classify)
        let pageType=decodeURIComponent(options.pageType)
        // console.log(options)
        that.setData({
            swiperHeight: wx.getSystemInfoSync().windowHeight,
            classify:classify,
            pageType:pageType
        })
        if(pageType=='背题模式'){
            db.collection('testbanks').where({
                classify:this.data.classify
            }).get().then(res=>{
                // console.log(res.data)
                this.setData({
                    testlist:res.data
                })
            })
        }
        if(pageType=='收藏夹'){
            db.collection('teststars').where({
                _openid:wx.getStorageSync('openid'),
                classify:this.data.classify
            }).get().then(res=>{
                // console.log(res.data)
                this.setData({
                    testlist:res.data
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
                let answerArr = res.data[0].answerArr
                let currentIndex = res.data[0].currentIndex
                this.setData({
                    answerArr,
                    currentIndex,
                    current: currentIndex
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
                    console.log('更新记录成功')
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