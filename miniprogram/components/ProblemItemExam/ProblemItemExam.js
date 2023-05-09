// components/ProblemItem/ProblemItem.js
const db = wx.cloud.database()
const _ = db.command
let timer = null
Component({
    /**
     * 组件的属性列表
     */
    properties: {
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
        // 展示底部还是答题卡弹窗
        showNum: false,
        /* 题目答案是否展示 */
        showAnswer: false,
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
        }
      },


    /**
     * 组件的方法列表
     */
    methods: {
        // 得到填空题的答案
        getKongVal(e) {
            if (timer != null) clearTimeout(timer)
            timer = setTimeout(() => {
                this.setData({
                    kongVal: e.detail.value
                })
                // console.log(e.detail.value)
            }, 500)
        },
        
        /* 选择答案操作 */
        getAnswer(e) {
            let {option} =e.currentTarget.dataset
            let {testlist,currentIndex,answerArr,answerStatus}=this.data
            let resStatus=option.code==testlist[currentIndex].answer ? true:false;
            answerStatus={
                index:currentIndex,
                value:resStatus,
                answer:option.code,
                nowOption:option
            }
            this.setData({
                showAnswer: true,
                resultIcon:resStatus,
                nowOption:option,
            })
            this.triggerEvent('answerStatus', answerStatus)
            // console.log('选择题')
            wx.showToast({
              title: '提交成功',
              icon:'none'
            })
        },
        // 填空题提交答案操作
        getKongAnswer(e){
            let{kongVal,testlist,currentIndex,answerStatus}=this.data
            let resStatus=kongVal==testlist[currentIndex].answer ? true:false;
            answerStatus={
                index:currentIndex,
                value:resStatus,
                answer:kongVal,
                nowOption:{}
            }
            this.setData({
                showAnswer: true,
                resultIcon:resStatus,
            })
            this.triggerEvent('answerStatus', answerStatus)
            // console.log('填空题')
            wx.showToast({
                title: '提交成功',
                icon:'none'
              })
        },
        // 提交操作
        toTijiao(){
            this.triggerEvent('tiJiao')
        }


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
