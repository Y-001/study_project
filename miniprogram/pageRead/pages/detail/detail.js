// pages/detail/detail.js
import {ajax} from '../../../utils/index';
let timer=null;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        /* 是否展示底部弹出层 */
        write: false,
        submit:false,
        comment:"",
        addBookshelfIcon:[
            {
                icon:'../../images/detail-add.png',
                text:'加入书架'
            },
            {
                icon:'../../images/detail-success.png',
                text:'从书架移除'
            }
        ],
        book:{}
    },
    /* 加入书架操作 */
    addBookshelf(e){
        const addBookshelfIcon=this.data.addBookshelfIcon;
        let last=addBookshelfIcon.pop()
        addBookshelfIcon.unshift(last)
        this.setData({
            addBookshelfIcon
        })
    },
    /* 去阅读页面 */
    toRead(e){
        wx.navigateTo({
          url: '/pageRead/pages/read/read',
        })
    },
    /* 发布评论按钮 */
    submiteComment(e){
        this.onClose()
    },
    /* input写评论 */
    writeComment(e){
        //console.log(e.detail.value)
        if(timer) clearTimeout(timer);
        timer=setTimeout(()=>{
            this.setData({
                submit:true,
                comment:e.detail.value
            })
        },1000)
    },
    /* 展示弹出层 */
    showWrite(e){
        this.setData({
            write:true
        })
    },
    /* 关闭弹出层 */
    onClose() {
        this.setData({ 
            write: false,
            submit:false,
            comment:''
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        const { _id } = options;
        // console.log(_id)
        //获取书籍详细信息
        const{data}=await ajax('/book/detial','GET',_id)
        if(data.status=='success'){
            this.setData({
                book:data.data[0]
            })
        }else{
            wx.showToast({
              title: '网络错误',
              icon:'none'
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