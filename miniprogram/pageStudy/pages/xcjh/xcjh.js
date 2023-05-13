// pages/xcjh/xcjh.js
import { dateFormat, getLaterDate } from '../../../utils/index'
const db = wx.cloud.database()
let timestudy = null
let daystudy = null
Page({

    /**
     * 页面的初始数据
     */
    data: {
        multiArray: [[10, 15, 20, 30, 45, 60], [10, 15, 20, 25, 30, 35, 45]],
        multiIndex: [0, 0],
        checked: false,
        starList: [],
        donetime: '',
        //已选择的收藏id
        select_id: '',
        bookname: "",
        bookid: '',
    },
    // 切换计划选择
    bindMultiPickerChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            multiIndex: e.detail.value
        })
        this.getDonetime()
    },
    // 是否需要系统提醒
    onChangeSwitch({ detail }) {
        let _this=this
        console.log(detail)
        if (detail) {
            // 填写你自己的模板id
            const templateId = 'N-dxzhUUJRG4E-tgE6ooHLY9k7V7CEC_zw2C_DzgBs8'
            // 仅展示了主流程
            // 正式环境中，需考虑到用户可能会点击‘拒绝’、‘永久拒绝’等情况
            // 并弹出对应的反馈，如弹窗等
            wx.requestSubscribeMessage({
                tmplIds: [templateId],
                success(res) {
                    console.log('订阅成功 ', res)
                    if(res['N-dxzhUUJRG4E-tgE6ooHLY9k7V7CEC_zw2C_DzgBs8']=='reject'){
                        _this.setData({
                            checked:!detail
                        })
                    }else{
                        _this.setData({
                            checked:detail
                        })
                    }
                },
                fail(err) {
                    console.log('订阅失败 ', err)
                    _this.setData({
                        checked:!detail
                    })
                }
            })
        }else{
            this.setData({
                checked: detail
            })
        }
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
    // 没有收藏经典的情况
    toStore() {
        wx.switchTab({
            url: '/pages/store/store',
        })
    },
    //选择计划书
    selectBook(e) {
        let { id, bookname, bookid } = e.currentTarget.dataset
        this.setData({
            select_id: id,
            bookname,
            bookid
        })
    },
    //计算完成天数
    getDonetime() {
        // let {studyday,studytime,donetime}=this.data;
        let { multiArray, multiIndex, donetime } = this.data;
        // let time=new Date()
        // donetime=getLaterDate(studyday)
        donetime = getLaterDate(multiArray[1][multiIndex[1]])
        this.setData({
            donetime
        })
    },
    //确认学习计划
    getPlan() {
        if (this.data.starList.length == 0) {
            wx.showToast({
                title: '请先去收藏经典',
                icon: 'none'
            })
            return
        }
        let { select_id, multiArray, multiIndex, donetime, bookname, bookid,checked } = this.data
        if (!bookid) {
            wx.showToast({
                title: '请选择经典',
                icon: 'none'
            })
            return
        }
        let studyday = multiArray[1][multiIndex[1]]
        let studytime = multiArray[0][multiIndex[0]]
        db.collection('users').where({
            _openid: wx.getStorageSync('openid')
        }).update({
            data: {
                studyplan: {
                    select_id, studyday, studytime, donetime, bookname, bookid, calendar: [],checked,isOut:false,syday:studyday,jindu:0,
                    createtime: new Date().getTime()
                }
            }
        }).then(res => {
            // console.log(res)
            wx.showToast({
                title: '确认学习计划成功',
                icon: 'none'
            })
            setTimeout(() => {
                wx.switchTab({
                    url: '/pages/index/index',
                })
            }, 500)
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getDonetime()
        let { multiArray } = this.data
        let _this = this
        //获取收藏经典列表
        db.collection('bookstars').where({
            _openid: wx.getStorageSync('openid')
        }).get().then(res => {
            res.data.forEach(item => {
                item.createtime = dateFormat(item.createtime)
            })
            this.setData({
                starList: res.data
            })
            //获取学习计划列表
            db.collection('users').where({
                _openid: wx.getStorageSync('openid')
            }).get().then(res => {
                if ('studyplan' in res.data[0]) {
                    let { select_id, studyday, studytime, bookname, bookid, donetime } = res.data[0].studyplan
                    let a = multiArray[0].indexOf(studytime)
                    let b = multiArray[1].indexOf(studyday)
                    let multiIndex = [a, b]
                    this.setData({
                        select_id, bookname, bookid, multiIndex, donetime
                    })
                }
            })
        })
        wx.getSetting({
            withSubscriptions: true,
            success(res) {
                //   console.log(res.authSetting)
                console.log(res.subscriptionsSetting)
                // res.authSetting = {
                //   "scope.userInfo": true,
                //   "scope.userLocation": true
                // }
                if (res.subscriptionsSetting.mainSwitch) {
                    _this.setData({
                        checked: true
                    })
                }
            }
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