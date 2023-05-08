const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
const db=wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 权限判断
        auth:0,
        prizeList:[
            {
                img:'cloud://project-4gak2jnr9bdf0df2.7072-project-4gak2jnr9bdf0df2-1307359075/grade/21.png',
                text:'坚持不懈',
                score:5,
            },
            {
                img:'cloud://project-4gak2jnr9bdf0df2.7072-project-4gak2jnr9bdf0df2-1307359075/grade/50.png',
                text:'聚沙成塔',
                score:50,
            },
            {
                img:'cloud://project-4gak2jnr9bdf0df2.7072-project-4gak2jnr9bdf0df2-1307359075/grade/1000.png',
                text:'天道酬勤',
                score:1000,
            },
            {
                img:'cloud://project-4gak2jnr9bdf0df2.7072-project-4gak2jnr9bdf0df2-1307359075/grade/2000.png',
                text:'学富五车',
                score:2000,
            },
        ],
        avatar: '', //用户头像
        isLogin: false,
        show: false,
        nickName: '', //用户名称
        pdprizeImg:''
    },
    onLoad(){
        let _this=this
        // 查看权限
        db.collection('authoritys').where({
            openid:wx.getStorageSync("openid")
        }).get().then(res=>{
            if(res.data.length!=0){
                _this.setData({
                    auth:res.data[0].role
                })
                wx.setStorageSync('auth', res.data[0].role)
            }
        })
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
            db.collection('users').where({
                _openid:wx.getStorageSync('openid')
            }).get().then(res=>{
                let pdprize=res.data[0]?.pdprize || ''
                let img= _this.data.prizeList.filter(item=>{
                    return item.text==pdprize
                })[0]?.img || ''
                _this.setData({
                    pdprizeImg: img,
                })
            })
        }

    },
    // 去勋章页面
    toPrize(){
        wx.navigateTo({
          url: '/pageStudy/pages/xcxz/xcxz',
        })
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