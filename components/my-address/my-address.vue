<template>
  <view>
    <view class="receipt-site-box" @click="gotoAddressList()">
      <view class="receipt-site-anatomy" v-if="show">
        <view class="receipt-site-main">
          
          <text>{{address.addressProvince}}</text>
          <text>默认</text>
        </view>
        <view class="receipt-site-assistant-box">
          <view class="receipt-site-assistant">{{address.addressDetailed}}</view>
          <view class="receipt-site-icon"><van-icon name="arrow" /></view>
        </view>
        <text>{{address.consignee}}</text>
        <text>{{geTel(`${address.contact}`)}}</text>
      </view>
      <view class="add-receipt-site-box"  v-else>
        <view class="animation-box">
          <van-icon name="add-o" class="receipt-site-icon-add" />
          <view class="loader">
            <text>添加地址</text>
            <text>添加地址</text>
          </view>
        </view>
      </view>
      <view class="border-img"><image src="../../static/cart_border@2x.png" mode=""></image></view>
    </view>
  </view>
</template>

<script>
  import {mapState} from 'vuex'
export default {
  name: 'my-address',
  data() {
    return {
      show: false,
      address:{}
    };
  },
      
    created(){
     this.loopAddressList()
    },
  methods:{
    geTel(tel) {
      let reg = /^(\d{3})\d{4}(\d{4})$/;
      return tel.replace(reg, '$1****$2');
    },
    gotoAddressList(){
      uni.navigateTo({
        url:'/subpkg/address_list/address_list'
      })
    },
      
    loopAddressList(){
      if(this.addressList.length!==0){
        this.addressList.forEach(item=>{
          if(item.addressDefault){
            this.address=item
            this.show=true
          }
        })
      }else{
        this.show=false
      }
    }
  },
    
  computed:{
   // ...mapState('my_positioning',['addressList'])
  },
    
  watch:{
    addressList:{
     handler(newVal,oldVal){
      this.loopAddressList()
     },
     immediate:true,
     deep:true
    }
  }
  
};
</script>

<style lang="scss">
.receipt-site-box {
  background-color: #ffffff;
  border-radius: 0 0 30rpx 30rpx;
  overflow: hidden;

  .receipt-site-anatomy {
    padding: 20rpx;

    .receipt-site-main {
      height: 50rpx;
      line-height: 50rpx;

      text:nth-child(2) {
        background-color: #d81f07;
        font-size: 20rpx;
        margin-left: 20rpx;
        padding: 0 10rpx;
          color: #fff;
      }

      text:nth-child(1) {
        font-size: 24rpx;
      }
    }

    .receipt-site-assistant-box {
      display: flex;
      justify-content: space-between;

      .receipt-site-assistant {
        margin: 10rpx 0;
      }

      .receipt-site-icon {
        width: 60rpx;
        line-height: 60rpx;
        color: #b2b2b2;
        text-align: center;
      }
    }

    & > text {
      font-size: 24rpx;
      margin-right: 10rpx;
    }
  }

  .border-img {
    width: 100%;
    image {
      width: 100%;
      height: 10rpx;
    }
  }
}

.add-receipt-site-box {
  position: relative;
  height: 100px;

  .animation-box {
    position: absolute;
    border: 1rpx solid rgb(128, 198, 255);
    border-radius: 100rpx;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 220rpx;
    height: 50rpx;
    line-height: 50rpx;
    display: flex;
    justify-content: space-around;
    // background-color: #00b26a;

    .receipt-site-icon-add {
      margin: 5rpx;
      color: rgb(128, 198, 255);
    }

    .loader {
      padding: auto;
      position: relative;
      width: 200rpx;
    }

    .loader text {
      position: absolute;
      color: #fff;
      // transform: translate(-50%, -50%);
      font-size: 16px;
      letter-spacing: 5px;
    }

    .loader text:nth-child(1) {
      color: transparent;
      -webkit-text-stroke: 0.3px rgb(128, 198, 255);
    }

    .loader text:nth-child(2) {
      color: rgb(128, 198, 255);
      -webkit-text-stroke: 1px rgb(128, 198, 255);
      animation: uiverse723 3s ease-in-out infinite;
    }

    @keyframes uiverse723 {
      0%,
      100% {
        clip-path: polygon(0% 45%, 15% 44%, 32% 50%, 54% 60%, 70% 61%, 84% 59%, 100% 52%, 100% 100%, 0% 100%);
      }

      50% {
        clip-path: polygon(0% 60%, 16% 65%, 34% 66%, 51% 62%, 67% 50%, 84% 45%, 100% 46%, 100% 100%, 0% 100%);
      }
    }
  }
}
</style>
