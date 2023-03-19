const db = wx.cloud.database()
const _ = db.command

Page({

    /**
     * 页面的初始数据
     */
    data: {
        //书籍详情
        book: {},
        //章节内容
        content: '',
        //当前第几章
        no: 1,
        maxno: 3,
        //章节列表
        bookchapter: [],
        /* 是否打开控制页面 */
        control: false,
        /* 更换背景颜色 */
        background: ['#f6f6f6', '#c9cfc1', '#90a07d', '#141722'],
        item: 0,
        /* 字体大小 */
        fontsize: '36rpx',
        /* 字体间距 */
        lineheight: 'normal',
        /* 加入书架 */
        star: [
            {
                icon: '../../images/read-dui.png',
                text: '已收藏'
            },
            {
                icon: '../../images/read-add.png',
                text: '加入收藏'
            }
        ],
        /* 打开目录 */
        show: false
    },
    /* 关闭目录 */
    onCloseBookshelf(e) {
        this.setData({
            show: false
        })
    },
    /* 打开目录 */
    getBooklet(e) {
        this.setData({
            control: false,
            show: true
        })
    },
    // 根据目录切换章节
    getChapter(e) {
        let { chapter } = e.target.dataset
        this.setData({
            content: chapter.content,
            no: chapter.no,
            show: false
        })
    },
    // 上一章下一章
    goNextChapter(e) {
        let { num } = e.currentTarget.dataset
        num = Number(num)
        let { no, maxno } = this.data
        if (num == 1) {
            if (no == maxno) {
                wx.showToast({
                    title: '已经是最后一章',
                    icon: 'none'
                })
                return
            }
        }
        if (num == -1) {
            if (no == 1) {
                wx.showToast({
                    title: '已经是第一章',
                    icon: 'none'
                })
                return
            }
        }
        no = no + num;
        let content = ''
        this.data.bookchapter.forEach(item => {
            if (item.no == no) {
                content = item.content
            }
        })
        this.setData({
            no,
            content
        })
    },
    /* 加入书架 收藏 */
    addBookshelf(e) {
        let _this=this
        const star = this.data.star;
        if (star[0].text == '加入收藏') {
            db.collection('bookstars').add({
                data: {
                    bookid: this.data.book._id,
                    bookname: this.data.book.name,
                    studytime: 0,
                    createtime: new Date().getTime(),
                }
            }).then(res => {
                wx.showToast({
                    title: '加入收藏成功',
                    icon: 'none'
                })
                // console.log(_this.data.book._id)
                db.collection('booklists').doc(_this.data.book._id).update({
                    data:{
                        like:_.inc(1)
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
        if (star[0].text == '已收藏') {
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
        let last = star.pop()
        star.unshift(last)
        this.setData({
            star
        })
    },
    /* 存入本地缓存的函数 control */
    addControl(name, val) {
        let control = wx.getStorageSync('control')
        if (control) {
            control[name] = val
        } else {
            control = {}
            control[name] = val
        }
        wx.setStorageSync('control', control)
    },
    /* 改变间距 */
    changeFontLine(e) {
        let { item } = e.target.dataset
        let { lineheight } = this.data
        if (item == 0) {
            lineheight = 'normal'
        } else if (item == 1) {
            lineheight = '70rpx'
        } else {
            lineheight = '90rpx'
        }
        this.setData({
            lineheight
        })
        this.addControl('lineheight', lineheight)
    },

    toBookStore() {
        wx.switchTab({
            url: '/pages/store/store',
        })
    },
    toDetail(e) {
        let id = this.data.book._id
        wx.navigateTo({
            url: '/pageRead/pages/detail/detail?id=' + id,
        })
    },
    toNotes(e) {
        wx.navigateTo({
            url: '/pageNote/pages/notes/notes',
        })
    },
    /* 改变字号 */
    changeFontSize(e) {
        /* 
        item:0减小一个字号  1增大字号
        */
        let { item } = e.target.dataset
        let { fontsize } = this.data
        let size = 36
        console.log(item)
        if (item == 1) {
            size = parseInt(fontsize) + 2
            fontsize = size + 'rpx'
        } else {
            size = parseInt(fontsize) - 2
            fontsize = size + 'rpx'
        }
        this.setData({
            fontsize
        })
        this.addControl('fontsize', fontsize)
    },
    /* 切换颜色 */
    changeColor(e) {
        let item = e.target.dataset.item
        this.setData({
            item,
            control: false
        })
        this.addControl('backgroundnum', item)
    },
    /* 打开控制弹窗 */
    openContral(e) {
        this.setData({
            control: true
        })
    },
    /* 控制-控制弹窗关闭 */
    onClose() {
        this.setData({
            control: false
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let id = options.id
        //获取书籍详情
        db.collection('booklists').doc(id).get().then(res => {
            let name = res.data.name
            res.data.name = name.match(/《(.*?)》/g)[0].replace("《", '').replace("》", '')
            this.setData({
                book: res.data,
                content: res.data.desc
            })
            //更换导航栏名字
            wx.setNavigationBarTitle({
                title: res.data.name,
                fail: function () {
                    //todo 显示错误页面
                }
            });
            //获取书籍目录
            if (this.data.bookchapter.length <= 0) {
                db.collection('bookchapters').orderBy('no', 'asc').where({
                    // name:this.data.book.name
                    name: db.RegExp({
                        //以name为关键字进行匹配
                        regexp: this.data.book.name,
                        //输入框输入的内容
                        options: 'i',
                        //大小写不区分
                    })
                }).get().then(res => {
                    // console.log(res)
                    this.setData({
                        bookchapter: res.data,
                        maxno: res.data.length
                    })
                })
            }
            //获取书籍是否被收藏
            db.collection('bookstars').where({
                _openid: wx.getStorageSync('openid'),
                bookid: res.data._id
            }).get()
                .then(res => {
                    // console.log(res)
                    if (res.data.length > 0) {
                        const star = this.data.star;
                        let last = star.pop()
                        star.unshift(last)
                        this.setData({
                            star
                        })
                    }
                })
        })

        // 阅读设置
        let control = wx.getStorageSync('control')
        if (control) {
            if ("fontsize" in control) {
                this.setData({
                    fontsize: control.fontsize
                })
            }
            if ("backgroundnum" in control) {
                this.setData({
                    item: control.backgroundnum
                })
            }
            if ("lineheight" in control) {
                this.setData({
                    lineheight: control.lineheight
                })
            }
        }
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