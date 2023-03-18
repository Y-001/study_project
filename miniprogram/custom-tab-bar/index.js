Component({
    data:{
        select:0,
        list:[
            {
                pagePath: "/pages/index/index",
                text: "学经典",
                iconPath: "../images/icon-bookshelf.png",
                selectedIconPath: "../images/icon-bookshelf1.png",
                type:0,
            },
            {
                pagePath: "/pages/store/store",
                text: "看经典",
                iconPath: "../images/icon-store.png",
                selectedIconPath: "../images/icon-store1.png",
                type:0,
            },
            {
                pagePath:'/pages/question/question',
                type:1,
            },
            {
                pagePath: "/pages/talk/talk",
                text: "论经典",
                iconPath: "../images/icon-talk.png",
                selectedIconPath: "../images/icon-talk1.png",
                type:0,
            },
            {
                pagePath: "/pages/me/me",
                text: "我的",
                iconPath: "../images/icon-me.png",
                selectedIconPath: "../images/icon-me1.png",
                type:0,
            }
        ]
    },
    methods:{
        selectPage(e){
            const {index,page,type}=e.currentTarget.dataset;
            //console.log(page)
            if(index !== this.data.select && type === 0){
                wx.switchTab({
                  url: page,
                })
            }
            if(type===1){
                wx.navigateTo({
                  url: page,
                })
            }
        },
    }
})