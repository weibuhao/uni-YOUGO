// 获取轮播图数据
  export const getSwitchList = async () => {
    const {
      data: res
    } = await uni.$http.get('/api/public/v1/home/swiperdata')
    if (res.meta.status >= 400) return uni.$showMsg()
    return res.message
  }

  //获取导航栏数据
  export const getNavList = async () => {
    const {
      data: res
    } = await uni.$http.get('/api/public/v1/home/catitems')
    if (res.meta.status >= 400) return  uni.$showMsg()
    return res.message
  }

  //获取楼层图数据
  export const getFloorList = async () => {
    const {
      data: res
    } = await uni.$http.get("/api/public/v1/home/floordata")
    if (res.meta.status >= 400) return uni.$showMsg()
    
    res.message.forEach(item=>{
      item.product_list.forEach(prod=>{
      prod.url='/subpkg/goods_list/goods_list?'+prod.navigator_url.split('?')[1]
    })
    })
    return res.message
  }
  