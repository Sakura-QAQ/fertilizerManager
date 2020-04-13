import Vue from 'vue'
import App from './App.vue'

import EleMent from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import router from '@/router'

import components from '@/components'
// 导入axios
import axios from '@/api/axios'

// 倒入全局样式
import '@/styles/index.less'

Vue.use(components)

Vue.prototype.$http = axios

Vue.use(EleMent)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
