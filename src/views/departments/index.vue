<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <tree-tools
          :tree-node="company"
          @delDepts="getDepartments"
          @addDepts="addDepts"
        />
        <el-tree :data="departs" :props="defaultProps">
          <tree-tools
            slot-scope="{ data }"
            :tree-node="data"
            :is-root="true"
            @delDepts="getDepartments"
            @addDepts="addDepts"
            @editDepts="editDepts"
          />
        </el-tree>
      </el-card>
    </div>
    <add-dept
      ref="addDept"
      :show-dialog.sync="showDialog"
      :tree-node="node"
      @addDepts="getDepartments"
    />
    <div v-loading="loading" class="dashboard-container" />
  </div>
</template>

<script>
import treeTools from './components/tree-tools.vue'
import { getDepartments } from '@/api/departments.js'
import { tranListToTreeData } from '@/utils'
import AddDept from '@/views/departments/components/add-dept.vue'
export default {
  components: {
    treeTools,
    AddDept
  },
  data() {
    return {
      defaultProps: {
        label: 'name'
      },
      departs: [],
      company: {},
      showDialog: false,
      node: null,
      loading: false
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      this.loading = true
      const res = await getDepartments()
      console.log(res)
      this.company = { name: res.companyName, manager: '负责人', id: '' } //! 这边有id属性原因： 后面对添加功能验证表单有用： '' === undefined  返回结构是 false
      this.departs = tranListToTreeData(res.depts, '')
      this.loading = false
    },
    addDepts(node) {
      this.showDialog = true //! 显示弹出层
      this.node = node //! 因为node是当前点击的部门，此时这个部门一个记录下来
    },
    editDepts(node) {
      this.showDialog = true //! 首先打开弹出层
      this.node = node //! 赋值操作的节点
      //! 我们需要在这个位置，调用子组件的方法
      this.$refs.addDept.getDepartDetail(node.id) //! 传入值 id
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
