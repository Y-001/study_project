// components/calendar/calendar.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
      lists:{
        type:Array,
        default:[],
        observer:function(newVal, oldVal) {
            // 属性值变化时执行
            this.getCalendar();
          }
      }
    },
   
    /**
     * 组件的初始数据
     */
    data: {
      curDate:'',//当天日期
      calendarList:[],//日历列表
      day:['S','M','T','W','T','F','S']
    },
    attached(){
      this.getCalendar(); //初始化日历
    },
    /**
     * 组件的方法列表
     */
    methods: {
      getCalendar(){
        // 获取当前月签到日期列表
        const signlist=this.properties.lists
        let curTime=new Date()
        let curYear=curTime.getFullYear()//当前年份
        let curMonth=curTime.getMonth()+1//当前月份
        let curDate=curTime.getDate()//当前日期
        
        // 获取当月第一天日期  当获取第一天的时候，月份是0~11，0代表获取1月1日
        let curFirstDate=new Date(curYear,curMonth-1,1)
        // 第一天周几
        let firstDay=curFirstDate.getDay()
        // 第一天日期
        let firstDate=curFirstDate.getFullYear()+'-'+(curFirstDate.getMonth()+1)+'-'+curFirstDate.getDate()
        // 获得当月最后一天是几号==本月有多少天  当获取最后一天的时候，月份需要加1
        let lastdate=new Date(curYear,curMonth,0).getDate()
        let bigarr=[]
        // 1号前面空格补上
        for(let d=0;d<firstDay;d++){
          bigarr[d]={num:0}
        }
        // 循环得到本月日历列表详情
        if(curMonth<10){
            curMonth='0'+curMonth
        }
        for(let i=1;i<=lastdate;i++){
            let dateitem=''
            if(i<10){
                 dateitem=curYear+'/'+curMonth+'/0'+i
            }else{
                 dateitem=curYear+'/'+curMonth+'/'+i
            }
          let type=''//before当前日期之前 day当天 after之后
          let sign='0'//表示没签到
          if(i<curDate){
            type='before'
          }else if(i==curDate){
            type='day'
          }else if(i>curDate){
            type='after'
          }
          // 看看当前日期是否在签到日期列表里面
          let samearr=signlist.filter(v=>v==dateitem)
          if(samearr.length==1){
            sign='1'
          }
        // if(signlist.includes(dateitem)){
        //     sign='1'
        // }
          let obj={
            date:dateitem,
            num:i,
            type:type,
            sign:sign
          }
          bigarr.push(obj)
        }
        this.setData({
          curDate:curDate,
          calendarList:bigarr
        })
        // console.log(this.data.calendarList)
      },
    }
  })