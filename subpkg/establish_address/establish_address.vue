<template>
  <view>
    <view class="establish_address-list">
      <van-notice-bar color="#1989fa" background="#ecf9ff" left-icon="info-o" scrollable text="点击右侧定位图标可进行定位" />
      <van-cell-group>
        <van-field @change="setAddress($event, 'consignee')" :value="addressInfo.consignee" :auto-focus="true" clearable
          right-icon="user-o" label="收货人" icon="question-o" placeholder="请填写收货人姓名" />

        <van-field @change="setAddress($event, 'contact')" @blur="isMobile(addressInfo.contact)" :error-message="errMsg"
          :value="addressInfo.contact" clearable right-icon="phone-o" label="手机号码" icon="question-o"
          placeholder="请填写收货人手机号" type="digit" />

        <van-field :value="positioning" @click-input="changeProvince()" disabled clearable right-icon="location-o"
          label="所在地区" placeholder="省市区县、乡镇等" :border="false" @click-icon="getAddresSpower()" />
        <van-field @change="setAddress($event, 'addressDetailed')" @click-icon="getAddresSpower()"
          :value="addressInfo.addressDetailed" right-icon="guide-o" clearable label="详细地址" placeholder="街道、楼牌号等"
          :border="false" />
      </van-cell-group>
    </view>
    <view class="label-box">
      <view class="label-item-container">
        <view class="label-word">标签</view>
        <view class="label-item-box">
          <view :class="['label-item', index === current ? 'current' : '']" @click="currentFn(index)"
            v-for="(item, index) in addressType" :key="index">{{ item }}</view>
        </view>
      </view>
      <view class="set-default-address">
        <view class="set-word-box">
          <view class="set-word-item">设置默认地址</view>
          <view class="tips-word">提示：下单优先使用该地址</view>
        </view>
        <view class="set-default-icon">
          <van-switch :checked="addressInfo.addressDefault" active-color="#ee0a24" @change="changeFn()" size="16px" />
        </view>
      </view>
    </view>
    <van-goods-action>
      <van-goods-action-button text="保存" @click="preservation()" />
    </van-goods-action>
    <van-action-sheet :show="addressOption">
      <van-area :item-height="40" :area-list="areaList" :value="addressCode" @confirm="determine()"
        @cancel="addressOption = !addressOption" />
    </van-action-sheet>
  </view>
</template>

<script>
  import {
    areaList
  } from '@/wxcomponents/area-data/dist/index.cjs.js';
  import {
    mapState,
    mapMutations
  } from 'vuex';

  import {
    filterArr
  } from '@/utils/filterArr.js';

  export default {
    data() {
      return {
        areaList,
        addressType: ['家', '公司', '学校'],
        current: 0,
        addressOption: false,
        addressInfo: {
          consignee: '',
          contact: '',
          addressType: 0,
          addressDetailed: '',
          addressProvince: '',
          addressDefault: true
        },
        errMsg: '',
        addressList: JSON.parse(uni.getStorageSync('addressList_key') || '[]'),
        editAddress: {}
      };
    },

    onLoad(options) {

      if (options.address) {
        this.addressInfo = JSON.parse(options.address)
        this.editAddress.address = JSON.parse(options.address)
        this.editAddress.addressIndex = JSON.parse(options.addressIndex - 0)
        this.changeAddress(this.addressInfo.addressProvince)
        this.currentFn(this.editAddress.address.addressType)
      }

    },
    methods: {
      ...mapMutations('my_positioning', ['getCity', 'changeAddress', 'resetInfo', 'updateAddressList']),

      changeFn() {
        this.addressInfo.addressDefault = !this.addressInfo.addressDefault;
      },

      currentFn(index) {
        //console.log(index);
        this.current = index;
        this.addressInfo.addressType = index
      },

      determine(e) {
        const newAddress = {
          address: `${e.detail.values[0].name}、${e.detail.values[1].name}、${e.detail.values[2].name}`,
          addressCode: e.detail.values[2].code
        };
        this.changeAddress(newAddress);
        this.addressOption = false;
      },

      getAddresSpower() {
        this.getCity();

        setTimeout(() => {
          this.addressInfo.addressDetailed = this.address.addressDetailed;
        }, 1000);
      },
      changeProvince() {
        this.addressOption = true;
      },

      setAddress(e, type) {
        for (let i in this.addressInfo) {
          if (type === i) {
            this.addressInfo[i] = e.detail;
          }
        }
      },

      isMobile(mobile) {
        if (!/^1[3-9]\d{9}$/.test(mobile)) {
          this.errMsg = '电话号码格式错误，请重新输入';
        } else {
          this.errMsg = '';
        }
      },

      preservation() {
        this.addressInfo.addressProvince = this.positioning;
        let istrue = true;
        for (let i in this.addressInfo) {
          if (this.addressInfo[i] === '') istrue = false;
        }
        if (this.positioning && istrue && !this.errMsg) {

          if (this.editAddress.address) {
            this.addressList.splice(this.editAddress.addressIndex, 1, this.addressInfo)
            uni.setStorageSync('addressList_key', JSON.stringify(this.addressList))
          } else {
            filterArr(this.addressList, this.addressInfo)
          }
          this.updateAddressList()

          // this.changeAddressData(this.addressInfo)
        } else {
          uni.$showMsg('请填写相关信息', 'error', 3000);
        }
      }
    },

    onUnload() {
      this.resetInfo();
    },

    computed: {
      ...mapState('my_positioning', ['positioning', 'addressCode', 'address'])
    }
  };
</script>

<style lang="scss">
  .van-picker {
    border-radius: 20rpx 20rpx 0;
  }

  .current {
    background-color: #fc0000;
    color: #fff;
    animation: jelly 0.6s ease;
  }

  .van-field__label {
    font-size: 24rpx;
    font-weight: 700;
  }

  .establish_address-list {
    margin: 20rpx;
    background-color: #fff;
    border-radius: 20rpx;
    overflow: hidden;

    .detailed-address-box {
      display: flex;
      height: 50px;

      .detailed-address {
        flex: 3;
      }

      .tips {
        flex: 5;
      }

      .detailed-address-icon {
        flex: 1;
      }
    }
  }

  .label-box {
    margin: 20rpx;
    padding: 20rpx;
    background-color: #fff;
    border-radius: 15rpx;

    .label-item-container {
      display: flex;
      // margin-bottom: 15rpx;
      padding-bottom: 20rpx;
      border-bottom: 1px solid #efefef;

      .label-word {
        width: 150rpx;
        font-size: 26rpx;
        font-weight: 700;
      }

      .label-item-box {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .label-item {
          text-align: center;
          margin: 0 20rpx;
          width: 60rpx;
          padding: 8rpx 15rpx;
          font-size: 26rpx;
          border-radius: 100rpx;
          border: 1px solid #efefef;
        }
      }
    }

    .set-default-address {
      display: flex;
      justify-content: space-between;
      height: 80rpx;
      margin: 20rpx 0;

      .set-word-box {
        font-size: 26rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .tips-word {
          font-size: 24rpx;
          color: #c3c3c3;
        }
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
