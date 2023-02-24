import { $http } from '@escook/request-miniprogram'

uni.$http=$http

$http.baseUrl="https://api-hmugo-web.itheima.net"

// 请求拦截器
$http.beforeRequest = function (options) {
  if(options.url.indexOf('/my/')!==-1){
      
    options.header={
      Authorization:"Bearer "
    }
  }
}

//响应拦截
$http.afterRequest = function () {
  // do something...
}