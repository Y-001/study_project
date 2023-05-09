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
        bookname:"",
        bookid:'',
    },
    // 没有收藏经典的情况
    toStore(){
        wx.switchTab({
          url: '/pages/store/store',
        })
    },
    //选择计划书
    selectBook(e){
        let {id,bookname,bookid}=e.currentTarget.dataset
        this.setData({
            select_id:id,
            bookname,
            bookid
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
        if(this.data.starList.length==0){
            wx.showToast({
              title: '请先去收藏经典',
              icon:'none'
            })
            return
        }
        let {select_id,studyday,studytime,donetime,bookname,bookid}=this.data
        if(!bookid){
            wx.showToast({
              title: '请选择经典',
              icon:'none'
            })
            return
        }
        db.collection('users').where({
            _openid:wx.getStorageSync('openid')
        }).update({
            data:{
                studyplan:{
                    select_id,studyday,studytime,donetime,bookname,bookid,calendar:[],
                    createtime:new Date().getTime()
                }
            }
        }).then(res=>{
            // console.log(res)
            wx.showToast({
              title: '确认学习计划成功',
              icon:'none'
            })
            setTimeout(()=>{
                wx.switchTab({
                  url: '/pages/index/index',
                })
            },500)
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
            //获取学习计划列表
            db.collection('users').where({
                _openid:wx.getStorageSync('openid')
            }).get().then(res=>{
                if('studyplan' in res.data[0]){
                    let {select_id,studyday,studytime,bookname,bookid} =res.data[0].studyplan
                    this.setData({
                        select_id,studyday,studytime,bookname,bookid,
                    })
                }
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