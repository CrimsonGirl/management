import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    redirect:'/login',
    component: ()=> import('../views/home/Home.vue')
  },
  {
    path:'/login',
    component: () => import('../components/login.vue')
  },
  {
    path:'/Home',
    component:() => import('../views/home/Home.vue')
  }
  // {
  //   path: '/appp',
  //   component: () => import('../views/app/appp.vue'),
  //   redirect:"/Home",
  //   children:[
  //     {
  //       path: '/Home',
  //       name: 'Home',
  //       component: () => import('../views/home/Home.vue')
  //     }
  //   ]
  // }
]

const router = new VueRouter({
  mode:'hash',
  routes
})
// 挂载路由导航守卫
router.beforeEach((to,from,next)=>{
  // to 将要访问的路径
  // from 代表从那个路径跳转而来
  // next 是一个函数，表示放行   next('/login')  强制跳转
  if(to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()

})

export default router
