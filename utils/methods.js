//封装弹框
uni.$showMsg=function(title='数据请求失败！',duration=1500,icon='none'){
  uni.showToast({
    title,
    duration,
    icon
  })
}