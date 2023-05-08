// pages/publish/publish.js
const db = wx.cloud.database()
const _ = db.command
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 选择的图片列表
        imgList: [],
        // 选中的分类
        classify: '吐槽',
        title: '',
        content: ''
    },
    // 发布
    async publish() {
        let { imgList, classify, title, content } = this.data
        let userInfo=JSON.parse(wx.getStorageSync('userInfo'))
        if (!title) {
            wx.showToast({
                title: '请输入标题',
                icon: 'none'
            })
            return
        }
        if (!content) {
            wx.showToast({
                title: '请输入内容',
                icon: 'none'
            })
            return
        }
        if (!classify) {
            wx.showToast({
                title: '请选择分类',
                icon: 'none'
            })
            return
        }
        let imgUp=[]
        if (imgList.length > 0) {
            // 将图片上传至云存储空间
            for(let i=0;i<imgList.length;i++){
                let res=await wx.cloud.uploadFile({
                    // 指定上传到的云路径
                    cloudPath: 'circle/' + new Date().getTime() + "_" + Math.floor(Math.random() * 1000) + '.jpg',
                    // 指定要上传的文件的小程序临时文件路径
                    filePath: imgList[i],
                })
                imgUp.push(res.fileID)
            }
        }
        db.collection('circles').add({
            data:{
                classify, title, content,imgUp,time:new Date().getTime(),...userInfo
            }
        }).then(res=>{
            wx.showToast({
              title: '发布成功',
              icon:'none'
            })
            setTimeout(()=>{
                wx.redirectTo({
                  url: '/pageTalk/pages/talk/talk',
                })
            },500)
        })

    },
    // 选择分类
    selectClassify(e) {
        // console.log(e)
        let name = e.target.dataset.name
        this.setData({
            classify: name
        })
    },
    getTitle(e) {
        this.setData({
            title: e.detail.value
        })
    },
    getContent(e) {
        this.setData({
            content: e.detail.value
        })
    },
    // 上传图片
    uploadImg() {
        let { imgList } = this.data
        wx.chooseMedia({
            count: 6 - imgList.length,
            mediaType: ['image'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                const { tempFiles } = res;
                tempFiles.forEach(item => {
                    imgList.unshift(item.tempFilePath)
                })
                this.setData({
                    imgList
                })
            }
        })
    },
    // 删除当前上传的图片
    deleteImg(e) {
        let { index } = e.currentTarget.dataset;
        let { imgList } = this.data;
        imgList.splice(index, 1);

        this.setData({
            imgList
        })
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

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