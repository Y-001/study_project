import * as echarts from "../../../components/ec-canvas/echarts.min";
const db = wx.cloud.database()
const $ = db.command.aggregate
var hengData = []
var shuData = []
function initChart(canvas, width, height, dpr) {
    const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr
    });
    canvas.setChart(chart);

    var option = {
        title: {
            text: ''
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {},
        xAxis: {
            type: 'category',
            boundaryGap: false,
            //   data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            data: hengData
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value}'
            }
        },
        series: [
            {
                name: '考试得分',
                type: 'line',
                // data: [10, 11, 13, 11, 12, 12, 9],
                data: shuData,

                // markLine: {
                //     data: [{ type: 'average', name: 'Avg' }]
                // }
            },
            //   {
            //     name: 'Lowest',
            //     type: 'line',
            //     data: [1, -2, 2, 5, 3, 2, 0],
            //     markPoint: {
            //       data: [{ name: '周最低', value: -2, xAxis: 1, yAxis: -1.5 }]
            //     },
            //     markLine: {
            //       data: [
            //         { type: 'average', name: 'Avg' }
            //       ]
            //     }
            //   }
        ]
    };
    chart.setOption(option);

    return chart;
}

Page({

    /**
     * 页面的初始数据
     */
    data: {
        ec: {
            onInit: initChart
        },
        visible:false,
        //用户信息
        userInfo: {},
        // 累计考试次数
        testcount: 0,
        // 累计考试得分
        scorecount: 0,
        // 累计正确率
        rightrate: 0,

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        this.setData({
            userInfo: JSON.parse(wx.getStorageSync('userInfo'))
        })
        // 获取用户考试数据
        await db.collection('testexams').where({
            _openid: wx.getStorageSync('openid')
        }).get().then(res => {
            const testlist = res.data
            let testcount = 0, scorecount = 0, rightnum = 0;
            testcount = testlist.length;
            testlist.forEach(item => {
                scorecount += item.score;
                rightnum += item.rightnum;
            })
            let rightrate = rightnum / (testcount*5) * 100 || 0
            this.setData({
                testcount,
                scorecount,
                rightrate
            })
        })
       await db.collection('testexams').aggregate()
       .match({
           _openid:wx.getStorageSync('openid')
       })
            .group({
                _id: '$classify',
                num: $.sum('$score')
            })
            .end().then(res=>{
                // console.log(res.list)
                if(res.list.length!=0){
                    res.list.forEach(item=>{
                        hengData.push(item._id)
                        shuData.push(item.num)
                    })
                }
            })
            this.setData({
                visible:true
            })
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