<template>
  <view v-if="goodsDetail.goods_name">
    <swiper :indicator-dots="true" :autoplay="true" circular :interval="3000" :duration="1000"
      indicator-active-color="#b2b2b2" indicator-color="#efefef">
      <swiper-item v-for="(item, index) in goodsDetail.pics" :key="item.pics_id">
        <view class="swiper-item">
          <image :src="item.pics_big" @click="preview(index)"></image>
        </view>
      </swiper-item>
    </swiper>
    <view class="goods-detail-box">
      <view class="goods-price">
        <text>￥{{goodsDetail.goods_price? priceToFixed(goodsDetail.goods_price):'0.00'}}</text>
        <text>￥{{priceToFixed(goodsDetail.goods_price+186)}}</text>
      </view>
      <view class="goods-title-box">
        <view class="goods-title-tiem">
          {{goodsDetail.goods_name}}
        </view>
        <view class="goods-Collection">
          <van-icon name="star-o" class="goods-Collection-icon" />
          <view class="goods-Collection-word">
            收藏
          </view>
        </view>
      </view>
      <text class="goods-express">快递：免运费</text>
    </view>
    <rich-text :nodes="goodsDetail.goods_introduce"></rich-text>
    <view class="goods-action-box">
      <van-goods-action>
        <van-goods-action-icon icon="chat-o" text="客服" />
        <van-goods-action-icon icon="cart-o" class="cartIcon" text="购物车" :info="CartCount===0||!userInfo?'':CartCount"
          @click="gotoCart()" />
        <van-goods-action-icon icon="shop-o" text="店铺" />
        <van-goods-action-button text="加入购物车" type="warning" @click="addCart()" />
        <van-goods-action-button @click="gotoOrderDetails()" text="立即购买" />
      </van-goods-action>
    </view>
  </view>
</template>

<script>
  import {
    mapState,
    mapMutations
  } from 'vuex'

  export default {
    // 计算属性
    computed: {
      // 导入vuex购物车数据
      ...mapState('my_cart', ['cart']),
      ...mapState('my_user', ['userInfo'])
    },
    data() {
      return {
        goodsDetail: {},
        CartCount: 0,
        seconds: 3,
        time: null
      };
    },
    onLoad(options) {
      // 发起数据请求
      this.getGoodsDetail(options.goods_id)
      // 将购物车数量赋值
      this.CartCount = this.cart.length
    },
    methods: {
      // 导入vuex的方法
      ...mapMutations('my_cart', ['addToCart', 'updateCart']),

      // 数据请求方法
      async getGoodsDetail(id) {
        const {
          data: res
        } = await uni.$http.get(`/api/public/v1/goods/detail?goods_id=${id}`)
        if (res.meta.status >= 400) return uni.$showMsg()
        res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g, '<img style="display:block;"')
          .replace(/webp/g, 'jpg')
        this.goodsDetail = res.message
      },

      //点击轮播图调用uni的方法全屏显示图片
      preview(index) {
        uni.previewImage({
          current: index,
          urls: this.goodsDetail.pics.map(item => item.pics_big)
        })
      },

      // 给价格添加两个零
      priceToFixed(val) {
        if (!val) return
        return val.toFixed(2)
      },

      // 添加购物车
      addCart() {

        if (!this.userInfo) {
          this.delayNavigate()
        } else {
          // 显示图标
          uni.$showMsg('加入购物车', 'success')
          // 加入vuex的数据
          const goods = {
            goods_id: this.goodsDetail.goods_id,
            goods_name: this.goodsDetail.goods_name,
            goods_price: this.goodsDetail.goods_price,
            goods_count: 1,
            goods_small_logo: this.goodsDetail.goods_small_logo,
            goods_state: true
          }
          this.addToCart(goods)
          this.CartCount = this.cart.length
          this.updateCart()
        }

      },

      // 跳转购物车
      gotoCart() {
        uni.switchTab({
          url: "/pages/cart/cart"
        })
      },

      gotoOrderDetails() {

        if (!this.userInfo) {
          this.delayNavigate()
        } else {
          const goods = {
            goods_id: this.goodsDetail.goods_id,
            goods_name: this.goodsDetail.goods_name,
            goods_price: this.goodsDetail.goods_price,
            goods_count: 1,
            goods_small_logo: this.goodsDetail.goods_small_logo,
            goods_state: true
          }
          uni.navigateTo({
            url: `/subpkg/order_details/order_details?goods=${JSON.stringify(goods)}`
          })
        }
      },

      showTips(n) {
        uni.showToast({
          icon: 'none',
          title: `请登录再进行操作！${n}秒后跳转至登录页`,
          mask: true,
          duration: 1100
        })
      },


      delayNavigate() {
        this.showTips(this.seconds)

        this.time = setInterval(() => {
          this.seconds--
          this.showTips(this.seconds)
          if (this.seconds <=0) {
            clearInterval(this.time)
            uni.switchTab({
              url: '/pages/my/my'
            })
          }
        }, 1000)

      }
    }
  }
</script>

<style lang="scss">
  swiper {
    height: 700rpx;

    swiper-item {
      .swiper-item {
        width: 100%;
        height: 100%;

        image {
          width: 100%;
          height: 100%;
        }
      }
    }

  }

  .goods-detail-box {
    padding: 20rpx;
    background-color: #fff;

    .goods-price {

      text:nth-child(1) {
        margin-right: 20rpx;
        font-size: 40rpx;
        color: #c00000;
      }

      text:nth-child(2) {
        text-decoration: line-through;
        font-size: 20rpx;
        color: #b2b2b2;
      }
    }

    .goods-title-box {
      margin: 20rpx 0;
      display: flex;

      .goods-title-tiem {
        border-right: 1px solid #efefef;
        font-size: 24rpx;
      }

      .goods-Collection {
        width: 200rpx;
        height: 30px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        text-align: center;
        color: #b2b2b2;

        .goods-Collection-icon {
          font-size: 36rpx;
        }

        .goods-Collection-word {
          font-size: 22rpx;
        }
      }
    }

    .goods-express {
      font-size: 20rpx;
      color: #b2b2b2;
    }
  }
</style>
