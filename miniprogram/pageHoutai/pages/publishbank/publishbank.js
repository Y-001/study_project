// pageHoutai/pages/tbank/tbank.js
import Dialog from '@vant/weapp/dialog/dialog';
const db = wx.cloud.database()
const _ = db.command
Page({

    /**
     * 页面的初始数据
     */
    data: {
        searchQ: '',//搜索框的值
        //下拉菜单值
        option1: [
            { text: '全部分类', value: '全部分类', icon: '' },
        ],
        option2: [
            { text: '全部题目', value: 0, icon: '' },
            { text: '我的题目', value: 1, icon: '' },
        ],
        option3: [
            { text: '待审核', value: 0, icon: '' },
            { text: '审核已通过', value: 1, icon: '' },
            { text: '审核未通过', value: 2, icon: '' },
            { text: '全部状态', value: 3, icon: '' },
        ],
        value1: '全部分类',
        value2: 0,
        value3: 0,
        testList: [],//下边展示的题目数组
        id: 0,//选中题目的id
    },
    //删除题目
    delete(e) {
        let item = e.currentTarget.dataset.item
        wx.showModal({
            title: '确定删除此道题目？',
            content: '',
            complete: (res) => {
                if (res.cancel) {

                }

                if (res.confirm) {
                    if((item.status==0 || item.status==2)&&item._openid==wx.getStorageSync('openid')){
                            db.collection('reviewtests').doc(item._id).remove().then(res => {
                                wx.showToast({
                                    title: '删除成功',
                                })
                                this.getTestList()
                                this.setData({
                                    value1: '全部分类',
                                    value2: 0,
                                    value3:0
                                })
                            })
                    }else{
                        db.collection('reviewtests').doc(item._id).update({
                            data:{
                                operate:2,
                                czuser:JSON.parse(wx.getStorageSync('userInfo')).nickName,
                                status:0
                            }
                        }).then(res => {
                            wx.showToast({
                                title: '提交审核成功，审核成功之后会直接执行删除操作',
                            })
                            this.getTestList()
                            this.setData({
                                value1: '全部分类',
                                value2: 0,
                                value3:0
                            })
                        })
                    }
                    
                }
            }
        })
    },
    //当点击搜索
    search(e) {
        wx.showLoading({
            title: '加载中...',
        })
        let data = e.detail
        db.collection('reviewtests').where({
            title: {
                $regex: '.*' + data + '.*',
                $options: 'i'
            }
        }).get().then(res => {
            this.setData({
                testList: res.data,
                value1: '全部分类',
                value2: 0,
                value3:3
            })
            wx.hideLoading()
        })
    },
    // 展示审核意见
    seeAdvice(e){
        let info=e.currentTarget.dataset.advice 
        Dialog.alert({
            title: '审核意见',
            message: info,
          }).then(() => {
            // on close
          });
    },
    //筛选展示
    changeA(e) {
        this.setData({
            value1: e.detail,
            searchQ: ""
        })
        this.getTestList(this.data.value1, this.data.value2,this.data.value3)
    },
    changeB(e) {
        this.setData({
            value2: e.detail,
            searchQ: ""
        })
        this.getTestList(this.data.value1, this.data.value2,this.data.value3)
    },
    changeC(e) {
        this.setData({
            value3: e.detail,
            searchQ: ""
        })
        this.getTestList(this.data.value1, this.data.value2,this.data.value3)
    },
    // 新增修改题目
    editTest(e) {
        let { id } = e.currentTarget.dataset
        this.setData({
            id
        })
        wx.navigateTo({
            url: '/pageHoutai/pages/editbank/editbank?id=' + id,
        })
    },
    // 获取题目列表
    async getTestList(val1 = '全部分类', val2 = 0,val3=0) {
        let {option1}=this.data
        // let classify=option1.map(item=>item.text)
        if(option1.length==1){
            if (wx.getStorageSync('auth') == 1 || wx.getStorageSync('auth') == 3) {
                //获取分类列表
                let res=await db.collection('testclassifys').get()
                let data = res.data.map(item => {
                    let text = item.bank
                    let value = item.bank
                    let icon = ''
                    return {
                        text, value, icon
                    }
                })
                data.unshift({
                    text: '全部分类',
                    value: '全部分类',
                    icon: ''
                })
                this.setData({
                    option1: data,
                    value1: data[0].value
                })
                option1=data
            }else{
                let res2=await db.collection('authoritys').where({
                    openid:wx.getStorageSync("openid")
                }).get()
                let data=[]
                    if(res2.data[0].banks.length>0){
                        data = res2.data[0].banks.map(item => {
                            let text = item
                            let value = item
                            let icon = ''
                            return {
                                text, value, icon
                            }
                        })
                        console.log(data)
                    }
                    data.unshift({
                        text: '全部分类',
                        value: '全部分类',
                        icon: ''
                    })
                    this.setData({
                        option1: data,
                        value1: data[0].value
                    })
                    option1=data
            }
        }
        let classify=option1.map(item=>item.text)
        classify.shift()
        console.log(classify)
        wx.showLoading({
            title: '加载中...',
        })
        let data = {}
        if (val1 != '全部分类') {
            data.classify = val1
        }
        if(val1 == '全部分类'){
            data.classify=_.in(classify)
        }
        if (val2 == 1) {
            data._openid = wx.getStorageSync('openid')
        }
        if(val3!=3){
            data.status=val3
        }
        
        db.collection('reviewtests').where({
            ...data,
        }).get().then(res => {
            this.setData({
                testList: res.data
            })
            wx.hideLoading()
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        
        this.getTestList()
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