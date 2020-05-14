<template>
  <div class="pass-container">
    <el-card>
      <div class="headers">
        <my-bread>通道管理</my-bread>
        <el-card style="margin-top:20px;">
          <el-form class="select" :model="proID" align="left" >
            <el-form-item label="请选择园区:" >
              <el-select v-model="proID.projectId" @change="areaChange">
                <el-option
                  v-for="item in proList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-form class="select" :model="FerId" align="left" >
            <el-form-item label="请选择施肥机:" >
              <el-select v-model="FerId.id" @change="ferchange">
                <el-option
                  v-for="item in FerList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </el-card>
    <el-card class="bodys">
      <div class="title">通道名称定义</div>
      <div class="btn">
        <el-button type="primary" @click="sending">提交</el-button>
      </div>
      <div class="passData">
        <div class="design" v-for="(item, index) in channels" :key="index">
          <span class="passName">{{index + 1}}通道：</span>
          <el-input
            placeholder="通道名称"
            v-model="channels[index]"
            clearable>
          </el-input>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      proID: {
        projectId: ''
      },
      FerId: {
        id: ''
      },
      proList: [],
      FerList: [],
      passName: '',
      channels: '',
      ferData: {}
    }
  },
  mounted () {
    this.getproject().then(res => {
      this.getferlist().then(res => {
        this.querybyferid()
      })
    })
  },
  methods: {
    // 园区切换
    areaChange () {
      this.getferlist().then(res => {
        this.querybyferid()
      })
    },
    // 园区选择
    async getproject () {
      const { data: { data } } = await this.$http.post('http://192.168.1.254:10010/sso/api/project/queryAllByUser')
      this.proList = data
      this.proID.projectId = data[0].id
    },
    // 切换
    ferchange () {
      this.querybyferid()
    },
    // 默认展示的施肥机数据
    async getferlist () {
      const { data: { data } } = await this.$http.post('http://192.168.1.254:10020/fertilizer/api/fertilizer/queryByProjectId', this.proID)
      if (data.length === 0) {
        this.$message.error('没有施肥机！请去添加！')
        this.FerId = {}
        this.FerList = []
        this.channels = ''
        return false
      } else {
        this.FerList = data
        this.FerId.id = data[0].id
      }
    },
    // 施肥机查询
    async querybyferid () {
      const { data: { data } } = await this.$http.post('http://192.168.1.254:10020/fertilizer/api/fertilizer/queryById', this.FerId)
      if (data === null) {
        return false
      }
      if (data.channels === null || data.channels === '') {
        data.channels = ',,,,,,,,'
        this.channels = data.channels.split(',')
        this.$message.warning('此施肥机无通道名称，请编辑后提交')
      } else {
        this.ferData = data
        this.channels = data.channels.split(',')
      }
    },
    // 提交
    async sending () {
      const channel = {
        id: this.FerId.id,
        channels: this.channels.join(',')
      }
      if (channel.channels === ',,,,,,,,') {
        this.$message.error('提交参数不能为空')
        return false
      } else {
        const { data } = await this.$http.post('http://192.168.1.254:10020/fertilizer/api/fertilizer/updateFertilizerChannels', channel)
        if (data.code === 200) {
          this.$message.success('提交成功')
          this.querybyferid()
        } else {
          this.$message.error(data.msg)
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.pass-container {
  .headers {
    /deep/ .el-card__body {
      .el-form {
        display: inline-block;
        width: 340px;
        .el-form-item {
          margin: 0 0;
        }
      }
    }
  }
  .bodys {
    position: relative;
    padding: 20px 0;
    .title {
      text-align: center;
      font-weight: 800;
      font-size: 24px;
      margin: 20px 0 25px 0;
    }
    .btn {
      position: absolute;
      right: 20px;
      top: 20px;
    }
    .passData {
      display: flex;
      justify-content: space-evenly;
      flex-wrap: nowrap;
      .design {
        width: 150px;
        height: 75px;
        border: 1px solid #ccc;
        padding: 10px;
        border-radius: 10px;
        .passName {
          display: inline-block;
          margin-bottom: 10px;
        }
      }
      .design:hover {
        background-color: #f2f2f2;
      }
    }
  }
}
</style>
