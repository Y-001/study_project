import { dateFormat } from '../../../utils/index';
const db = wx.cloud.database();
const _ = db.command;
var way='';
var newBookId='';
var isStar=false;

var startTime,
    endTime,
    app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //判断是怎样进入阅读页面的
        way: '',//0 没收藏进来的 1 收藏进来的  3 学习进来的
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
                icon: '../../images/read-add.png',
                text: '加入收藏'
            },
            {
                icon: '../../images/read-dui.png',
                text: '已收藏'
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
        let _this = this
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
        // console.log(options)
        let id = options.id
         newBookId=id
         way = options.way
        //获取书籍详情
        db.collection('booklists').doc(id).get().then(res => {
            let name = res.data.name
            res.data.name = name.match(/《(.*?)》/g)[0].replace("《", '').replace("》", '')
            let lastname=res.data.name
            let desc=res.data.desc
            res.data.desc=desc.replace(/。/g,'。\n&nbsp;&nbsp;').replace(/<*strong>/g,'')
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
            //添加最近阅读
            db.collection('users').where({
                _openid:wx.getStorageSync('openid')
            }).get().then(res=>{
                if('lastRead' in res.data[0]){
                    if(res.data[0].lastRead.indexOf(lastname)>=0) return
                    res.data[0].lastRead.push(lastname)
                }else{
                    res.data[0].lastRead=[lastname]
                }
                db.collection('users').where({
                    _openid:wx.getStorageSync('openid')
                }).update({
                    data:{
                        lastRead:res.data[0].lastRead
                    }
                }).then(res=>{
                    console.log('添加最近阅读成功')
                })
            })
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
                    res.data.forEach(item=>{
                        let content=item.content
                        item.content=content.replace(/。/g,'。\n&nbsp;&nbsp;').replace(/<*strong>/g,'')
                    })
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
                        isStar=true
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
        console.log('read页面显示')
        setTimeout(function () {
            startTime = +new Date();
            // console.log(startTime)
        }, 100)

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        console.log('read页面隐藏')
        setTimeout(function () {
            endTime = +new Date();
            console.log("demo页面停留时间：" + (endTime - startTime))
            let stayTime = Math.round((endTime - startTime)/(60*1000));
            let day = dateFormat(startTime)
            const calendar = {
                stayTime,
                day,
                progress:false
            }
            console.log(stayTime)
            // console.log(calendar)
            //这里获取到页面停留时间stayTime，然后了可以上报了
            if(stayTime>2){
                //把停留时间放在收藏中
            if(isStar){
                db.collection('bookstars').where({
                    bookid:newBookId
                }).update({
                    data:{
                        studytime:_.inc(stayTime)
                    }
                }).then(res=>{
                    console.log('更新收藏图书的停留时间'+stayTime)
                })
            }
            //把停留时间放在学习计划中
                if (way == '3') {
                    let isSomeDay=-1
                    db.collection('users').where({
                        _openid: wx.getStorageSync('openid')
                    }).get().then(res => {
                        let {studyplan} = res.data[0]
                        // if('calendar' in studyplan){
                        if(Reflect.has(studyplan,"calendar")){
                            if(studyplan.calendar.length>0){
                                studyplan.calendar.forEach((item,index)=>{
                                    if(item.day==calendar.day){
                                        isSomeDay=index
                                        calendar.stayTime+=item.stayTime
                                        if(calendar.stayTime==studyplan.studytime){
                                            calendar.progress=true
                                        }
                                    }
                                })
                            }
                            if(isSomeDay>=0) studyplan.calendar.splice(isSomeDay,1)
                            studyplan.calendar.push(calendar)
                            db.collection('users').where({
                                _openid:wx.getStorageSync('openid')
                            }).update({
                                data:{
                                    studyplan:{
                                        calendar:studyplan.calendar
                                    }
                                }
                            }).then(res=>{
                                console.log('更新记录成功')
                            })
                        }else{
                            db.collection('users').where({
                                _openid:wx.getStorageSync('openid')
                            }).update({
                                data:{
                                    studyplan:{
                                        calendar:[calendar]
                                    }
                                }
                            }).then(res=>{
                                console.log('插入记录成功')
                            })
                        }
                    })
                }
            }
        }, 100)

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload:  async function () {
        console.log('read页面卸载')
         setTimeout( function () {
            endTime = +new Date();
            console.log("demo页面停留时间：" + (endTime - startTime))
            // var stayTime = endTime - startTime;
            let stayTime = Math.round((endTime - startTime)/(60*1000));
            let day = dateFormat(startTime)
            const calendar = {
                stayTime,
                day,
                progress:false
            }
            console.log(stayTime)
            //这里获取到页面停留时间stayTime，然后了可以上报了
            if(stayTime>2){
                //把停留时间放在收藏中
            if(isStar){
                db.collection('bookstars').where({
                    bookid:newBookId
                }).update({
                    data:{
                        studytime:_.inc(stayTime)
                    }
                }).then(res=>{
                    console.log('更新收藏图书的停留时间'+stayTime)
                })
            }
            //把停留时间放在学习计划中
                if (way == '3') {
                    let isSomeDay=-1
                    db.collection('users').where({
                        _openid: wx.getStorageSync('openid')
                    }).get().then(res => {
                        let {studyplan} = res.data[0]
                        // if('calendar' in studyplan){
                        if(Reflect.has(studyplan,"calendar")){
                            if(studyplan.calendar.length>0){
                                studyplan.calendar.forEach((item,index)=>{
                                    if(item.day==calendar.day){
                                        isSomeDay=index
                                        calendar.stayTime+=item.stayTime
                                        if(calendar.stayTime==studyplan.studytime){
                                            calendar.progress=true
                                        }
                                    }
                                })
                            }
                            if(isSomeDay>=0) studyplan.calendar.splice(isSomeDay,1)
                            studyplan.calendar.push(calendar)
                            db.collection('users').where({
                                _openid:wx.getStorageSync('openid')
                            }).update({
                                data:{
                                    studyplan:{
                                        calendar:studyplan.calendar
                                    }
                                }
                            }).then(res=>{
                                console.log('更新记录成功')
                            })
                        }else{
                            db.collection('users').where({
                                _openid:wx.getStorageSync('openid')
                            }).update({
                                data:{
                                    studyplan:{
                                        calendar:[calendar]
                                    }
                                }
                            }).then(res=>{
                                console.log('插入记录成功')
                            })
                        }
                    })
                }
            }
        }, 100)
        
        // 获取当前页面
        // const pages = getCurrentPages();
        // // 获取上一级页面
        // const beforePage = pages[pages.length - 2];
        
        // beforePage.setData({ //直接修改上个页面的数据（可通过这种方式直接传递参数）
        //     backRefresh: true  //函数封装，传值为true时调接口刷新页面
        // })

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