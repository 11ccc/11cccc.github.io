// #ifndef VUE3
import Vue from 'vue'
import App from './App'

// ❤1 在 mian.js 中导入 store 实例对象，并挂载到 Vue 的实例上
// ❤1-1 导入 store 的实例对象
import store from '@/store/store.js'


// 导入网络请求的包
import {
  $http
} from '@escook/request-miniprogram'

// 在 uni-app 项目中,将按需导入的 $http 挂载到 uni 顶级对象之上，方便全局调用
// 给 uni 挂载一个自定义属性，指向我们导入的成员$http。今后，在项目的每个页面里面，就可以基于 uni.$http 来发起网络数据请求了。
uni.$http = $http

// 配置请求根路径
$http.baseUrl = 'https://api-ugo-web.itheima.net'

// 配置请求拦截器
// 请求开始之前做一些事情
// 这个 options形参接收请求的时候一些相关的配置
$http.beforeRequest = function(options) {
  uni.showLoading({
    title: '数据加载中...'
  })
}
// 配置相应拦截器
// 请求完成之后做一些事情
$http.afterRequest = function() {
  uni.hideLoading()
}


// 一系列的封装操作
// 封装展示消息提示的方法 -- 为 uni 对象挂载自定义的 $showMsg() 方法
uni.$showMsg = function(title = '数据加载失败！', duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none'
  })
}



Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App,
  // ❤1-2 将 store 挂载到 Vue 实例上
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
