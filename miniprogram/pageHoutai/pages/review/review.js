// pageHoutai/pages/review/review.js
const db = wx.cloud.database()
const _ = db.command
Page({

    /**
     * 页面的初始数据
     */
    data: {
        testList:[],//题目列表
        option1: [
            { text: '全部分类', value: '全部分类', icon: '' },
        ],
        option2: [
            { text: '新增', value: 0, icon: '' },
            { text: '修改', value: 1, icon: '' },
            { text: '删除', value: 2, icon: '' },
            { text: '全部操作', value: 3, icon: '' },
        ],
          value1: '全部分类',
          value2: 3,
          nowitem:{},
        //   弹窗展示
          show: false,
        //   审核意见
          advice:'',
          showAdvice:false,
    },
    // 打开弹窗，查看详情
    getDeatil(e){
        let item=e.currentTarget.dataset.item
        this.setData({
            nowitem:item,
            show:true
        })
    },
    //关闭弹窗
    onClose() {
        this.setData({ show: false });
      },
    //   点击确认按钮
    pass(){
        let {nowitem}=this.data
        db.collection('reviewtests').doc(nowitem._id).update({
            data:{
                status:1,
                shuser:JSON.parse(wx.getStorageSync('userInfo')).nickName
            }
        }).then(item=>{
           
            if(nowitem.operate==0){
                db.collection('testbanks').add({
                    data:{
                        _id:nowitem._id,
                        title:nowitem.title,
                        type:nowitem.type,
                        options:nowitem.options,
                        classify:nowitem.classify,
                        answer:nowitem.answer,
                        analysis:nowitem.analysis
                    }
                }).then(item=>{
                    console.log('向正式题库增加了一条')
                })
            }
            if(nowitem.operate==1){
                db.collection('testbanks').doc(nowitem._id).update({
                    data:{
                        title:nowitem.title,
                        type:nowitem.type,
                        options:nowitem.options,
                        classify:nowitem.classify,
                        answer:nowitem.answer,
                        analysis:nowitem.analysis
                    }
                }).then(item=>{
                    console.log('向正式题库更新了一条')
                })
            }
            if(nowitem.operate==2){
                db.collection('testbanks').doc(nowitem._id).remove().then(item=>{
                    console.log('向正式题库删除了一条')
                })
            }
            wx.showToast({
                title: '已审核',
                icon:'none'
              })
              this.setData({
                  value1: '全部分类',
                  value2: 3,
              })
              this.getTestList()
        })
    },
    //   点击取消按钮
    noPass(){
        this.setData({
            showAdvice:true
        })
    },
    //输入意见之后
    putAdvice(){
        let {nowitem,advice}=this.data
        if(!advice){
            wx.showToast({
              title: '请输入审核意见',
              icon:'none'
            })
            return
        }
        db.collection('reviewtests').doc(nowitem._id).update({
            data:{
                status:2,
                shuser:JSON.parse(wx.getStorageSync('userInfo')).nickName,
                advice
            }
        }).then(item=>{
            wx.showToast({
                title: '已审核',
                icon:'none'
              })
              this.setData({
                value1: '全部分类',
                value2: 3,
            })
            this.getTestList()
        })
    },
    changeA(e) {
        this.setData({
            value1: e.detail,
        })
        this.getTestList(this.data.value1, this.data.value2)
    },
    changeB(e) {
        this.setData({
            value2: e.detail,
        })
        this.getTestList(this.data.value1, this.data.value2)
    },
    // 获取未审核题目列表
    getTestList(val1 = '全部分类', val2 = 3) {
        wx.showLoading({
            title: '加载中...',
        })
        let data = {}
        data.status=0
        if (val1 != '全部分类') {
            data.classify = val1
        }
        if(val2!=3){
            data.operate=val2
        }
        
        db.collection('reviewtests').where({
            ...data
        }).get().then(res => {
            this.setData({
                testList: res.data
            })
            wx.hideLoading()
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getTestList()
        //获取分类列表
        db.collection('testclassifys').get().then(res => {
            let data = res.data.map(item => {
                let text = item.bank
                let value = item.bank
                let icon = ''
                return {
                    text, value, icon
                }
            })
            data.unshift({
                text: '全部分类',
                value: '全部分类',
                icon: ''
            })
            this.setData({
                option1: data,
                value1: data[0].value
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