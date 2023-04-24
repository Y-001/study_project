// pageHoutai/pages/tclassify/tclassify.js
const db=wx.cloud.database()
const _=db.command
Page({

    /**
     * 页面的初始数据
     */
    data: {
        banks:[],
        show:false,
        id:0,
        nowbank:'',
        // 角色类型
        array: ['用户', '超级管理员', '题库老师'],
        index:0,
    },
    getBank(e){
        this.setData({
            nowbank:e.detail.value
        })
    },
    bindPickerChange: function(e) {
        // console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
          index: e.detail.value
        })
      },
    async edit() {
        console.log('确认');
        let {id,array,index,nowbank}=this.data
        if(id==0){
            await db.collection('testclassifys').add({
                data:{
                    title:array[index],
                    bank:nowbank
                }
            }).then(res=>{
                wx.showToast({
                  title: '新增成功',
                  icon:'nono'
                })
            })
        }else{
            await db.collection('testclassifys').doc(id).update({
                data:{
                    title:array[index],
                bank:nowbank
                }
            }).then(res=>{
                wx.showToast({
                    title: '修改成功',
                    icon:'nono'
                  })
            })
        }
        this.onLoad()
      },
    
      onClose() {
        this.setData({ show: false });
      },
    // 修改或者新增题库分类
    toEditTclassify(e){
        let {id}=e.currentTarget.dataset
        let {banks,array}=this.data
        // console.log(id)
        let a=banks.filter(item=>{
            return item._id==id
        })
        let title='',index=0,bank=''
        if(a.length>0){
             title=a[0].title
             index=array.indexOf(title)
             bank=a[0].bank
        }
       
        this.setData({
            id,
            show:true,
            index:index,
            nowbank:bank
        })
        
    },
    onChange(e) {
        let title=e.detail.title
        this.getBankList(title)
      },
      //搜索题库
    getBankList(title){
        wx.showLoading({
          title: '加载中',
        })
        let banks=[]
        db.collection('testclassifys').where({
            title:title
        }).get().then(res=>{
            if(res.data.length==0){
                this.setData({
                    banks:[]
                })
                wx.hideLoading()
            }else{
                res.data.forEach(item=>{
                    banks.push(item)
                })
                this.setData({
                    banks
                })
                wx.hideLoading()
            }
        }).catch(err=>{
            console.log(err)
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getBankList('经论')
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