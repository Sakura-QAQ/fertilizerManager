<template>
  <div class="gateway-container">
    <el-card>
      <div solt="header">
        <my-bread>采集器管理</my-bread>
        <el-card style="margin-top:20px;">
          <el-form class="select" :model="proID" align="left" >
            <el-form-item label="请选择园区:" >
              <el-select v-model="proID.projectId" @change="planchange">
                <el-option
                  v-for="item in proList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-button class="btn" type="primary" @click="add">添加采集器</el-button>
        </el-card>
        <el-dialog class="gateform" :visible.sync="dialogFlag" :close-on-click-modal="false">
          <el-form :model="addGateList" label-width="120px" style="width:630px;margin: 0 auto;">
            <el-form-item label="采集器名称：">
              <el-input v-model="addGateList.name"></el-input>
            </el-form-item>
            <el-form-item label="采集器坐标：">
              <el-input v-model="addGateList.position"></el-input>
            </el-form-item>
            <el-form-item label="采集器类型：">
              <el-radio-group v-model="addGateList.type">
                <el-radio :label="1">土壤墒情</el-radio>
                <el-radio :label="2">气象站</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFlag = false">取 消</el-button>
            <el-button type="primary" @click="submitGateList">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>
    <el-card>
      <el-table :data="gateList.slice((pageNum - 1)*pageSize, pageNum*pageSize)">
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="状态" prop="status"></el-table-column>
        <el-table-column label="注册包" prop="dtuCode"></el-table-column>
        <el-table-column label="位置" prop="position">
        </el-table-column>
        <el-table-column label="类型" prop="type">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-edit"
              circle
              plain
              type="primary"
              @click="edit(scope.$index, scope.row)"
            ></el-button>
            <el-button
              icon="el-icon-delete"
              circle
              plain
              type="danger"
              @click="del(scope.$index, scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
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
</template>

<script>
export default {
  data () {
    return {
      // 分页参数
      pageNum: 1,
      pageSize: 8,
      total: 0,
      // 项目id
      proID: {
        projectId: ''
      },
      // 网关id
      gateID: {
        id: ''
      },
      addGateList: {
        name: '',
        projectId: '',
        position: '',
        type: 1
      },
      dialogFlag: false,
      proList: [],
      gateList: []
    }
  },
  mounted () {
    this.getproject().then(res => {
      this.getgateway()
    })
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
    // 园区切换
    planchange () {
      this.getgateway()
    },
    // 园区选择
    async getproject () {
      const { data: { data } } = await this.$http.post('http://192.168.1.254:10010/sso/api/project/queryAllByUser')
      this.proList = data
      this.proID.projectId = data[0].id
    },
    // 通过园区id获取网关
    async getgateway () {
      const { data: { data } } = await this.$http.post('http://192.168.1.254:10040/sensor/api/gateway/queryByProject', this.proID)
      this.gateList = data
      this.total = data.length
    },
    // 添加网关
    add () {
      this.addGateList = {}
      this.dialogFlag = true
    },
    // 提交网关
    async submitGateList () {
      this.addGateList.projectId = this.proID.projectId
      const { data } = await this.$http.post('http://192.168.1.254:10040/sensor/api/gateway/saveOrUpdate', this.addGateList)
      if (data.code === 200) {
        this.dialogFlag = false
        this.$message.success('提交成功')
        this.getgateway()
      }
    },
    // 编辑
    edit (index, row) {
      this.dialogFlag = true
      this.addGateList = {
        id: row.id,
        name: row.name,
        projectId: row.projectId,
        position: row.position,
        type: row.type
      }
    },
    // 删除
    del (index, row) {
      const ID = {
        id: row.id
      }
      this.$confirm('此操作将永久删除该网关, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this.$http.post(
            'http://192.168.1.254:10040/sensor/api/gateway/delete',
            ID
          )
          this.$message.success('删除成功')
          const totalPage = Math.ceil((this.total - 1) / this.pageSize)
          const pageNum = this.pageNum > totalPage ? totalPage : this.pageNum
          this.pageNum = pageNum < 1 ? 1 : pageNum
          this.getgateway()
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="less" scoped>
.gateway-container {
  .select {
      display: inline-block;
      width: 340px;
      .el-form-item {
        margin-bottom: 0;
      }
    }
  /deep/ .btn {
    float: right;
  }
  .gateform {
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
  .box {
    text-align: center;
  }
}
</style>
