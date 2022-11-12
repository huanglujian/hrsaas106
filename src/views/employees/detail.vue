<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="activeName">
          <el-tab-pane label="用户管理" name="first">
            <el-form ref="form" :rules="rules" :model="userInfo" label-width="120px" style="margin-left: 120px; margin-top:30px">
              <el-form-item label="姓名：" prop="username">
                <el-input v-model="userInfo.username" style="width:300px" />
              </el-form-item>
              <el-form-item label="密码：" prop="password2">
                <el-input v-model="userInfo.password2" type="password" style="width:300px" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUser">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="配置管理" name="second">
            <UserInfo />
          </el-tab-pane>
          <el-tab-pane label="角色管理" name="third">
            <JobInfo />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById, saveUserDetailById } from '@/api/employees'
import UserInfo from './components/user-info.vue'
import JobInfo from './components/job-info.vue'
export default {
  components: {
    UserInfo,
    JobInfo
  },
  data() {
    return {
      activeName: 'first', // 默认显示谁
      userId: this.$route.params.id, //! 通过路由来动态回去用户的id
      userInfo: {
        username: '',
        password2: '' //! 为什么叫password2，因为读取出来的password是密文
      },
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password2: [{ required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.getUserDetailById()
  },
  methods: {
    async getUserDetailById() {
      const result = await getUserDetailById(this.userId)
      this.userInfo.username = result.username
    },
    async saveUser() {
      try {
        await this.$refs.form.validate()
        await saveUserDetailById({ ...this.userInfo, password: this.userInfo.password2 })
        this.$message.success('保存成功')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style>

</style>
