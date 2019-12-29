import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      component: Login
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home
    },
  ]
})
//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to将要访问的路径,from代表从哪个路径跳转而来,next()是一个函数,表示放行
  if (to.path === '/login') {
    return next();
  } else {
    //先获取token
    const token = window.sessionStorage.getItem('token');
    if (!token) {
      return next('/login');
    } else {
      next();
    }
  }
})

export default router
