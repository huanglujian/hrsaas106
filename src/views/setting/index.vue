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
                  <el-button size="small" type="success" @click="assignPerm(row.id)">分配权限</el-button>
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
      <!-- 添加编辑角色弹出层 -->
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

      <!-- 分配权限弹出层 -->
      <el-dialog title="分配权限" :visible.sync="showPermDialog" @close="btnPermCancel">
        <el-tree
          ref="permTree"
          :data="permData"
          :props="defaultProps"
          default-expand-all
          show-checkbox
          check-strictly
          :default-checked-keys="selectCheck"
          node-key="id"
        />
        <!-- 确定 取消 -->
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button type="primary" size="small" @click="btnPermOK">确定</el-button>
            <el-button size="small" @click="btnPermCancel">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole, assignPerm } from '@/api/setting'
import { getPermissionList } from '@/api/peimisson'
import { tranListToTreeData } from '@/utils'
import { mapGetters } from 'vuex'
export default {
  name: 'Setting',
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
      title: '',
      showPermDialog: false, //! 分配角色的弹出层
      permData: [], //! 专门用来接收权限数据，树形数据
      defaultProps: {
        label: 'name'
      },
      selectCheck: [], //! 定义一个数组来接收已经选中的节点
      roleId: null //! 用于记录分配角色的id
    }
  },
  computed: {
    ...mapGetters(['companyId'])
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
    },

    //! 点击分配权限
    async assignPerm(id) {
      //! 获取所有权限点的数据，并转化为树形
      this.permData = tranListToTreeData(await getPermissionList(), '0')
      this.roleId = id
      //! 获取当前角色的权限点数据
      const { permIds } = await getRoleDetail(id)
      this.selectCheck = permIds //! 将当前角色所拥有的权限id赋值
      this.showPermDialog = true
    },
    async btnPermOK() {
      await assignPerm({ id: this.roleId, permIds: this.$refs.permTree.getCheckedKeys() })
      this.$message.success('成功')
      this.showPermDialog = false
    },
    btnPermCancel() {
      this.selectCheck = []
      this.showPermDialog = false
    }
  }

}
</script>

<style>

</style>
