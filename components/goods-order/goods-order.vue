<template>
  <view>
   <view class="goods-order-box">
     <view class="goods-order-left">
       <image :src="goods.goods_small_logo" mode=""></image>
     </view>
     <view class="goods-order-right">
       <view class="goods-order">
       {{goods.goods_name}}
       </view>
       <view class="goods-price-box">
         <view class="goods-price">
           ￥{{goods.goods_price.toFixed(2)}}
         </view>
         <view class="goods-count-box">
           <van-icon name="minus" :class="{'minus-icon':count===1?'minus-icon':''}" @click="reduceCount()" />
           <view class="goods-count">
            {{count}}
           </view>
           <van-icon name="plus" :class="{'minus-icon':count>=999?'minus-icon':''}" @click="addCount()" />
         </view>
              </view>
         <view class="discount-price-box">
           <view class="discount-price">
             每件到手价￥{{(goods.goods_price<=30?goods.goods_price:goods.goods_price-30).toFixed(2)}}
           </view>
           <view class="discount-service">
             <text>支持7天无理由退货</text>
             <text>自营专享价</text>
           </view>
         </view>
     </view>
   </view>
  </view>
</template>

<script>
  export default {
    name:"goods-order",
    props:['goodsDetail'],
    data() {
      return {
        count:this.goodsDetail.goods_count,
        goods:this.goodsDetail,
        totalPrice:0
      }; 
    },
       
     created(){
       uni.$emit('totalPrice',this.goods.goods_price>30?this.goods.goods_price-30:this.goods.goods_price)
     },
    
    methods:{
      reduceCount(){
        if(this.count==1) return
        this.count--
       this.totalPrice=(this.goods.goods_price>30?this.goods.goods_price-30:this.goods.goods_price)*this.count
          // this.totalPrice=this.goods.goods_price*this.count
        let goodsPrice={goddsCount:this.count,goodsID:this.goodsDetail.goods_id}
        uni.$emit('totalPrice',this.totalPrice)
        uni.$emit('goodsPrice',goodsPrice)
      },
       
     addCount() {
     if(this.count==999) return
     this.count++
      this.totalPrice=(this.goods.goods_price>30?this.goods.goods_price-30:this.goods.goods_price)*this.count
      // this.totalPrice=this.goods.goods_price*this.count
     let goodsPrice={goddsCount:this.count,goodsID:this.goodsDetail.goods_id}
     uni.$emit('totalPrice',this.totalPrice)
     uni.$emit('goodsPrice',goodsPrice)
     }
    }
  }
</script>

<style lang="scss" scoped>
  
.goods-order-box{
  margin: 20rpx 0;
  display: flex;
    
  .goods-order-left{
      
    image{
      width: 160rpx;
      height: 160rpx;
    }
  }
  
    
  .goods-order-right{
      padding:0 20rpx;
    .goods-order{
      width: 450rpx;
       font-size: 28rpx;
       white-space: nowrap;
       overflow: hidden;
       text-overflow: ellipsis;
    }
    
    .goods-price-box{
      display: flex;
      margin: 20rpx 0 10rpx ;
      height: 20px;
      align-items: center;
      justify-content: space-between;
        
      .goods-price{
        font-weight: 700;
        color: #fd4443;
      }
        
      .goods-count-box{
        width: 90px;
        margin-right:50rpx;
        display: flex;
        align-items:center;
        justify-content: space-between;
          
        .minus-icon{
          color: #dddddd !important;
        }
        .goods-count{
          width: 80rpx;
          height: 40rpx;
          line-height: 40rpx;
          font-size: 28rpx;
          border-radius: 10rpx;
          padding: 5rpx;
          background-color: #f6f6f6;
          text-align: center;
        }
      }
    }
      
    .discount-price-box{
        
      .discount-price{
        font-size: 26rpx;
        color: #fd4443;
      }
        
      .discount-service{
        margin: 15rpx 0;
        font-size: 18rpx;
        
        text{
          margin-right: 10rpx;
          border: 1rpx solid #fd4443;
          padding: 0 5rpx;
          border-radius: 8rpx;
          color: #fd4443;
        }
      }
    }
  }
}
</style>