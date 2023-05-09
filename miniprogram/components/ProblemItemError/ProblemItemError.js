// components/ProblemItem/ProblemItem.js
const db = wx.cloud.database()
const _ = db.command
let timer = null
Component({
    /**
     * 组件的属性列表
     */
    properties: {
      
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
            this.setData({
                resultIcon:testlist[num].answer==testlist[num].myAnswer,
                nowOption:testlist[num].myOption,
                kongVal:testlist[num].answer
            })
        }
      },


    /**
     * 组件的方法列表
     */
    methods: {
        // 去到当前题 点击答题卡
        toDelete(e) {
            let {testlist,currentIndex}=this.data
            this.triggerEvent('deleteid', testlist[currentIndex]._id)
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
        
        


    },
    lifetimes: {
        created() {
        },
        attached() {
            // console.log('attached');
        },
        ready() {
            let {testlist,currentIndex}=this.data
            // console.log(testlist)
            // console.log(currentIndex)
            this.setData({
                resultIcon:testlist[currentIndex].answer==testlist[currentIndex].myAnswer,
                nowOption:testlist[currentIndex].answer,
                kongVal:testlist[currentIndex].kongVal
            })
            // console.log(this.data.testlist)
        },
        moved() {
            // console.log('moved');
        },
        detached() {
            // console.log('moved');
        }
    }
})
