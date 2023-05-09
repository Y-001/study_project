// components/ProblemItem/ProblemItem.js
const db=wx.cloud.database()
const _=db.command
let timer=null
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
        },
        // 当前第几题
        currentIndex:{
            type:Number,
            value:0
        },
        // 题目列表
        testlist:{
            type:Array,
            value:[]
        },
        answerOld:{
            type:Object,
            value:{}
        }
        
    },
    observers: {
        'answerOld': function(field) {
          // 使用 setData 设置 this.data.some.field 本身或其下任何子数据字段时触发
          // （除此以外，使用 setData 设置 this.data.some 也会触发）
          if(field){
            this.setData({
                showAnswer:true,
                resultIcon:field.value,
                kongVal:field.answer,
                nowOption:field.nowOption
            })
          }else{
            this.setData({
                showAnswer:true,
                resultIcon:false,
                kongVal:'',
                nowOption:{},
                kongti:true
            })
          }
        },
      },
    

    /**
     * 组件的初始数据
     */
    data: {
        /* 题目答案是否展示 */
        showAnswer: false,
        /* 回答正确或者错误 */
        resultIcon: false,
        // 当前选择的选项
        nowOption:{},
        judgePage: false,
        // 答对 打错数组
        // answerArr:wx.getStorageSync('answerArr') ? JSON.parse(wx.getStorageSync('answerArr')) :[],
        answerStatus:{},
        // 填空题的值
        kongVal:'',
        // 没答案
        kongti:false
    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 得到填空题的答案
        getKongVal(e){
            if(timer!=null) clearTimeout(timer)
            timer=setTimeout(()=>{
                this.setData({
                    kongVal:e.detail.value
                })
                // console.log(e.detail.value)
            },500)
        },
        
       
    },
    lifetimes:{
        created(){
            // console.log('create')
            
        },
        attached(){
            // console.log('attached');
        },
        ready(){
        },
        moved(){
            // console.log('moved');
        },
        detached(){
            // console.log('moved');
        }
     }
})
