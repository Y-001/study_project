// pageHoutai/pages/dz/dz.js
const db = wx.cloud.database()
const _ = db.command
const ROOM_STATE = {
    IS_OK: 'OK', // 房间状态正常
    IS_PK: 'PK', // 对战中
    IS_READY: 'READY', // 非房主用户已经准备
    IS_FINISH: 'FINISH', // 对战结束
    IS_USER_LEAVE: 'LEAVE' // 对战中有用户离开
}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 房间id
        roomId: "",
        // 是否展示开始答题按钮
        showBtns: false,
        // 随机的题目
        tiList: [],
        // 房主
        leftU: {},
        // 非房主
        rightU: {},
        // 显示答题
        showDati: false,
        // 显示结果
        showRes: false,
        // 分数
        leftScore: 0,
        rightScore: 0
    },
    // 获得最后的分数
    getScore() { },
    // 去答题
    async toDati() {
        await db.collection('pk').where({
            _id: roomId,
            'right.openid': this._.neq(''),
            state: ROOM_STATE.IS_READY
        }).update({
            data: {
                state: ROOM_STATE.IS_PK
            }
        })
    },
    async init() {
        const that = this
        if (!this.data.roomId) {
            let res1 = await db.collection('testbanks').limit(2).get()
            let tiList = res1.data
            this.setData({
                tiList
            })
            const { _id = '' } = await db.collection('pk').add({
                data: {
                    tiList: tiList,
                    createTime: new Date().getTime(),
                    left: {
                        openid: wx.getStorageSync('openid'),
                        isfull: false,
                        grades: 0
                    },
                    right: {
                        openid: '',
                        isfull: false,
                        grades: 0
                    },
                    state: ROOM_STATE.IS_OK,
                }
            })
            this.setData({
                roomId: _id
            })
        } else {
            db.collection('pk').where({
                _id: roomId,
                'right.openid': '',
                state: ROOM_STATE.IS_OK
            }).update({
                data: {
                    right: { openid },
                    state: ROOM_STATE.IS_READY,
                }
            })
            db.collection('pk').where({
                _id: roomId
            }).get().then(res => {
                let left = res.data[0].left
                let right = res.data[0].right
                that.setData({
                    leftU: left,
                    rightU: right
                })
            })
        }
        const watcher = db.collection('pk').doc(that.data.roomId)
            .watch({
                onChange: function (snapshot) {
                    // that.setData({
                    //     stars: snapshot.docs[0].star
                    // })
                    // console.log('文档数据发生变化', snapshot)
                    if (snapshot.docs[0].state == 'READY') {
                        that.setData({
                            showBtns: true
                        })
                    }
                    if (snapshot.docs[0].state == 'PK') {
                        that.setData({
                            showBtns: false,
                            showDati: true
                        })
                    }
                    if (snapshot.docs[0].left.isfull && snapshot.docs[0].right.isfull && snapshot.docs[0].state == 'PK') {
                        db.collection('pk').doc(snapshot.docs[0]._id).update({
                            data: {
                                state: IS_FINISH
                            }
                        })
                    }
                    if (snapshot.docs[0].state == 'FINISH') {
                        that.setData({
                            showBtns: false,
                            showDati: false,
                            showRes: true,
                            leftScore: snapshot.docs[0].left.grades,
                            rightScore: snapshot.docs[0].right.grades
                        })
                    }
                },
                onError: function (err) {
                    console.error('监听因错误停止', err)
                }
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
    onShareAppMessage({ from }) {
        const { data: { roomInfo: { isHouseOwner, state, roomId, bookName } } } = this
        if (from === 'button' && isHouseOwner && state === ROOM_STATE.IS_OK) {
            return {
                title: `❤ @你, 来一起pk[${bookName}]吖，点我进入`,
                path: `/pages/combat/combat?roomId=${roomId}`,
                imageUrl: './../../images/share-pk-bg.png'
            }
        }
    },
})