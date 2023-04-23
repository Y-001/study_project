// pageStudy/pages/xcxz/xcxz.js
const db=wx.cloud.database()
const _=db.command
Page({

    /**
     * 页面的初始数据
     */
    data: {
        prizeList:[
            {
                img:'cloud://project-4gak2jnr9bdf0df2.7072-project-4gak2jnr9bdf0df2-1307359075/grade/21.png',
                text:'坚持不懈',
                score:5,
            },
            {
                img:'cloud://project-4gak2jnr9bdf0df2.7072-project-4gak2jnr9bdf0df2-1307359075/grade/50.png',
                text:'聚沙成塔',
                score:50,
            },
            {
                img:'cloud://project-4gak2jnr9bdf0df2.7072-project-4gak2jnr9bdf0df2-1307359075/grade/1000.png',
                text:'天道酬勤',
                score:1000,
            },
            {
                img:'cloud://project-4gak2jnr9bdf0df2.7072-project-4gak2jnr9bdf0df2-1307359075/grade/2000.png',
                text:'学富五车',
                score:2000,
            },
        ],
        score:0,//总积分
        lqprize:[],//领取的奖项
        pdprize:"",//已佩戴的奖项
    },
    // 领取勋章
    lqPrzie(e){
        let {lqprize,prizeList,score}=this.data
        let text=e.currentTarget.dataset.text
        if(lqprize.includes(text)) return
        let currentPrize=prizeList.filter(item=>{
            return item.text==text
        })[0]
        // console.log(currentPrize)
        if(score<currentPrize.score){
            wx.showToast({
                title: '请加油学习获取哦~',
                icon:'none'
            })
            return
        }
        db.collection('users').where({
            _openid:wx.getStorageSync('openid')
        }).update({
            data:{
                lqprize:_.push(text)
            }
        }).then(res=>{
            wx.showToast({
                title: '领取成功~',
                icon:'none'
            })
            this.onLoad()
        })
    },
    // 佩戴勋章
    pdPrize(e){
        let {lqprize,pdprize}=this.data
        let text=e.currentTarget.dataset.text
        if(text==pdprize) return
        let isCan=lqprize.includes(text)
        if(!isCan) return
        db.collection('users').where({
            _openid:wx.getStorageSync('openid')
        }).update({
            data:{
                pdprize:text
            }
        }).then(res=>{
            wx.showToast({
              title: '佩戴成功',
              icon:'none'
            })
            this.onLoad()
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        let res=await db.collection('users').where({
            _openid:wx.getStorageSync('openid')
        }).get()
        let lqprize=res.data[0]?.lqprize || []
        let pdprize=res.data[0]?.pdprize || ""
        let score=res.data[0]?.score || 0
        this.setData({
            lqprize,
            pdprize,
            score
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