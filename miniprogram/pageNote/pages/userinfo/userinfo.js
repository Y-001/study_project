// pageNote/pages/userinfo/userinfo.js
const db=wx.cloud.database()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo:{},
        show:false,
        nickName:'',
        birthday:'',
        geqian:'',
        juexin:'',
    },
    
    onConfirmCale(e){
        this.setData({
            show:true,
            showCale: false,
            birthday: this.formatDate(e.detail),
          });
    },
    toEdit(){
        this.setData({
            show:true
        })
    },
    getUserInfo(event) {
        let {nickName,birthday,geqian,juexin}=this.data
        db.collection('users').where({
            _openid:wx.getStorageSync('openid')
        }).update({
            data:{
                nickName,birthday,geqian,juexin
            }
        }).then(res=>{
            wx.showToast({
              title: '修改成功',
              icon:'none'
            })
            wx.removeStorageSync('userInfo')
            db.collection('users').where({
                _openid:wx.getStorageSync('openid')
            }).get().then(res=>{
                let userInfo={
                    avatar:res.data[0].avatar,
                    nickName:res.data[0].nickName
                }
                wx.setStorageSync('userInfo', JSON.stringify(userInfo))
            })
            this.onLoad()
        })
    },
    
      onClose() {
        this.setData({ show: false });
      },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        db.collection('users').where({
            _openid:wx.getStorageSync('openid')
        }).get().then(res=>{
            this.setData({
                userInfo:res.data[0],
                nickName:res.data[0].nickName,
                birthday:res.data[0].birthday || '',
                geqian:res.data[0].geqian || '',
                juexin:res.data[0].juexin || ''
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