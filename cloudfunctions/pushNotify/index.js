// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()
const kTableName = 'todos'

// 云函数入口函数
exports.main = async (event, context) => {
    try {
      // --- 步骤1 ---
      // 从云开发数据库中查询等待发送的消息列表
      const msgArr = await db
        .collection(kTableName)
        // 查询条件
        .where({
          checked: false,
          pushed: true,
        })
        .get()
  
      // --- 步骤2 ---
      for (const msgData of msgArr.data) {
        // 发送订阅消息
        await cloud.openapi.subscribeMessage.send({
          touser: msgData._openid, // 要发送用户的openid
          page: '/pageNote/pages/daiban2/daiban2', // 用户通过消息通知点击进入小程序的页面
          lang: 'zh_CN',
          // 订阅消息模板ID
          // 替换为你的模板id!
          templateId: 'N-dxzhUUJRG4E-tgE6ooHLY9k7V7CEC_zw2C_DzgBs8',
          // 跳转小程序类型：developer为开发版；trial为体验版；formal为正式版；默认为正式版
          // 正式版删除此行
          miniprogramState: 'developer',
          // 要发送的数据，要和模板一致
          data: {
            // 待办的主题
            thing1: {
              value: msgData.content === '' ? '无' : sliceBodyStr(msgData.content, 16)
            },
            // 待办的详情
            time2: {
              value: forTime(msgData.date)
            },
          }
        })
  
        // --- 步骤3 ---
        // 发送成功后将pushed数据状态重置
        db
          .collection(kTableName)
          .doc(msgData._id)
          .update({
            data: {
              pushed: false
            },
          })
      }
  
      // --- 步骤4 ---
      return msgArr
    } catch (e) {
      return e
    }
  }
// 云函数入口函数
// exports.main = async (event, context) => {
//     const wxContext = cloud.getWXContext()

//     return {
//         event,
//         openid: wxContext.OPENID,
//         appid: wxContext.APPID,
//         unionid: wxContext.UNIONID,
//     }
// }
function forTime(time){
    let date=new Date(time)
    let yy=date.getFullYear()
    let mon=date.getMonth()
    let day=date.getDate()
    let h=date.getHours()
    let min=date.getMinutes()
    if(min<10){
        min='0'+min
    }
    if(h<10){
        h='0'+h
    }
    return yy+'年'+mon+'月'+day+'日'+' '+h+':'+min
}
// 将太长的文本截短
function sliceBodyStr(str, length) {
    if (str.length <= length) {
      return str
    } else {
      return str.slice(0, length) + '...'
    }
  }