<template>
  <div class="article-container">
    <!-- 筛选区域 -->
    <el-card>
      <div slot="header">
        <my-bread>用户管理</my-bread>
      </div>
      
      <!-- <el-table>
        <el-table-column label="用户名" prop="title"></el-table-column>
        <el-table-column label="用户状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" type="info">草稿</el-tag>
            <el-tag v-if="scope.row.status === 1">待审核</el-tag>
            <el-tag v-if="scope.row.status === 2" type="success">审核通过</el-tag>
            <el-tag v-if="scope.row.status === 3" type="warning">审核失败</el-tag>
            <el-tag v-if="scope.row.status === 4" type="danger">已删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template>
            <el-button icon="el-icon-edit" circle plain type="primary"></el-button>
            <el-button icon="el-icon-delete" circle plain type="danger"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="box">
        <el-pagination
          background
          layout="prev, pager, next"
          @current-change="pager"
          :current-page="reqParams.page"
          :page-size="reqParams.per_page"
          :total="total"
        ></el-pagination>
      </div> -->
    </el-card>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      // 提交后筛选条件
      reqParams: {
        page: 1,
        per_page: 20,
        // 默认数据''和null的区别
        // 如果是null 该字段是不会提交给后台
        status: null,
        channel_id: null,
        begin_pubdate: null,
        end_pubdate: null
      },
      total: 0
    }
  },
  created () {
    this.list();
  },
  methods: {
    // 获取列表
    async list () {
      const { data: { data } } = await this.$http.post('http://192.168.1.254:10010/sso/api/user/list')
      // this.proList = data;
      console.log(JSON.stringify(data) );
      console.log('hahahaha');
    },
    // 编辑
    edit (id) {
    },
    // 删除
    del (id) {
    },
    // 分页
    pager (newPage) {
      // 提交当前页码给后台才能获取对应的数据
      this.reqParams.page = newPage
    },
    // 获取数据
    async getArticles () {
    }
  }
}
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
