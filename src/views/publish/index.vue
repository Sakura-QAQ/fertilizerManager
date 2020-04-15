<template>
<div class="container">
  <el-card>
    <div solt="header">
      <my-bread>实况管理</my-bread>
      <el-card style="margin-top:20px;">
        <el-form :model="proID" align="left" >
          <el-form-item label="请选择园区:" >
            <el-select v-model="proID.projectId">
              <el-option
                v-for="item in proList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </el-card>
  <el-card class="AreaBody">
    <div class="bgArea">
      <vue-drag-resize
        :isResizable="false"
        :w="150"
        :h="74"
        :left="left"
        :top="top"
        v-for="(item, index) in 1"
        :key="index"
        :parentLimitation="true"
        @dragging="dragFer($event, index)">
        <div class="fer"></div>
      </vue-drag-resize>
    </div>
  </el-card>
</div>
</template>

<script>
export default {
  data () {
    return {
      proID: {
        projectId: ''
      },
      proList: [],
      top: 50,
      left: 0
    }
  },
  created () {
    this.getproject()
  },
  methods: {
    // 获取列表
    async getproject () {
      const { data: { data } } = await this.$http.post('http://192.168.1.254:10010/sso/api/project/queryAllByUser')
      this.proList = data
      this.proID.projectId = data[0].id
    },
    dragFer (e, index) {
      console.log(e)
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  /deep/ .el-form-item {
    margin-bottom: 0;
  }
  /deep/ .AreaBody {
    .el-card__body {
      padding: 0;
      .bgArea {
        position: relative;
        width: 1660px;
        height: 780px;
        background-color: #ccc;
        .fer {
          width: 150px;
          height: 74px;
          background-color: #fff;
        }
      }
    }
  }
}
</style>
