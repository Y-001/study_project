
Page({
 
    /**
     * 页面的初始数据
     */
    data: {
        list:[], //定义一个空数组
        name:'', //输入的内容
        Num:0, // 完成的数量
        isCheckAll: false // 默认不全选
    },
    add(e){
        //正则验证 不能是空格 内容长度不能大于10 不可以输入特殊符号
        let valueReg = /^[\u4e00-\u9fa5a-zA-Z\d]{1,10}$/
        if (!valueReg.test(this.data.name)){
			wx.showToast({
				title: '内容不符合规范',
				icon:"none"
			})
			return;
        }
        let list=this.data.list
        list.push({name:this.data.name,checked:false})
        this.setData({ //视图刷新
 
            list:list,
            name:''
        })
        //调用函数 计算未完成的数量 和存到本地
        this.getNum()
    },
    //计算未完成的数量 和存到本地
    getNum(){
        this.setData({ //视图刷新
            Num: this.data.list.filter(item=> !item.checked).length
        })
        wx.setStorageSync('admin', this.data.list)
    },
    //单个任务的勾选事件
    ass(e){
        //获取当前下标
        console.log(e.currentTarget.dataset.index);
        //将 e.currentTarget.dataset.index 赋给 i i就是当前下标
        let i = e.currentTarget.dataset.index
        this.setData({//视图刷新
            //进行反选
            [`list[${i}].checked`]:!this.data.list[i].checked,
        })
        this.setData({//视图刷新
            //this.data.list.checked 全部勾选 全选高亮
            isCheckAll:this.data.list.every(item=>item.checked)
        })
        //调用函数 计算未完成的数量 和存到本地
        this.getNum()
    },
    //单个删除
    del(e){
        //获取下标 进行删除
        let i = e.currentTarget.id
        if(this.data.list[i].checked){ //if判断 为true 不删除 为false删除
            return
        }
        //删除的i下标 1删除的数量
        this.data.list.splice(i,1)
        this.setData({//视图刷新
            list:this.data.list
        })
        //调用函数 计算未完成的数量 和存到本地
        this.getNum()
    },
    //全选
    checkAll(){
        this.setData({//视图刷新
            //反选 若果this.data.isCheckAll为true 反选为 false
            //反选 若果this.data.isCheckAll为false 反选为 true
            isCheckAll: !this.data.isCheckAll
        })
        //forEach循环
        this.data.list.forEach(item=>{
            //将this.data.isCheckAll的值赋给this.data.list.checked
            item.checked = this.data.isCheckAll
        })
        this.setData({//视图刷新
            list:this.data.list
        })
        //调用函数 计算未完成的数量 和存到本地
        this.getNum()
    },
    //清空完成事件
    dels(){
        this.setData({//视图刷新
            //将this.data.list.checked 为false筛选出来 
            list:this.data.list.filter(item=> !item.checked),
            isCheckAll:false
        })
        //调用函数 计算未完成的数量 和存到本地
        this.getNum()
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        //获取本地数据
        this.setData({
            list:wx.getStorageSync('admin') || []
        })
    },
 
})