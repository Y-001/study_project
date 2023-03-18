Page({
      /**
       * 页面的初始数据
       */
      data: {
        currentMonthDays:0,
        startWeek:0,
        data_arr:["日","一","二","三","四","五","六"],
        year:"",
        month:"",
        today:2 //这是固定2号这天打开，连续几天打卡就用数组就好了
      },
    
      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function (options) {
        let now = new Date()
        let year = now.getFullYear()
        // month获取是从 0~11
        let month = now.getMonth() + 1
        this.setData({
          year,month
        })
        this.showCalendar()
      },
    
      showCalendar(){
        let {year,month} = this.data
        //以下两个month已经+1
        let currentMonthDays = new Date(year,month,0).getDate() //获取当前月份的天数
        let startWeek = new Date(year + '/' + month + '/' + 1).getDay(); //本月第一天是从星期几开始的
        this.setData({
          currentMonthDays,startWeek
        })
      },
    
      //上个月按钮
      bindPreMonth(){
        let {year,month} = this.data
        //判断是否是1月
        if(month - 1 >= 1){
          month = month - 1 
        }else{
          month = 12
          year = year - 1
        }
        this.setData({
          month,year
        })
        this.showCalendar()
      },
    
      //下个月按钮
      bindNextMonth(){
        let {year,month} = this.data
        //判断是否是12月
        if(month + 1 <= 12){
          month = month + 1 
        }else{
          month = 1
          year = year + 1
        }
        this.setData({
          month,year
        })
        this.showCalendar()
      }
    })