<template>
  <div class="image-container">
    <el-card>
      <div solt="header">
        <my-bread>园区管理</my-bread>
        <el-form align="right">
          <el-button type="primary" @click="add">添加园区</el-button>
        </el-form>
        <el-dialog :visible.sync="dialogFlag" :close-on-click-modal="false" :show-close="false">
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
                action="http://47.104.128.108:10010/sso/api/project/updateAvatar"
                :headers="TokenBus"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="fileList"
                :auto-upload="false"
                :limit="1"
                :on-exceed="handleExceed"
                :on-success="handleBannerSuccess"
                :before-upload="beforeAvatarUpload">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
              </el-upload>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="returnImage">取 消</el-button>
            <!-- <el-button @click="dialogFlag = false">取 消</el-button> -->
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
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" circle plain type="primary" @click="editproject(scope.$index, scope.row)"></el-button>
            <el-button icon="el-icon-delete" circle plain type="danger" @click="del(scope.$index, scope.row)" ></el-button>
          </template>
        </el-table-column>
        <el-table-column label="管理用户">
          <template slot-scope="scope">
            <el-button icon="el-icon-user-solid" plain type="primary" @click="queryUser(scope.$index, scope.row)">关联用户</el-button>
            <!-- <el-button icon="el-icon-user-solid" plain type="primary" @click="addUser(scope.$index, scope.row)">用户添加</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 用户查询 -->
      <el-dialog class="userList" :visible.sync="dialogUser" :close-on-click-modal="false">
        <div class="addUserBtn">
          <el-popover
            placement="right"
            width="400"
            trigger="click">
            <el-input style="width:80%;" placeholder="输入要添加的用户名/手机号/邮箱" v-model="userOrTel"></el-input>
            <el-button style="margin:0 0 0 10px;" type="primary" @click="define">确定</el-button>
            <el-button slot="reference" icon="el-icon-user" type="primary" plain>添加用户</el-button>
          </el-popover>
        </div>
        <el-table
          class="userTable"
          :data="userPlan"
          style="width: 100%">
          <el-table-column
            prop="name"
            label="用户账号">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!-- <el-button plain type="primary"></el-button> -->
              <el-button plain type="danger" @click="delUser(scope.$index, scope.row)">解绑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogUser = false">取 消</el-button>
        </div>
      </el-dialog>
      <!-- 用户添加 -->
      <el-dialog :visible.sync="dialogUserAdd" :close-on-click-modal="false">
        <el-table
          :data="personList"
          style="width: 100%">
          <el-table-column
            prop="user.name"
            label="用户账号">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button plain type="primary" @click="sendUserData(scope.$index, scope.row)">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogUserAdd = false">取 消</el-button>
        </div>
      </el-dialog>
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
      dialogUser: false,
      dialogUserAdd: false,
      fileList: [],
      TokenBus: {
        token: ''
      },
      imgUrl: 'http://47.104.128.108:10010/image/avatar/',
      userPlan: [],
      projectId: '',
      // 员工列表
      personList: [],
      // 添加的用户名或手机号
      userOrTel: '',
      visible: false
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
      const { data: { data } } = await this.$login.post('sso/api/project/queryAllByUser')
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
    // 提交项目表单
    async submitproject () {
      if (this.addList.name === '') {
        this.$message.error('名字不能为空')
        return false
      } else if (this.addList.descr === '') {
        this.$message.error('描述不能为空')
        return false
      } else {
        const { data: { data } } = await this.$login.post('sso/api/project/saveOrUpdate', this.addList)
        if (data === true) {
          this.$message.success('提交成功')
          this.addList.id = ''
          this.addList.name = ''
          this.addList.descr = ''
          this.addList.situationUrl = ''
          this.dialogFlag = false
          this.$refs.upload.uploadFiles = []
          this.getproject()
        }
      }
    },
    // 返回
    returnImage () {
      this.dialogFlag = false
      this.$refs.upload.uploadFiles = []
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
          await this.$login.post(
            'sso/api/project/delete',
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
    // dialog关闭的回调
    closeDialog () {
      console.log(111)
      this.dialogFlag = false
      this.$refs.upload.uploadFiles = []
    },
    // 上传文件
    submitUpload () {
      this.$refs.upload.submit()
    },
    // 删除文件
    handleRemove (file, fileList) {
      // console.log(file, fileList)
    },
    // 点击文件
    handlePreview (file) {
      console.log(file)
    },
    handleBannerSuccess (response) {
      this.addList.situationUrl = response.data
      // this.$refs.upload.uploadFiles = []
    },
    // 文件选择限制
    handleExceed (files, fileList) {
      this.$message.warning('限制选择 1 个文件,请删除当前文件后在选择')
    },
    // 图片上传
    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isLt2M
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
    // 用户查询
    async queryUser (index, row) {
      this.dialogUser = true
      const params = {
        projectId: row.id
      }
      const { data: { data } } = await this.$login.post('sso/api//project/queryLinkedUser', params)
      this.userPlan = data
      this.projectId = row.id
    },
    // 用户解绑
    async delUser (index, row) {
      const params = {
        projectId: this.projectId,
        userId: row.id
      }
      this.$confirm('此操作将解绑此用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data } = await this.$login.post(
            'sso/api//project/deleteLinkedUser',
            params
          )
          if (data.code === 100) {
            this.$message.error(data.msg)
          } else {
            this.$message.success('解绑成功')
            this.dialogUser = false
            this.getproject()
          }
        })
        .catch(() => {})
    },
    // 添加
    async addUser (index, row) {
      this.dialogUserAdd = true
      const { data: { data } } = await this.$login.post('sso/api//emp/query')
      this.personList = data
      this.projectId = row.id
    },
    // 提交添加的用户
    async sendUserData (index, row) {
      const params = {
        projectId: this.projectId,
        username: row.user.name
      }
      this.$confirm('此操作将添加此用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data } = await this.$login.post(
            'sso/api//project/addUserLink',
            params
          )
          if (data.code === 100) {
            this.$message.error(data.msg)
          } else {
            this.$message.success('添加成功')
            this.dialogUserAdd = false
            this.getproject()
          }
        })
        .catch(() => {})
    },
    // 提交添加用户
    async define () {
      const params = {
        projectId: this.projectId,
        username: this.userOrTel
      }
      this.$confirm('确定给该园区绑定此用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data } = await this.$login.post(
            'sso/api//project/addUserLink',
            params
          )
          if (data.code === 100) {
            this.$message.error(data.msg)
          } else {
            this.$message.success('添加成功')
            this.userOrTel = ''
            this.dialogUser = false
            this.getproject()
          }
        })
        .catch(() => {})
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
  .userList {
    .addUserBtn {
      position: absolute;
      top: 18px;
      left: 24px;
    }
    .userTable {
      margin-top: 20px;
    }
  }
}
</style>
