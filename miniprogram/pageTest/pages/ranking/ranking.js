// pages/ranking/ranking.js
const db=wx.cloud.database();
const _=db.command;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userSorce:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        const countResult=await db.collection('testexams').count()
        const total=countResult.total
        const MAX_LIMIT=20
        const total_times=Math.ceil(total/MAX_LIMIT)
        var userSorce=[]
        for(let i=1;i<=total_times;i++){
            await db.collection('testexams').skip((i-1)*MAX_LIMIT).limit(MAX_LIMIT).get().then(res=>{

                userSorce=Object.values(
                    res.data.reduce((acc,{_openid,userInfo,score})=>{
                        if(!acc[_openid]) acc[_openid]={_openid,userInfo,score:0};
                        acc[_openid].score +=score
                        return acc
                    },{})
                ).map(({_openid,userInfo,score})=>({_openid,userInfo,score}))
                // res.data.forEach(item=>{
                //     if(userSorce.length==0){
                //         userSorce.push({
                //             _openid:item._openid,
                //             userInfo:item.userInfo,
                //             score:item.score
                //         })
                //     }else{
                //         for(let i=0;i<userSorce.length;i++){
                //             if(userSorce[i]._openid==item._openid){
                //                 userSorce[i].score+=item.score
                //                 break
                //             }
                //             if(i==userSorce.length-1){
                //                 userSorce.push({
                //                     _openid:item._openid,
                //                     userInfo:item.userInfo,
                //                     score:item.score
                //                 })
                //                 return
                //             }
                //         }
                //     }
                // })
            })
        }
        // userSorce.score.sort((a,b)=>{
        //     return a-b
        // })
        // this.sortArr(userSorce,'score',false)

        this.setData({
            userSorce
        })
    },
    //冒泡法排序
 sortArr(arr, attr ='id',flag=true) {
        for (var i = 0; i < arr.length - 1; i++) {//比较arr.length-1轮
            for (var j = i + 1; j < arr.length; j++) {
                if (arr[i][attr] > arr[j][attr] && flag == true) {//交换
                    var temp = arr[i][attr];//临时变量
                    arr[i][attr] = arr[j][attr];
                    arr[j][attr] = temp;

                }else if(arr[i][attr] < arr[j][attr] && flag == false){
                    var temp = arr[i][attr];//临时变量
                    arr[i][attr] = arr[j][attr];
                    arr[j][attr] = temp;
                }
            }
        }
        return arr;
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