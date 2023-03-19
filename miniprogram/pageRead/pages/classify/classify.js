// pages/classify/classify.js
const db=wx.cloud.database()
const _=db.command
Page({

    /**
     * 页面的初始数据
     */
    data: {
        active: '经论',
        books:[],
    },
    onChange(e) {
        // wx.showToast({
        //   title: `切换到标签 ${event.detail.name}`,
        //   icon: 'none',
        // });
        // console.log(e.detail.title)
        let title=e.detail.title
        this.getBookList(title)
      },
    toDetail(e){
        let {id}=e.currentTarget.dataset
        // console.log(id)
        db.collection("booklists").doc(id).update({
            data:{
                hot:_.inc(1),
            }
        })
        wx.navigateTo({
          url: `/pageRead/pages/detail/detail?id=${id}`,
        })
    },
    //搜索书籍数据
    getBookList(classify){
        db.collection('booklists').where({
            classify:classify
        }).get().then(res=>{
            res.data.forEach(item=>{
                let name=item.name.match(/《(.*?)》/g)[0].replace("《",'').replace("》",'')
               item.name=name
            })
            this.setData({
                books:res.data
            })
        }).catch(err=>{
            console.log(err)
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let {classify}=options
        classify=decodeURIComponent(classify)
        // console.log(classify)
        this.setData({
            active:classify
        })
        this.getBookList(classify)
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