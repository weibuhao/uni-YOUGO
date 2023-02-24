export const filterArr = (arr, val) => {
  if (arr.length == 0) {
    arr.push(val)
    uni.navigateBack({
      delta:1
    })
    uni.setStorageSync('addressList_key', JSON.stringify(arr))
  } else {

    let newArr = JSON.parse(uni.getStorageSync('addressList_key'))
    if (val.addressDefault) {
      newArr.forEach(item => item.addressDefault = false)
    }
    let istrue = false
    newArr.some((item) => {
      if (item.consignee == val.consignee && item.contact == val.contact && item.addressDetailed == val
        .addressDetailed && item.addressProvince == val.addressProvince) {
       return istrue = true
      }
    })
    if (!istrue) { 
      newArr.unshift(val)
      uni.setStorageSync('addressList_key', JSON.stringify(newArr))
    } else {
      uni.$showMsg('您已添加过该地址')
    }
  }
}
