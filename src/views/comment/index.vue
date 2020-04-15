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
        <el-dialog style="margin-top:20px;" :visible.sync="dialogFormVisible">
          <el-form :model="addFerList"  label-width="120px" style="width:400px;margin: 0 auto;">
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
                <el-radio :label="1">天正阀</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="版本号：">
              <el-input v-model="addFerList.version"></el-input>
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
      <el-table :data="FerList">
        <el-table-column label="施肥机名称" prop="name"></el-table-column>
        <el-table-column label="施肥机描述" prop="descr">
        </el-table-column>
        <el-table-column label="产品编号" prop="prodCode"></el-table-column>
        <el-table-column label="是否在线" prop="isOnline"></el-table-column>
        <el-table-column label="状态" prop="status"></el-table-column>
        <el-table-column label="dtu码" prop="dtuCode"></el-table-column>
        <el-table-column label="阀类型" prop="valveType"></el-table-column>
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
      total: 0,
      // 项目id
      proID: {
        projectId: ''
      },
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
        // 版本号
        version: ''
      },
      // 弹出层
      dialogFormVisible: false,
      // 阀弹出层
      dialogValve: false,
      // 阀名称
      ValveName: ['1#', '2#', '3#', '4#', '5#', '6#', '7#', '8#', '9#', '10#', '11#', '12#', '13#', '14#', '15#', '16#', '17#', '18#', '19#', '20#', '21#', '22#', '23#', '24#', '25#', '26#', '27#', '28#', '29#', '30#', '31#', '32#', '33#', '34#', '35#', '36#', '37#', '38#', '39#', '40#', '41#', '42#', '43#', '44#', '45#', '46#', '47#', '48#', '49#', '50#', '51#', '52#', '53#', '54#', '55#', '56#', '57#', '58#', '59#', '60#', '61#', '62#', '63#', '64#'],
      // 提交阀的施肥机id
      ferValveId: ''
    }
  },
  mounted () {
    this.order()
  },
  methods: {
    // 顺序
    order () {
      this.getproject().then(res => {
        this.getFerList()
      })
    },
    // 园区切换
    async proTab () {
      const { data: { data } } = await this.$http.post('http://192.168.1.254:10020/fertilizer/api/fertilizer/queryByProjectId', this.proID)
      this.FerList = data
    },
    // 获取列表
    async getproject () {
      const { data: { data } } = await this.$http.post('http://192.168.1.254:10010/sso/api/project/queryAllByUser')
      this.proList = data
      this.proID.projectId = data[0].id
    },
    // 获取施肥机列表
    async getFerList () {
      const { data: { data } } = await this.$http.post('http://192.168.1.254:10020/fertilizer/api/fertilizer/queryByProjectId', this.proID)
      this.FerList = data
    },
    // 添加施肥机
    add () {
      this.dialogFormVisible = true
      this.clear()
    },
    // 提交施肥机表单
    async submitFerForm () {
      this.addFerList.projectId = this.proID.projectId
      await this.$http.post('http://192.168.1.254:10020/fertilizer/api/fertilizer/saveOrUpdate', this.addFerList)
      this.dialogFormVisible = false
      this.getFerList().then(res => {
        this.clear()
      })
    },
    // 删除
    async del (index, row) {
      const ID = {
        id: row.id
      }
      await this.$http.post('http://192.168.1.254:10020/fertilizer/api/fertilizer/delete', ID)
      this.getFerList()
    },
    // 编辑施肥机
    async editFerList (index, row) {
      this.dialogFormVisible = true
      this.addFerList = {
        id: row.id,
        projectId: row.projectId,
        prodCode: row.prodCode,
        name: row.name,
        descr: row.descr,
        dtuCode: row.dtuCode,
        valveType: row.valveType,
        version: row.version
      }
    },
    // 恢复默认 (直接调用)
    clear () {
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
        version: ''
      }
    },
    // 弹出阀号名称
    async editValves (index, row) {
      this.dialogValve = true
      this.ferValveId = row.id
      const ferId = {
        id: row.id
      }
      const { data: { data } } = await this.$http.post('http://192.168.1.254:10020/fertilizer/api/fertilizer/queryValveAlias', ferId)
      this.ValveName = data.split(',')
    },
    async submitValvesName () {
      const obj = {
        id: this.ferValveId,
        valveAlias: this.ValveName.join(',')
      }
      await this.$http.post('http://192.168.1.254:10020/fertilizer/api/fertilizer/updateValveAlias', obj)
      this.dialogValve = false
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  /deep/.el-dialog {
    width: 650px !important;
  }
  /deep/ .Valve {
    .el-dialog__body {
      width: 600px;
      height: 450px;
      margin: 0 auto;
      > div {
        float: left;
        width: 72px;
        margin-right: 3px;
        margin-top: 3px;
      }
    }
  }
}
</style>
