// pages/detail/detail.js
const db = wx.cloud.database()
const _ = db.command
let timer = null;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        status: {
            /* 是否展示底部弹出层 */
            write: false,
            //发布按钮是否出现
            submit: false,
            // 回复或者投诉
            applyShow: false,
            //查看全部评论
            commentShow: false
        },
        dianzanIcon:[
            {
                icon: '../../images/dianzan.png',
                text: '点赞'
            },
            {
                icon: '../../images/dianzana.png',
                text: '已点赞'
            }
        ],
        openid: '',
        comment: "",
        addBookshelfIcon: [
            {
                icon: '../../images/detail-add.png',
                text: '加入收藏'
            },
            {
                icon: '../../images/detail-success.png',
                text: '从收藏移除'
            }
        ],
        book: {}
    },
    /* 加入书架操作 */
    addBookshelf(e) {
        let _this = this
        const addBookshelfIcon = this.data.addBookshelfIcon;
        if (addBookshelfIcon[0].text == '加入收藏') {
            db.collection('bookstars').add({
                data: {
                    bookid: this.data.book._id,
                    bookname: this.data.book.name,
                    studytime: 0,
                    createtime: new Date().getTime(),
                }
            }).then(res => {
                wx.showToast({
                    title: '收藏成功',
                    icon: 'none'
                })
                // console.log(_this.data.book._id)
                db.collection('booklists').doc(_this.data.book._id).update({
                    data: {
                        like: _.inc(1)
                    }
                })
            }).catch(res => {
                wx.showToast({
                    title: '收藏失败',
                    icon: 'none'
                })
                return
            })
        }
        if (addBookshelfIcon[0].text == '从收藏移除') {
            db.collection('bookstars').where({
                bookid: this.data.book._id,
                _openid: this.data.openid
            }).remove().then(res => {
                wx.showToast({
                    title: '移除成功',
                    icon: 'none'
                })
            }).catch(res => {
                wx.showToast({
                    title: '移除失败',
                    icon: 'none'
                })
                return
            })
        }
        let last = addBookshelfIcon.pop()
        addBookshelfIcon.unshift(last)
        this.setData({
            addBookshelfIcon
        })
    },
    /* 去阅读页面 */
    toRead(e) {
        let { id } = e.currentTarget.dataset
        // console.log(name)
        wx.navigateTo({
            url: '/pageRead/pages/read/read?id=' + id,
        })
    },
    /* 发布评论按钮 */
    submiteComment(e) {
        this.onClose()
    },
    /* input写评论 */
    writeComment(e) {
        //console.log(e.detail.value)
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            this.setData({
                submit: true,
                comment: e.detail.value
            })
        }, 1000)
    },
    /* 展示弹出层 */
    showWrite(e) {
        this.setData({
            write: true
        })
    },
    openApply(){
        this.setData({
            applyShow:true
        })
    },
    openComment(){
        this.setData({
            commentShow:true
        })
    },
    /* 关闭弹出层 */
    onCloseWrite() {
        this.setData({
            write: false,
            submit: false,
            comment: ''
        });
    },
    onCloseApply(){
        this.setData({
            applyShow:false
        })
    },
    onCloseComment(){
        this.setData({
            commentShow:false
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        this.setData({
            openid: wx.getStorageSync('openid')
        })
        const { id } = options;
        // console.log(id)
        //获取书籍详细信息
        db.collection('booklists').doc(id).get().then(res => {
            // console.log(res.data)
            let name = res.data.name.match(/《.*?》/g)[0].replace("《", '').replace("》", '')
            res.data.name = name
            this.setData({
                book: res.data
            })
            //获取书籍是否被收藏
            db.collection('bookstars').where({
                _openid: this.data.openid,
                bookid: res.data._id
            }).get()
                .then(res => {
                    // console.log(res)
                    if (res.data.length > 0) {
                        let addBookshelfIcon = this.data.addBookshelfIcon
                        let last = addBookshelfIcon.pop()
                        addBookshelfIcon.unshift(last)
                        this.setData({
                            addBookshelfIcon
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