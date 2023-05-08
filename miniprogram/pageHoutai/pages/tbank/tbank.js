// pageHoutai/pages/tbank/tbank.js
const db=wx.cloud.database()
const _=db.command
Page({

    /**
     * 页面的初始数据
     */
    data: {
        searchQ:'',//搜索框的值
        //下拉菜单值
        option1: [
            { text: '全部分类', value: '全部分类',icon:'' },
          ],
          option2: [
            { text: '全部题目', value: 0,icon:'' },
            { text: '我的题目', value: 1,icon:'' },
          ],
          value1: '全部分类',
          value2: 0,
        testList:[],//下边展示的题目数组
        id:0,//选中题目的id
    },
    //删除题目
    delete(e){
        let id=e.currentTarget.dataset.id
        wx.showModal({
          title: '确定删除此道题目？',
          content: '',
          complete: (res) => {
            if (res.cancel) {
              
            }
        
            if (res.confirm) {
              db.collection('testbanks').doc(id).remove().then(res=>{
                  wx.showToast({
                    title: '删除成功',
                  })
                  this.getTestList()
                  this.setData({
                    value1: '全部分类',
                    value2: 0,
                  })
              })
            }
          }
        })
    },
    //当点击搜索
    search(e){
        wx.showLoading({
            title: '加载中...',
        })
        let data=e.detail
        db.collection('testbanks').where({
            title: {
                $regex: '.*' + data+'.*',
                $options: 'i' 
              }
        }).get().then(res=>{
            this.setData({
                testList:res.data,
                value1: '全部分类',
                value2: 0,
            })
            wx.hideLoading()
        })
    },
    //筛选展示
    changeA(e){
        this.setData({
            value1:e.detail,
            searchQ:""
        })
        this.getTestList(this.data.value1,this.data.value2)
    },
    changeB(e){
        this.setData({
            value2:e.detail,
            searchQ:""
        })
        this.getTestList(this.data.value1,this.data.value2)
    },
    // 新增修改题目
    editTest(e){
        let {id}=e.currentTarget.dataset
        this.setData({
            id
        })
        wx.navigateTo({
          url: '/pageHoutai/pages/editbank/editbank?id='+id,
        })
    },
    // 获取题目列表
    getTestList(val1='全部分类',val2=0){
        wx.showLoading({
          title: '加载中...',
        })
        let data={}
        if(val1!='全部分类'){
            data.classify=val1
        }
        if(val2==1){
            data._openid=wx.getStorageSync('openid')
        }
        db.collection('testbanks').where({
            ...data
        }).get().then(res=>{
            this.setData({
                testList:res.data
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
        db.collection('testclassifys').get().then(res=>{
            let data=res.data.map(item=>{
                let text=item.bank
                let value=item.bank
                let icon=''
                return {
                    text,value,icon
                }
            })
            data.unshift({
                text:'全部分类',
                value:'全部分类',
                icon:''
            })
            this.setData({
                option1:data,
                value1:data[0].value
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