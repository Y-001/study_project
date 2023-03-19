// pages/store/store.js
const db = wx.cloud.database()
const _ =db.command
Page({

    /**
     * 页面的初始数据
     */
    data: {
        background: ['../../images/book_lb1.jpg', '../../images/book_lb2.jpg', '../../images/book_lb3.jpg'],
        hotBooksList:[],
        likeBooksList:[]
    },
    toSearch(){
        wx.navigateTo({
          url: '/pageRead/pages/search/search',
        })
    },
    toDetail(e){
        let {id}=e.currentTarget.dataset
        // console.log(id)
        db.collection("booklists").doc(id).update({
            data:{
                hot:_.inc(1)
            }
        })
        wx.navigateTo({
          url: `/pageRead/pages/detail/detail?id=${id}`,
        })
    },
    toClassify(e){
        let {classify}=e.target.dataset
        // console.log(e.target.dataset)
        wx.navigateTo({
          url: `/pageRead/pages/classify/classify?classify=${encodeURIComponent(classify)}`,
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
     onLoad(options) {
         //获取热门推荐的书籍
         db.collection('booklists').orderBy('hot','desc').limit(4).get().then(res=>{
             res.data.forEach(item=>{
                 let name=item.name.match(/《(.*?)》/g)[0].replace("《",'').replace("》",'')
                item.name=name
             })
             this.setData({
                hotBooksList:res.data
             })
         })
         //获取猜你喜欢书籍
         db.collection('booklists').orderBy('like','desc').limit(6).get().then(res=>{
            res.data.forEach(item=>{
                let name=item.name.match(/《(.*?)》/g)[0].replace("《",'').replace("》",'')
               item.name=name
            })
            this.setData({
               likeBooksList:res.data
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