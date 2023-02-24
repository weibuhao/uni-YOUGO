<template>
  <view>
    <!-- 搜索框 -->
    <view class="search-position">
      <search-frame @click.native="gotoSearch()"></search-frame>
    </view>
    <!-- 轮播图 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" i :duration="1000" circular
      indicator-active-color="#fff">
      <swiper-item v-for="item in switchList" :key="item.goods_id">
        <navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id='+item.goods_id">
          <image :src="item.image_src"></image>
        </navigator>
      </swiper-item>
    </swiper>
    <!-- 导航栏 -->
    <view class="sort-nav">
      <image class="nav-item" v-for="item in navList" :key="item.name" :src="item.image_src"
        @click="navClickHandler(item)"></image>
    </view>
    <!-- 楼层图 -->
    <view class="floor-img-box" v-for="item in floorList" :key="item.floor_title.name">
      <view class="floor-title-box">
        <image :src="item.floor_title.image_src"></image>
      </view>
      <view class="floor-item-box">
        <navigator class="left-box" :url="item.product_list[0].url">
          <image :src="item.product_list[0].image_src" :style="{width:item.product_list[0].image_width+'rpx'}" mode="">
          </image>
        </navigator>
        <view class="right-box">
          <navigator class="right-item" :url="item2.url" v-for="(item2 , i) in item.product_list" :key="item2.name"
            v-if="i!=0">
            <image :src="item2.image_src" :style="{width:item2.image_width+'rpx'}" mode=""></image>
          </navigator>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  // 获取数据列表
  import {
    getSwitchList,
    getNavList,
    getFloorList
  } from "./getList.js"

  export default {
    data() {
      return {
        switchList: [],
        navList: [],
        floorList: []
      };
    },

    onLoad() {
      this.getLIst()
    },

    methods: {
      async getLIst() {
        this.switchList = await getSwitchList()
        this.navList = await getNavList()
        this.floorList = await getFloorList()
      },

      navClickHandler(item) {
        switch (item.name) {
          case "分类":
            uni.switchTab({
              url: "/pages/cate/cate"
            })
            break
          case "秒杀拍":
            uni.navigateTo({
              url: '/subpkg/goods_list/goods_list?query=秒杀'
            })
            break
          case "超市购":
            uni.navigateTo({
              url: '/subpkg/goods_list/goods_list?query=超市'
            })
            break
          case "母婴品":
            uni.navigateTo({
              url: '/subpkg/goods_list/goods_list?query=母婴'
            })
            break
        }
      },

      gotoSearch() {
        uni.navigateTo({
          url: "/subpkg/search/search"
        })
      }
    }
  }
</script>

<style lang="scss">
    
  .search-position{
    position: sticky;
    top: 0;
    z-index: 999;
  }
  swiper {
    height: 330rpx;

    .swiper-item {
      height: 100%;

      image {
        width: 100%;
        height: 100%;
      }
    }
  }

  .sort-nav {
    height: 200rpx;
    display: flex;
    justify-content: space-around;

    .nav-item {
      margin: auto 0;
      width: 128rpx;
      height: 140rpx;
    }
  }

  .floor-img-box {
    margin: 10rpx;

    .floor-title-box {
      height: 60rpx;

      image {
        width: 100%;
        height: 100%;
      }
    }

    .floor-item-box {
      display: flex;

      .right-box {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;

        .right-item {
          height: 48%;

          image {
            height: 100%;
          }
        }
      }
    }
  }
</style>
