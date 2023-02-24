<template>
  <view>
    <view class="address-list-box">
      <van-swipe-cell :right-width="65" v-for="(item,i) in addressList" :key="i">
        <view class="address-item" >
      <view class="address-item-left"  @click="addressDefault(i)">
        <view class="address-item-change" :class="{ animation: item.addressDefault }" ><van-checkbox :value="true" shape="round" checked-color="#fe3232" v-if="item.addressDefault"></van-checkbox></view>
        <view class="address-info">
          <view class="address-province">{{item.addressProvince}}</view>
          <view class="address-details">{{item.addressDetailed}}</view>
          <view class="address-contact">
            <text>{{item.consignee}}</text>
            <text>{{ geTel(`${item.contact}`) }}</text>
          </view>
        </view>
      </view>
          <view class="address-icon" @click="changeAddress(item,i)"> <van-icon name="edit" /></view>
        </view>
        <view class="address-delete" slot="right" @click="addressDelete(i)" >删除</view>
      </van-swipe-cell>

    </view>
    <van-empty
    v-if="addressList.length==0"
      class="custom-image"
      image="https://img.yzcdn.cn/vant/custom-empty-image.png"
      description="这里好像是空的"
    />
    <van-goods-action><van-goods-action-button text="新建收货地址" @click="gotoEstablishAddress()" /></van-goods-action>
  </view>
</template>

<script>
  import {mapState} from 'vuex'
export default {
  data() {
    return {
      istrue: true
    };
  },
  
  methods: {
    geTel(tel) {
      let reg = /^(\d{3})\d{4}(\d{4})$/;
      return tel.replace(reg, '$1****$2');
    },

    gotoEstablishAddress() {
     uni.navigateTo({
        url: '/subpkg/establish_address/establish_address'
      });
    },
    
      
    addressDefault(i){
      this.addressList.forEach(item=>item.addressDefault=false)
      this.addressList[i].addressDefault=true
    },

    addressDelete(index){
      if(this.addressList.length>1&&this.addressList[index].addressDefault){
        this.addressList[1].addressDefault=true
      }
    this.addressList.splice(index,1)
    uni.setStorageSync('addressList_key',JSON.stringify(this.addressList))
    if(this.addressList.length==0) uni.removeStorageSync('addressList_key')
    },
    
    changeAddress(val,index){
      uni.navigateTo({
        url:`/subpkg/establish_address/establish_address?address=${JSON.stringify(val)}&addressIndex=${index}`
      })
    }
  },
  
  computed:{
    ...mapState('my_positioning',['addressList'])
  },
  mounted() {
    console.log(this.addressList);
  }
  
};
</script>

<style lang="scss">
.animation {
  animation: jelly 0.6s ease;
}
  
  
.address-delete{
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  width: 130rpx;
  height: 100%;
  background-color:#fe3232 ;
  color: #fff;
}

.address-list-box {
  margin: 20rpx;
  border-radius: 15rpx;
  background-color: #fff;

  .address-item {
    display: flex;
    justify-content: space-between;
    padding: 15rpx;
    border-bottom: 1rpx solid #efefef;
    align-items: center;
    .address-item-left{
      flex: 1;
      display: flex;
      align-items: center;
      .address-item-change {
        flex: 1;
        text-align: center;
      }
      
      .address-info {
        flex: 8;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .address-province {
          font-size: 24rpx;
          color: #9f9f9f;
        }
      
        .address-details {
          margin: 10rpx 0;
          font-weight: 700;
        }
      
        .address-contact {
          font-size: 24rpx;
      
          text {
            margin-right: 15rpx;
          }
          text:nth-child(2) {
            font-size: 22rpx;
            color: #9f9f9f;
          }
        }
      }
    }
   

    .address-icon {
      width: 100rpx;
      text-align: center;
      font-size: 40rpx;
    }
  }
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
