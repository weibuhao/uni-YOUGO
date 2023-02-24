<template>
  <view>
    <view class="goods-list-box">
      <view class="goods-list-item" @click="gotoGoodsDetail(item)" v-for="(item, index) in goodsList" :key="index">
        <van-card :tag="item.goods_price=='0'?'零元购':seckillShow" :price="item.goods_price.toFixed(2)"
          :title="item.goods_name" :origin-price="(item.goods_price + 80).toFixed(2)"
          :thumb="item.goods_small_logo ? item.goods_small_logo : 'https://img2.baidu.com/it/u=379476991,2239051645&fm=253&fmt=auto&app=138&f=JPEG?w=740&h=470'"
          :lazy-load="true" />
      </view>
    </view>
    <view class="Mask" @touchmove.stop.prevent="moveHandle" v-if="loadingShow">
      <!-- 加载loading -->
      <view class="loading-box">
        <view class="spinner">
          <text></text>
          <text></text>
          <text></text>
          <text></text>
          <text></text>
          <text></text>
          <text></text>
          <text></text>
        </view>
      </view>
    </view>
    <view class="search-empty" v-if="searchEmptyShow">
      <van-empty image="search" description="没有找到你想要的" />
    </view>
    <view class="goods-empty" v-if="goodsEmptyShow">
      <van-empty class="custom-image" image="https://img.yzcdn.cn/vant/custom-empty-image.png" description="给你找到个空盒子" />
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        queryObject: {
          query: '',
          cid: '',
          pagenum: 1,
          pagesize: 10
        },
        goodsList: [],
        // webRequest: false,
        loadingShow: true,
        itme: null,
        goodsTotal: 0,
        searchEmptyShow: false,
        goodsEmptyShow: false,
        seckillShow: ''
      };
    },

    onLoad(options) {
      if (options.goods_id) {
        this.queryObject.cid = options.goods_id;
      } else if (options.search_query) {
        this.queryObject.query = options.search_query;
      } else {
        if (options.query == '秒杀') this.seckillShow = options.query;
        if (options.query == '超市') this.seckillShow = options.query;
        this.queryObject.query = options.query;
      }

      this.getGoodsList(this.queryObject).then(() => {
        if (options.goods_id && this.goodsList.length == 0) this.goodsEmptyShow = true;
        if (options.search_query && this.goodsList.length == 0) this.searchEmptyShow = true;
      });
    },

    methods: {
      async getGoodsList({
        query = '',
        cid = '',
        pagenum = 1,
        pagesize = 10
      }) {
        // this.webRequest = true;
        if (query) {
          const {
            data: res
          } = await uni.$http.get(
            `/api/public/v1/goods/search?query=${query}&pagenum=${pagenum}&pagesize=${pagesize}`);
          if (res.meta.status >= 400) return uni.$showMsg();
          this.goodsList = [...this.goodsList, ...res.message.goods];
          this.goodsTotal = res.message.total;
        } else {
          const {
            data: res
          } = await uni.$http.get(`/api/public/v1/goods/search?cid=${cid}&pagenum=${pagenum}&pagesize=${pagesize}`);
          if (res.meta.status >= 400) return uni.$showMsg();
          this.goodsList = [...this.goodsList, ...res.message.goods];
          this.goodsTotal = res.message.total;
        }
        // this.webRequest = false;
        this.loadingShow = false;
      },

      gotoGoodsDetail(item) {
        uni.navigateTo({
          url: `/subpkg/goods_detail/goods_detail?goods_id=${item.goods_id}`
        });
      },
      moveHandle() {}
    },

    onReachBottom() {
      if (this.queryObject.pagenum >= Math.ceil(this.goodsTotal / this.queryObject.pagesize)) {
        uni.$showMsg('没有更多了');
      } else {
        if (this.loadingShow) return;
        clearTimeout(this.time);
        this.loadingShow = true;
        this.time = setTimeout(() => {
          this.queryObject.pagenum++;
          this.getGoodsList(this.queryObject);
        }, 2000);
      }
    },

    onPullDownRefresh() {
      this.goodsList = [];
      this.queryObject.pagenum = 1;
      this.getGoodsList(this.queryObject).then(() => uni.stopPullDownRefresh());
    }
  };
</script>

<style lang="scss">
  .loading-box {
    position: fixed;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 3rpx solid #efefef;
    border-radius: 20rpx;
    width: 250rpx;
    height: 250rpx;
    background-color: #4c4c4c;

    /* From uiverse.io by @satyamchaudharydev */
    .spinner {
      position: relative;
      top: 50%;
      left: 85%;
      transform: translate(-50%, -50%);
      width: 60px;
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      margin-left: -75px;
    }

    .spinner text {
      position: absolute;
      top: 50%;
      left: var(--left);
      width: 35px;
      height: 7px;
      background: #ffff;
      animation: dominos 1s ease infinite;
      box-shadow: 2px 2px 3px 0px black;
    }

    .spinner text:nth-child(1) {
      --left: 80px;
      animation-delay: 0.125s;
    }

    .spinner text:nth-child(2) {
      --left: 70px;
      animation-delay: 0.3s;
    }

    .spinner text:nth-child(3) {
      left: 60px;
      animation-delay: 0.425s;
    }

    .spinner text:nth-child(4) {
      animation-delay: 0.54s;
      left: 50px;
    }

    .spinner text:nth-child(5) {
      animation-delay: 0.665s;
      left: 40px;
    }

    .spinner text:nth-child(6) {
      animation-delay: 0.79s;
      left: 30px;
    }

    .spinner text:nth-child(7) {
      animation-delay: 0.915s;
      left: 20px;
    }

    .spinner text:nth-child(8) {
      left: 10px;
    }

    @keyframes dominos {
      50% {
        opacity: 0.7;
      }

      75% {
        -webkit-transform: rotate(90deg);
        transform: rotate(90deg);
      }

      80% {
        opacity: 1;
      }
    }
  }


  .Mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
</style>
