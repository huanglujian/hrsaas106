<template>
  <div>
    <el-upload
      action="#"
      list-type="picture-card"
      :limit="1"
      :on-preview="preview"
      :on-remove="handleRemove"
      :file-list="fileList"
      :class="{disabled: fileComputed }"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showPercent" :percentage="percent" style="width: 180px" />
    <el-dialog :visible.sync="showDialog" title="预览">
      <img width="100%" :src="imgUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5' //! 引入 腾讯云Cos的包
//! 实例化COS对象
const cos = new COS({
  SecretId: 'AKIDVr1yiEWZNxOj3DJI5f180gCWv77yb1EF', //! 身份识别ID
  SecretKey: 'uaActwsdC9r362lGZkjU3RccYpvoobBY' //! 身份密钥
})
export default {
  data() {
    return {
      fileList: [],
      imgUrl: '',
      showDialog: false,
      currentFileUid: '', //! 用一个变量，记住当前上传的图片id
      percent: 0,
      showPercent: false
    }
  },
  computed: {
    //! 设定一个计算属性，判断是否已经上传完了一张
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    preview(file) {
      this.imgUrl = file.url
      this.showDialog = true
    },
    //! file是点击删除的文件信息
    //! fileList 是最新的 上传文件的列表
    handleRemove(file, fileList) {
      //! 这儿的 this.fileList 并不会自动更新
      this.fileList = fileList
      // this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    },
    changeFile(file, fileList) { //! 该方法 添加文件、上传成功和上传失败都会调用一次
      this.fileList = fileList.map(item => item)
    },
    beforeUpload(file) {
      //! 首先判断 格式是否合格
      // console.log(file)
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      //! 其次判断文件大小
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      this.showPercent = true //! 打开进度条
      this.currentFileUid = file.uid //! 记住当前的id
      return true //! 最后一定要 return true ， 不然会默认为 return undifined
    },
    upload(params) {
      // console.log(params.file)
      if (params.file) {
        cos.putObject({
          Bucket: 'hlj-renzi-one-1315028885', /* 填入您自己的存储桶，必须字段 */
          Region: 'ap-nanjing', /* 存储桶所在地域，例如ap-beijing，必须字段 */
          Key: params.file.name, /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
          Body: params.file, /* 必须，上传文件对象，可以是input[type="file"]标签选择本地文件后得到的file对象 */
          StorageClass: 'STANDARD', //! 上传的模式类型 直接默认 标准模式即可
          onProgress: (progressData) => {
            this.percent = progressData.percent * 100
          }
        }, (err, data) => {
          // console.log(err || data)
          if (!err && data.statusCode === 200) { //! 代表成功
            this.fileList = this.fileList.map(item => {
              if (item.uid === this.currentFileUid) {
                return { url: 'http://' + data.Location, upload: true }
                //! upload 为true 表示这张图片已经上传完毕 这个属性要为我们后期应用的时候做标记
                //! 保存  => 图片有大有小 => 上传速度有快又慢 =>要根据有没有upload这个标记来决定是否去保存
              }
              return item
            })
          }
        })
      }
      setTimeout(() => {
        this.showPercent = false
        this.percent = 0
      }, 1000)
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card {
  display: none
}
</style>
