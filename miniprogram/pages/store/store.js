// pages/store/store.js
import {ajax} from '../../utils/index';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        background: ['../../images/book_lb1.jpg', '../../images/book_lb2.jpg', '../../images/book_lb3.jpg'],
        books:[
            // {
            //     image:'../../images/test_img1.jpg',
            //     name:'本草纲目',
            //     author:'李时珍',
            //     desc:'纪称∶望龙光，知古剑；觇宝气，辨明珠。故萍实商羊，非天明莫洞。厥后博物称华，辨字称康，析宝玉称倚顿，亦仅仅晨星耳。楚蕲阳李君东璧，一日过予山园谒予，留饮数有《本草纲目》数十卷。谓予曰∶时珍，荆楚鄙人也。幼多羸疾，质成钝椎；长耽典籍，若啖蔗饴。遂渔猎群书，搜罗百氏。',
            //     classify:'本草',
            //     num:'8万'
            // },
        ],
        hotBooksList:[]
    },
    toSearch(){
        wx.navigateTo({
          url: '/pageRead/pages/search/search',
        })
    },
    toDetail(e){
        let {id}=e.currentTarget.dataset
        wx.navigateTo({
          url: `/pageRead/pages/detail/detail?_id=${id}`,
        })
    },
    toClassify(e){
        wx.navigateTo({
          url: '/pageRead/pages/classify/classify',
        })
    },

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

        // if (typeof this.getTabBar === 'function' && this.getTabBar()) {
        //     this.getTabBar().setData({
        //         select: 1
        //     })
        // }
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