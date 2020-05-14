<template>
  <div class="sensor-container">
    <el-card>
      <div solt="header">
        <my-bread>传感器</my-bread>
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
          <el-form class="select" :model="gateID" align="left" >
            <el-form-item label="请选择采集器:" >
              <el-select v-model="gateID.gatewayId" @change="gatechange">
                <el-option
                  v-for="item in gateList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-button class="btn" type="primary" @click="add">添加传感器</el-button>
        </el-card>
        <el-dialog class="sensorform" :visible.sync="dialogFlag" :close-on-click-modal="false">
          <el-form :model="addSensorList" label-width="120px" style="width:630px;margin: 0 auto;">
            <el-form-item label="传感器名称：">
              <el-input v-model="addSensorList.name"></el-input>
            </el-form-item>
            <el-form-item label="传感器类别：">
              <el-select v-model="typeId.id">
                <el-option
                  v-for="item in typeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="通道位置：">
              <el-input v-model="addSensorList.nodeNumber"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFlag = false">取 消</el-button>
            <el-button type="primary" @click="submitSensorList">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>
    <el-card>
      <el-table :data="sensorList.slice((pageNum - 1)*pageSize, pageNum*pageSize)">
        <el-table-column label="传感器名称" prop="name"></el-table-column>
        <el-table-column label="通道位置" prop="nodeNumber"></el-table-column>
        <el-table-column label="传感器类型" prop="typename"></el-table-column>
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
      // 采集器id
      gateID: {
        gatewayId: ''
      },
      // 传感器类别id
      typeId: {
        id: ''
      },
      addSensorList: {
        id: '',
        name: '',
        nodeNumber: null
      },
      dialogFlag: false,
      proList: [],
      gateList: [],
      sensorList: [],
      typeList: []
    }
  },
  mounted () {
    this.getproject().then(res => {
      this.getgatelist().then(res => {
        this.getsensortype().then(res => {
          this.queryByGateway()
        })
      })
    })
  },
  methods: {
    planchange () {
      this.getgatelist().then(res => {
        this.getsensortype().then(res => {
          this.queryByGateway()
        })
      })
    },
    gatechange () {
      this.queryByGateway()
    },
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
    // 园区选择
    async getproject () {
      const { data: { data } } = await this.$http.post('http://192.168.1.254:10010/sso/api/project/queryAllByUser')
      this.proList = data
      this.proID.projectId = data[0].id
    },
    // 通过园区id获取采集器
    async getgatelist () {
      const { data: { data } } = await this.$http.post('http://192.168.1.254:10040/sensor/api/gateway/queryByProject', this.proID)
      this.total = data.length
      if (data.length === 0) {
        this.$message.warning('没有采集器，请去添加')
        this.gateID.gatewayId = ''
        this.gateList = []
        return false
      } else {
        this.gateList = data
        this.gateID.gatewayId = data[0].id
      }
    },
    // 传感器类别选项
    async getsensortype () {
      const { data: { data } } = await this.$http.post('http://192.168.1.254:10040/sensor/api/type/queryAll')
      this.typeList = data
      this.typeId.id = data[0].id
    },
    // 通过采集器id获取传感器
    async queryByGateway () {
      const { data: { data } } = await this.$http.post('http://192.168.1.254:10040/sensor/api/sensor/queryByGateway', this.gateID)
      for (let i = 0; i < data.length; i++) {
        const element = data[i]
        for (let j = 0; j < this.typeList.length; j++) {
          const type = this.typeList[j]
          if (element.typeId === type.id) {
            element.typename = type.name
          }
        }
      }
      this.sensorList = data
    },
    clear () {
      this.addSensorList = {
        id: '',
        name: '',
        nodeNumber: null
      }
      this.typeId.id = ''
    },
    // 添加
    async add () {
      this.clear()
      this.dialogFlag = true
    },
    // 编辑
    edit (index, row) {
      this.addSensorList.id = row.id
      this.dialogFlag = true
      this.addSensorList.name = row.name
      this.typeId.id = row.typeId
      this.gateID.gatewayId = row.gatewayId
      this.proID.projectId = row.projectId
      this.addSensorList.nodeNumber = row.nodeNumber
    },
    // 删除
    async del (index, row) {
      const ID = {
        id: row.id
      }
      this.$confirm('此操作将永久删除该传感器, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this.$http.post(
            'http://192.168.1.254:10040/sensor/api/sensor/delete',
            ID
          )
          this.$message.success('删除成功')
          const totalPage = Math.ceil((this.total - 1) / this.pageSize)
          const pageNum = this.pageNum > totalPage ? totalPage : this.pageNum
          this.pageNum = pageNum < 1 ? 1 : pageNum
          this.queryByGateway()
        })
        .catch(() => {})
    },
    // 提交
    async submitSensorList () {
      let SensorList = {
        id: this.addSensorList.id,
        name: this.addSensorList.name,
        typeId: this.typeId.id,
        gatewayId: this.gateID.gatewayId,
        projectId: this.proID.projectId,
        // 节点位置(通道位置)
        nodeNumber: Number(this.addSensorList.nodeNumber)
      }
      const { data: { code } } = await this.$http.post('http://192.168.1.254:10040/sensor/api/sensor/saveOrUpdate', SensorList)
      if (code === 200) {
        this.$message.success('提交成功')
        this.dialogFlag = false
        this.queryByGateway()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.sensor-container {
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
  .box {
    text-align: center;
  }
}
</style>
