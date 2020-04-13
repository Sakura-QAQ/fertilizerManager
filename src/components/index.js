// 封装一个vue插件 完成当前文件夹所有文件的全局注册
// 导入这个模块 当Vue.use（使用这个模块）vue会调用install函数 默认传入Vue对象
import MyBread from '@/components/my-bread.vue'
export default {
  install (Vue) {
    // 使用Vue对象去做业务
    // 进行组件的注册
    Vue.component(MyBread.name, MyBread)
  }
}
