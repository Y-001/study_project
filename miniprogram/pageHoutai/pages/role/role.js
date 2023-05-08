// pageHoutai/pages/role/role.js
const db = wx.cloud.database()
const _ = db.command
let timer = null
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 总共的权限列表
        roles: [],
        // 新增弹窗
        show: false,
        // 修改弹窗
        showEdit: false,
        // 当前是哪个人的权限
        nowrole: {},
        // 角色类型
        array: ['用户', '超级管理员', '题库老师','题库管理员'],
        index: 0,
        // 输入用户名字
        name: '',
        // 查询出用户列表
        userList: [],
        // 当前选中的用户信息
        chooseuser: {}
    },

    // 删除当前角色
    delete(e){
        let { item } = e.currentTarget.dataset
        let _this=this
        wx.showModal({
          title: '是否删除当前用户角色',
          content: '',
          complete: (res) => {
            if (res.cancel) {
              
            }
        
            if (res.confirm) {
                db.collection('authoritys').doc(item._id).remove().then(res=>{
                    wx.showToast({
                        title: '删除成功',
                        icon:'none'
                      })
                    _this.getRoleList()
                })
            }
          }
        })
    },

    bindPickerChange: function (e) {
        // console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            index: e.detail.value
        })
    },
    async edit() {
        let { array, index, nowrole } = this.data
        await db.collection('authoritys').doc(nowrole._id).update({
            data: {
                role: Number(index),
            }
        }).then(res => {
            wx.showToast({
                title: '修改成功',
                icon: 'nono'
            })
        })
        this.getRoleList()
    },
    // 关闭弹窗
    onClose() {
        this.setData({ show: false, showEdit: false });
    },
    // 修改用户角色
    toEditRole(e) {
        let { item } = e.currentTarget.dataset
        if (item.role == 1) return

        this.setData({
            showEdit: true,
            index: item.role,
            nowrole: item
        })
    },
    // 新增用户角色
    toAddRole() {
        this.setData({
            show: true,
            index: 0,
            nowrole: {}
        })
    },
    // 获取输入的文字
    getName(e) {
        this.setData({
            name: e.detail.value
        })
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            if(e.detail.value!=''){
                this.getUser(e.detail.value)
            }
            
        }, 1000)
    },
    // 选择用户
    chooseUser(e) {
        let { item } = e.currentTarget.dataset
        let {roles}=this.data
        this.setData({
            chooseuser: item,
            name: item.nickName
        })
        let a=roles.filter(data=>{
            return data.openid==item._openid
        })
        if(a.length>0){
            wx.showToast({
                title: '不能为同一个用户多次授权',
                icon: 'none'
            })
            return
        }
        wx.showToast({
            title: `选中用户${item.nickName}`,
            icon: 'none'
        })
    },
    // 添加用户角色
    add() {
        let { chooseuser, array, index } = this.data
        let _this=this
        if (!chooseuser?.nickName) {
            wx.showToast({
                title: '请选择一个存在的用户',
                icon: 'none'
            })
            return
        }
        db.collection('authoritys').add({
            data: {
                openid: chooseuser._openid,
                role: Number(index),
                nickName: chooseuser.nickName,
                avatar: chooseuser.avatar,
                bank:[]
            }
        }).then(res => {
            wx.showToast({
                title: '角色添加成功',
                icon: 'nono'
            })
            _this.getRoleList()
        })
        
    },
    // 按关键词搜索所有用户
    getUser(name) {
        db.collection('users').where({
            nickName: {
                $regex: '.*' + name,
                $options: 'i' 
              }
        }).get().then(res => {
            if (res.data.length > 0) {
                this.setData({
                    userList: res.data
                })
            }
        })
    },

    // 搜索权限列表
    getRoleList(title) {
        wx.showLoading({
            title: '加载中',
        })
        let roles = []
        db.collection('authoritys').get().then(res => {
            wx.hideLoading()
            this.setData({
                roles: res.data
            })
        }).catch(err => {
            console.log(err)
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getRoleList()
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