<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="activeName">
          <!-- 角色管理 -->
          <el-tab-pane label="角色管理" name="first">
            <el-row style="height:60px">
              <!-- 按钮 -->
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="addRole"
              >新增角色</el-button>
            </el-row>
            <!-- 表单 -->
            <el-table border="" :data="list">
              <el-table-column
                label="序号"
                width="120"
                type="index"
                prop="id"
                align="center"
              />
              <el-table-column
                label="角色"
                width="240"
                prop="name"
                align="center"
              />
              <el-table-column
                label="描述"
                prop="description"
                align="center"
              />
              <el-table-column
                label="操作"
                align="center"
              >
                <template slot-scope="{ row }">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
                </template>

              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <el-pagination
                :current-page="page.page"
                :page-size="page.pagesize"
                background
                layout="prev, pager, next"
                :total="page.total"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <!-- 公司信息 -->
          <el-tab-pane label="公司信息" name="second">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form ref="form" label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <!-- 弹出层 -->
      <el-dialog :title="title" :visible="showDialog" :close-on-press-escape="true" @close="btnCancel">
        <el-form ref="form" :model="ruleForm" :rules="rules" label-width="120px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="ruleForm.name" />
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input v-model="ruleForm.description" />
          </el-form-item>
        </el-form>
        <el-row type="flex" justify="center">
          <el-button @click="btnCancel">取 消</el-button>
          <el-button type="primary" @click="btnOK">确 定</el-button>
        </el-row>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole } from '@/api/setting'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      activeName: 'first',
      list: [], //! 承接数组
      page: { //! 放置页码及相关的数据
        page: 1,
        pagesize: 10,
        total: 0
      },
      formData: {},
      showDialog: false,
      ruleForm: {},
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      title: ''
    }
  },
  created() {
    this.getRoleList() //! 获取角色列表
    this.getCompanyInfo()
  },
  methods: {
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page)
      this.list = rows
      this.page.total = total
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    async deleteRole(id) {
      //! $confirm 不给回调函数返回的是promise，如果选取消，就会报错，确定就没报错继续往下走
      try {
        await this.$confirm('确定删除该角色吗？')
        await deleteRole(id) //! 调用删除接口
        this.getRoleList() //! 重新获取角色数据
        this.$message.success('删除成功') //! 提示删除成功
      } catch (error) {
        console.log(error)
      }
    },
    changePage(newpage) {
      this.page.page = newpage //! newpage是当前点击的页码
      this.getRoleList()
    },
    async editRole(id) {
      this.title = '编辑'
      this.ruleForm = await getRoleDetail(id)
      this.showDialog = true
    },
    async btnOK() {
      await this.$refs.form.validate()
      try {
        //! 只有校验通过的情况下，才会执行await的下方内容
        //! roleForm这个对象有id就是编辑，没id就是新增
        if (this.ruleForm.id) {
          // 编辑
          await updateRole(this.ruleForm)
        } else {
          // 添加
          await addRole(this.ruleForm)
        }
        this.getRoleList() //! 重新调用获取角色接口
        this.showDialog = false
        this.$message.success('操作成功')
      } catch (error) {
        console.log(error)
      }
    },
    btnCancel() {
      this.ruleForm = {
        name: '',
        description: ''
      }
      //! 移除校验
      this.$refs.form.resetFields()
      this.showDialog = false
    },
    addRole() {
      this.title = '添加'
      this.showDialog = true
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  }
}
</script>

<style>

</style>
