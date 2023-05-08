<<<<<<< HEAD
// pageNote/pages/daiban2/daiban2.js
=======
const db = wx.cloud.database()
const _ = db.command
import Dialog from '@vant/weapp/dialog/dialog';
>>>>>>> ca76ee910539ef51c49e8bb81f63fe77f64fbfcf
Page({

    /**
     * 页面的初始数据
     */
    data: {
<<<<<<< HEAD

    },
=======
        todoList: [],//待办数组
        show: false,//是否显示待办
        showCalendar: false,//是否显示日历
        date: '',//选择的截止日期
        pushed: false,//是否开启订阅提醒
        done: false,//是否完成待办
        content: '',//新建待办内容
        info: '',//新建待办详细信息
    },
    changeContent(e) {
        this.setData({
            content: e.detail.value
        })
    },
    changeInfo(e) {
        this.setData({
            info: e.detail.value
        })
    },
    //确认添加待办
    confirmAdd() {
        let { info, content, date, pushed } = this.data
        if (!content) {
            wx.showToast({
                title: '没有待办内容，添加失败',
                icon: 'none'
            })
            return
        }
        let data = { info, content, date: new Date(date).getTime(), pushed, checked: false }
        db.collection('todos').add({
            data
        }).then(res => {
            wx.showToast({
                title: '添加待办成功',
                icon: 'none'
            })
            this.getTodos()
        })
    },
    onCloseT(e) {
        this.setData({
            show: false
        })
    },
    //选择是否完成
    onChangeDone(e) {
        let id = e.currentTarget.dataset.id
        let checked = e.detail
        db.collection('todos').doc(id).update({
            data: {
                checked
            }
        }).then(res => {
            this.getTodos()
        })

    },
    //待办右滑后关闭
    onCloseTodo(event) {
        const { position, instance } = event.detail;
        const id = event.currentTarget.dataset.id
        const _this = this
        console.log(event)
        switch (position) {
            case 'left':
            case 'cell':
                instance.close();
                break;
            case 'right':
                wx.showModal({
                    title: '确定删除此条待办',
                    content: '',
                    complete: (res) => {
                        if (res.cancel) {
                            instance.close();
                        }

                        if (res.confirm) {
                            db.collection('todos').doc(id).remove().then(res => {
                                wx.showToast({
                                    title: '删除成功',
                                    icon: 'none'
                                })
                                instance.close();
                                _this.getTodos()
                            })
                        }
                    }
                })
                break;
        }
    },
    //添加待办按钮
    toAdd() {
        let date = this.formatDate(+new Date)
        this.setData({
            show: true,
            date
        })
    },
    // 向用户申请推送服务
    subscribe() {
        // 填写你自己的模板id
        const templateId = 'N-dxzhUUJRG4E-tgE6ooHLY9k7V7CEC_zw2C_DzgBs8'
        // 仅展示了主流程
        // 正式环境中，需考虑到用户可能会点击‘拒绝’、‘永久拒绝’等情况
        // 并弹出对应的反馈，如弹窗等
        wx.requestSubscribeMessage({
            tmplIds: [templateId],
            success(res) {
                console.log('订阅成功 ', res)
            },
            fail(err) {
                console.log('订阅失败 ', err)
            }
        })
    },
    //是否开启提醒切换按钮
    onChangeSwitch({ detail }) {
        if (detail) {
            this.subscribe()
        }
        // 需要手动对 pushed 状态进行更新
        this.setData({ pushed: detail });
    },
    // 选择日历
    onDisplay() {
        this.setData({ showCalendar: true, show: false });
    },
    onCloseCalendar() {
        this.setData({ showCalendar: false, show: true });
    },
    formatDate(date) {
        date = new Date(date);
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    },
    onConfirmCalendar(event) {
        this.setData({
            showCalendar: false,
            show: true,
            date: this.formatDate(event.detail),
        });
    },
    // 获取用户所有的待办，按截止时间排序
    getTodos() {
        db.collection('todos').where({
            _openid: wx.getStorageSync('openid')
        }).get().then(res => {
            let list = res.data
            for (var i = 0; i < list.length - 1; i++) {
                for (var j = 0; j < list.length - i - 1; j++) {
                    // 1.对每一个值和它的下一个值进行比较
                    if (list[j].date > list[j + 1].date) {
                        // 如果第一个值更多，则将其赋予自定义计数值 count
                        var count = list[j];
                        // 反复交换
                        list[j] = list[j + 1];
                        list[j + 1] = count;
                    };
                };
            }
            list.forEach(item => {
                item.date = this.formatDate(item.date)
            })
            this.setData({
                todoList: list
            })
        })
    },
>>>>>>> ca76ee910539ef51c49e8bb81f63fe77f64fbfcf

    /**
     * 生命周期函数--监听页面加载
     */
<<<<<<< HEAD
    onLoad(options) {

=======
    onLoad: function (options) {
        this.getTodos()
        let _this=this
        wx.getSetting({
            withSubscriptions: true,
            success (res) {
            //   console.log(res.authSetting)
              console.log(res.subscriptionsSetting)
              // res.authSetting = {
              //   "scope.userInfo": true,
              //   "scope.userLocation": true
              // }
              if(res.subscriptionsSetting.mainSwitch){
                  _this.setData({
                      pushed:true
                  })
              }
            }
          })
>>>>>>> ca76ee910539ef51c49e8bb81f63fe77f64fbfcf
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

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

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