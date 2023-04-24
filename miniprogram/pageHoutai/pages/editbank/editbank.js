// pageHoutai/pages/editbank/editbank.js
const db=wx.cloud.database()
const _=db.command
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id:0,
        type:'0',
        title:"",
        // options:[
           
        // ],
        optA:'',
        optB:"",
        optC:'',
        optD:'',
        answer:'',
        analysis:'',
        array: ['内经知要'],
        index: 0,
    },
    bindPickerChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
          index: e.detail.value
        })
      },
    onChangeType(e){
        this.setData({
            type: e.detail,
          });
    },
    // 点击提交按钮
    async toAddtest(){
        let {id,title,type,array,index,optA,optB,optC,optD,answer,analysis}=this.data
        if(!analysis){
            wx.showToast({
              title: '请输入解析',
              icon:'none'
            })
        }
        if(!answer){
            wx.showToast({
              title: '请输入答案',
              icon:'none'
            })
        }
        if(type==0){
            if(!optA){
                wx.showToast({
                    title: '请输入选项A的答案',
                    icon:'none'
                  })
            }
            if(!optB){
                wx.showToast({
                    title: '请输入选项B的答案',
                    icon:'none'
                  })
            }
            if(!optC){
                wx.showToast({
                    title: '请输入选项C的答案',
                    icon:'none'
                  })
            }
            if(!optD){
                wx.showToast({
                    title: '请输入选项D的答案',
                    icon:'none'
                  })
            }
        }
        if(!title){
            wx.showToast({
              title: '请输入题目',
              icon:'none'
            })
        }
        let options= type==3 ? []:[
            {
                code:'A',
                content:optA
            },
            {
                code:'B',
                content:optB
            },
            {
                code:'C',
                content:optC
            },
            {
                code:'D',
                content:optD
            },
        ] 
        if(id==0){
            await db.collection('testbanks').add({
                data:{
                    classify:array[index],
                    title,
                    type:Number(type),
                    options,
                    answer,
                    analysis
                }
            })
            wx.showToast({
              title: '添加成功',
              icon:'none'
            })
        }else{
            await db.collection('testbanks').doc(id).update({
                data:{
                    classify:array[index],
                    title,
                    type:Number(type),
                    options,
                    answer,
                    analysis
                }
            })
            wx.showToast({
                title: '修改成功',
                icon:'none'
              })
        }
        setTimeout(()=>{
            wx.navigateTo({
                url: '/pageHoutai/pages/tbank/tbank',
              })
        },500)
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        let id=options.id
        this.setData({
            id
        })
        let res=await db.collection('testclassifys').get()
        let array=res.data.map(item=>{
            return item.bank
        })
        this.setData({
            array
        })
        // 数据回显
        
        if(id!=0){
            let a=await db.collection('testbanks').doc(id).get()
            this.setData({
                type:a.data.type.toString(),
                title:a.data.title,
                answer:a.data.answer,
                analysis:a.data.analysis,
                index:array.indexOf(a.data.classify),
            })
            if(a.data.type==0){
                this.setData({
                    optA:a.data.options[0].content,
                    optB:a.data.options[1].content,
                    optC:a.data.options[2].content,
                    optD:a.data.options[3].content
                })
            }
            
        }
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