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
                showAnswer:false,
                resultIcon:false,
                kongVal:'',
                nowOption:{}
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
        kongVal:''
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
            },1000)
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
            // wx.setStorageSync('answerArr', JSON.stringify(answerArr))
            this.triggerEvent('answerStatus', answerStatus)
            if(resStatus==false){
                const addData = testlist[currentIndex]
                addData.myOption=option
                addData.myAnswer=option.code
                db.collection('testerrors').add({
                    data:addData
                }).then(res=>{
                    console.log('错题加入成功')
                }).catch(err=>{})
            }
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
            // wx.setStorageSync('answerArr', JSON.stringify(answerArr))
            this.triggerEvent('answerStatus', answerStatus)
            if(resStatus==false){
                const addData = testlist[currentIndex]
                addData.myOption={}
                addData.myAnswer=kongVal
                db.collection('testerrors').add({
                    data:addData
                }).then(res=>{
                    console.log('错题加入成功')
                }).catch(err=>{})
            }
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
            // let answerArr=wx.getStorageSync('answerArr')
            // if(answerArr){
            //     answerArr=JSON.parse(answerArr)
            //     answerArr.forEach(item=>{
            //         if(item.index==this.data.currentIndex){
            //             this.setData({
            //                 showAnswer:true,
            //                 resultIcon:item.value,
            //                 kongVal:item.answer,
            //                 nowOption:item.nowOption
            //             })
            //         }
            //     })
            // }
        },
        moved(){
            // console.log('moved');
        },
        detached(){
            // console.log('moved');
        }
     }
})
