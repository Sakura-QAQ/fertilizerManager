<template>
  <div class="image-container">
    <el-card>
      <div slot="header">
        <my-bread>园区管理</my-bread>
      </div>
      <div>1111</div>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 参数对象
    }
  },
  created () {
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
.image-list {
  list-style: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  li {
    width: 180px;
    height: 180px;
    border: 1px dashed #eee;
    float: left;
    margin-right: 50px;
    margin-bottom: 20px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
    .fot {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background: rgba(0, 0, 0, 0.5);
      color: #fff;
      span {
        margin: 0 20px;
        &.red {
          color: red;
        }
      }
    }
  }
}
</style>
