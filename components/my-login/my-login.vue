<template>
  <view>
    <view class="my-login-container">
      <view class="my-login-icon">
        <uni-icons type="contact-filled" size="100px" color="#aeb0ae"></uni-icons>
      </view>
      <button type="primary" class="login-but" open-type="getUserProfile" withCredentials="true"
        @getuserinfo="getUserProfile">一键登录</button>
      <view class="my-login-word">
        登录后享受更多权益
      </view>
    </view>
  </view>
</template>

<script>
  import {mapMutations} from 'vuex'
  export default {
    data() {
      return {};
    },

    methods: {
      ...mapMutations('my_user',['updataUserInfo']) ,
    async  getUserProfile() {
        uni.getUserProfile({
          desc: '登录',
          success: (info) => {
            uni.setStorageSync('userInfo',JSON.stringify(info.userInfo))
            this.updataUserInfo()
            //console.log('同意', info)
            uni.login({
              provider: 'weixin',
              success: (res) => {
               
              }
            })
            
          },
          fail: (err) => {
            uni.$showMsg('您取消了登录授权！')
            //console.log('不同意', err);
          }
        })
      },
    }
  }
</script>

<style lang="scss">
  .my-login-container {
    padding: 250rpx 80rpx;

    .my-login-icon {
      text-align: center;
    }

    .login-but {
      background-color: #d81f07;
      border-radius: 500rpx;
      color: #fff;
    }

    .my-login-word {
      text-align: center;
      margin: 20rpx 0;
      font-size: 26rpx;
      color: #aeb0ae;
    }
  }
</style>
