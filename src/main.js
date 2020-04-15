import Vue from 'vue'
import App from './App.vue'

import EleMent from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import router from '@/router'

import components from '@/components'
// 导入axios
import axios from '@/api/axios'
// 缩放、拖拽
import VueDragResize from 'vue-drag-resize'

// 倒入全局样式
import '@/styles/index.less'

Vue.use(components)

Vue.prototype.$http = axios

Vue.use(EleMent)

Vue.config.productionTip = false

Vue.component('vue-drag-resize', VueDragResize)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
