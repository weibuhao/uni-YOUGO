<template>
  <view>
    <view class="my-container">
      <view class="my-head">
        <view class="head-portrait-box">
          <view class="head-portrait">
            <image :src="userInfo.avatarUrl"
              mode=""></image>
          </view>
          <text class="head-portrait-word">{{userInfo.nickName}}</text>
        </view>
      </view>
      <view class="my-main">
        <view class="my-details">
          <view class="my-details-item" v-for="(item, i) in myRecord" :key="i">
            <view class="my-details-item-count">
              {{item.count}}
            </view>
            <view class="my-details-item-type">
              {{item.type}}
            </view>
          </view>
        </view>
        <view class="my-order">
          <view class="my-order-word">
            我的订单
          </view>
          <view class="my-order-details">
            <view class="my-order-details-item">
              <view class="my-order-details-image">
                <image src="../../static/my-icons/icon1.png" mode=""></image>
              </view>
              <text>待付款</text>
            </view>
            <view class="my-order-details-item">
              <view class="my-order-details-image">
                <image src="../../static/my-icons/icon2.png" mode=""></image>
              </view>
              <text>待收货</text>
            </view>
            <view class="my-order-details-item">
              <view class="my-order-details-image">
                <image src="../../static/my-icons/icon3.png" mode=""></image>
              </view>
              <text>退款/退货</text>
            </view>
            <view class="my-order-details-item">
              <view class="my-order-details-image">
                <image src="../../static/my-icons/icon4.png" mode=""></image>
              </view>
              <text>全部账单</text>
            </view>
          </view>
        </view>
        <view class="my-function">
          <van-cell title="收货地址" link-type="navigateTo" url="/subpkg/address_list/address_list" is-link />
          <van-cell title="联系客服" @click="contactService()" is-link />
          <van-cell title="退出登录" @click="loginOut()" is-link />
        </view>
      </view>
    </view>
    <van-dialog
      title="登录"
      message="是否退出登录"
      :show="dialogShow"
      show-cancel-button
      @confirm="confirmFn()"
      @cancel="dialogShow=!dialogShow"
    >
    </van-dialog>
  </view>
</template>

<script>
  import {mapMutations,mapState} from 'vuex'
  export default {
    data() {
      return {
        myRecord: [{
            type: '收藏的店铺',
            count: 12
          },

          {
            type: '收藏的商品',
            count: 22
          },
          {
            type: '退款售后',
            count: 0
          },
          {
            type: '足迹',
            count: 43
          }

        ],
        dialogShow:false
      };
    },
      
    methods:{
       ...mapMutations('my_user',['updataUserInfo']) ,
      contactService(){
        uni.$showMsg('还未开发该服务！！')
      },
        
      loginOut(){
         this.dialogShow=!this.dialogShow
      },
        
      confirmFn(){
        this.dialogShow=!this.dialogShow
        uni.removeStorageSync('userInfo')
        this.updataUserInfo()
      }
    },
      
    computed:{
      ...mapState('my_user',['userInfo'])
    }
  }
</script>

<style lang="scss">
  .my-container {
    position: relative;

    .my-head {
      display: flex;
      justify-content: center;
      height: 350rpx;
      background-color: #d81f07;
      border-radius: 0 0 100% 100%;

      .head-portrait {
        width: 120rpx;
        height: 120rpx;
        margin-top: 40rpx;
        margin-bottom: 10rpx;
        overflow: hidden;
        border-radius: 1000rpx;

        image {
          width: 100%;
          height: 100%;
        }
      }

      .head-portrait-word {
        color: #fff;
      }

    }

    .my-main {
      width: 100%;
      position: absolute;
      top: 260rpx;
      left: 0;
      box-sizing: border-box;
      padding: 0 20rpx;

      .my-details {
        display: flex;
        justify-content: space-around;
        align-items: center;
        border-radius: 15rpx;
        height: 100rpx;
        background-color: #fff;

        .my-details-item {
          text-align: center;
          font-size: 26rpx;

          .my-details-item-count {
            margin-bottom: 8rpx;
          }
        }
      }

      .my-order {
        margin: 15rpx 0;
        border-radius: 15rpx;
        background-color: #fff;

        .my-order-word {
          padding-left: 15rpx;
          height: 80rpx;
          line-height: 80rpx;
          border-bottom: 1px solid #efefef;
        }

        .my-order-details {
          display: flex;
          justify-content: space-around;
          padding: 20rpx 0;

          .my-order-details-item {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-size: 26rpx;

            .my-order-details-image {
              width: 65rpx;
              height: 70rpx;

              image {
                width: 100%;
                height: 100%;
              }
            }

            text {
              margin-top: 8rpx;
            }
          }
        }
      }

      .my-function {
        overflow: hidden;
        border-radius: 15rpx;
        background-color: #fff;
      }
    }
  }
</style>
