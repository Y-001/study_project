// pages/detail/detail.js
import { dealComment, generateUuid,dateFormat } from '../../../utils/index'
const db = wx.cloud.database()
const _ = db.command
let timer = null;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //是否已经是学习计划中
        isPlan:false,
        //父评论
        fatherRoot: 'root',
        /* 是否展示底部弹出层 */
        write: false,
        //发布按钮是否出现
        submit: false,
        // 回复或者投诉
        applyShow: false,
        //查看全部评论
        commentShow: false,

        dianzanIcon: [
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
        //评论的内容
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
        book: {},
        //评论列表
        commentList: [],
        //当前点击的评论 需要回复的
        newComment: {},
        //当前点击查看的评论
        lookComment: {}

    },
    // 点赞操作
    qxdianzan(e){
        let {comment}=e.currentTarget.dataset;
        let openid=wx.getStorageSync('openid');
        console.log(comment)
        let list=comment.likeuserlist.filter(item=>{
            return item!=openid
        })
        db.collection('booklists').where({
            comments:{
                commentid:comment.commentid
            }
        }).update({
            data:{
                'comments.$.likenum': _.inc(-1),
                'comments.$.likeuserlist': list
            }
        }).then(res=>{
            wx.showToast({
              title: '取消点赞成功',
              icon:'none'
            })
            this.getBookInfo()
        })
    },
    // 取消点赞
    dianzan(e){
        let {commentid}=e.currentTarget.dataset;
        console.log(commentid)
        db.collection('booklists').where({
            comments:{
                commentid:commentid
            }
        }).update({
            data:{
                'comments.$.likenum': _.inc(1),
                'comments.$.likeuserlist': _.push(wx.getStorageSync('openid'))
            }
        }).then(res=>{
            wx.showToast({
              title: '点赞成功',
              icon:'none'
            })
            this.getBookInfo()
        })
    },
    /* 加入收藏操作 */
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
            if(this.data.isPlan==true){
                wx.showToast({
                  title: '经典在学习计划中不可移除',
                  icon:'none'
                })
                return
            }
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
        let { fatherRoot, comment, book } = this.data;
        if (this.data.newComment['commentid']) {
            fatherRoot = this.data.newComment.commentid
        }
        let commentid = generateUuid()
        this.onCloseWrite();
        if (!comment) {
            wx.showToast({
                title: '请填写评论内容',
                icon: 'none'
            })
            return
        }
        let userInfo = JSON.parse(wx.getStorageSync('userInfo'))
        let openid = wx.getStorageSync('openid')
        let time = new Date().getTime()
        let likenum = 0
        let likeuserlist=[]
        let bookid = book._id
        let params = {
            fatherRoot,
            openid,
            time,
            likenum,
            comment,
            nickname: userInfo.nickName,
            avatar: userInfo.avatar,
            commentid,
            likeuserlist
        }
        let param = []
        db.collection('booklists').doc(bookid).get().then(res => {
            if (!res.data['comments']) {
                param.push(params)
            } else {
                res.data.comments.push(params)
                param = res.data.comments
            }
            db.collection('booklists').doc(bookid).update({
                data: {
                    comments: param
                }
            }).then(res => {
                wx.showToast({
                    title: '评论成功',
                    icon: 'none'
                })
                this.getBookInfo()
            })
        })
    },
    // 获取书籍信息
    getBookInfo(){
        //获取书籍详细信息
        db.collection('booklists').doc(this.data.book._id).get().then(res => {
            let list = dealComment(res.data.comments)
            console.log(list)
            this.setData({
                commentList: list
            })
        })
    },
    /* input写评论 */
    writeComment(e) {
        // console.log(e.detail.value)
        let comment = e.detail.value
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            this.setData({
                submit: true,
                comment
            })
        }, 300)
    },
    /* 展示弹出层 */
    showWrite(e) {
        this.setData({
            write: true,
            applyShow: false,
            commentShow: false
        })
    },
    // 回复
    openApply(e) {
        let { root } = e.currentTarget.dataset
        this.setData({
            applyShow: true,
            write: false,
            commentShow: false,
            newComment: root
        })
    },
    // 查看
    openComment(e) {
        let { comment } = e.currentTarget.dataset
        // console.log(comment)
        this.setData({
            commentShow: true,
            write: false,
            applyShow: false,
            lookComment: comment
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
    onCloseApply() {
        this.setData({
            applyShow: false
        })
    },
    onCloseComment() {
        this.setData({
            commentShow: false
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
            //输出评论格式化后的
            console.log('评论啊')
            // console.log(res.data.comments)
            let list = dealComment(res.data.comments)
            console.log(list)
            this.setData({
                commentList: list
            })
        })
        // 获取此本书是否已被列入学习计划
        db.collection('users').where({
            _openid:wx.getStorageSync('openid')
        }).get().then(res=>{
            let planbookid=res.data[0].studyplan.bookid
            if(id==planbookid){
                this.setData({
                    isPlan:true
                })
            }
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