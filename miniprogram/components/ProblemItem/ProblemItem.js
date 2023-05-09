// components/ProblemItem/ProblemItem.js
const db = wx.cloud.database()
const _ = db.command
let timer = null
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        isCuoti: {
            type: Boolean,
            value: false
        },
        isStar: {
            type: Boolean,
            value: true
        },
        // 属于哪个题库
        classify: {
            type: String,
            value: ''
        },
        // 当前第几题
        currentIndex: {
            type: Number,
            value: 0
        },
        // 题目列表
        testlist: {
            type: Object,
            value: []
        }

    },

    /**
     * 组件的初始数据
     */
    data: {
        // 题目列表
        // testlist:[],
        // 展示底部还是答题卡弹窗
        showNum: false,
        showKey: false,
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
        /* 题目答案是否展示 */
        showAnswer: true,
        /* 回答正确或者错误 */
        resultIcon: true,
        // 当前选择的选项
        nowOption: {},
        judgePage: false,
        // 填空题的值
        kongVal: ''
    },
    observers: {
        'currentIndex': function(num) {
            let {testlist}=this.data
         this.getStarStatus(testlist[num]._id)
        }
      },


    /**
     * 组件的方法列表
     */
    methods: {
        // 去到当前题 点击答题卡
        goIndex(e) {
            let { index } = e.currentTarget.dataset;
            // console.log(index)
            this.triggerEvent('childIndex', index)
        },
        // 得到填空题的答案
        getKongVal(e) {
            if (timer != null) clearTimeout(timer)
            timer = setTimeout(() => {
                this.setData({
                    kongVal: e.detail.value
                })
                console.log(e.detail.value)
            }, 500)
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
            }).catch(err => {
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


    },
    lifetimes: {
        created() {
        },
        attached() {
            // console.log('attached');
        },
        ready() {

        },
        moved() {
            // console.log('moved');
        },
        detached() {
            // console.log('moved');
        }
    }
})
