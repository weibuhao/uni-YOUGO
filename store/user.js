  
export default{
  namespaced:true,
  state:()=>({
    userInfo:JSON.parse(uni.getStorageSync('userInfo')||true)
  }),
  
  mutations:{
      
    updataUserInfo(state){
      state.userInfo=JSON.parse(uni.getStorageSync('userInfo')||true)
    }
  }
}