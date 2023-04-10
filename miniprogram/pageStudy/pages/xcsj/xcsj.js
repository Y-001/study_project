import * as echarts from "../../../components/ec-canvas/echarts.min";
import {dateFormat} from "../../../utils/index"
const db = wx.cloud.database()
var hengData = [0]
var shuData = [0]
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
            // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
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
                name: '学习时长',
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
        //累计读经典
        totalBook:0,
        //累计学习分钟
        totalmin:0,
        //累计完成经典
        totalbookdone:0

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            userInfo: JSON.parse(wx.getStorageSync('userInfo'))
        })
        //获取用户计划
        db.collection('users').where({
            _openid: wx.getStorageSync('openid')
        }).get().then(res => {
            if ('studyplan' in res.data[0] && 'calendar' in res.data[0].studyplan) {
                let { createtime, studyday, calendar } = res.data[0].studyplan
                const one_day = 86400000; // 24 * 60 * 60 * 1000;
                // const addVal = dayNum * one_day + createtime;
                for(let i=0;i<studyday;i++){
                    hengData.push(dateFormat(i * one_day + createtime))
                }
                // console.log(hengData)
                hengData.forEach((item,index)=>{
                    calendar.forEach(rizi=>{
                        if(item==rizi.day){
                            shuData[index]=rizi.stayTime
                        }
                    })
                })
                // console.log(shuData)
                this.setData({
                    visible:true
                })
            }
            if('lastRead' in res.data[0]){
                this.setData({
                    totalBook:res.data[0].lastRead.length
                })
            }
        })
        //获取累计学习分钟
        db.collection('bookstars').where({
            _openid: wx.getStorageSync('openid')
        }).get().then(res=>{
            // console.log(res.data)
            let sum=0
            res.data.forEach(item=>{
                sum+=item.studytime
                this.setData({
                    totalmin:sum
                })
            })
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