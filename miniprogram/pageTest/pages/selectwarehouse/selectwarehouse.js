// pages/selectwarehouse/selectwarehouse.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        items:[
            {
              // 导航名称
              text: '本草',
              // 禁用选项
              disabled: false,
              // 该导航下所有的可选项
              children: [
                {
                  // 名称
                  text: '本草纲目',
                  // id，作为匹配选中状态的标识
                  id: 1,
                  // 禁用选项
                //   disabled: true,
                },
                {
                  text: '神农本草经',
                  id: 2,
                },
              ],
            },
            {
                // 导航名称
                text: '方药',
                // 禁用选项
                disabled: false,
                // 该导航下所有的可选项
                children: [
                  {
                    // 名称
                    text: '五十二病方',
                    // id，作为匹配选中状态的标识
                    id: 1,
                    // 禁用选项
                    // disabled: true,
                  },
                  {
                    text: '苏沈良方',
                    id: 2,
                  },
                ],
              },
              {
                // 导航名称
                text: '经络',
                // 禁用选项
                disabled: false,
                // 该导航下所有的可选项
                children: [
                  {
                    // 名称
                    text: '奇经八脉考',
                    // id，作为匹配选中状态的标识
                    id: 1,
                    // 禁用选项
                    // disabled: false,
                  },
                  {
                    text: '经络全书',
                    id: 2,
                  },
                  {
                    text: '上海',
                    id: 3,
                  }
                ],
              },
             
              
          ],
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
        wx.navigateTo({
          url: '/pageTest/pages/testdetail/testdetail',
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
    onShareAppMessage() {

    }
})