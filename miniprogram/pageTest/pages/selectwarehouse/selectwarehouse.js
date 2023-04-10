// pages/selectwarehouse/selectwarehouse.js
const db=wx.cloud.database()
const _=db.command
const $ = db.command.aggregate
Page({

    /**
     * 页面的初始数据
     */
    data: {
        items:[],
          /* 左侧选中项的索引 */
        mainActiveIndex: 0,
        /* 右侧选中项的id */
        activeId: null,
    },
    /* 左侧导航点击时，触发事件 */
    onClickNav({ detail = {} }) {
        this.setData({
          mainActiveIndex: detail.index || 0,
        });
      },
    /* 右侧导航点击时，触发事件 */
      onClickItem({ detail = {} }) {
        const activeId = this.data.activeId === detail.id ? null : detail.id;
        this.setData({ activeId });
        let classify=detail.text
        wx.navigateTo({
          url: '/pageTest/pages/testdetail/testdetail?classify='+encodeURIComponent(classify),
        })
      },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        //获取题库
        db.collection('testclassifys').aggregate()
        .group({
          // 按 category 字段分组
          _id: '$title',
          // 每组有一个 avgSales 字段，其值是组内所有记录的 sales 字段的平均值
          children: $.push('$bank')
        })
        .end().then(res=>{
           console.log(res.list)
        let a=res.list.map(item=>{
            let text=item._id
            let children=item.children.map((item,index)=>{
                return {
                    text:item,
                    id:index
                }
            })
            return {
                text,
                children
            }
        })
            this.setData({
                items:a
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