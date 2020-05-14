<template>
  <div class="image-container">
    <el-card>
      <div solt="header">
        <my-bread>园区管理</my-bread>
        <el-form align="right">
          <el-button type="primary" @click="add">添加园区</el-button>
        </el-form>
        <el-dialog :visible.sync="dialogFlag" :close-on-click-modal="false">
          <el-form :model="addList">
            <el-form-item label="项目名称：">
              <el-input v-model="addList.name"></el-input>
            </el-form-item>
            <el-form-item label="项目描述：">
              <el-input type="textarea" v-model="addList.descr"></el-input>
            </el-form-item>
            <el-form-item label="园区场景：">
              <el-upload
                class="upload-demo"
                name="avatarfile"
                ref="upload"
                action="http://192.168.1.254:10010/sso/api/project/updateAvatar"
                :headers="TokenBus"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="fileList"
                :auto-upload="false"
                :on-success="handleBannerSuccess">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
              </el-upload>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFlag = false">取 消</el-button>
            <el-button type="primary" @click="submitproject">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>
    <el-card>
      <el-table :data="proList.slice((pageNum - 1)*pageSize, pageNum*pageSize)">
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
      <div class="box" style="text-align: center;">
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
      pageSize: 10,
      total: 0,
      // 园区列表
      proList: [],
      // 添加
      addList: {
        id: '',
        name: '',
        descr: '',
        situationUrl: ''
      },
      dialogFlag: false,
      fileList: [],
      TokenBus: {
        token: ''
      },
      imgUrl: 'http://192.168.1.254:10010/image/avatar/'
    }
  },
  created () {
    const token = JSON.parse(window.sessionStorage.getItem('token')).token
    this.TokenBus.token = token
    this.getproject()
  },
  methods: {
    // 获取列表
    async getproject () {
      const { data: { data } } = await this.$http.post('http://192.168.1.254:10010/sso/api/project/queryAllByUser')
      this.proList = data
      this.total = data.length
    },
    add () {
      this.dialogFlag = true
      this.addList.id = ''
      this.addList.name = ''
      this.addList.descr = ''
      this.addList.situationUrl = ''
    },
    // 提交项目
    async submitproject () {
      if (this.addList.name === '') {
        this.$message.error('名字不能为空')
        return false
      } else if (this.addList.descr === '') {
        this.$message.error('描述不能为空')
        return false
      } else {
        const { data: { data } } = await this.$http.post('http://192.168.1.254:10010/sso/api/project/saveOrUpdate', this.addList)
        if (data === true) {
          this.$message.success('提交成功')
          this.addList.id = ''
          this.addList.name = ''
          this.addList.descr = ''
          this.addList.situationUrl = ''
          this.dialogFlag = false
          this.getproject()
        }
      }
    },
    // 编辑项目
    async editproject (index, row) {
      this.dialogFlag = true
      this.addList.id = row.id
      this.addList.name = row.name
      this.addList.descr = row.descr
      this.addList.situationUrl = row.situationUrl
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
          const totalPage = Math.ceil((this.total - 1) / this.pageSize)
          const pageNum = this.pageNum > totalPage ? totalPage : this.pageNum
          this.pageNum = pageNum < 1 ? 1 : pageNum
          this.getproject()
        })
        .catch(() => {})
    },
    // 上传文件
    submitUpload () {
      this.$refs.upload.submit()
    },
    // 删除文件
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    // 点击文件
    handlePreview (file) {
      console.log(file)
    },
    handleBannerSuccess (response) {
      this.addList.situationUrl = response.data
      // this.$refs.upload.uploadFiles = []
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
.image-container {
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
  /deep/ .el-dialog__footer {
    text-align: right;
  }
  /deep/ .el-form {
    .el-form-item__content {
      width: 300px;
    }
  }
}
</style>
