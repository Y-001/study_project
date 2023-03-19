// pages/classify/classify.js
const db=wx.cloud.database()
const _ =db.command
let timer=null
Page({

    /**
     * 页面的初始数据 
     */
    data: {
        /* 搜索框的输入 */
        search:'',
        //临时展示
        bookTemp:[],
        /* 展示loading还是done */
        show:true,
        /* 搜索历史 */
        searchLog:[],
        active: 0,
        //结果
        bookRes:[]
        
    },
    //点击历史记录
    getLog(e){
        let {item} = e.currentTarget.dataset
        this.setData({
            search:item
        })
    },
    //搜索书籍内容
    getBookList(name){
        return new Promise((resolve)=>{
            db.collection('booklists').where({
                name: {
                  $regex: '.*' + name,
                  $options: 'i'
                }
              }).get().then(res=>{
                  let books=res.data
                  resolve(books)
              })
        })
    },
    //去详情页
    toDetail(e){
        let {id}=e.currentTarget.dataset
        db.collection("booklists").doc(id).update({
            data:{
                hot:_.inc(1)
            }
        })
        wx.navigateTo({
          url: `/pageRead/pages/detail/detail?id=${id}`,
        })
    },
    /* 清空搜索历史 */
    deleteLog(e){
        this.setData({
            searchLog:[]
        })
        wx.removeStorageSync('searchLog')
    },
    /* 搜索过程 */
    searchChange(e){
        //console.log(e.detail)
        if(timer) clearTimeout(timer)
        timer=setTimeout(()=>{
            let search=e.detail
            this.setData({
                search
            })
            let searchLog=wx.getStorageSync('searchLog');
            if(!!search){
                if(searchLog){
                    searchLog.unshift(search)
                }
                else{
                    searchLog=[search]
                }
                wx.setStorageSync('searchLog', searchLog)
                this.setData({
                    searchLog
                })
                this.getBookList(search).then(res=>{
                    this.setData({
                        bookTemp:res
                    })
                })
            }
        },1000)
    },
    /* 按下搜索按钮 */
    searchDone(e){
        let search=e.detail
        // console.log(search)
        this.setData({
            show:false
        })
        this.getBookList(search).then(res=>{
            res.forEach(item=>{
                let name=item.name.match(/《(.*?)》/g)[0].replace("《",'').replace("》",'')
               item.name=name
            })
            this.setData({
                bookRes:res
            })
        })
    },
    /* 切换标签 */
    onChange(event) {
        wx.showToast({
          title: `切换到标签 ${event.detail.name}`,
          icon: 'none',
        });
      },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let searchLog=wx.getStorageSync('searchLog')
        if(searchLog){
            this .setData({
                searchLog
            })
        }
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