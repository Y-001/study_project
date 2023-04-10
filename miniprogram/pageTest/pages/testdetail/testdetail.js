// pages/testdetail/testdetail.js
const db=wx.cloud.database()
const _=db.command
Page({

    /**
     * 页面的初始数据
     */
    data: {
        classify:'',
        isStarClassify:false
    },
    // 去顺序页面
    toShunxu(e){
        wx.navigateTo({
          url: '/pageTest/pages/shunxu/shunxu?classify='+encodeURIComponent(this.data.classify),
        })
    },
    toRanking(e){
        wx.navigateTo({
          url: '/pageTest/pages/ranking/ranking',
        })
    },
    // 去题型选择页面
    toTxlx(){
        wx.navigateTo({
          url: '/pageTest/pages/txlx/txlx?classify='+encodeURIComponent(this.data.classify),
        })
    },
    // 去背题页面
    toBeitu(e){
        // console.log(e)
        let {type}=e.currentTarget.dataset
        let page=''
        if(type==0){
            page='背题模式'
        }
        if(type==1){
            page='收藏夹'
        }
        wx.navigateTo({
            url: '/pageTest/pages/beiti/beiti?classify='+encodeURIComponent(this.data.classify)+"&pageType="+encodeURIComponent(page),
          })
    },
    // 去错题页面
    toErrorlist(e){
        wx.navigateTo({
            url: '/pageTest/pages/errorlist/errorlist?classify='+encodeURIComponent(this.data.classify),
          })
    },
    // 去模拟考试
    toExamBegin(e){
        wx.navigateTo({
            url: '/pageTest/pages/exambegin/exambegin?classify='+encodeURIComponent(this.data.classify),
          })
    },
    // 收藏此题库
    starClassify(){
        if(this.data.isStarClassify){
            wx.showToast({
              title: '已收藏',
              icon:'none'
            })
            return
        }
        let time=new Date().getTime()
        db.collection('users').where({
            _openid:wx.getStorageSync('openid')
        }).update({
            data:{
                question:{
                    starClassify:_.push({classify:this.data.classify,time:time})
                }
            }
        }).then(res=>{
            wx.showToast({
              title: '收藏成功',
              icon:'none'
            })
            this.setData({
                isStarClassify:true
            })
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let classify=decodeURIComponent(options.classify)
        // console.log(classify)
        this.setData({
            classify
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
        db.collection('users').where({
            _openid:wx.getStorageSync('openid')
        }).get().then(res=>{
            let list=res.data[0].question?.starClassify
            if(list){
                list.forEach(item=>{
                    if(item.classify==this.data.classify){
                        this.setData({
                            isStarClassify:true
                        })
                    }
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