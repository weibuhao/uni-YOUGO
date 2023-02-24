<template>
  <view>
    <my-login v-if="!userInfo"></my-login>
    <my-userInfo v-else></my-userInfo>
  </view>
</template>

<script>
  import {mapState} from "vuex"
  export default {
    data() {
      return {
      }
    },
    computed: {
    ...mapState('my_user',['userInfo'])
    },
  }
</script>

<style lang="scss">

</style>
