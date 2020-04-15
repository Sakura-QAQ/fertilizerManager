<template>
  <div class="container">
    <el-card>
      <div solt="header">
        <my-bread>温室管理</my-bread>
        <el-card style="margin-top:20px;">
          <el-form align="right">
            <el-button type="primary" @click="add">添加温室</el-button>
          </el-form>
          <el-form :model="proID" align="left">
            <el-form-item label="请选择园区:">
              <el-select v-model="proID.projectId" @change="proTab">
                <el-option
                  v-for="item in proList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </el-card>
    <el-card>
      <el-table :data="areaList">
        <el-table-column label="温室名称" prop="name"></el-table-column>
        <el-table-column label="绑定的施肥机" prop="ferName"></el-table-column>
        <el-table-column label="绑定的阀" prop="fergroup">
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
      <el-dialog class="Valve" :visible.sync="dialogFlag">
        <el-form :model="addAreaList" label-width="120px" style="width:630px;margin: 0 auto;">
          <el-form-item label="温室名称：">
            <el-input v-model="addAreaList.name"></el-input>
          </el-form-item>
          <el-form-item label="选择施肥机：">
            <el-select v-model="addAreaList.fertilizerId" @change="TabFer">
              <el-option v-for="item in FerList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="绑定电磁阀：">
            <el-checkbox-group v-model="checkboxGroup">
              <template v-for="(item, index) in Vals">
                <el-checkbox-button :label="index + 1" :key="index">
                  <div class="valve_num">{{item}}</div>
                </el-checkbox-button>
              </template>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag = false">取 消</el-button>
          <el-button type="primary" @click="submitAreaList">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 项目id
      proID: {
        projectId: ''
      },
      // 园区列表
      proList: [],
      // 温室列表
      areaList: [],
      // 施肥机列表
      FerList: [],
      // 添加编辑的温室列表
      addAreaList: {
        id: '',
        name: '',
        projectId: '',
        fertilizerId: '',
        fertilizerValves: ''
      },
      // 编辑层
      dialogFlag: false,
      // 选中的阀
      checkboxGroup: [],
      // 页面进入渲染使用的阀
      useVals: [4, 8, 18],
      // 阀列表
      Vals: ['1#', '2#', '3#', '4#', '5#', '6#', '7#', '8#', '9#', '10#', '11#', '12#', '13#', '14#', '15#', '16#', '17#', '18#', '19#', '20#', '21#', '22#', '23#', '24#', '25#', '26#', '27#', '28#', '29#', '30#', '31#', '32#', '33#', '34#', '35#', '36#', '37#', '38#', '39#', '40#', '41#', '42#', '43#', '44#', '45#', '46#', '47#', '48#', '49#', '50#', '51#', '52#', '53#', '54#', '55#', '56#', '57#', '58#', '59#', '60#', '61#', '62#', '63#', '64#']
    }
  },
  mounted () {
    this.order()
  },
  methods: {
    order () {
      this.getproject().then(res => {
        this.getFerList().then(res => {
          this.getAreaList()
        })
      })
    },
    // dialog层施肥机切换
    async TabFer () {
      const ID = {
        id: this.addAreaList.fertilizerId
      }
      const { data: { data } } = await this.$http.post('http://192.168.1.254:10020/fertilizer/api/fertilizer/queryValveAlias', ID)
      this.Vals = data.split(',')
    },
    // 获取园区
    async getproject () {
      const {
        data: { data }
      } = await this.$http.post(
        'http://192.168.1.254:10010/sso/api/project/queryAllByUser'
      )
      this.proList = data
      this.proID.projectId = data[0].id
    },
    // 切换
    proTab () {
      this.getFerList().then(res => {
        this.getAreaList()
      })
    },
    // 获取温室
    async getAreaList () {
      const {
        data: { data }
      } = await this.$http.post(
        'http://192.168.1.254:10020/fertilizer/api/area/queryByProjectId',
        this.proID
      )
      const ferlist = this.FerList
      const arealist = data
      for (let i = 0; i < arealist.length; i++) {
        arealist[i].ferName = '已删除'
        const a = arealist[i].fergroup = arealist[i].fertilizerValves.split(',').map(Number)
        let ID = {
          id: arealist[i].fertilizerId
        }
        const { data: { data } } = await this.$http.post('http://192.168.1.254:10020/fertilizer/api/fertilizer/queryValveAlias', ID)
        const b = data.split(',')
        arealist[i].fergroup = b.filter((_, index) => a.includes(index + 1)).join(',')
        for (let j = 0; j < ferlist.length; j++) {
          if (arealist[i].fertilizerId === ferlist[j].id) {
            arealist[i].ferName = ferlist[j].name
          }
        }
      }
      this.areaList = arealist
    },
    // 获取施肥机列表
    async getFerList () {
      const {
        data: { data }
      } = await this.$http.post(
        'http://192.168.1.254:10020/fertilizer/api/fertilizer/queryByProjectId',
        this.proID
      )
      this.FerList = data
    },
    // 添加
    add () {
      this.clear()
      this.dialogFlag = true
      this.addAreaList.projectId = this.proID.projectId
      this.getAreaList()
    },
    // 编辑
    async edit (ndex, row) {
      this.dialogFlag = true
      this.checkboxGroup = row.fertilizerValves.split(',').map(Number)
      this.addAreaList = {
        id: row.id,
        name: row.name,
        projectId: row.projectId,
        fertilizerId: row.fertilizerId,
        fertilizerValves: row.fertilizerValves
      }
      const ID = {
        id: row.fertilizerId
      }
      const { data: { data } } = await this.$http.post('http://192.168.1.254:10020/fertilizer/api/fertilizer/queryValveAlias', ID)
      this.Vals = data.split(',')
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
          await this.$http.post(
            'http://192.168.1.254:10020/fertilizer/api/area/delete',
            ID
          )
          this.$message.success('删除成功')
          this.getAreaList()
        })
        .catch(() => {})
    },
    clear () {
      this.addAreaList = {
        id: '',
        name: '',
        projectId: '',
        fertilizerId: '',
        fertilizerValves: ''
      }
      this.checkboxGroup = []
      this.Vals = ['1#', '2#', '3#', '4#', '5#', '6#', '7#', '8#', '9#', '10#', '11#', '12#', '13#', '14#', '15#', '16#', '17#', '18#', '19#', '20#', '21#', '22#', '23#', '24#', '25#', '26#', '27#', '28#', '29#', '30#', '31#', '32#', '33#', '34#', '35#', '36#', '37#', '38#', '39#', '40#', '41#', '42#', '43#', '44#', '45#', '46#', '47#', '48#', '49#', '50#', '51#', '52#', '53#', '54#', '55#', '56#', '57#', '58#', '59#', '60#', '61#', '62#', '63#', '64#']
    },
    // 提交园区表单
    async submitAreaList () {
      this.addAreaList.fertilizerValves = this.checkboxGroup.join(',')
      const res = await this.$http.post(
        'http://192.168.1.254:10020/fertilizer/api/area/saveOrUpdate',
        this.addAreaList
      )
      if (res.data.code === 200) {
        this.$message.success('提交成功')
      }
      this.dialogFlag = false
      this.getAreaList()
    }
  }
}
</script>

<style lang="less" scoped>
.container {
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
