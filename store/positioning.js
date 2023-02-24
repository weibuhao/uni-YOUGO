import QQMapWX from '@/utils/wx-jssdk/qqmap-wx-jssdk.min.js';
export default {
  namespaced: true,
  state: () => ({
    positioning: '',
    addressCode: "110101",
    addressList:JSON.parse(uni.getStorageSync('addressList_key')||'[]'),
    address: {
      consignee: '',
      contact: '',
      addressDetailed: '',
      addressType: '家',
      addressDefault: true
    }
  }),
  mutations: {
    getCity(state) {
      // 向用户发起授权请求，弹框提示
      uni.authorize({
        // 获取用户定位信息
        scope: "scope.userLocation",
        // 用户同意授权执行
        success() {
          uni.$showMsg('正在获取定位！')
          // 引入腾讯地图api
          // 实例化API核心类
          let qqmapsdk = new QQMapWX({
            // 填写自己的Key值，这个值是与AppID绑定的
            key: '6TKBZ-RHUKU-LUWVK-BZJHF-CB64K-ZLBHA'
          });
          //获取位置信息
          uni.getLocation({
            type: 'wgs84',
            success(res) {
              // 逆地址解析方法
              qqmapsdk.reverseGeocoder({
                location: {
                  latitude: res.latitude,
                  longitude: res.longitude
                },
                success(res) {
                  state.positioning =
                    `${res.result.address_component.province}、${res.result.address_component.city}、${res.result.address_component.district ? res.result.address_component.district : res.result.address_component.street}`
                  state.addressCode = res.result.ad_info.adcode
                  state.address.addressDetailed = res.result.formatted_addresses.recommend
                },
                fail(res) {
                  //console.log('逆地址解析方法' + res)
                }
              })
            },
            fail(res) {
              uni.$showMsg('注意：你未开启定位，功能将无法使用', 'error', 3000)
              //console.log('你未开启定位' + res)
            }
          })
        },
        // 若用户不同意授权，弹框提示
        fail(res) {
          // 这里是封装了一个提示框方法
          uni.$showMsg('注意：需要获取您的定位授权,否则部分功能将无法使用')
        }
      })
    },
    changeAddress(state, val) {
        
      if( typeof val ==='object'){
        state.positioning = val.address
        state.addressCode = val.addressCode
      }else{
         state.positioning = val
      }
      
    },
    
    resetInfo(state){
      state.positioning = ''
      state.addressCode ='110101'
    },
      
    updateAddressList(state){
      state.addressList=JSON.parse(uni.getStorageSync('addressList_key'))
        
      if(state.addressList.length===1&&!state.addressList[0].addressDefault){
        state.addressList[0].addressDefault=true
      }
      uni.$showMsg('保存成功！')
      uni.navigateBack({
       delta:1
      })
    }

  }
}
