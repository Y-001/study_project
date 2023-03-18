// pages/classify/classify.js
let timer=null
Page({

    /**
     * 页面的初始数据
     */
    data: {
        /* 搜索框的输入 */
        search:'',
        /* 展示loading还是done */
        show:true,
        /* 搜索历史 */
        searchLog:[],
        active: 0,
        books:[
            {
                image:'../../images/test_img3.jpg',
                name:'本草纲目',
                author:'李时珍',
                desc:'简介你有啥不啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊',
                classify:'伤寒',
                num:'180万'
            },
            {
                image:'../../images/test_img2.jpg',
                name:'wuyu',
                author:'nihao',
                desc:'简介你有啥不啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊',
                classify:'伤寒',
                num:'180万'
            }
        ],
    },
    /* 清空搜索历史 */
    deleteLog(e){
        this.setData({
            searchLog:[]
        })
        wx.removeStorageSync('searchLog')
    },
    /* 搜索过程 */
    searchChange(e){
        //console.log(e.detail)
        if(timer) clearTimeout(timer)
        timer=setTimeout(()=>{
            let search=e.detail
            this.setData({
                search
            })
            let searchLog=wx.getStorageSync('searchLog');
            if(!!search){
                if(searchLog){
                    searchLog.unshift(search)
                }
                else{
                    searchLog=[search]
                }
                wx.setStorageSync('searchLog', searchLog)
                this.setData({
                    searchLog
                })
            }
        },1000)
    },
    /* 按下搜索按钮 */
    searchDone(e){
        this.setData({
            show:false
        })
    },
    /* 切换标签 */
    onChange(event) {
        wx.showToast({
          title: `切换到标签 ${event.detail.name}`,
          icon: 'none',
        });
      },
      /* 去详情页 */
    toDetail(e){
        wx.navigateTo({
          url: '/pageRead/pages/detail/detail',
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let searchLog=wx.getStorageSync('searchLog')
        if(searchLog){
            this .setData({
                searchLog
            })
        }
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