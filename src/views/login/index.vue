<template>
  <div class="login-container">
    <el-card class="login-box">
      <!-- 登录表单 -->
      <el-form ref="loginForm" :status-icon="true" :model="loginForm" :rules="loginRules">
        <el-form-item prop="name">
          <el-input v-model="loginForm.name" placeholder="请输入账号/手机号/邮箱"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox :value="true">我已阅读并同意用户协议和隐私条款</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button style="width:100%" type="primary" @click="login">登 录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      loginForm: {
        name: '',
        password: ''
      },
      loginRules: {
        name: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    login () {
      // loading
      this.loading = true
      // 对整个表单进行校验
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          // 发promise对象请求
          try {
          // 拿到登录的结果
            const res = await this.$http.post('http://192.168.1.254:10010/sso/api/login', this.loginForm)
            console.log(res)
            if (res.data.code === 100 && res.data.msg === '用户不存在') {
              this.$message.error('用户不存在')
              return false
            } else if (res.data.code === 100 && res.data.msg === '密码不正确') {
              this.$message.error('密码错误')
              return false
            } else if (res.data.code === 200) {
              this.$message.success('登录成功！')
              // 存数据
              window.sessionStorage.setItem('token', JSON.stringify(res.data.data))
              // 跳路由
              this.$router.push('/image')
            }
          } catch (err) {
            this.$message.error('Error')
            // console.log(err)
            if (err) {
              this.loading = false
            }
          }
        }
      })
    }
  }
}

</script>

<style lang="less" scoped>
.login-container {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: url(../../assets/images/login_bg.jpg) no-repeat center / cover;
  .login-box {
    width: 400px;
    height: 350px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    img {
      display: block;
      width: 200px;
      margin: 10px auto;
    }
  }

}
</style>
