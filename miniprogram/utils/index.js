//计算几天后是什么日期
export function getLaterDate(dayNum, dateTime = null) {
    // 如果为null,则格式化当前时间为时间戳
    if (!dateTime) dateTime = +new Date();
    // 如果dateTime长度为10或者13，则为秒和毫秒的时间戳，如果超过13位，则为其他的时间格式
    if (dateTime.toString().length == 10) dateTime *= 1000;
    const timestamp = +new Date(Number(dateTime));
  
    const one_day = 86400000; // 24 * 60 * 60 * 1000;
    const addVal = dayNum * one_day + timestamp;
    //x天后的日期
    const date = new Date(addVal);
  
    //格式化日期
    const filters = n => {
      return n < 10 ? (n = '0' + n) : n;
    };
    const month = filters(date.getMonth() + 1);
    const day = filters(date.getDate());
    const hours = filters(date.getHours());
    const minutes = filters(date.getMinutes());
    const seconds = filters(date.getSeconds());
  
    // const lastTime = `${date.getFullYear()}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    const lastTime = `${date.getFullYear()}/${month}/${day}`;
    return lastTime;
  }
  



//时间格式化函数
export function dateFormat(date) {
    date=new Date(date)
    var year = date.getFullYear();                // 年
    var month = showTime(date.getMonth() + 1);        // 月
    var week = showTime(date.getDay());           // 星期
    var day = showTime(date.getDate());          // 日
    var hours = showTime(date.getHours());         // 小时
    var minutes = showTime(date.getMinutes());    // 分钟
    var second = showTime(date.getSeconds());     // 秒
    var str = '';
    // str = str + year + '-' + month + '-' + week + '-' + day + '-' + hours + '-' + minutes + '-' + second
    str=str + year + '/' + month + '/' + day
    // document.write(str);
    return str
    // 封装一个不够两位数就补零的函数
    function showTime(t) {
        var time
        time = t > 10 ? t : '0' + t
        return time
    }
}









export const ajax = (url, method, data) => {
    const base_url = 'http://localhost:3001';
    return new Promise((resolve, reject) => {
        wx.request({
            url: `${base_url}${url}`,
            method: method ? method : 'GET',
            data,
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err);
            }
        })
    })
}