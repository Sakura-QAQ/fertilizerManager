<template>
  <div class="type-container">
    <el-card>
      <div solt="header">
        <my-bread>传感器类别</my-bread>
        <el-card class="mainData" style="margin-top:20px;">
          <div class="title">传感器类别定义</div>
          <el-table :data="typelist.slice((pageNum - 1)*pageSize, pageNum*pageSize)">
            <el-table-column label="类别名称" prop="name"></el-table-column>
            <el-table-column label="类别单位" prop="unit"></el-table-column>
          </el-table>
          <div class="btn">
            <el-button type="primary" @click="add">添加</el-button>
          </div>
          <div class="box">
            <el-pagination
              background
              layout="prev, pager, next"
              @current-change="currentchange"
              @next-click="nextpage"
              @prev-click="prevpage"
              :current-page="pageNum"
              :page-size="pageSize"
              :total="total"
            ></el-pagination>
          </div>
        </el-card>
      </div>
      <el-dialog class="sensorform" :visible.sync="dialogFlag" :close-on-click-modal="false">
        <el-form :model="addTypeList" label-width="120px" style="width:630px;margin: 0 auto;">
          <el-form-item label="类别名称：">
            <el-input v-model="addTypeList.name"></el-input>
          </el-form-item>
          <el-form-item label="类别单位：">
            <el-input v-model="addTypeList.unit"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag = false">取 消</el-button>
          <el-button type="primary" @click="submitTypeList">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 分页参数
      pageNum: 1,
      pageSize: 12,
      total: 0,
      // typelist
      typelist: [],
      // dialog
      dialogFlag: false,
      // addTypeList
      addTypeList: {
        name: '',
        unit: ''
      }
    }
  },
  mounted () {
    this.queryAllType()
  },
  methods: {
    // 分页
    currentchange (newPage) {
      this.pageNum = newPage
    },
    prevpage () {
      this.pageNum = this.pageNum - 1
    },
    nextpage () {
      this.pageNum = this.pageNum + 1
    },
    // 获取所有类别
    async queryAllType () {
      const { data: { data } } = await this.$sensor.post('sensor/api/type/queryAll')
      this.typelist = data
      this.total = data.length
    },
    add () {
      this.dialogFlag = true
    },
    async submitTypeList () {
      const { data: { code } } = await this.$sensor.post('sensor/api/type/add', this.addTypeList)
      if (code === 200) {
        this.$message.success('添加成功')
        this.addTypeList = {
          name: '',
          unit: ''
        }
        this.queryAllType()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.type-container {
  .mainData {
    position: relative;
    .title {
      text-align: center;
      font-weight: 800;
      font-size: 24px;
      padding: 20px 0 30px 0;
      border-bottom: 1px solid #000;
    }
    .btn {
      position: absolute;
      right: 10px;
      top: 10px;
    }
    .box {
      text-align: center;
    }
  }
  .sensorform {
    /deep/.el-dialog {
      width: 680px !important;
    }
    /deep/ .el-dialog__body {
      .el-form {
        .el-form-item__content {
          float: left;
          margin-left: 20px !important;
        }
      }
    }
  }
}
</style>
