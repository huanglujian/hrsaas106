<template>
  <div>
    <el-dialog
      :title="showTitle"
      :visible="showDialog"
      width="30%"
      @close="btnCancel"
    >
      <el-form ref="form" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="formData.name" style="width: 80%" />
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="formData.code" style="width: 80%" />
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">
          <el-select
            v-model="formData.manager"
            placeholder="请选择"
            style="width: 80%"
            @focus="getEmployeeSimple"
          >
            <el-option
              v-for="item in peoples"
              :key="item.id"
              :label="item.username"
              :value="item.username"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input
            v-model="formData.introduce"
            type="textarea"
            :row="3"
            style="width: 80%"
          />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnOk">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDepartments,
  addDepartments,
  getDepartDetail,
  updateDepartments
} from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    //! 定义一个函数，这个函数的目的是去找同级别部门下是否有重复的部门名称
    const checkNameRepeat = async(rule, value, callback) => {
      //! 先要获取最新的组织架构数据
      const { depts } = await getDepartments()
      //! depts 是所有的部门数据
      //! 如何去找技术部所有的节点
      let isResult = false
      //! 有id就是编辑
      if (this.formData.id) {
        // 编辑
        isResult = depts
          .filter(
            (item) =>
              item.pid === this.treeNode.pid && item.id !== this.treeNode.id
          )
          .some((item) => item.name === value)
      } else {
        // 添加
        isResult = depts
          .filter((item) => item.pid === this.treeNode.id)
          .some((item) => item.name === value)
      }

      isResult
        ? callback(new Error(`同级部门下已经有${value}的部门了`))
        : callback()
    }
    //! 检查部门的编码同理
    const checkCodeResult = async(rule, value, callback) => {
      //! 先获取最新的组织架构数据
      const { depts } = await getDepartments()
      let isResult = false
      if (this.formData.id) {
        // 编辑
        isResult = depts.some((item) => item.code === value && value && item.id !== this.treeNode.id)
      } else {
        // 添加
        isResult = depts.some((item) => item.code === value && value) //! 这里另加一个条件， value不能为空，因为有些部门有可能没有code
      }

      isResult
        ? callback(new Error(`组织架构中已经有部门使用${value}编码`))
        : callback()
    }
    return {
      //! 定义表单数据
      formData: {
        name: '', //! 部门名称
        code: '', //! 部门编码
        manager: '', //! 部门管理者
        introduce: '' //! 部门介绍
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '部门名称要求1-50个字符',
            trigger: 'blur'
          },
          {
            validator: checkNameRepeat,
            trigger: 'blur'
          }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '部门编码要求1-50个字符',
            trigger: 'blur'
          },
          {
            validator: checkCodeResult,
            trigger: 'blur'
          }
        ],
        manager: [
          { required: true, message: '部门管理人不能为空', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '部门介绍要求1-50个字符',
            trigger: 'blur'
          }
        ]
      },
      peoples: []
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '添加子部门'
    }
  },
  methods: {
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    btnOk() {
      this.$refs.form.validate(async(isOk) => {
        //! isOk 为true表示验证通过，可以提交
        if (isOk) {
          if (this.formData.id) {
            //! 编辑
            await updateDepartments(this.formData)
          } else {
            //! 调用新增接口
            await addDepartments({
              ...this.formData,
              pid: this.treeNode.id
            })
          }
          this.$emit('addDepts') //! 告诉父元素重新获取数据
          this.$emit('update:showDialog', false) //! .sync修饰符  触发事件，关闭弹出层
        }
      })
    },
    btnCancel() {
      //! 重置数据，因为resetFiled只能重置表单上的数据，非表单上的 比如 id就不能重置
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      this.$refs.form.resetFields() //! 重置了 formData内容 且 重置检验字段
      this.$emit('update:showDialog', false)
    },
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id) //! props传值是异步的，有什么会接收不到 id值（报错） ，所以不能直接传值 this.treeNode.id
    }
  }
}
</script>

<style></style>
