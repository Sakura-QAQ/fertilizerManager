// 配置路由
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login'
import Home from '@/views/home'
import Welcome from '@/views/welcome'
import Article from '@/views/article'
import NotFound from '@/views/404'
import Image from '@/views/image'
import Publish from '@/views/publish'
import Comment from '@/views/comment'
import Setting from '@/views/setting'
import Fans from '@/views/fans'
import PassageWay from '@/views/passageway'
import Gateway from '@/views/gateway'
import Sensor from '@/views/sensor'
import SensorType from '@/views/sensortype'

Vue.use(VueRouter)

const router = new VueRouter({
  // mode: 'history',
  routes: [
    { name: 'login', path: '/login', component: Login },
    {
      path: '/',
      component: Home,
      children: [
        { name: 'welcome', path: '/', component: Welcome },
        { name: 'article', path: '/article', component: Article },
        { name: 'image', path: '/image', component: Image },
        { name: 'publish', path: '/publish', component: Publish },
        { name: 'comment', path: '/comment', component: Comment },
        { name: 'setting', path: '/setting', component: Setting },
        { name: 'fans', path: '/fans', component: Fans },
        { name: 'passageway', path: '/passageway', component: PassageWay },
        { name: 'gateway', path: '/gateway', component: Gateway },
        { name: 'sensor', path: '/sensor', component: Sensor },
        { name: 'sensortype', path: '/sensortype', component: SensorType }
      ]
    },
    { name: '404', path: '*', component: NotFound }
  ]
})

// 路由前置守卫

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const user = window.sessionStorage.getItem('token')
  if (user) return next()
  next('/login')
})

export default router
