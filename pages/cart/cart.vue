<template>
  <view>
    <my-login v-if="!userInfo"></my-login>
 <view class="" v-else >
   <view class="cart-page-box" v-if="cart.length!==0">
     <view class="cart-page">
       <!-- 地址组件 -->
       <my-address></my-address>
       <view class="cart-container">
         <view class="cart-head">
           <view class="cart-icon">
             <van-icon name="shop-o" />
             <text>购物车</text>
           </view>
           <view class="edit-box" @click="changeEdit()">
             <text v-if="!editState">编辑</text>
             <text v-else>完成</text>
           </view>
         </view>
         <!-- 商品 -->
         <view class="cart-goods" v-for="(item, i) in cart" :key="item.goods_id">
           <view class="address-item-change">
             <van-checkbox :value="item.goods_state" shape="round" checked-color="#fe3232"
               @change="changeGoodsState(item)" :class="{animation:item.goods_state}"></van-checkbox>
           </view>
           <goods-order :goodsDetail="item" @click.native="gotoGoodsDetail(item)"></goods-order>
         </view>
       </view>
     </view>
     <!-- 提交 -->
     <van-submit-bar v-if="!editState" :price="totalPrice.toString()+'00'-0" @submit="gotoOrder()" button-text="提交订单">
       <view class="address-item-change">
         <van-checkbox :value="istrue" shape="round" checked-color="#fe3232" @change="allChoice()"
           :class="{animation:istrue}"></van-checkbox>全选
       </view>
     </van-submit-bar>
     <!-- 删除 -->
     <van-submit-bar v-else @submit="deleteCart()" button-text="删除">
       <view class="address-item-change">
         <van-checkbox :value="istrue" shape="round" checked-color="#fe3232" @change="allChoice()"
           :class="{animation:istrue}"></van-checkbox>全选
       </view>
     </van-submit-bar>
   </view>
   <van-empty v-else class="custom-image"
     image="https://img11.360buyimg.com/jdphoto/s180x180_jfs/t18163/292/540553659/74408/adeb7463/5a93c51cN3bb5e37b.png"
     description="您的购物车是空的" />
 </view>
 
  </view>

</template>

<script>
  import {
    mapState,
    mapMutations
  } from 'vuex'
  export default {
    data() {
      return {
        whetherLogin:false,
        istrue: true,
        price: 0,
        editState: false
      };
    },

    onLoad() {
      this.goodsState()
      uni.$on('goodsPrice', (val) => {
        this.cart.some(item => {
          if (item.goods_id == val.goodsID) {
            item.goods_count = val.goddsCount
            this.saveToStorage()
          }
        })
      })
    },
    methods: {
      ...mapMutations('my_cart', ['saveToStorage', 'updateCart']),
      allChoice(e) {
        this.istrue = !this.istrue
        this.cart.forEach(item => item.goods_state = e.detail)
        this.saveToStorage()
      },

      changeGoodsState(item) {
        item.goods_state = !item.goods_state
        this.goodsState()
      },

      goodsState() {
        let state = true
        this.cart.forEach(item => !item.goods_state ? state = false : state)
        state ? this.istrue = true : this.istrue = false
        this.saveToStorage()
      },

      gotoOrder(e) {
        //console.log(e);
        let cart = {}
        cart.goodsList = this.cart.filter(item => item.goods_state)
          
        if(cart.goodsList.length==0){
          uni.$showMsg('请选择商品')
        }else{
          cart.totalPrice = this.totalPrice
          uni.navigateTo({
            url: `/subpkg/order_details/order_details?cart=${JSON.stringify(cart)}`
          })
        }
      
      },
        
      gotoGoodsDetail(item){
        uni.navigateTo({
          url:`/subpkg/goods_detail/goods_detail?goods_id=${item.goods_id}`
        })
      },

      changeEdit() {
        this.editState = !this.editState
      },

      deleteCart() {
        let cart = this.cart.filter(item => !item.goods_state)
          //console.log(cart);
        if(cart.length!==0){
         uni.$showMsg('请选择商品')
        }else{
          uni.setStorageSync('cart', JSON.stringify(cart))
          this.updateCart()
          
          if (this.cart.length == 0) {
            this.editState = false
            uni.removeStorageSync('cart')
          }
        }
      }
    },

    computed: {
      ...mapState('my_cart', ['cart']),
      ...mapState('my_user', ['userInfo']),

      totalPrice() {
        let allPrice = 0
        this.cart.forEach(item => {
          if (item.goods_state) {
            allPrice += (item.goods_price > 30 ? item.goods_price - 30 : item.goods_price) * item.goods_count
          }
        })
        return allPrice
      }
    }
  }
</script>

<style lang="scss">
  .van-empty {
    padding: 160px 0 !important;
  }
 .van-empty__image {
    width: 150rpx !important;
    height: 150rpx !important;
  }

  .van-submit-bar__bar {
    justify-content: space-between !important;
  }

  .cart-page {
    padding-bottom: 60px;
  }

  .cart-container {
    margin: 20rpx 0;
    padding: 20rpx;
    background-color: #fff;
    border-radius: 20rpx;

    .cart-head {
      margin: 20rpx 0;
      font-size: 45rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .cart-icon {
        display: flex;
        align-items: center;
      }

      text {
        margin: 0 15rpx;
        font-size: 28rpx;
      }

      .edit-box {
        padding: 5rpx 15rpx;
        border-radius: 100rpx;
        background-color: #fe3232;
        color: #fff;
        text-align: center;
      }
    }
  }

  .address-item-change {
    display: flex;
    align-items: center;
  }

  .cart-goods {
    display: flex;
    align-items: center;
  }



  .animation {
    animation: jelly 0.6s ease;
  }

  @keyframes jelly {
    from {
      transform: scale(1, 1);
    }

    30% {
      transform: scale(1.25, 0.75);
    }

    40% {
      transform: scale(0.75, 1.25);
    }

    50% {
      transform: scale(1.15, 0.85);
    }

    65% {
      transform: scale(0.95, 1.05);
    }

    75% {
      transform: scale(1.05, 0.95);
    }

    to {
      transform: scale(1, 1);
    }
  }
</style>
