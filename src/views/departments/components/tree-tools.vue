<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 40px; width: 100%"
  >
    <el-col>{{ treeNode.name }}</el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <el-dropdown trigger="click" @command="operateDepts">
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item
                v-if="isRoot"
                command="edit"
              >编辑部门</el-dropdown-item>
              <el-dropdown-item
                v-if="isRoot"
                command="del"
              >删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {
  props: {
    treeNode: {
      required: true,
      type: Object
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    operateDepts(type) {
      //! 添加部门
      if (type === 'add') {
        //! 告诉父组件，显示弹层
        this.$emit('addDepts', this.treeNode) //! 传出treeNode ，添加子部门，需要此数据
      } else if (type === 'edit') { //! 修改部门
        this.$emit('editDepts', this.treeNode)
      } else { //! 删除部门
        //! 提示框，点击确定就会进入then
        this.$confirm('确定删除该部门?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return delDepartments(this.treeNode.id) //! 返回promise对象，外面用then接收
        }).then(() => { //! 如果删除成功了，就会进入这个then
          this.$emit('delDepts') //! 后端数据变了，但是前端数据没变，需要重新获取，这边自定义事件，让父元素那在重新获取数据
          this.$message.success('删除成功')
        })
      }
    }
  }
}
</script>

<style></style>
