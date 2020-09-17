import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    component: () => import('../components/login.vue')
  },
  {
    path: '/Home',
    component: () => import('../views/home/Home.vue'),
    redirect:'/welcome',
    children: [
      {
        path: '/welcome',
        component:()=>import('../components/welcome.vue')
      },
      {
        path: '/users',
        component:()=>import('../components/user/users.vue')
      },
      {
        path: '/goods',
        component:()=>import('../components/shop/goods.vue')
      },
      {
        path: '/params',
        component:()=>import('../components/shop/params.vue')
      },
      {
        path: '/categories',
        component:()=>import('../components/shop/categories.vue')
      },
      {
        path: '/rights',
        component:()=>import('../components/power/rights.vue')
      },
      {
        path: '/roles',
        component:()=>import('../components/power/roles.vue')
      },
      {
        path: '/orders',
        component:()=>import('../components/order/orders.vue')
      },
      {
        path: '/reports',
        component:()=>import('../components/reports/reports.vue')
      }
    ]
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
  mode: 'hash',
  routes
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从那个路径跳转而来
  // next 是一个函数，表示放行   next('/login')  强制跳转
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()

})

export default router
