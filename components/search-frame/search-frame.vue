<template>
  <view>
    <van-search @focus="focusFn()" shape="round" background="#d81f07" input-align="center" placeholder="请输入搜索关键词" />
  </view>
</template>

<script>
  export default {
    name:"search-frame",
    data() {
      return {
        
      };
    },
      
    methods:{
        
      focusFn(){
        console.log(1)
      }
    }
  }
</script>

<style lang="scss">

</style>