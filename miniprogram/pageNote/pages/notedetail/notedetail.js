// pages/notedetail.js
let timecy = null;
let timet = null;
let timect = null;
const db = wx.cloud.database()
const _ = db.command
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //上传照片临时路径的数组
        imgList: [],
        //是否显示输入框
        inputShow: false,
        //分类列表
        classifyList:[],
        //分类的值
        classify: '',
        title: '',
        content: '',
        classifyA: '',
        //时间对象
        time: {}
    },
    //选择分类
    changeClassify(e){
        let {name}=e.currentTarget.dataset
        this.setData({
            classify:name
        })
    },
    //input分类
    changeClassifyA(e) {
        if (timecy != null) clearTimeout(timecy);
        timecy = setTimeout(() => {
            this.setData({
                classifyA: e.detail.value
            })
        }, 500)
    },
    //input标题
    changeTitle(e) {
        if (timet != null) clearTimeout(timet);
        timet = setTimeout(() => {
            this.setData({
                title: e.detail.value
            })
        }, 1500)
    },
    //input内容
    changeContent(e) {
        if (timect != null) clearTimeout(timect);
        timect = setTimeout(() => {
            this.setData({
                content: e.detail.value
            })
        }, 1500)
    },

    //添加分类类别
    addClassify() {
        this.setData({
            inputShow: !this.data.inputShow,
            classify:''
        })
    },
    //上传照片
    uploadImg() {
        let { imgList } = this.data
        wx.chooseMedia({
            count: 3 - imgList.length,
            mediaType: ['image'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                const { tempFiles } = res;
                tempFiles.forEach(item => {
                    imgList.unshift(item.tempFilePath)
                })
                // console.log(tempFiles)
                this.setData({
                    imgList
                })
            }
        })
    },
    deleteImg(e) {
        let { index } = e.currentTarget.dataset;
        let { imgList } = this.data;
        imgList.splice(index, 1);
        this.setData({
            imgList
        })
    },
    //发布
     publish() {
        let { title, content, classify, classifyA, time, imgList } = this.data
        if (!title) {
            wx.showToast({
                title: '请填写笔记题目',
                icon: 'none'
            })
            return
        }
        if (!content) {
            wx.showToast({
                title: '请填写笔记内容',
                icon: 'none'
            })
            return
        }
        if (!classify && !classifyA) {
            console.log(classify)
            console.log(classifyA)
            wx.showToast({
                title: '请选择笔记分类',
                icon: 'none'
            })
            return
        }
        const imageUp = [];
        if (imgList.length > 0) {
            imgList.forEach((item, index) => {
                if (index == imgList.length - 1) {
                    // 将图片上传至云存储空间
                    wx.cloud.uploadFile({
                        // 指定上传到的云路径
                        cloudPath: 'uploadFile/' + new Date().getTime() + "_" + Math.floor(Math.random() * 1000) + '.jpg',
                        // 指定要上传的文件的小程序临时文件路径
                        filePath: item,
                        // 成功回调
                        success: res => {
                            // console.log('上传成功', res)
                            // console.log(res.fileID)
                            imageUp.push(res.fileID)
                            db.collection('notes').add({
                                data: {
                                    title,
                                    content,
                                    classify: classify || classifyA,
                                    createtime: time.createtime,
                                    imageUp
                                }
                            }).then(res => {
                                console.log(res)
                                wx.showToast({
                                    title: '保存成功',
                                    icon: 'none'
                                })
                                this.onLoad()
                            })
                        },
                    })
                }else{
                    wx.cloud.uploadFile({
                        // 指定上传到的云路径
                        cloudPath: 'uploadFile/' + new Date().getTime() + "_" + Math.floor(Math.random() * 1000) + '.jpg',
                        // 指定要上传的文件的小程序临时文件路径
                        filePath: item,
                        // 成功回调
                        success: res => {
                            // console.log('上传成功', res)
                            // console.log(res.fileID)
                            imageUp.push(res.fileID)
                        },
                    })
                }

            })
        }
        if (imgList.length<=0) {
            db.collection('notes').add({
                data: {
                    title,
                    content,
                    classify: classify || classifyA,
                    createtime: time.createtime,
                    imageUp
                }
            }).then(res => {
                console.log(res)
                wx.showToast({
                    title: '保存成功',
                    icon: 'none'
                })
                this.onLoad()
            })
        }
    },



    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        //获取当前的时间
        let createtime = new Date().getTime()
        // console.log(createtime)
        let day = `${new Date(createtime).getMonth() + 1}月${new Date(createtime).getDate()}日`
        let min = `${new Date(createtime).getHours()}:${new Date(createtime).getMinutes()}`
        this.setData({
            time: {
                createtime,
                day,
                min
            }
        })
        //获取分类
        db.collection('notes').where({
            _openid:wx.getStorageSync('openid')
        }).get().then((res)=>{
            let list=[]
            res.data.forEach(item=>{
                list.push(item.classify)
            })
            // console.log(list)
            this.setData({
                classifyList:[...new Set(list)]
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