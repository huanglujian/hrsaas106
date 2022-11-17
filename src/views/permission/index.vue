<template>
  <div class="dashboard-container">
    <div class="app-container">
      <h2>
        <page-tools>
          <template #after>
            <el-button type="primary" size="small" @click="addPermission('0', '1')">添加权限</el-button>
          </template>
        </page-tools>
        <!-- 表格 -->
        <el-table border :data="list" row-key="id">
          <el-table-column label="名称" prop="name" />
          <el-table-column align="center" label="标识" prop="code" />
          <el-table-column align="center" label="描述" prop="description" />
          <el-table-column align="center" label="操作">
            <template v-slot="{ row }">
              <el-button v-if="row.type === 1" type="text" @click="addPermission(row.id, '2')">添加</el-button>
              <el-button type="text" @click="ediPermission(row.id)">编辑</el-button>
              <el-button type="text" @click="delBtn(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </h2>
    </div>
    <!-- 弹层 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      @close="cancelbtn"
    >
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="form.code" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="form.description" />
        </el-form-item>
        <el-form-item label="开启">
          <el-switch
            v-model="form.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="cancelbtn">取 消</el-button>
        <el-button type="primary" @click="btnOk">确 定</el-button>
      </span>
      </el-form></el-dialog>
  </div>
</template>

<script>
import { getPermissionList, addPermission, updatePermission, delPermission, getPermissionDetail } from '@/api/peimisson'
import { tranListToTreeData } from '@/utils'
export default {
  name: 'Permission',
  data() {
    return {
      list: [],
      dialogVisible: false,
      form: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      this.list = tranListToTreeData(await getPermissionList(), '0')
    },
    async delBtn(id) {
      try {
        await this.$confirm('确定删除')
        await delPermission(id)
        this.getPermissionList()
      } catch (error) {
        console.log(error)
      }
    },
    addPermission(pid, type) {
      this.form.pid = pid
      this.form.type = type
      this.dialogVisible = true
    },
    async ediPermission(id) {
      this.form = await getPermissionDetail(id)
      this.dialogVisible = true
    },
    async btnOk() {
      try {
        await this.$refs.form.validate()
        if (this.form.id) {
          //! 有id就是编辑
          await updatePermission(this.form)
        } else {
          await addPermission(this.form)
        }
        this.$message.success('操作成功')
        this.getPermissionList()
        this.dialogVisible = false
      } catch (error) {
        console.log(error)
      }
    },
    cancelbtn() {
      this.form = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      this.$refs.form.resetFields()
      this.dialogVisible = false
    }
  }
}
</script>

<style>

</style>
