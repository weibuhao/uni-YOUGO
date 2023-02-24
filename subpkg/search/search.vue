<template>
  <view>
    <!-- 搜索框 -->
    <van-search @change="searchChange" @search="gotoGoodsList(searchValue)" :value="searchValue" shape="round"
      background="#d81f07" :focus="true" placeholder="请输入搜索关键词" />
    <!-- 搜索历史 -->
    <view class="search-record-box" v-if="!searchTipsShow">
      <view class="search-record-itlte">
        <view class="search-itlte">
          搜索历史
        </view>
        <van-icon name="delete-o" class="icon-delete" v-if="!deleteState" @click="changeDelete()" />
        <view class="delete-state" v-else>
          <view class="delete" @click="changeDelete()"
            :style="{backgroundColor:searchHistory.length===0?'#cfcfcf':'#d81f07',borderColor:searchHistory.length===0?'#cfcfcf':'#d81f07'}">
            全部删除
          </view>
          <view class="delete" @click="cancel()">
            确定
          </view>
        </view>
      </view>
      <view class="search-record" :style="{justifyContent:searchHistory.length>=5?'space-between':''}">
        <view :class="['search-record-item',deleteState?'animation':'']" @click="gotoGoodsList(item)"
          v-for="(item , index) in searchHistory" :key="index">
          <view class="delete-box" v-if="deleteState">
            x
          </view>
          <!-- 多加一个盒子为了让一行装不下出现省略号不剪切删除小图标（x） -->
          <view class="search-record-word">
            {{item}}
          </view>
        </view>
      </view>
    </view>
    <!-- 搜索建议 -->
    <scroll-view class="search-tips-box" :style="{height:(wh-54)+'px'}" scroll-y v-else>
      <view class="search-tips-item" @click="gotoGoodsList(searchValue)" v-html="replaceKw(searchValue,searchValue)">

      </view>
      <view class="search-tips-item" @click="gotoGoodsList(item.goods_name)" v-for=" (item,index) in searchTipList" :key="index"
        v-html="replaceKw(item.goods_name,searchValue)">
      </view>
    </scroll-view>
    <van-dialog id="van-dialog" title="删除" :showCancelButton="true" :show="show" message="你真的要清空搜索历史吗"
      @confirm="cancelDelete()" @cancel="show=!show" />
  </view>
</template>

<script>
  export default {
    data() {
      return {
        searchTipList: [],
        searchHistory: [],
        wh: '',
        searchValue: '',
        deleteState: false,
        show: false,
        searchTipsShow: false,
        itme: null
      };
    },

    onLoad() {
      const sysInfo = uni.getSystemInfoSync()
      this.wh = sysInfo.windowHeight
      if (!uni.getStorageSync('history_key')) return
      this.searchHistory = JSON.parse(uni.getStorageSync('history_key'))
    },
    methods: {
      // 获取数据
      async getSearchTipList() {
        const {
          data: res
        } = await uni.$http.get(`/api/public/v1/goods/search?query=${this.searchValue}`)
        if (res.meta.status >= 400) return uni.$showMsg()
        this.searchTipList = res.message.goods
      },

      // 跳转搜索商品列表
      gotoGoodsList(query) {
        // 删除状态
        if (this.deleteState) {
          this.searchHistory = this.searchHistory.filter(item => item !== query)
          uni.setStorageSync('history_key', JSON.stringify(this.searchHistory))
        } else {
          if (query.length>=8) {
            this.searchHistory = this.searchHistory.filter(item => item !== query)
            this.searchHistory.unshift(query)
            uni.setStorageSync('history_key', JSON.stringify(this.searchHistory))
           let result=query.split('');
            query = result[0]+result[1]
            // 跳转页面带参数
            uni.navigateTo({
              url: `/subpkg/goods_list/goods_list?search_query=${query}`
            })
          } else {
            uni.navigateTo({
              url: `/subpkg/goods_list/goods_list?search_query=${query}`
            })
            this.searchHistory = this.searchHistory.filter(item => item !== query)
            this.searchHistory.unshift(query)
            uni.setStorageSync('history_key', JSON.stringify(this.searchHistory))
          }
        }
      },

      changeDelete() {
        if (this.deleteState && this.searchHistory.length !== 0) {
          this.show = true
        } else {
          this.show = false
        }
        this.deleteState = true
      },

// 清空历史记录
      cancelDelete() {
        uni.removeStorageSync('history_key');
        this.searchHistory = []
        this.deleteState = false
        this.show = false
      },

      cancel() {
        this.deleteState = false
        this.show = false
      },


// 去掉输入框空格
      searchChange(e) {
        this.searchValue = e.detail.replace(/[, ]/g, '')
      },
      //输入框与搜索建议中相匹配的值标红
      replaceKw(originStr = this.searchValue, target) {
        const reg = RegExp(target, 'ig')
        return originStr.replace(reg, `<span style="color:red;">${target}</span>`)
      }
    },

    watch: {
      searchValue() {
        if (this.searchValue === '') {
          this.searchTipsShow = false
        } else {
          // 防抖效果
          this.searchTipList = []
          clearTimeout(this.itme)
          this.searchTipsShow = true
          this.itme = setTimeout(() => {
            this.getSearchTipList()
          }, 300)
        }
      }
    }
  }
</script>

<style lang="scss">
  .search-record-box {
    padding: 0 20rpx;

    .search-record-itlte {
      height: 60rpx;
      line-height: 60rpx;
      margin: 15rpx 0;
      display: flex;
      justify-content: space-between;
      border-bottom: 5rpx solid #efefef;

      .search-itlte {
        font-size: 26rpx;
        color: #cfcfcf;
      }

      .icon-delete {
        font-size: 40rpx !important;
        margin-right: 20rpx;
      }


      .delete-state {
        display: flex;

        .delete {
          font-size: 24rpx;
          border: 1rpx solid #d81f07;
          border-radius: 100rpx;
          background-color: #d81f07;
          padding: 0 15rpx 0 15rpx;
          margin: 0 10rpx;
          color: #ffff;
        }
      }
    }

    .search-record {
      padding-top: 0;
      display: flex;
      flex-wrap: wrap;

      .search-record-item {
        max-width: 120rpx;
        text-align: center;
        border: 3rpx solid #cfcfcf;
        border-radius: 100rpx;
        font-size: 24rpx;
        padding: 10rpx 15rpx;
        margin: 10rpx;
        position: relative;

        .delete-box {
          text-align: center;
          line-height: 25rpx;
          display: block;
          width: 30rpx;
          height: 30rpx;
          border-radius: 50%;
          position: absolute;
          top: -10rpx;
          right: -10rpx;
          background-color: #cfcfcf;
        }


        .search-record-word {
          max-width: 130rpx;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }


  .search-tips-box {
    background-color: #ffff;
    display: flex;
    flex-direction: column;

    .search-tips-item {
      padding: 10rpx 30rpx;
      border-bottom: 1rpx solid #f9fafb;
      font-size: 24rpx;

    }
  }


  .animation {
    animation: fly-1 0.6s ease-in-out infinite alternate;
  }

  @keyframes fly-1 {
    from {
      transform: translateY(0.1em);
    }

    to {
      transform: translateY(-0.1em);
    }
  }
  
</style>
