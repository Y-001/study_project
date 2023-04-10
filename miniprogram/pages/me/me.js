const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        avatar: '', //用户头像
        isLogin: false,
        show: false,
        nickName: '', //用户名称
    },
    onShow() {
        let _this=this
        // let userInfo = JSON.parse(wx.getStorageSync("userInfo"))
        if (wx.getStorageSync("userInfo")) {
            let userInfo = JSON.parse(wx.getStorageSync("userInfo"))
            _this.setData({
                isLogin: true,
                avatar: userInfo.avatar,
                nickName: userInfo.nickName
            })
        }
    },
    // 去代办页面
    toDaiban(){
        wx.navigateTo({
          url: '/pageNote/pages/daiban/daiban',
        })
    },
    // 去个人信息页面
    toUserinfo(){
        wx.navigateTo({
          url: '/pageNote/pages/userinfo/userinfo',
        })
    },

    getUserInfo(event) {
        //   console.log(event)
        let data={
            avatar:this.data.avatar,
            nickName:this.data.nickName
        }
        this.regist(data)
    },

    logout() {
        let _this=this
        wx.showModal({
            title: '提示',
            content: '确定退出吗？',
            success(res) {
                if (res.confirm) {
                    wx.removeStorageSync('userInfo')
                    wx.showToast({
                        title: '退出成功',
                        icon:'none'
                    })
                    wx.reLaunch({
                      url: '/pages/login/login',
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })

    },

})