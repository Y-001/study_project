// pages/xcjh/xcjh.js
import {dateFormat,getLaterDate} from '../../../utils/index'
const db=wx.cloud.database()
let timestudy=null
let daystudy=null
Page({

    /**
     * 页面的初始数据
     */
    data: {
        starList:[],
        studytime:20,
        studyday:10,
        donetime:'',
        //已选择的收藏id
        select_id:'',
    },
    //选择计划书
    selectBook(e){
        let {id}=e.currentTarget.dataset
        this.setData({
            select_id:id
        })
    },
    //两个input事件
    changeStudytime(e){
        // console.log(e.detail.value)
        if(timestudy!=null) clearTimeout(timestudy)
        timestudy=setTimeout(()=>{
            this.setData({
                studytime:e.detail.value
            })
        },2000)
    },
    changeStudyday(e){
        if(daystudy!=null) clearTimeout(daystudy)
        daystudy=setTimeout(()=>{
            this.setData({
                studyday:e.detail.value
            })
            this.getDonetime()
        },2000)
    },
    //计算完成天数
    getDonetime(){
        let {studyday,studytime,donetime}=this.data;
        // let time=new Date()
        donetime=getLaterDate(studyday)
        this.setData({
            donetime
        })
    },
    //确认学习计划
    getPlan(){
        let {select_id,studyday,studytime,donetime}=this.data
        db.collection('users').where({
            _openid:wx.getStorageSync('openid')
        }).update({
            data:{
                studyplan:{
                    select_id,studyday,studytime,donetime,
                    createtime:new Date().getTime()
                }
            }
        }).then(res=>{
            console.log(res)
            wx.showToast({
              title: '添加成功',
              icon:'none'
            })
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getDonetime()
        //获取收藏经典列表
        db.collection('bookstars').where({
            _openid: wx.getStorageSync('openid')
        }).get().then(res => {
            res.data.forEach(item=>{
                item.createtime=dateFormat(item.createtime)
            })
            this.setData({
                starList:res.data
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