// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/fonts/iconfont.css'
import axios from 'axios'

//配置请求根路径
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
// 通过axios1请求拦截器添加token，保证拥有获取数据的权限
axios.interceptors.request.use(config=>{
  //console.log(config);
  //为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config;
})
Vue.prototype.$http=axios
Vue.use(ElementUI);
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
