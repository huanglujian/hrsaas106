<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="closeFn">
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col>
        <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        <el-button size="small" @click="closeFn">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById, assignRoles } from '@/api/employees'
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      list: [], //! 所有的角色信息
      roleIds: [] //! 用户的当前角色
    }
  },
  mounted() {
    this.getRoleList()
  },
  methods: {
    closeFn() {
      this.roleIds = [] // 清空原来的数组
      this.$emit('update:showRoleDialog', false)
    },
    async getRoleList() {
      const { rows } = await getRoleList()
      this.list = rows
    },
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id)
      this.roleIds = roleIds
    },
    async btnOk() {
      await assignRoles({ id: this.userId, roleIds: this.roleIds })
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>

<style>

</style>
