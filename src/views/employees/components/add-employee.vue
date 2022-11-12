<template>
  <el-dialog :visible="showDialog" title="添加" width="80%" @close="btnCancel">
    <!-- form -->
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="form.username" style="width:50%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="form.mobile" style="width:50%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker
          v-model="form.timeOfEntry"
          style="width:50%"
          type="date"
          placeholder="请选择入职信息"
        />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="form.formOfEmployment" style="width:50%" placeholder="请选择聘用形式">
          <el-option
            v-for="item in EmployeeEnum.informaltype"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="form.workNumber" style="width:50%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="form.departmentName" style="width:50%" placeholder="请选择部门" @focus="getDepartments" />
        <el-tree
          v-if="showTree"
          v-loading="loading"
          :data="treeData"
          :props="{ label: 'name' }"
          default-expand-all
          @node-click="selectNode"
        />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker
          v-model="form.correctionTime"
          style="width:50%"
          type="date"
          placeholder="请选择转正时间"
        />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments } from '@/api/departments' //! 引入获取部门信息的接口
import { tranListToTreeData } from '@/utils/index' //! 引入 对象转树形对象的方法
import EmployeeEnum from '@/api/constant/employees' //! 引入枚举
import { addEmployee } from '@/api/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      EmployeeEnum, //! 上面的模板只能用 export default 中定义的数据
      treeData: [], //! 定义数组接收树形数据
      showTree: false, //! 控制树形的显示或者隐藏
      loading: false, //! 控制树的显示或者隐藏进度条
      form: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          { min: 1, max: 4, message: '用户姓名为1-4位', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: 'change' }
        ],
        timeOfEntry: [
          { required: true, message: '入职时间不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    selectNode(node) { //! node就是 传递给data属性的数组中该节点所对应的对象
      this.form.departmentName = node.name
      this.showTree = false
    },
    async getDepartments() {
      this.showTree = true
      this.loading = true
      const { depts } = await getDepartments() //! depts 是 数组，但是不是树形数组
      this.treeData = tranListToTreeData(depts, '')
      this.loading = false
    },
    async btnOK() {
      await this.$refs.form.validate()
      try {
        await addEmployee(this.form)
        //! this.$parent 可以直接调用到父组件的实例，实际上就是父组件 this
        this.$parent.getEmployeeList()
        this.$parent.showDialog = false
        // this.$emit('update:showDialog', false)
      } catch (error) {
        console.log(error)
      }
    },
    btnCancel() {
      try {
        this.form = {
          username: '',
          mobile: '',
          formOfEmployment: '',
          workNumber: '',
          departmentName: '',
          timeOfEntry: '',
          correctionTime: ''
        }
        this.$refs.form.resetFields() // 重置校验结果
        this.$parent.showDialog = false
      // this.$emit('update:showDialog', false)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style>

</style>
