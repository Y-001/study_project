// components/ProblemItem/ProblemItem.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        isCuoti:{
            type:Boolean,
            value:false
        },
        isStar:{
            type:Boolean,
            value:true
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
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
                text: '收藏'
            }
        ],
        /* 题目答案是否展示 */
        showAnswer: false,
        /* 回答正确或者错误 */
        resultIcon: false,
        judgePage: false
    },

    /**
     * 组件的方法列表
     */
    methods: {
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
            let last = star.pop()
            star.unshift(last)
            this.setData({
                star
            })
        },
        /* 选择答案操作 */
        getAnswer(e) {
            this.setData({
                showAnswer: true
            })
        },

    }
})
