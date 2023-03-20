// pages/notes/notes.js
import {dateFormat} from '../../../utils/index'
const db=wx.cloud.database()
const _=db.command
Page({

    /**
     * 页面的初始数据
     */
    data: {
        active:'全部',
        noteList:[],
        classifyList:[]
    },
    changeClassify(e){
        let active=e.currentTarget.dataset.name
        this.setData({
            active
        })
        if(active=='全部'){
            this.onLoad()
        }else{
            db.collection('notes').where({
                _openid:wx.getStorageSync('openid'),
                classify:active
            }).get().then(res=>{
                res.data.forEach(item=>{
                    item.createtime=dateFormat(item.createtime)
                })
                this.setData({
                    noteList:res.data
                })
            })
        }
        
    },
    toNotedetail(e){
        wx.navigateTo({
          url: '/pageNote/pages/notedetail/notedetail',
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        //获取笔记
        db.collection('notes').where({
            _openid:wx.getStorageSync('openid')
        }).get().then(res=>{
            // console.log(res.data)
            let list=[]
            res.data.forEach(item=>{
                list.push(item.classify)
                item.createtime=dateFormat(item.createtime)
            })
            // console.log(list)
            this.setData({
                classifyList:[...new Set(list)],
                noteList:res.data
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