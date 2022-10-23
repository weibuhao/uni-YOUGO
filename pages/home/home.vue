<template>
  <view>
    <view class="search-box">
      <input type="text" class="search" placeholder="搜索">
    </view>
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" i :duration="1000" circular   indicator-active-color="#fff">
      <swiper-item v-for="item in switchList" :key="item.goods_id">
        <navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id='+item.goods_id" > 
          <image :src="item.image_src" ></image>
        </navigator> 
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        switchList: []
      };
    },

    onLoad() {
      this.getSwitchList()
    },

    methods: {
      async getSwitchList() {
        const {data: res} = await uni.$http.get('/api/public/v1/home/swiperdata')
        if (res.meta.status >=400) {
          uni.$showMsg()
        }
        this.switchList=res.message
        console.log(this.switchList);
      }
    }
  }
</script>

<style lang="scss">
      
    .search-box{
      height: 80rpx;
      background-color: #d81f07;
         
       .search{
         margin: auto;
         width: 80%;
         height: 80%;
         text-align: center;
         border-radius: 100rpx;
         background-color: #fff;
       }
    }
  
swiper .swiper-item{
height: 330rpx;
  image{
    width: 100%;
    height: 100%;
  }
}
</style>
