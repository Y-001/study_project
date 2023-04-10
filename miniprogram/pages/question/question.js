// pages/question/question.js
const db=wx.cloud.database()
const _=db.command
Page({

    /**
     * 页面的初始数据
     */
    data: {
        background: ['cloud://project-4gak2jnr9bdf0df2.7072-project-4gak2jnr9bdf0df2-1307359075/swiper/book_lb1.jpg', 'cloud://project-4gak2jnr9bdf0df2.7072-project-4gak2jnr9bdf0df2-1307359075/swiper/book_lb2.jpg', 'cloud://project-4gak2jnr9bdf0df2.7072-project-4gak2jnr9bdf0df2-1307359075/swiper/book_lb3.jpg'],
        // 我的题库
        classifyList:[],
        mingyan:'名言警句： 锲而舍之,朽木不折,锲而不舍,金石可镂。 加油啊！中医人'
    },
    toSelectwarehouse(e){
        wx.navigateTo({
          url: '/pageTest/pages/selectwarehouse/selectwarehouse',
        })
    },
    // 去题库详情
    toTestdetail(e){
        let {item} = e.currentTarget.dataset;
        wx.navigateTo({
            url: '/pageTest/pages/testdetail/testdetail?classify='+encodeURIComponent(item.classify),
          })
    },
    // 去排行榜
    toRanking(){
        wx.navigateTo({
          url: '/pageTest/pages/ranking/ranking',
        })
    },
    // 去考试记录
    toRecordList(){
        wx.navigateTo({
          url: '/pageTest/pages/recordlist/recordlist',
        })
    },
    // 去答题数据
    toAnswerData(){
        wx.navigateTo({
            url: '/pageTest/pages/answerdata/answerdata',
          })
    },
    // 刷新页面数据

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        
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
        db.collection('users').where({
            _openid:wx.getStorageSync('openid')
        }).get().then(res=>{
            if(res.data[0].question){
                this.setData({
                    classifyList:res.data[0].question.starClassify
                })
            }
            if(res.data[0].geqian){
                this.setData({
                    mingyan:res.data[0].geqian
                })
            }
        })
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