<template>
  <div class="container">
    <el-card>
      <div solt="header">
        <my-bread>备用</my-bread>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 分页参数
      reqParams: {
        page: 1,
        per_page: 20,
        response_type: 'comment'
      },
      // 总条数
      total: 0
    }
  },
  created () {
  },
  methods: {
  }
}
</script>

<style>
</style>
