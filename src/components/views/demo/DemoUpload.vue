<template>
  <div>
    <el-row :gutter="10">
      <el-col :lg="{span:8}">
        <el-card>
          <el-upload
            class="upload-demo"
            :action="uploadURL"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :on-success="handleFirstSuccess"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <template #tip>
              <div class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </template>
          </el-upload>
        </el-card>
      </el-col>
      <el-col :lg="{span:8}">
        <el-card :header="'用户头像上传'">
          <el-upload
            class="avatar-uploader"
            :action="uploadURL"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar" alt=""/>
            <el-icon v-else class="avatar-uploader-icon">
              <el-icon-plus/>
            </el-icon>
          </el-upload>
        </el-card>
      </el-col>
      <el-col :lg="{span:8}">
        <el-card :header="'照片墙'">
          <el-upload
            :action="uploadURL"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <el-icon>
              <el-icon-plus/>
            </el-icon>
          </el-upload>
          <el-dialog v-model="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-card>
      </el-col>
    </el-row>
    <br>
    <el-row :gutter="10">
      <el-col :lg="{span:8}">
        <el-card :header="'文件缩略图'">
          <el-upload
            :action="uploadURL"
            list-type="picture-card"
            :auto-upload="false">
            <template #default>
              <el-icon>
                <el-icon-plus/>
              </el-icon>
            </template>
            <template #file="{file}">
              <img class="el-upload-list__item-thumbnail"
                   :src="file.url" alt=""/>
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview"
                      @click="handlePictureCardPreview(file)">
                  <el-icon>
                    <el-icon-zoom-in/>
                  </el-icon>
                </span>
                <span v-if="!disabled"
                      class="el-upload-list__item-delete"
                      @click="handleDownload(file)">
                  <el-icon><el-icon-download/></el-icon>
                </span>
                <span v-if="!disabled"
                      class="el-upload-list__item-delete"
                      @click="handleRemove(file)">
                  <el-icon><el-icon-delete/></el-icon>
                </span>
              </span>
            </template>
          </el-upload>
          <el-dialog v-model="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-card>
      </el-col>
      <el-col :lg="{span:8}">
        <el-card :header="'图片列表缩略图'">
          <el-upload
            class="upload-demo"
            :action="uploadURL"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <template #tip>
              <div class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </template>
          </el-upload>
        </el-card>
      </el-col>
      <el-col :lg="{span:8}">
        <el-card :header="'上传文件列表控制'">
          <el-upload
            class="upload-demo"
            :action="uploadURL"
            :on-change="handleChange"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <template #tip>
              <div class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </template>
          </el-upload>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :lg="{span:8}">
        <el-card :header="'拖拽上传'">
          <el-upload
            class="upload-demo"
            drag
            :action="uploadURL"
            multiple>
            <el-icon class="el-icon--upload">
              <el-icon-upload-filled/>
            </el-icon>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <template #tip>
              <div class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </template>
          </el-upload>
        </el-card>
      </el-col>
      <el-col :lg="{span:8}">
        <el-card :header="'手动上传'">
          <el-upload
            class="upload-demo"
            ref="upload"
            :action="uploadURL"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :auto-upload="false">
            <template #trigger>
              <el-button size="small" type="primary">选取文件</el-button>
            </template>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
            <template #tip>
              <div class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </template>
          </el-upload>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<style lang="less" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar-uploader-icon svg {
  margin-top: 74px; /* (178px - 28px) / 2 - 1px */
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<script>
import appInfo from '@/store/config/appInfo'

export default {
  name: 'demoUpload',
  data() {
    return {
      uploadURL: appInfo.baseURL + '/file/upload',
      fileList: [{
        name: 'food.jpeg',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      }, {
        name: 'food2.jpeg',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      }],
      imageUrl: '',
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false
    }
  },
  methods: {
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleFirstSuccess(res, file) {
      // file.name = res.message
      // file.type = res.message
      console.log(res)
      console.log(file)
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3)
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      console.log(file, fileList)
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleDownload(file) {
      console.log(file)
    }
  }
}
</script>
