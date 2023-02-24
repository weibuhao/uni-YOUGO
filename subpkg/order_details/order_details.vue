<template>
  <view>
    <my-address></my-address>
    <view class="goods-order-container">
      <view class="shop">
        <van-icon name="newspaper-o" />
        <text>官方自营</text>
      </view>
      <goods-order :goodsDetail="goodsDetail" v-if="goodsDetail"></goods-order>
      <van-card v-else v-for="(item, i ) in cart" :key="item.goods_id" tag="官方" :num="item.goods_count"
        :price="(item.goods_price>30?item.goods_price-30:item.goods_price)+'.00'" :title="item.goods_name"
        :thumb="item.goods_small_logo" />
      <view class="service-list">
        <view class="service-delivery">
          <text>配送</text>
          <text>顺丰快递（送货上门）</text>
        </view>
        <view class="service-delivery">
          <text>退换货免运费</text>
          <text>可享1次免费上门取件</text>
        </view>
      </view>
    </view>
    <van-submit-bar :price="(totalPrice.toString()+'00')-0" @submit="placeOrder()" button-text="提交订单" />
  </view>

</template>

<script>
  import {
    mapState
  } from 'vuex'
  export default {
    data() {
      return {
        goodsDetail: null,
        totalPrice: 0,
        cart: []
      };
    },

    onLoad(options) {
      //console.log(options);
      if (options.goods) {
        this.goodsDetail = JSON.parse(options.goods)
        uni.$on('totalPrice', (val) => {
          this.totalPrice = val
        })

      } else {
        let staging
        staging = JSON.parse(options.cart)
        this.cart = staging.goodsList
        this.totalPrice = staging.totalPrice
      }
    },

    methods: {
      //提交订单
      placeOrder() {
        //当没有收货地址时
        if (this.addressList.length == 0) {
          uni.$showMsg('请添加收货地址！')
        } else {
          //将默认地址分离出来
          const address = this.addressList.filter(item => item.addressDefault)
          const newAddress = `${address[0].addressProvince}、${address[0].addressDetailed}`
          //console.log(newAddress);
          if (this.goodsDetail) this.cart.push(this.goodsDetail)
          this.createOrder(newAddress, this.cart)
        }

      },

      //创建订单
      async createOrder(address, goodsList) {
        //console.log(goodsList);
        const orderInfo = {
          order_price: 0.01,
          consignee_addr: address,
          goods: goodsList.map(item => ({
            goods_id: item.goods_id,
            goods_number: item.goods_count,
            goods_price: item.goods_price > 30 ? item.goods_price - 30 : item.goods_price
          }))
        }
        //创建订单编号
        const {
          data: res
        } = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo)
        if (res.meta.status >= 400) return uni.$showMsg('创建订单失败！')

        const orderNumber = res.message.order_number
        //console.log(orderNumber);

        //订单预支付
        const {
          data: res2
        } = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', {
          order_number: orderNumber
        })
        if (res2.meta.status >= 400) return uni.$showMsg('预付订单生成失败！')
        const payInfo = res2.message.pay
        const [err, succ] = await uni.requestPayment(payInfo)
        // 3.2 未完成支付
        if (err){
          uni.$showMsg('支付完成！')
        }
      }
    },

    computed: {
      ...mapState('my_positioning', ['addressList'])
    }
  };
</script>

<style lang="scss">
  .van-card {
    background-color: #fff !important;
  }

  .goods-order-container {
    font-family: Times, serif;
    background-color: #fff;
    padding: 25rpx;
    margin: 25rpx 0;
    border-radius: 20rpx;

    .shop {
      color: #fd4443;

      text {
        font-size: 24rpx;
        // font-weight: 700;
      }
    }

    .service-delivery {
      display: flex;
      justify-content: space-between;
      height: 60rpx;
      line-height: 60rpx;

      text:nth-child(1) {
        font-weight: 700;
        font-size: 26rpx;
      }

      text:nth-child(2) {
        font-size: 22rpx;
      }
    }
  }
</style>
