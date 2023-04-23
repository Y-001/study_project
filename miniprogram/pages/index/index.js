import { dateFormat } from '../../utils/index'
const db = wx.cloud.database()
const _ = db.command
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 轮播图配置
        background: [
            'cloud://project-4gak2jnr9bdf0df2.7072-project-4gak2jnr9bdf0df2-1307359075/swiper/lb005.jpg',
            'cloud://project-4gak2jnr9bdf0df2.7072-project-4gak2jnr9bdf0df2-1307359075/swiper/lb001.jpg', 
            ],
        indicatorDots: true,
        vertical: false,
        autoplay: false,
        interval: 2000,
        duration: 500,
        // 经典收藏的列表
        starList: [],
        //学习计划
        studyplan:{
            studytime:0,
            studyday:0,
            bookname:'暂无学习计划'
        },
        //今日学习时长
        todyTime:0,
        //是否完成今日学习
        doneTody:false,
        //最近阅读
        lastRead:[]
    },
    //开始学习
    toReadDetail(){
        if(!this.data.studyplan?.bookid){
            wx.showToast({
              title: '请先去添加学习计划',
              icon:'none'
            })
            return
        }
        wx.redirectTo({
            url: `/pageRead/pages/read/read?way=3&id=${this.data.studyplan.bookid}`,
        })
    },
    toXcjh() {//计划
        wx.navigateTo({
            url: '/pageStudy/pages/xcjh/xcjh',
        })
    },
    toXcqd() {//签到
        wx.navigateTo({
            url: '/pageStudy/pages/xcqd2/xcqd2',
        })
    },
    toXcsj() {//数据
        wx.navigateTo({
            url: '/pageStudy/pages/xcsj/xcsj',
        })
    },
    toNote() {
        wx.navigateTo({
            url: '/pageNote/pages/notes/notes',
        })
    },
    toTest() {
        wx.switchTab({
            url: '/pages/question/question',
        })
    },
    toDetail(e) {
        let id=e.currentTarget.dataset.id
        wx.navigateTo({
            url: '/pageRead/pages/detail/detail?id='+id,
        })
    },
    toStore() {
        wx.switchTab({
            url: '/pages/store/store',
        })
    },
    // 刷新数据
    toShaxun(){
        let _this=this
        //获取收藏经典列表
        db.collection('bookstars').where({
            _openid: wx.getStorageSync('openid')
        }).get().then(res => {
            res.data.forEach(item => {
                item.createtime = dateFormat(item.createtime)
            })
            this.setData({
                starList: res.data
            })
        })
        //获取学习计划
        db.collection('users').where({
            _openid:wx.getStorageSync('openid')
        }).get().then(res=>{
            if(res.data[0]?.lastRead){
                _this.setData({
                    lastRead:res.data[0].lastRead
                })
            }
            if(res.data[0]?.studyplan){
                _this.setData({
                    studyplan:res.data[0].studyplan,
                })
                let day=dateFormat(+new Date())
            if(res.data[0].studyplan?.calendar){
                res.data[0].studyplan.calendar.forEach(item=>{
                    if(item.day==day){
                        _this.setData({
                            todyTime:item.stayTime,
                            doneTody:item.progress
                        })
                    }
                })
            }
            }
            
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let _this=this
        let openid = wx.getStorageSync('openid')
        if (!openid) {
            wx.cloud.callFunction({ //  调用云函数获取openid
                name: 'getOpenid',
                complete: res => {
                    //   openid = res.result.openid;
                    // console.log(res)
                    wx.setStorageSync('openid', res.result.openid)
                }
            })
        }
        // 判断是否登录
        let userInfo=wx.getStorageSync('userInfo')
        if(!userInfo){
            wx.reLaunch({
              url: '/pages/login/login',
            })
        }else{
            db.collection('users').where({
                _openid:wx.getStorageSync('openid')
            }).get().then(res=>{
                if(res.data.length==0){
                    wx.reLaunch({
                        url: '/pages/login/login',
                      })
                }
            })
        }
        this.toShaxun()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        // this.onLoad()
        this.toShaxun()
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})