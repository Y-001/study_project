// pages/publish/publish.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgList:[],
    },
    uploadImg(){
        let {imgList}=this.data
        wx.chooseMedia({
            count: 6-imgList.length,
            mediaType: ['image'],
            sourceType: ['album', 'camera'],
            success:(res)=>{
              const {tempFiles}=res;
              tempFiles.forEach(item=>{
                  imgList.unshift(item.tempFilePath)
              })
              this.setData({
                  imgList
              })
            }
          })
    },
    deleteImg(e){
        let { index }=e.currentTarget.dataset;
        let {imgList}=this.data;
        imgList.splice(index,1);

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