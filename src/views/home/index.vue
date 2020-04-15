<template>
  <el-container class="home-container">
    <el-aside class="my-aside" :width="collapse?'64px':'200px'">
      <el-menu
        router
        style="border-right:none"
        :default-active="$route.path"
        background-color="#002033"
        text-color="#fff"
        active-text-color="rgb(68, 204, 91)"
        :collapse="collapse"
        :collapse-transition="false"
      >
        <el-menu-item index="/">
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-menu-item index="/article">
          <i class="el-icon-document"></i>
          <span slot="title">用户管理</span>
        </el-menu-item>
        <el-menu-item index="/image">
          <i class="el-icon-picture"></i>
          <span slot="title">园区管理</span>
        </el-menu-item>
        <el-menu-item index="/publish">
          <i class="el-icon-s-promotion"></i>
          <span slot="title">实况管理</span>
        </el-menu-item>
        <el-menu-item index="/comment">
          <i class="el-icon-chat-dot-round"></i>
          <span slot="title">施肥机管理</span>
        </el-menu-item>
        <el-menu-item index="/fans">
          <i class="el-icon-present"></i>
          <span slot="title">温室管理</span>
        </el-menu-item>
        <el-menu-item index="/setting">
          <i class="el-icon-setting"></i>
          <span slot="title">备用</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="my-header">
        <span class="el-icon-s-fold" @click="toggleMenu()"></span>
        <span class="text">施肥机后台管理系统</span>
        <el-dropdown style="float:right" @command="handleCommand">
          <span class="el-dropdown-link">
            <img
              style="vertical-align:middle"
              width="30"
              height="30"
              :src="avatar"
              alt
            />
            <b style="vertical-align:middle;padding-left:5px">{{name}}</b>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-setting" command="setting">个人设置</el-dropdown-item>
            <el-dropdown-item icon="el-icon-lock" command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main>
        <!-- 二级路由显示的位置 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      collapse: false,
      avatar: '',
      name: ''
    }
  },
  created () {
  },
  methods: {
    toggleMenu () {
      this.collapse = !this.collapse
    },
    // 绑定的事件给了组件 组件解析过后 标签是不存在的 所以无效
    // 使用事件修饰符 @click.prevent 阻止浏览器模式行为 @cliack.native绑定原生事件
    setting () {
      this.$router.push('setting')
    },
    logout () {
      // 清楚sessionStorage中的token数据
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    handleCommand (command) {
      this[command]()
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  // background-color: rgb(68, 204, 91);
  .my-aside {
    background: #002033;
  }
  .my-header {
    border-bottom: 1px solid #ddd;
    line-height: 60px;
    .el-icon-s-fold {
      font-size: 26px;
      vertical-align: middle;
    }
    .text {
      vertical-align: middle;
      padding-left: 10px;
    }
  }
}
</style>
