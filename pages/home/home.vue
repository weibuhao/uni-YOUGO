<template>
  <view>
    <van-search shape="round" background="#d81f07" input-align="center" placeholder="请输入搜索关键词" />
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" i :duration="1000" circular
      indicator-active-color="#fff">
      <swiper-item v-for="item in switchList" :key="item.goods_id">
        <navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id='+item.goods_id">
          <image :src="item.image_src"></image>
        </navigator>
      </swiper-item>
    </swiper>
    <view class="sort-nav">
       <image class="nav-item"  v-for="item in navList" :key="item.name" :src="item.image_src" @click="navClickHandler(item)"></image>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        switchList: [],
        navList: []
      };
    },

    onLoad() {
      this.getSwitchList()
      this.getNavList()
    },

    methods: {
      async getSwitchList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/swiperdata')
        if (res.meta.status >= 400) {
          uni.$showMsg()
        }
        this.switchList = res.message
        console.log(this.switchList);
      },

      async getNavList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/catitems')
        
        if (res.status >= 400){
          uni.$showMsg()
        }
          this.navList = res.message
          console.log(this.navList )
            
      },
        
      navClickHandler(item){
        console.log(item);
      }
    }
  }
</script>

<style lang="scss">
  swiper .swiper-item {
    height: 330rpx;

    image {
      width: 100%;
      height: 100%;
    }
  }


  .sort-nav {
    height: 200rpx;
    display: flex;
    justify-content: space-around;
    
      .nav-item{
        margin: auto 0;
        width: 128rpx;
        height: 140rpx;
      
    }
  }
</style>
