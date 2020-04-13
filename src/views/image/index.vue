<template>
  <div class="image-container">
    <el-card>
      <div slot="header">
        <my-bread>园区管理</my-bread>
      </div>
      <el-form :model="addList">
        <el-form-item label="项目名">
          <el-input v-model="addList.name"></el-input>
        </el-form-item>
        <el-form-item label="项目描述">
          <el-input v-model="addList.descr"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addproject">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-table :data="proList">
        <el-table-column label="园区名" prop="name"></el-table-column>
        <el-table-column label="园区描述" prop="descr">
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" circle plain type="primary" @click="editproject(scope.$index, scope.row)"></el-button>
            <el-button icon="el-icon-delete" circle plain type="danger" @click="del(scope.$index, scope.row)" ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 园区列表
      proList: [],
      // 添加
      addList: {
        id: '',
        name: '',
        descr: ''
      }
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
    },
    // 添加项目
    async addproject () {
      if (this.addList.name === '') {
        this.$message.error('名字不能为空')
        return false
      } else if (this.addList.descr === '') {
        this.$message.error('描述不能为空')
        return false
      } else {
        await this.$http.post('http://192.168.1.254:10010/sso/api/project/saveOrUpdate', this.addList)
        this.$message.success('提交成功')
        this.addList.name = ''
        this.addList.descr = ''
        this.getproject()
      }
    },
    // 编辑项目
    async editproject (index, row) {
      this.addList.id = row.id
      this.addList.name = row.name
      this.addList.descr = row.descr
    },
    async del (index, row) {
      const obj = {
        id: row.id
      }

      this.$confirm('此操作将永久删除该园区, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this.$http.post(
            'http://192.168.1.254:10010/sso/api/project/delete',
            obj
          )
          // 删除成功
          this.$message.success('删除成功')
          this.getproject()
        })
        .catch(() => {})
    }
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
