import * as echarts from "../../../components/ec-canvas/echarts.min";
const db = wx.cloud.database()
const $ = db.command.aggregate
var hengData = []
var shuData = []
var dtcassify = []
function initChart(canvas, width, height, dpr) {
    const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr
    });
    canvas.setChart(chart);

    var option = {
        title: {
            text: '答题得分分析',
            left: 'center'

        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            orient: 'vertical',
            left: 'left'
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
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
                data: shuData,
            },
        ]
    };
    chart.setOption(option);

    return chart;
}
function initChart2(canvas, width, height, dpr) {
    const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
    });
    canvas.setChart(chart);

    var option = {
        title: {
            text: '答题类型统计',
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        backgroundColor: "#ffffff",
        series: [{
            label: {
                normal: {
                    fontSize: 14
                }
            },
            type: 'pie',
            // center: ['50%', '50%'],
            // radius: ['20%', '40%'],
            radius: '50%',
            // data: [{
            //     value: 55,
            //     name: '北京'
            // }, {
            //     value: 20,
            //     name: '武汉'
            // }, {
            //     value: 10,
            //     name: '杭州'
            // }, {
            //     value: 20,
            //     name: '广州'
            // }, {
            //     value: 38,
            //     name: '上海'
            // }],
            data: dtcassify,
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
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
        ec2: {
            onInit: initChart2
        },
        visible: false,
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
            let rightrate = Math.round(rightnum / (testcount * 5) * 100) || 0
            this.setData({
                testcount,
                scorecount,
                rightrate
            })
        })
        await db.collection('testexams').aggregate()
            .match({
                _openid: wx.getStorageSync('openid')
            })
            .group({
                _id: '$classify',
                num: $.sum('$score'),
                sum: $.sum(1),
            })
            .end().then(res => {
                // console.log(res.list)
                if (res.list.length != 0) {
                    res.list.forEach(item => {
                        hengData.push(item._id)
                        shuData.push(item.num)
                        dtcassify.push({ name: item._id, value: item.sum })
                    })
                }
            })
        this.setData({
            visible: true
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
        hengData = []
        shuData = []
        dtcassify = []
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        hengData = []
        shuData = []
        dtcassify = []
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