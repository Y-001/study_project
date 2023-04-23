import * as echarts from "../../../components/ec-canvas/echarts.min";
import {dateFormat} from "../../../utils/index"
const db = wx.cloud.database()
var hengData = [0]
var shuData = [0]
var myDate=[100, 100, 90, 50, 40,30,15]
var typename='开始'
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
            axisLabel: {
                textStyle: {
                    color: '#666',
                    padding: [0,0,0,0],
                    fontSize: 8
                },
                interval:1
            },
            axisLine: { 
                show: false,
                lineStyle: {
                    color: '#666',
                    width:1,
                },
            },
            // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            data: hengData
        },
        yAxis: {
            name: '时长（min）',
            nameTextStyle: {
                fontSize: 8,
                padding:[0,0,0,0],
            },
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
            // data: ['0', '20分钟后', '1小时后', '1天后', '1周后', '1月后'],
            data: ['开始', '1天后','2天后','3天后', '1周后', '1月后','3月后'],
            axisLabel: {
                textStyle: {
                    color: '#666',
                    padding: [10,0,0,0],
                    fontSize: 10
                },
                interval:0
            },
            axisLine: { 
                show: false,
                lineStyle: {
                    color: '#666',
                    width:1,
                },
            },
            splitLine: {
                show: false,
            },
            axisTick: {
                show: false,
            },
        },
        yAxis: {
            name: '记忆率（%）',
            nameTextStyle: {
                fontSize: 8,
                padding:[0,0,0,0],
            },
        },
        series: [
            {
                // name: '预警时间',
                type: 'line',
                markLine: {
                    itemStyle: { //盒须图样式。
                        normal: {
                            label:{
                                formatter: '今天'
                            }
                        }
                    },
                    //name: '预警时间',
                    //yAxisIndex: 0,
                    symbol:'none',//去掉箭头
                    data: [[
                        {coord: [typename, 0] },
                        {coord: [typename, 100] }
                    ]]
                }
            },
            {
                name: '艾宾浩斯遗忘曲线',
                type: 'line',
                symbol :'circle',
                smooth: true,
                data: [100,26,25,24, 23, 21,15]
            },
            {
                name: '你的学习遗忘曲线',
                type: 'line',
                symbol :'circle',
                smooth: true,
                data: myDate
            },
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
        pdprizeImg:'',
        ec1: {
            onInit: initChart
        },
        ec2: {
            onInit: initChart2
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
        let _this=this
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
                // 计算遗忘曲线 myData calendar
                let tody=dateFormat(new Date().getTime()).slice(8)
                // console.log(tody.slice(8))                
                let dy=hengData.map(item=>{
                    return item.toString().slice(8)
                })
                let chaday=tody-dy
                typename=chaday==1?'1天后':chaday==2?'2天后':chaday==3 || 4?'3天后':chaday>=5||chaday<30?'1周后':chaday>=30||chaday<90?'1月后':'3月后'

                

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
            let pdprize=res.data[0]?.pdprize || ''
                let img= _this.data.prizeList.filter(item=>{
                    return item.text==pdprize
                })[0]?.img || ''
                _this.setData({
                    pdprizeImg: img,
                })
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