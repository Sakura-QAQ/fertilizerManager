<template>
<div class="container">
  <el-card>
    <div solt="header">
      <my-bread>实况管理</my-bread>
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
        <el-button type="primary" @click="add">新增<i class="el-icon-folder-add el-icon--right"></i></el-button>
        <el-button type="primary" @click="reset">重置<i class="el-icon-refresh el-icon--right"></i></el-button>
        <el-button type="primary" @click="sending">提交<i class="el-icon-upload el-icon--right"></i></el-button>
      </el-card>
    </div>
  </el-card>
  <el-card class="AreaBody">
    <div class="bgArea" :style="{backgroundImage: 'url(' + areaUrl  + ')'}">
      <vue-drag-resize
        v-for="(item, index) in marks"
        :key="index"
        :isResizable="false"
        :w="150"
        :h="74"
        :x="item.left"
        :y="item.top"
        :isActive="false"
        :parentLimitation="true"
        @clicked="checkdrag($event, index, item)"
        @dragging="dragFer($event, index, item)">
        <div :class="{'fer': true, 'checkFer':index===num}">
          <div class="sfjImg"></div>
          <div class="showData">
            <div class="ferzName">{{item.name}}</div>
            <div class="status">
              <div :class="[item.isOnline === 0? 'gray' : (item.status === 1? 'green' : 'none')]"></div>
            </div>
            <div class="jt-icon"></div>
          </div>
        </div>
      </vue-drag-resize>
      <vue-drag-resize
        v-for="valve in Vavles"
        :key="valve.id"
        :isResizable="false"
        :w="40"
        :h="40"
        :x="valve.left"
        :y="valve.top"
        :isActive="false"
        :parentLimitation="true"
        @clicked="checkvalve($event, valve)"
        @dragging="dragValve($event, valve)"
        @dragstop="out"
        >
        <el-button :class="[valve.onCheck === 0?'valve':'isActived']" type="warning" icon="el-icon-set-up" circle></el-button>
      </vue-drag-resize>
      <div class="hover_con" v-show="seen" :style="positionStyle">
        <div class="dcfTip">阀名称:{{VavlesName}}</div>
        <div class="r-jt">阀状态:{{VavlesStatus}}</div>
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
      areaUrl: '',
      proList: [],
      FerList: [],
      VavlesName: null,
      VavlesStatus: null,
      marks: [],
      Vavles: [],
      seen: false,
      positionStyle: { top: 0, left: 0 },
      num: null,
      imgUrl: 'http://192.168.1.254:10010/image/avatar/'
    }
  },
  mounted () {
    this.order()
  },
  methods: {
    order () {
      this.getproject().then(res => {
        this.getSituation()
      })
    },
    // 园区切换
    areaChange () {
      this.getSituation()
      this.bgchange()
    },
    // 背景切换
    async bgchange () {
      const ID = {
        id: this.proID.projectId
      }
      const { data: { data } } = await this.$http.post('http://192.168.1.254:10010/sso/api/project/queryById', ID)
      this.areaUrl = this.imgUrl + data.situationUrl
    },
    // 园区选择
    async getproject () {
      const { data: { data } } = await this.$http.post('http://192.168.1.254:10010/sso/api/project/queryAllByUser')
      this.proList = data
      this.proID.projectId = data[0].id
      this.areaUrl = this.imgUrl + data[0].situationUrl
    },
    // 通过园区获取施肥机
    async getferlist () {
      const { data: { data } } = await this.$http.post('http://192.168.1.254:10020/fertilizer/api/fertilizer/queryByProjectId', this.proID)
      // 合并后的阀名数组
      const vallist = []
      // 对应的施肥机id
      const ferId = []
      // 对应的阀名
      const valveNum = []
      for (let i = 0; i < data.length; i++) {
        const ID = {
          id: data[i].id
        }
        const res = await this.$http.post('http://192.168.1.254:10020/fertilizer/api/fertilizer/queryValveAlias', ID)
        const a = data[i].valveNum.split(',').map(Number)
        const b = res.data.data.split(',')
        const c = b.filter((_, index) => a.includes(index + 1))
        for (let j = 0; j < c.length; j++) {
          const element = c[j]
          ferId.push(data[i].id)
          vallist.push(element)
          valveNum.push(JSON.stringify(a.sort()[j]))
        }
        data[i].fertilizerId = data[i].id
        data[i].isChecked = 0
      }
      const VavlesMain = []
      for (let k = 0; k < vallist.length; k++) {
        const valveName = vallist[k]
        const obj = {
          key: JSON.stringify(Math.ceil(Math.random() * 100)) + 'key',
          name: valveName,
          left: 0,
          top: 0,
          status: 0,
          projectId: this.proID.projectId,
          fertilizerId: ferId[k],
          isOnline: 0,
          type: 1,
          isDel: 0,
          valveNum: valveNum[k],
          onCheck: 0
        }
        VavlesMain.push(obj)
      }
      this.marks = data
      this.Vavles = VavlesMain
    },
    // 回显数据
    async getSituation () {
      this.marks = []
      this.Vavles = []
      const proId = {
        id: this.proID.projectId
      }
      const { data: { data } } = await this.$http.post('http://192.168.1.254:10010/sso/api/project/querySituationByPid', proId)
      if (data.length !== 0) {
        for (let i = 0; i < data.length; i++) {
          const element = data[i]
          if (element.type === 0) {
            element.isChecked = 0
            this.marks.push(element)
          } else {
            element.onCheck = 0
            this.Vavles.push(element)
          }
        }
      } else {
        this.getferlist()
      }
    },
    // 拖动施肥机
    dragFer (e, index, item) {
      item.left = e.left
      item.top = e.top
    },
    // 点击施肥机
    async checkdrag (e, index, item) {
      for (let i = 0; i < this.Vavles.length; i++) {
        const element = this.Vavles[i]
        if (item.fertilizerId === element.fertilizerId) {
          element.onCheck = 1
        } else {
          element.onCheck = 0
        }
      }
      this.num = index
    },
    // 拖动电磁阀
    dragValve (e, valve) {
      this.positionStyle = { top: valve.top + (-50) + 'px', left: valve.left + 50 + 'px' }
      valve.left = e.left
      valve.top = e.top
    },
    // 点击电磁阀
    checkvalve (e, valve) {
      this.seen = true
      this.VavlesName = valve.name
      this.VavlesStatus = valve.status
      // console.log(valve)
    },
    // 点击组件外
    out () {
      this.seen = false
    },
    // 提交
    async sending () {
      var a = []
      for (let i = 0; i < this.marks.length; i++) {
        const sfj = this.marks[i]
        const objsfj = {
          name: sfj.name,
          fertilizerId: sfj.fertilizerId,
          left: sfj.left,
          top: sfj.top,
          status: sfj.status,
          projectId: sfj.projectId,
          isOnline: sfj.isOnline,
          type: 0,
          isDel: sfj.isDel,
          valveNum: sfj.valveNum
        }
        a.push(objsfj)
      }

      for (let i = 0; i < this.Vavles.length; i++) {
        const dcf = this.Vavles[i]
        const objval = {
          name: dcf.name,
          left: dcf.left,
          top: dcf.top,
          status: dcf.status,
          projectId: dcf.projectId,
          fertilizerId: dcf.fertilizerId,
          isOnline: dcf.isOnline,
          type: dcf.type,
          isDel: dcf.isDel,
          valveNum: dcf.valveNum
        }
        a.push(objval)
      }
      const { data: { code } } = await this.$http.post('http://192.168.1.254:10020/fertilizer/api/fertilizer/situation', a)
      if (code === 200) {
        this.$message.success('提交成功')
      }
    },
    // 新增
    async add () {
      const ID = {
        id: this.proID.projectId
      }
      const { data } = await this.$http.post('http://192.168.1.254:10020/fertilizer/api/fertilizer/queryAddedMapFertilizer', ID)
      const ferlist = data.data

      if (data.code === 200 && data.msg === '没有新增施肥机') {
        this.$message.warning('没有新增施肥机！')
      } else if (data.code === 200 && data.msg === 'success') {
        // 合并后的阀名数组
        const vallist = []
        // 对应的施肥机id
        const ferId = []
        // 对应的阀名
        const valveNum = []
        for (let i = 0; i < ferlist.length; i++) {
          const ID = {
            id: ferlist[i].id
          }
          const res = await this.$http.post('http://192.168.1.254:10020/fertilizer/api/fertilizer/queryValveAlias', ID)
          const a = ferlist[i].valveNum.split(',').map(Number)
          const b = res.data.data.split(',')
          const c = b.filter((_, index) => a.includes(index + 1))
          for (let j = 0; j < c.length; j++) {
            const element = c[j]
            ferId.push(ferlist[i].id)
            vallist.push(element)
            valveNum.push(JSON.stringify(a.sort()[j]))
          }
          ferlist[i].fertilizerId = ferlist[i].id
          this.marks.push(ferlist[i])
        }
        for (let k = 0; k < vallist.length; k++) {
          const valveName = vallist[k]
          const obj = {
            key: JSON.stringify(Math.ceil(Math.random() * 1000)) + 'key',
            name: valveName,
            left: 0,
            top: 0,
            status: 0,
            projectId: this.proID.projectId,
            fertilizerId: ferId[k],
            isOnline: 0,
            type: 1,
            isDel: 0,
            valveNum: valveNum[k]
          }
          this.Vavles.push(obj)
        }
      }
    },
    reset () {
      this.getferlist()
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  .select {
    width: 81%;
    display: inline-block;
  }
  /deep/ .el-form-item {
    margin-bottom: 0;
  }
  /deep/ .AreaBody {
    .el-card__body {
      padding: 0;
      .bgArea {
        position: relative;
        width: 1660px;
        height: 780px;
        background: url(../../assets/images/jlh.jpg) center / cover no-repeat;
        .fer {
          position: relative;
          width: 146px;
          height: 70px;
          border-radius: 10px;
          background-color: rgba(97, 91, 91, 0.9);
          border: 2px solid #000;
          .sfjImg {
            float: left;
            width: 60px;
            height: 60px;
            background: url('../../assets/icon/sfj-icon.png') no-repeat;
            background-size: 60px 60px;
          }
          .showData {
            float: left;
            .ferzName {
              color: #ccc;
              font-weight: 800;
            }
            .status {
              height: 39px;
              padding: 4.5px;
              div {
                margin: 0 auto;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background-color: red;
              }
              .green {
                background-color: rgb(95, 233, 15);
              }
              .gray {
                background-color: #ccc;
              }
            }
          }
          .jt-icon {
            position: absolute;
            left: 30px;
            bottom: -30px;
            width: 30px;
            height: 30px;
            background: url('../../assets/icon/jt-icon.png') no-repeat;
            background-size: 30px 30px;
          }
        }
        // 施肥机点击样式
        .checkFer {
          border: 2px solid skyblue;
          box-shadow: 0px 0px 15px skyblue inset;
        }
        .hover_con {
          position: absolute;
          width: 120px;
          height: 60px;
          background-color: rgba(97, 91, 91, 0.9);
          border: 1px solid #000;
          text-align: left;
          color: #fff;
        }
        // 阀点击样式
        .isActived {
          background-color:rgb(84, 216, 8);
          border-color: rgb(95, 233, 15);
        }
      }
    }
  }
  .vdr.active:before{
    outline: none
  }
}
</style>
