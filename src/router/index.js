import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'

Vue.use(Router)

const router=new Router({
  routes: [
    {
      path:'/',
      component:Login
    },
    {
      path:'/login',
      component:Login
    },
    {
      path:'/home',
      component:Home
    },
  ]
})
//挂载路由导航守卫
router.beforeEach((to,from,next)=>{

  if(to.path==='/login'){
    return next();
  }else{
    //先获取token
    const token=window.sessionStorage.getItem('token');
    if(!token){
      return next('/login');
    }else{
      next();
    }
  }
})

export default router
