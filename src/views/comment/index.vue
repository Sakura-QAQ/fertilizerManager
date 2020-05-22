<template>
  <div class="container">
    <el-card>
      <div solt="header">
        <my-bread>施肥机管理</my-bread>
        <el-card style="margin-top:20px;">
          <el-form align="right">
            <el-button type="primary" @click="add">添加施肥机</el-button>
          </el-form>
          <el-form :model="proID" align="left" >
            <el-form-item label="请选择园区:" >
              <el-select v-model="proID.projectId" @change="proTab">
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
        <!-- 对话层 -->
        <el-dialog style="margin-top:20px;" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
          <el-form :model="addFerList"  label-width="120px">
            <el-form-item label="产品编号：">
              <el-input v-model="addFerList.prodCode"></el-input>
            </el-form-item>
            <el-form-item label="施肥机名称：">
              <el-input v-model="addFerList.name"></el-input>
            </el-form-item>
            <el-form-item label="施肥机描述：">
              <el-input type="textarea" v-model="addFerList.descr"></el-input>
            </el-form-item>
            <el-form-item label="DTU编号：">
              <el-input v-model="addFerList.dtuCode"></el-input>
            </el-form-item>
            <el-form-item label="阀类型：">
              <el-radio-group v-model="addFerList.valveType">
                <el-radio :label="0">有线阀</el-radio>
                <el-radio :label="1">无线阀</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- <el-form-item label="状态：">
              <el-radio-group v-model="addFerList.status">
                <el-radio :label="0">不可用</el-radio>
                <el-radio :label="1">可用</el-radio>
              </el-radio-group>
            </el-form-item> -->
            <el-form-item label="版本号：">
              <el-input v-model="addFerList.version"></el-input>
            </el-form-item>
            <el-form-item label="阀号：">
              <el-checkbox-group v-model="checkboxGroup">
                <template v-for="(item, index) in ValveName">
                  <el-checkbox-button :label="index + 1" :key="index" v-show="cut(index)">
                    <div class="valve_num">{{index + 1}}</div>
                  </el-checkbox-button>
                </template>
              </el-checkbox-group>
              <el-button type="info" :icon="icons" circle @click="showall"></el-button>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitFerForm">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>
    <el-card>
      <el-table :data="FerList.slice((pageNum - 1)*pageSize, pageNum*pageSize)">
        <el-table-column label="施肥机名称" prop="name"></el-table-column>
        <el-table-column label="施肥机描述" prop="descr">
        </el-table-column>
        <el-table-column label="产品编号" prop="prodCode"></el-table-column>
        <el-table-column label="是否在线" prop="online"></el-table-column>
        <el-table-column label="状态" prop="statusName"></el-table-column>
        <el-table-column label="dtu码" prop="dtuCode"></el-table-column>
        <el-table-column label="阀类型" prop="valveName"></el-table-column>
        <el-table-column label="版本号" prop="version"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" circle plain type="primary" @click="editFerList(scope.$index, scope.row)"></el-button>
            <el-button icon="el-icon-delete" circle plain type="danger" @click="del(scope.$index, scope.row)" ></el-button>
            <el-button icon="el-icon-more-outline" circle plain type="info" @click="editValves(scope.$index, scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog class="Valve" style="margin-top:20px;" :visible.sync="dialogValve">
        <h2>阀名编辑</h2>
        <div v-for="(item, index) in ValveName" :key="index">
          <el-input v-model="ValveName[index]"></el-input>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogValve = false">取 消</el-button>
          <el-button type="primary" @click="submitValvesName()">确 定</el-button>
        </div>
      </el-dialog>
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
      checkboxGroup: [],
      // 园区列表
      proList: [],
      // 施肥机列表
      FerList: [],
      // 施肥机添加（编辑）列表
      addFerList: {
        projectId: '',
        // 产品编号
        prodCode: '',
        name: '',
        descr: '',
        // dtu编号
        dtuCode: '',
        // 阀类型
        valveType: 0,
        // 状态
        // status: 0,
        // 版本号
        version: '',
        // 阀号
        valveNum: ''
      },
      // 弹出层
      dialogFormVisible: false,
      // 阀弹出层
      dialogValve: false,
      // 阀显示隐藏
      isActive: false,
      // 图标
      icons: 'el-icon-caret-bottom',
      // 阀名称
      ValveName: ['1#', '2#', '3#', '4#', '5#', '6#', '7#', '8#', '9#', '10#', '11#', '12#', '13#', '14#', '15#', '16#', '17#', '18#', '19#', '20#', '21#', '22#', '23#', '24#', '25#', '26#', '27#', '28#', '29#', '30#', '31#', '32#', '33#', '34#', '35#', '36#', '37#', '38#', '39#', '40#', '41#', '42#', '43#', '44#', '45#', '46#', '47#', '48#', '49#', '50#', '51#', '52#', '53#', '54#', '55#', '56#', '57#', '58#', '59#', '60#', '61#', '62#', '63#', '64#'],
      // 提交阀的施肥机id
      ferValveId: ''
    }
  },
  mounted () {
    this.getproject().then(res => {
      this.getFerList()
    })
  },
  methods: {
    // 园区切换
    async proTab () {
      this.getFerList()
    },
    // 获取列表
    async getproject () {
      const { data: { data } } = await this.$login.post('sso/api/project/queryAllByUser')
      this.proList = data
      this.proID.projectId = data[0].id
    },
    // 获取施肥机列表
    async getFerList () {
      const { data: { data } } = await this.$http.post('fertilizer/api/fertilizer/queryByProjectId', this.proID)
      for (let i = 0; i < data.length; i++) {
        const element = data[i]
        if (element.isOnline === 0) {
          element.online = '离线'
        } else {
          element.online = '在线'
        }
        if (element.valveType === 0) {
          element.valveName = '有线阀'
        } else {
          element.valveName = '无线阀'
        }
        if (element.status === 0) {
          element.statusName = '不可用'
        } else {
          element.statusName = '可用'
        }
      }
      this.FerList = data
      this.total = data.length
    },
    // 添加施肥机
    add () {
      this.dialogFormVisible = true
      this.clear()
    },
    // 删除
    async del (index, row) {
      const ID = {
        id: row.id
      }
      this.$confirm('此操作将永久删除该温室, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this.$http.post('fertilizer/api/fertilizer/delete', ID)
          this.$message.success('删除成功')
          const totalPage = Math.ceil((this.total - 1) / this.pageSize)
          const pageNum = this.pageNum > totalPage ? totalPage : this.pageNum
          this.pageNum = pageNum < 1 ? 1 : pageNum
          this.getFerList()
        })
        .catch(() => {})
    },
    // 编辑施肥机
    editFerList (index, row) {
      this.dialogFormVisible = true
      this.checkboxGroup = row.valveNum.split(',').map(Number)
      this.addFerList = {
        id: row.id,
        projectId: row.projectId,
        prodCode: row.prodCode,
        name: row.name,
        descr: row.descr,
        dtuCode: row.dtuCode,
        // status: row.status,
        valveType: row.valveType,
        version: row.version,
        channels: row.channels
      }
    },
    // 恢复默认 (直接调用)
    clear () {
      this.checkboxGroup = []
      this.addFerList = {
        projectId: '',
        // 产品编号
        prodCode: '',
        name: '',
        descr: '',
        // dtu编号
        dtuCode: '',
        // 阀类型
        valveType: 0,
        // 版本号
        version: '',
        // // 阀号
        valveNum: ''
      }
    },
    // 弹出阀号名称
    async editValves (index, row) {
      this.dialogValve = true
      this.ferValveId = row.id
      const ferId = {
        id: row.id
      }
      const { data: { data } } = await this.$http.post('fertilizer/api/fertilizer/queryValveAlias', ferId)
      this.ValveName = data.split(',')
    },
    // 提交施肥机表单
    async submitFerForm () {
      this.addFerList.projectId = this.proID.projectId
      this.addFerList.valveNum = this.checkboxGroup.join(',')
      const { data } = await this.$http.post('fertilizer/api/fertilizer/saveOrUpdate', this.addFerList)
      if (data.code === 200) {
        this.$message.success('提交成功')
        this.dialogFormVisible = false
        this.getFerList().then(res => {
          this.clear()
        })
      } else {
        this.$message.error(data.msg)
      }
    },
    // 提交阀名
    async submitValvesName () {
      const obj = {
        id: this.ferValveId,
        valveAlias: this.ValveName.join(',')
      }
      const { data } = await this.$http.post('fertilizer/api/fertilizer/updateValveAlias', obj)
      if (data.code === 200) {
        this.$message.success('提交成功')
        this.dialogValve = false
      } else {
        this.$message.error(data.msg)
      }
    },
    // 阀索引函数条件
    cut (index) {
      if (this.isActive === false) {
        return index < 8
      } else if (this.isActive === true) {
        return !index < 8
      }
    },
    // 全部阀展开
    showall () {
      if (this.isActive === false) {
        this.isActive = true
        this.icons = 'el-icon-top'
      } else {
        this.isActive = false
        this.icons = 'el-icon-caret-bottom'
      }
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
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  /deep/.el-dialog {
    width: 780px !important;
  }
  /deep/ .Valve {
    .el-dialog__body {
      width: 600px;
      height: 450px;
      margin: 0 auto;
      .el-form {
        width: 730px !important;
        margin: 0 auto;
      }
      > div {
        float: left;
        width: 72px;
        margin-right: 3px;
        margin-top: 3px;
      }
    }
  }
  /deep/ .el-checkbox-group {
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
    margin-top: 20px;
    background: transparent;

    .el-checkbox-button__inner {
      width: 75px;
      border: 1px solid #6989a5;
      border-radius: 5px;
      background: transparent;
      color: #6989a5;
      margin-bottom: 8px;
      padding: 0 0;

      .valve_num {
        width: 75px;
        height: 35px;
        line-height: 35px;
        text-align: center;
        background: transparent;
      }
    }
    .is-checked {
      .el-checkbox-button__inner {
        background-color: #ccc;
        border: 1px solid transparent;
      }
    }
  }
}
</style>
