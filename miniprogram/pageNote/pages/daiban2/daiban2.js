// pageNote/pages/daiban2/daiban2.js
const db=wx.cloud.database()
const _=db.command
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list:[], //定义一个空数组
        content:'', //输入的内容
    },
    add(e){
        //正则验证 不能是空格 内容长度不能大于10 不可以输入特殊符号
        let valueReg = /^[\u4e00-\u9fa5a-zA-Z\d]{1,10}$/
        if (!valueReg.test(this.data.content)){
			wx.showToast({
				title: '内容不符合规范',
				icon:"none"
			})
			return;
        }
        db.collection('todos').add({
            data:{
                content:this.data.content,
                checked:false,
                push:false
            }
        }).then(res=>{
            wx.showToast({
              title: '添加成功',
              icon:'none'
            })
            this.setData({
                content:''
            })
            this.getTodoList()
        })
    },
    // 获取代办
    getTodoList(){
        db.collection('todos').where({
            _openid:wx.getStorageSync('openid')
        }).get().then(res=>{
            if(res.data.length>0){
                this.setData({
                    list:res.data
                })
            }
        })
    },
    //单个任务的勾选事件
    ass(e){
        let {id}=e.currentTarget.dataset
        db.collection('todos').doc(id).update({
            data:{
                checked:true
            }
        }).then(res=>{
            this.getTodoList()
        })
    },
    // 滑动删除或者别的
    onClose(event) {
        let _this=this
        const { position, instance,name } = event.detail;
        let {id}=event.currentTarget.dataset
        switch (position) {
          case 'left':
          case 'cell':
            instance.close();
            break;
          case 'right':
            wx.showModal({
                title: '确定删除吗？',
                content: '',
                success (res) {
                  if (res.confirm) {
                      db.collection('todos').doc(id).remove().then(res=>{
                        _this.getTodoList()
                      })
                    instance.close();
                  } else if (res.cancel) {
                    // console.log('用户点击取消')
                    instance.close();
                  }
                }
              })
            break;
        }
      },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getTodoList()
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