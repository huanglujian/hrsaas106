<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools :show-before="true">
        <template #before>
          <span>共{{ page.total }}条记录</span>
        </template>
        <template #after>
          <el-button size="small" type="warning" @click="$router.push('/import?type=user')">导入</el-button>
          <el-button size="small" type="danger" @click="exportData">导出</el-button>
          <el-button size="small" type="primary" @click="showDialog = true">新增员工</el-button>
        </template>
      </PageTools>
      <el-card v-loading="loading">
        <!-- 表格 -->
        <el-table border :data="list">
          <!-- sortable 用来给表格添加排序的功能 -->
          <el-table-column label="序号" sortable="" type="index" prop="id" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="头像" align="center">
            <template v-slot="{ row }">
              <img
                v-imagerror="require('@/assets/common/head.jpg')"
                alt=""
                :src="row.staffPhoto"
                style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
                @click="showQrCode(row.staffPhoto)"
              >
            </template>
          </el-table-column>
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column label="聘用形式" sortable="" prop="formOfEmployment" :formatter="formatEmployment" />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
            <template slot-scope="{ row }">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="" prop="enableState">
            <template slot-scope="{ row }">
              <!-- 根据目前的状态，决定是否打开开关 -->
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{ row }">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="deleteEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination layout="prev, pager, next" :page-size="page.size" :current-page="page.page" :total="page.total" @current-change="changePage" />
        </el-row>
      </el-card>
    </div>
    <add-employee :show-dialog.sync="showDialog" />
    <!-- 二维码弹窗 -->
    <el-dialog title="二维码" :visible.sync="showCodeDialog">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees' //! 导入枚举
import addEmployee from './components/add-employee.vue'
import { formatDate } from '@/filters/index'
import QrCode from 'qrcode'
export default {
  components: {
    addEmployee
  },
  data() {
    return {
      loading: false,
      list: [],
      page: {
        page: 1,
        size: 10,
        total: 0
      },
      showDialog: false,
      showCodeDialog: false
    }
  },
  mounted() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    changePage(currentPage) {
      this.page.page = currentPage
      this.getEmployeeList()
    },
    formatEmployment(row, column, cellValue, index) {
      // 要去找 1 对应的值
      // const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      // return obj ? obj.value : '未知'
      return cellValue === '1' ? '正式工' : '非正式'
    },
    async deleteEmployee(id) {
      try {
        await this.$confirm('确定删除？')
        await delEmployee(id)
        this.getEmployeeList()
        this.$message.success('删除员工成功')
      } catch (error) {
        console.log(error)
      }
    },
    //! 导出excel数据函数
    exportData() {
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      //! 懒加载
      import('@/vendor/Export2Excel').then(async excel => {
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total }) // 获取所有的员工的信息
        const data = this.formatJson(headers, rows)
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工信息表',
          multiHeader, //! 复杂表头
          merges //! 合并区域
        })
      })
    },
    //! 该方法负责将数组转换为二维数组
    formatJson(headers, rows) {
      return rows.map(item => {
        return Object.keys(headers).map(key => {
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            const result = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return result ? result.value : '未知'
          }
          return item[headers[key]]
        })
      })
    },
    showQrCode(url) {
      console.log(url)
      if (url) { //! url存在的情况下，才出弹层
        // debugger
        this.showCodeDialog = true //! 数据更新了，但是我的弹层会立刻出现吗？页面渲染是异步的！！
        //! Vue.$nextTick() 可以在上一次数据更新完毕后，页面渲染完毕之后
        this.$nextTick(() => {
          //! 此时已经确定有ref对象了
          QrCode.toCanvas(this.$refs.myCanvas, url)
        })
      } else {
        this.$message.warning('该用户还没有上传头像')
      }
    }
  }
}
</script>

<style>

</style>
