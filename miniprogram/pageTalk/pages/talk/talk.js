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
        //是否是我的发布页面
        isMy:false,
        starList:[]
    },
    // 预览图片
    previewSqs(event) {
        // 拿到图片的地址url
        let index = event.currentTarget.dataset.index;
        let item = event.currentTarget.dataset.item;
        // 微信预览图片的方法
        wx.previewImage({
            current: item.imgUp[index], // 图片的地址url
            urls: item.imgUp // 预览的地址url
        })
    },
    // 去收藏页
    toStar(){
        wx.navigateTo({
          url: '/pageTalk/pages/star/star',
        })
    },
    // 收藏
    getStar(e){
        let {sign,item}=e.currentTarget.dataset
        let {active,isMy}=this.data
        let status=isMy ? 1:0
        if(sign==0){
            db.collection('circlestars').where({
                circleid:item._id
            }).remove().then(res=>{
                wx.showToast({
                  title: '取消收藏成功',
                  icon:'none'
                })
                this.getList(active,status)
            })
        }
        if(sign==1){
            db.collection('circlestars').add({
                data:{
                    circleid:item._id,
                    avatar:item.avatar,
                    nickName:item.nickName,
                    classify:item.classify,
                    content:item.content,
                    imgUp:item.imgUp,
                    star:item.star,
                    time:item.time,
                    title:item.title
                }
            }).then(res=>{
                wx.showToast({
                  title: '收藏成功',
                  icon:'none'
                })
                this.getList(active,status)
            })
        }
    },
    // 查看我的发布的内容
    myPublish(){
        let active='吐槽'
        this.setData({
            active:'吐槽',
            isMy:true
        })
        this.getList('吐槽',1)
        //更换导航栏名字
        wx.setNavigationBarTitle({
            title: '我的发布',
            fail: function () {
                //todo 显示错误页面
            }
        });
    },
    tuiMyPublish(){
        let active='吐槽'
        this.setData({
            active:'吐槽',
            isMy:false
        })
        this.getList('吐槽',0)
        //更换导航栏名字
        wx.setNavigationBarTitle({
            title: '圈子',
            fail: function () {
                //todo 显示错误页面
            }
        });
    },
    // 删除发布的内容
    delete(e){
        let id=e.currentTarget.dataset.id
        let active=this.data.active
        let isMy=this.data.isMy
        let status= isMy ? 1:0
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
                  this.getList(active,status)
              })
            }
          }
        })
    },
    onChange(e){
        this.setData({
            active:e.detail.name
        })
        let isMy=this.data.isMy
        let status= isMy ? 1:0
        this.getList(e.detail.name,status)
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
    // 获取帖子列表
    getList(classify="吐槽",openid=0){
        wx.showLoading()
        let data={}
        data.classify=classify
        if(openid==1){
            data._openid=wx.getStorageSync('openid')
        }
        db.collection('circles').where({
            ...data
        }).get().then(res=>{
            let data=res.data.sort(function(a,b){
                return b.time-a.time
            })
            this.setData({
                list:data
            })
            wx.hideLoading()
            this.getStarList()
        })
    },
    // 获取收藏的帖子列表
    getStarList(){
        db.collection('circlestars').where({
            _openid:wx.getStorageSync('openid')
        }).get().then(res=>{
            let data=res.data.map(item=>{
                return item.circleid
            })
            this.setData({
                starList:data
            })
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