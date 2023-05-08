// pages/talk/talk.js
const db=wx.cloud.database()
const _=db.command
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 发布的文章内容
        list:[],
        openid:wx.getStorageSync('openid'),
        active:'吐槽',
        starList:[]
    },
    // 收藏
    cancelStar(e){
        let {item}=e.currentTarget.dataset
        let {active}=this.data
            db.collection('circlestars').where({
                circleid:item.circleid
            }).remove().then(res=>{
                wx.showToast({
                  title: '取消收藏成功',
                  icon:'none'
                })
                this.getList(active)
            })
    },
    // 删除发布的内容
    delete(e){
        let id=e.currentTarget.dataset.id
        let active=this.data.active
        wx.showModal({
          title: '确定删除？',
          content: '',
          complete: (res) => {
            if (res.cancel) {
              
            }
        
            if (res.confirm) {
              db.collection('circles').doc(id).remove().then(res=>{
                  wx.showToast({
                    title: '删除成功！',
                    icon:'none'
                  })
                  this.getList(active)
              })
            }
          }
        })
    },
    onChange(e){
        this.setData({
            active:e.detail.name
        })
        this.getList(e.detail.name)
    },
    toPublish(){
        wx.navigateTo({
          url: '/pageTalk/pages/publish/publish',
        })
    },
    toTalkdetail(e){
        let id=e.currentTarget.dataset.id
        wx.navigateTo({
          url: '/pageTalk/pages/talkdetail/talkdetail?id='+id,
        })
    },
    toTalk(e){
        let id=e.currentTarget.dataset.id
        wx.navigateTo({
          url: '/pageTalk/pages/talk/talk'
        })
    },
    // 获取帖子列表
    getList(classify="吐槽"){
        wx.showLoading()
        let data={}
        data.classify=classify
        data._openid=wx.getStorageSync('openid')
        db.collection('circlestars').where({
            ...data
        }).get().then(res=>{
            let data=res.data.sort(function(a,b){
                return b.time-a.time
            })
            this.setData({
                list:data
            })
            wx.hideLoading()
        })
    },
    
    // 点赞
    doStar(e){
        let id=e.currentTarget.dataset.id
        db.collection('circles').doc(id).update({
            data:{
                star:_.push(wx.getStorageSync('openid'))
            }
        }).then(res=>{
            this.getList()
            wx.showToast({
                title: '点赞成功',
                icon:'none'
              })
        })
    },
    // 取消点赞
    dodeleteStar(e){
        let item=e.currentTarget.dataset.item
        let openid=wx.getStorageSync('openid')
        let star=item.star.filter(item=>{
            return openid!=item
        })
        db.collection('circles').doc(item._id).update({
            data:{
                star:star
            }
        }).then(res=>{
            this.getList()
            wx.showToast({
              title: '取消点赞成功',
              icon:'none'
            })
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getList()
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

        if(typeof this.getTabBar === 'function' && this.getTabBar()){
            this.getTabBar().setData({
                select:3
            })
        }
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