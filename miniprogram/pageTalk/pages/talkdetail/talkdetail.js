// pageTalk/pages/talkdetail/talkdetail.js
import { dealComment, generateUuid, dateFormat } from '../../../utils/index'
const db = wx.cloud.database()
const _ = db.command
let timer = null
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: '',
        info: {},
        openid: wx.getStorageSync('openid'),
        //父评论
        fatherRoot: 'root',
        /* 是否展示底部弹出层 */
        write: false,
        //发布按钮是否出现
        submit: false,
        //评论的内容
        comment: "",
        //评论列表
        commentList: [],
        //当前点击的评论 需要回复的
        newComment: {},
        //当前点击查看的评论
        lookComment: {},
        // 回复或者投诉
        applyShow: false,
        //查看全部评论
        commentShow: false,
        listData: {
            imgUrl: "https://s1.ax1x.com/2022/04/13/LKr6i9.jpg",
        }

    },
    // 点击图片进行预览
    // 点击事件
    previewSqs(event) {
        // 拿到图片的地址url
        let index = event.currentTarget.dataset.index;
        let {info}=this.data
        // 微信预览图片的方法
        wx.previewImage({
            current: info.imgUp[index], // 图片的地址url
            urls: info.imgUp // 预览的地址url
        })
    },
    // 删除当前发布的内容
    delete(){
        let {info}=this.data
        wx.showModal({
          title: '确定删除？',
          content: '',
          complete: (res) => {
            if (res.cancel) {
              
            }
        
            if (res.confirm) {
              db.collection('circles').doc(info._id).remove().then(res=>{
                  wx.showToast({
                    title: '删除成功！',
                    icon:'none'
                  })
                  setTimeout(()=>{
                      wx.redirectTo({
                        url: '/pageTalk/pages/talk/talk',
                      })
                  },500)
              })
            }
          }
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
        // this.setData({
        //     write: true,
        //     applyShow: false,
        //     commentShow: false
        // })
        let sign=e.currentTarget.dataset?.sign
        // console.log(sign)
        if(sign==1){
            this.setData({
                write: true,
                applyShow: false,
                commentShow: false,
                newComment: {}
            })
        }else{
            this.setData({
                write: true,
                applyShow: false,
                commentShow: false,
            })
        }
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
    /* 发布评论按钮 */
    submiteComment(e) {
        let { fatherRoot, comment, info } = this.data;
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
        let like = []
        let params = {
            fatherRoot,
            openid,
            time,
            like,
            comment,
            commentid,
            ...userInfo
        }
        db.collection('circles').doc(info._id).update({
            data: {
                comments: _.push(params)
            }
        }).then(res => {
            wx.showToast({
                title: '评论成功',
                icon: 'none'
            })
            this.getInfo(info._id)
        })
    },
    // 给评论的点赞
    doplStar(e){
        let {sign,com} = e.currentTarget.dataset
        let openid = wx.getStorageSync('openid')
        let info=this.data.info
        if (sign == 0) {
            let like = com.like.filter(item => {
                return openid != item
            })
            db.collection('circles').where({
                _id:info._id,
                "comments.commentid":com.commentid
            }).update({
                data: {
                    'comments.$.like': like
                }
            }).then(res => {
                this.getInfo(info._id)
                wx.showToast({
                    title: '取消点赞成功',
                    icon: 'none'
                })
            })
        }
        if (sign == 1) {
            db.collection('circles').where({
                comments:{
                    commentid:com.commentid
                }
            }).update({
                data: {
                    'comments.$.like': _.push(wx.getStorageSync('openid'))
                }
            }).then(res => {
                this.getInfo(info._id)
                wx.showToast({
                    title: '点赞成功',
                    icon: 'none'
                })
            })
        }
    },
    // 点赞
    doStar(e) {
        let sign = e.currentTarget.dataset.sign
        let { info } = this.data
        let openid = wx.getStorageSync('openid')
        if (sign == 0) {
            let star = info.star.filter(item => {
                return openid != item
            })
            db.collection('circles').doc(info._id).update({
                data: {
                    star: star
                }
            }).then(res => {
                this.getInfo(info._id)
                wx.showToast({
                    title: '取消点赞成功',
                    icon: 'none'
                })
            })
        }
        if (sign == 1) {
            db.collection('circles').doc(info._id).update({
                data: {
                    star: _.push(wx.getStorageSync('openid'))
                }
            }).then(res => {
                this.getInfo(info._id)
                wx.showToast({
                    title: '点赞成功',
                    icon: 'none'
                })
            })
        }

    },
    //获取信息
    getInfo(id) {
        db.collection('circles').doc(id).get().then(res => {
            this.setData({
                info: res.data
            })
            let list = dealComment(res.data.comments)
            console.log(list)
            this.setData({
                commentList: list
            })
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let id = options.id
        this.setData({
            id
        })
        this.getInfo(id)
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