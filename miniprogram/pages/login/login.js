const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        avatar: defaultAvatarUrl, //用户头像
        isLogin: false,
        show: false,
        nickName: '', //用户名称
    },
    onShow() {
        let _this=this
        // if (wx.getStorageSync("userInfo")) {
        //     let userInfo = JSON.parse(wx.getStorageSync("userInfo"))
        //     _this.setData({
        //         isLogin: true,
        //         avatar: userInfo.avatar,
        //         nickName: userInfo.nickName
        //     })
        // }
    },

    getUserInfo(event) {
        //   console.log(event)
        if(!this.data.nickName){
            wx.showToast({
              title: '请输入您的昵称',
              icon:'none'
            })
            return
        }
        let data={
            avatar:this.data.avatar,
            nickName:this.data.nickName
        }
        this.regist(data)
    },

    onClose() {
        this.setData({
            show: false
        });
    },
    getMyUserInfo() {
        let _this=this
        if (this.data.isLogin) return
        let db = wx.cloud.database() //获取数据库信息
        //users集合有权限设置,导致只能查到自己以前添加过得数据
        db.collection('users').get().then(res => {
            if (res.data.length != 0) { 
                console.log(res.data)
                _this.setData({
                    avatar:res.data[0].avatar,
                    nickName:res.data[0].nickName,
                    isLogin:true
                })
                let userInfo={
                    avatar:res.data[0].avatar,
                    nickName:res.data[0].nickName,
                }
                wx.setStorageSync('userInfo', JSON.stringify(userInfo))
                wx.showToast({
                  title: '登录成功',
                  icon:'none'
                })
                setTimeout(()=>{
                    wx.switchTab({
                      url: '/pages/index/index',
                    })
                },1000)
            }else{
                _this.setData({
                    show: true
                })
            }
        })
    },

    onChooseAvatar(e) {
        wx.showLoading({
            title: '上传中',
        })
        wx.cloud.uploadFile({
            cloudPath: 'avaterFile/' + new Date().getTime() + "_" + Math.floor(Math.random() * 1000) + '.jpg',
            filePath: e.detail.avatarUrl,
            success: (res) => {
                let fileID = res.fileID
                wx.cloud.getTempFileURL({
                    fileList: [{
                        fileID: fileID,
                        maxAge: 60 * 60, // one hour
                    }]
                }).then(res => {
                    this.setData({
                        avatar: res.fileList[0].tempFileURL
                    })
                    wx.hideLoading()
                }).catch(error => {
                    // handle error
                })
            }
        })
    },

    userNameInput(e) {
        this.setData({
            nickName: e.detail.value
        })
    },

    regist(data) {
        let db = wx.cloud.database() //获取数据库信息
        db.collection('users').add({ //在users中添加数据
            // data: this.data.userInfo, //把userInfo中的新数据存入data
            data:data,
            success: (res) => {
                console.log('注册用户', res) //执行成功后打印
                wx.setStorageSync('userInfo', JSON.stringify(data))
                wx.showToast({
                    title: '登录成功',
                    icon:'none'
                  })
                setTimeout(()=>{
                    wx.switchTab({
                      url: '/pages/index/index',
                    })
                },1000)
            }
        })
    },

    
})