export const ajax = (url, method,data)=>{
    const base_url='http://localhost:3001';
    return new Promise((resolve,reject)=>{
        wx.request({
          url: `${base_url}${url}`,
          method:method? method:'GET',
          data,
          success:(res)=>{
              resolve(res);
          },
          fail:(err)=>{
              reject(err);
          }
        })
    })
}