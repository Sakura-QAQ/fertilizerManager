import Vue from 'vue'
import App from './App.vue'

import EleMent from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import router from '@/router'

import components from '@/components'
// 导入axios api
import axios from '@/api/axios'
import login from '@/api/login'
import sensor from '@/api/sensor'
// 缩放、拖拽
import VueDragResize from 'vue-drag-resize'

// 倒入全局样式
import '@/styles/index.less'

Vue.use(components)

Vue.prototype.$http = axios
Vue.prototype.$login = login
Vue.prototype.$sensor = sensor

Vue.use(EleMent)

Vue.config.productionTip = false

Vue.component('vue-drag-resize', VueDragResize)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
