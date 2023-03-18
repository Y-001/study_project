Page({

    /**
     * 页面的初始数据
     */
    data: {
        value:'',
        books:[
            {
                image:'../../images/test_img3.jpg',
                name:'伤寒论',
                author:'张仲景',
                desc:'1．太阳之为病，脉浮、头项强痛而恶寒。2．太阳病，发热、汗出、恶风、脉缓者，名为中风。3．太阳病，或已发热，或未发热，必恶寒、体痛、呕逆、脉阴阳俱紧者，名为伤寒。4．伤寒一日，太阳受之。脉若静者，为不传；颇欲吐，若躁烦，脉数急者，为传也。'
            },
            {
                image:'../../images/test_img2.jpg',
                name:'医林改错',
                author:'王清任',
                desc:'医，仁术也。乃或术而无仁，则贪医足以误世；或仁而无术，则庸医足以杀人。古云不服药粤数年，目击此辈甚众，辄有慨乎其中。每遇救急良方，不惜捐资购送。今于癸丑四月，适闻佛山友人有幼子患症，'
            },
            {
                image:'../../images/test_img1.jpg',
                name:'本草纲目',
                author:'李时珍',
                desc:'纪称∶望龙光，知古剑；觇宝气，辨明珠。故萍实商羊，非天明莫洞。厥后博物称华，辨字称康，析宝玉称倚顿，亦仅仅晨星耳。楚蕲阳李君东璧，一日过予山园谒予，留饮数有《本草纲目》数十卷。谓予曰∶时珍，荆楚鄙人也。'
            },
            
        ],
    },
    toSearch(){
        wx.navigateTo({
          url: '/pageRead/pages/search/search',
        })
    },
    toRead(e){
        wx.navigateTo({
          url: '/pageRead/pages/read/read',
        })
    },
    toNotes(e){
        wx.navigateTo({
          url: '/pageRead/pages/notes/notes',
        })
    },
   

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
        // if (typeof this.getTabBar === 'function' && this.getTabBar()) {
        //     this.getTabBar().setData({
        //         select: 0
        //     })
        // }
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