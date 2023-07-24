import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// 导入全局样式
import './assets/css/all.css'

import App from './App.vue'
//引入router
import router from './router';
// 导入axios
// import axios from 'axios'
// 引入vuex
import store from './store'
// Vue.prototype.$http = axios
// 设置api根路径
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios.defaults.baseURL = 'http://127.0.0.1:80/'
// axios.interceptors.request.use(config => {
//   //为请求头添加token的验证字段 Authorization
//   //在发起请求时，必定会执行这段代码，为请求头进行预处理，包含验证字段
//   config.headers.Authorization = window.sessionStorage.getItem('token')
//   // 返回config就说明进行了预处理，可以进行发送请求
//   // console.log(config)
//   return config
// })
//将axios进行集中封装
Vue.config.productionTip = false

//引入相关API请求接口
import API from '@/api';
//组件实例的原型的原型指向的是Vue.prototype
//任意组件可以使用API相关的接口
Vue.prototype.$API = API;

//注册全局组件
//全局引入
Vue.use(ElementUI);
new Vue({
  router: router,
  store,
  render: h => h(App),
}).$mount('#app')
