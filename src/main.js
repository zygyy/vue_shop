// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/fonts/iconfont.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
//富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

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
Vue.component('tree-table',TreeTable)
Vue.use(VueQuillEditor)

//时间处理函数
Vue.filter('dateFormat',function(originVal){
 const dt=new Date(originVal)
 const y=dt.getFullYear()
 const m=(dt.getMonth()+1+'').padStart(2,'0')
 const d=(dt.getDate()+'').padStart(2,'0')
 const hh=(dt.getHours()+'').padStart(2,'0')
 const mm=(dt.getMinutes()+'').padStart(2,'0')
 const ss=(dt.getSeconds()+'').padStart(2,'0')
 return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})


