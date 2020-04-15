<template>
  <div class="article-container">
    <!-- 筛选区域 -->
    <el-card>
      <div slot="header">
        <my-bread>用户管理</my-bread>
      </div>

      <el-table :data="userList">
        <el-table-column label="用户名" prop="name"></el-table-column>
        <el-table-column label="手机号" prop="telephone"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="创建时间" prop="createTime"></el-table-column>
        <el-table-column label="修改时间" prop="updateTime"></el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button @click="editUser(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="bindProject(scope.row.id)" type="text" size="small">绑定项目</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="绑定项目" :visible.sync="projectFormVisible">
        <el-form :model="project">
          <el-checkbox-group v-model="project.pids">
            <el-checkbox v-for="item in projects" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submit2">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="用户编辑" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth">
            <el-input v-model="form.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机号" :label-width="formLabelWidth">
            <el-input v-model="form.telephone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth">
            <el-input v-model="form.email" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </div>
      </el-dialog>

      <div class="box">
        <el-pagination
          background
          layout="prev, pager, next"
          @current-change="currentchange"
          @next-click="nextpage"
          @prev-click="prevpage"
          :current-page="page"
          :page-size="pageSize"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      userList: null,
      page: 1,
      pageSize: 10,
      total: 0,
      dialogFormVisible: false,
      projectFormVisible: false,
      form: {
        name: "aa",
        telephone: "",
        email: "",
        password: ""
      },
      project: {
        uid: "",
        pids: []
      },
      projects: [],
      formLabelWidth: "120px"
    };
  },

  created() {
    this.list();
  },
  methods: {
    cancel:function(){
      this.projectFormVisible = false;
       this.project.uid="";
      this.project.pids=[];
    },
    async submit2() {
      const {
        data: { data }
      } = await this.$http.post(
        "http://192.168.1.254:10010/sso/api/user/bindProject",
        this.project
      );
      this.projectFormVisible = false;
      this.project.uid="";
      this.project.pids=[];
      if (data) {
        this.$message({
          message: "绑定成功！",
          type: "success"
        });
        this.list();
      } else {
        this.$message.error("绑定失败！");
      }
    },

    bindProject: function(id) {
      this.project.uid = id;
      this.projectFormVisible = true;
      this.getprojects();
    },
    async getprojects() {
      const {
        data: { data }
      } = await this.$http.post(
        "http://192.168.1.254:10010/sso/api/project/queryAllByManager"
      );
      this.projects = data;
      console.log(JSON.stringify(data));
    },
    async submit() {
      const {
        data: { data }
      } = await this.$http.post(
        "http://192.168.1.254:10010/sso/api/user/update",
        this.form
      );
      this.list();
      this.dialogFormVisible = false;
      if (data) {
        this.$message({
          message: "修改成功！",
          type: "success"
        });
        this.list();
      } else {
        this.$message.error("修改失败！");
      }
    },
    editUser: function(item) {
      item.password = "";
      this.form = item;
      console.log(JSON.stringify(item));
      this.dialogFormVisible = true;
    },
    currentchange(page) {
      this.page = page;
      this.list();
    },
    prevpage() {
      this.page = this.page - 1;
      this.list();
    },
    nextpage() {
      this.page = this.page + 1;
      this.list();
    },
    // 获取列表
    async list() {
      const {
        data: { data }
      } = await this.$http.post(
        "http://192.168.1.254:10010/sso/api/user/list",
        { page: this.page, pageSize: this.pageSize, user: {} }
      );
      this.userList = data.data;
      this.total = data.total;
      console.log(JSON.stringify(data));
    },
    async updateUser(id) {
      const {
        data: { data }
      } = await this.$http.post(
        "http://192.168.1.254:10010/sso/api/user/deleteUser",
        { id: id }
      );
      if (data) {
        this.$message({
          message: "删除成功！",
          type: "success"
        });
        this.list();
      } else {
        this.$message.error("删除失败！");
      }

      console.log(JSON.stringify(data));
    },
    async deleteUser(id) {
      const {
        data: { data }
      } = await this.$http.post(
        "http://192.168.1.254:10010/sso/api/user/deleteUser",
        { id: id }
      );
      if (data) {
        this.$message({
          message: "删除成功！",
          type: "success"
        });
        this.list();
      } else {
        this.$message.error("删除失败！");
      }

      console.log(JSON.stringify(data));
    },
    // 编辑
    edit(id) {},
    // 删除
    del(id) {},
    // 分页
    pager(newPage) {
      // 提交当前页码给后台才能获取对应的数据
      this.reqParams.page = newPage;
    },
    // 获取数据
    async getArticles() {
      console.log("hahahahaha");
    }
  }
};
</script>

<style lang="less" scoped>
// el-card解析自动生成一个类名
.el-card {
  margin-bottom: 20px;
}
.box {
  text-align: center;
  margin-top: 20px;
}
</style>
