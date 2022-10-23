import { $http } from '@escook/request-miniprogram'

uni.$http=$http

$http.baseUrl="https://api-hmugo-web.itheima.net"

// 请求拦截器
$http.beforeRequest = function (options) {
 
}

//响应拦截
$http.afterRequest = function () {
  // do something...
}