// pageHoutai/pages/role/role.js
const db = wx.cloud.database()
const _ = db.command
let timer = null
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 所有题库分类名
        list: [
            // { name: 1, checked: false },
           ],
        //选择的题库分类名
        checkName:[],
        //题库老师列表
        teacher:[],
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
    // 修改题库老师题库权限
    async edit() {
        let { array, index, nowrole } = this.data
        await db.collection('authoritys').doc(nowrole._id).update({
            data: {
                banks: nowrole.banks,
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
        if(a[0].role==1|| a[0].role==3){
            wx.showToast({
                title: '无法越权操作',
                icon: 'none'
            })
            return
        }
        if(a[0].role==2){
            wx.showToast({
                title: '此用户已经是题库老师',
                icon: 'none'
            })
            return
        }
        wx.showToast({
            title: `选中用户${item.nickName}`,
            icon: 'none'
        })
    },
    
    // 添加题库老师角色
    add() {
        let { chooseuser,checkName,roles } = this.data
        let _this=this
        if (!chooseuser?.nickName) {
            wx.showToast({
                title: '请选择一个存在的用户',
                icon: 'none'
            })
            return
        }
        if (checkName.length==0) {
            wx.showToast({
                title: '为题库老师设置权限题目分类',
                icon: 'none'
            })
            return
        }
        let a=roles.filter(data=>{
            return data.openid==chooseuser._openid
        })
        if(a.length>0){
            db.collection('authoritys').doc(a[0]._id).update({
                data: {
                    role: 2,
                    banks:checkName
                }
            }).then(res => {
                wx.showToast({
                    title: '题库老师添加成功',
                    icon: 'nono'
                })
                _this.getRoleList()
            })
        }else{
            db.collection('authoritys').add({
                data: {
                    openid: chooseuser._openid,
                    role: 2,
                    nickName: chooseuser.nickName,
                    avatar: chooseuser.avatar,
                    banks:checkName
                }
            }).then(res => {
                wx.showToast({
                    title: '题库老师添加成功',
                    icon: 'nono'
                })
                _this.getRoleList()
            })
        }
        
        
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
            let teacher=res.data.filter(item=>{
                return item.role==2
            })
            this.setData({
                teacher
            })
        }).catch(err => {
            console.log(err)
        })
    },
    // 新增选择用户题库权限
    select(e){
        let id=e.currentTarget.dataset.id
        let {list,checkName}=this.data
        list[id].checked=!list[id].checked
        if(list[id].checked){
            checkName.push(list[id].name)
        }
        this.setData({
            list,checkName
        })
    },
    // 修改选择用户题库权限
    changeSelect(e){
        let name=e.currentTarget.dataset.name
        let {nowrole}=this.data
        let banks=nowrole.banks
        if(banks.includes(name)){
            banks=banks.filter(item=>{
                return item!=name
            })
        }else{
            banks.push(name)
        }
        nowrole.banks=banks
        this.setData({
            nowrole
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getRoleList()
        db.collection('testclassifys').get().then(res=>{
            let list=res.data.map((item,index)=>{
                let id=index
                let name=item.bank
                let checked=false
                return {
                    id,name,checked
                }
            })
            this.setData({
                list
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