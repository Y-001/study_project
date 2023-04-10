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
    date = new Date(date)
    var year = date.getFullYear();                // 年
    var month = showTime(date.getMonth() + 1);        // 月
    var week = showTime(date.getDay());           // 星期
    var day = showTime(date.getDate());          // 日
    var hours = showTime(date.getHours());         // 小时
    var minutes = showTime(date.getMinutes());    // 分钟
    var second = showTime(date.getSeconds());     // 秒
    var str = '';
    // str = str + year + '-' + month + '-' + week + '-' + day + '-' + hours + '-' + minutes + '-' + second
    str = str + year + '/' + month + '/' + day
    // document.write(str);
    return str
    // 封装一个不够两位数就补零的函数
    function showTime(t) {
        var time
        time = t >= 10 ? t : '0' + t
        return time
    }
}
export function dealComment(commentlist) {
    // deal comment tree
    var comments = (commentlist instanceof Array) ? commentlist : [];
    var result = [];
    // find the comment which the fatherRoot is root
    comments.forEach(function (item, index) {
        if (item.fatherRoot === 'root') {
            result.push({ rootComment: item, child: [] });
        }
    });
    var noRootComments = removeElement(comments, result);
    // 下边新写
    var findChilds=function(result,noRootComments){
        result.forEach(resitem=>{
            var resultArr = [];
            // var tempArr=noRootComments.filter(notRootItem=>{
            //     return notRootItem.fatherRoot==resitem.rootComment.commentid
            // })
            // tempArr.forEach((tmpItem)=> {
            //     // tmpItem.reply = resitem.rootComment.nickname;
            //     resultArr.push({ rootComment: tmpItem, child: [] });
            // });
            // resultArr = resultArr.concat(tempArr);
            noRootComments.forEach(function (item, index) {
                if (item.fatherRoot == resitem.rootComment.commentid) {
                    resultArr.push({ rootComment: item, child: [] });
                }
            });
            resitem.child = resultArr;
            if(resultArr.length<noRootComments.length){
                let noRootComment = removeElement(noRootComments, resultArr);
                findChilds(resultArr,noRootComment)
            }
        })
    }
    findChilds(result,noRootComments)
    // 评论排序
    result.sort(function (comment1, comment2) {
        return comment2.rootComment.time - comment1.rootComment.time
    });
    // cb(null, { code: 0, comments: result });
    return result
}
function removeElement(arr, ele){
    let result  = [];
    if(arr instanceof Array){
      if(ele instanceof Array){
        result = arr.filter(function(item){
          let isInEle = ele.some(function(eleItem){
            return item === eleItem;
          });
          return !isInEle
        })
      }else{
        result = arr.filter(function(item){
          return item !== ele
        })
      }
    }else{
      console.log('parameter error of function removeElement');
    }
    return result;
  }



//处理评论
// export function dealComment(commentlist) {
//     // deal comment tree
//     var comments = (commentlist instanceof Array) ? commentlist : [];
//     var result = [];
//     // find the comment which the fatherRoot is root
//     comments.forEach(function (item, index) {
//         if (item.fatherRoot === 'root') {
//             result.push({ rootComment: item, child: [] });
//         }
//     });
//     var noRootComments = removeElement(comments, result);
//     // find the comment whitch facther is not root, pack them into an array
//     result.forEach(function (resultItem) {
//         var resultArr = [];
//         var findChildAndSon = function (commentid, nickname,noRootComments) {
//             var tmpArr = noRootComments.filter(function (notRootItem) {
//                 return notRootItem.fatherRoot === commentid
//             });
//             tmpArr.forEach(function (tmpItem) {
//                 tmpItem.reply = nickname;
//             });
//             resultArr = resultArr.concat(tmpArr);
//             // when this comment has child
//             // if (tmpArr.length > 0) {
//             //     tmpArr.forEach(function (childItem) {
//             //         findChildAndSon(childItem.commentid, childItem.nickname);
//             //     });
//             // }
//             // 新加
//             if(tmpArr.length<noRootComments.length){
//                 let cComments = removeElement(noRootComments, tmpArr);
//                 tmpArr.forEach(function (childItem) {
//                     findChildAndSon(childItem.commentid, childItem.nickname,cComments);
//                 });
//             }
//             resultItem.child = resultArr;
//         };
//         findChildAndSon(resultItem.rootComment.commentid, resultItem.rootComment.nickname,noRootComments);
//         // resultItem.child = resultArr;
//     });
//     // 评论排序
//     result.sort(function (comment1, comment2) {
//         return comment2.rootComment.time - comment1.rootComment.time
//     });
//     // cb(null, { code: 0, comments: result });
//     return result
// }
// function removeElement(arr, ele){
//     let result  = [];
//     if(arr instanceof Array){
//       if(ele instanceof Array){
//         result = arr.filter(function(item){
//           let isInEle = ele.some(function(eleItem){
//             return item === eleItem;
//           });
//           return !isInEle
//         })
//       }else{
//         result = arr.filter(function(item){
//           return item !== ele
//         })
//       }
//     }else{
//       console.log('parameter error of function removeElement');
//     }
//     return result;
//   }


//生成唯一不重复ID
export  function generateUuid (length=5){
    return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36);
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