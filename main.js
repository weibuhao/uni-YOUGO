// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import store from './store/store.js'

// 导入请求
import './utils/request.js'
//导入封装方法
import './utils/methods.js'
//导入动画库
import 'animate.css';

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App,
  store
})
app.$mount()
// #endif

// #ifdef VUE3
import {
  createSSRApp
} from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif
