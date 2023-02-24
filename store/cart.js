  export default{
  namespaced:true,
  state:()=>({
    // 购物车数组,存放每个商品的相关数据
    // 每个商品的信息对象必须包含下面六个属性
    // {goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state}
    cart:JSON.parse(uni.getStorageSync('cart')||'[]')
  }),
  
  mutations:{
      
    addToCart(state,goods){
     const findResult= state.cart.find(x=>x.goods_id===goods.goods_id)
       
     if(!findResult){
       state.cart.unshift(goods)
     }else{
       findResult.goods_count++
     }
     this.commit('my_cart/saveToStorage')
    },
    saveToStorage(state){
      uni.setStorageSync('cart',JSON.stringify(state.cart))
    },
    updateCart(state){
    state.cart= JSON.parse(uni.getStorageSync('cart') )
    }
  }
}