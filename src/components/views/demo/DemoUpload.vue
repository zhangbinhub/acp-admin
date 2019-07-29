<template>
  <div>
    <Row :gutter="10">
      <i-col :xl="{span:8}">
        <Card>
          <Upload
            :name="'file'"
            :data="uploadParam"
            :headers="uploadHeaders"
            :on-success="handleSuccess"
            :action="uploadURL">
            <Button icon="ios-cloud-upload-outline">Upload files</Button>
          </Upload>
          <Divider orientation="left">点击上传</Divider>
          <p style="font-size: small">最基本用法，点击上传，一次选择一个文件。</p>
        </Card>
      </i-col>
      <i-col :xl="{span:8}">
        <Card>
          <Upload
            multiple="true"
            :name="'file'"
            :data="uploadParam"
            :headers="uploadHeaders"
            :on-success="handleSuccess"
            :action="uploadURL">
            <Button icon="ios-cloud-upload-outline">Upload files</Button>
          </Upload>
          <Divider orientation="left">多选</Divider>
          <p style="font-size: small">设置属性 multiple，可以选择多个文件。</p>
        </Card>
      </i-col>
      <i-col :xl="{span:8}">
        <Card>
          <Upload
            :before-upload="handleUpload"
            :name="'file'"
            :data="uploadParam"
            :headers="uploadHeaders"
            :on-success="handleSuccess"
            :action="uploadURL">
            <Button icon="ios-cloud-upload-outline">Select the file to upload</Button>
          </Upload>
          <div v-if="file !== null">Upload file: {{ file.name }}
            <Button type="text" @click="upload" :loading="loadingStatus">
              {{ loadingStatus ? 'Uploading' : 'Click to upload' }}
            </Button>
          </div>
          <Divider orientation="left">手动上传</Divider>
          <p style="font-size: small">绑定 before-upload，并返回false，可以阻止默认上传流程，手动控制文件上传。</p>
        </Card>
      </i-col>
    </Row>
    <br>
    <Row :gutter="10">
      <i-col :xl="{span:12}">
        <Card>
          <Upload
            :multiple="true"
            type="drag"
            :name="'file'"
            :data="uploadParam"
            :default-file-list="defaultList"
            :headers="uploadHeaders"
            :on-success="handleSuccess"
            :on-preview="handlePreview"
            :action="uploadURL">
            <div style="padding: 20px 0">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>Click or drag files here to upload</p>
            </div>
          </Upload>
          <Divider orientation="left">拖拽上传</Divider>
          <p style="font-size: small">设置属性 type 为 drag，可以拖拽上传。</p>
        </Card>
      </i-col>
      <i-col :xl="{span:12}">
        <Card>
          <div class="demo-upload-list" v-for="item in uploadList" :key="item.name">
            <template v-if="item.status === 'finished'">
              <img :src="item.url" alt="">
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
              </div>
            </template>
            <template v-else>
              <Progress v-if="item.showProgress" :percent="item.percentage" :hide-info="true"></Progress>
            </template>
          </div>
          <Upload
            ref="upload"
            :show-upload-list="false"
            :default-file-list="defaultList"
            :name="'file'"
            :data="uploadParam"
            :headers="uploadHeaders"
            :on-success="handleSuccess"
            :format="['jpg','jpeg','png']"
            :max-size="2048"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
            :multiple="true"
            type="drag"
            :action="uploadURL"
            style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
          <Modal title="View Image" v-model="visible">
            <img :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/avatar'" v-if="visible" style="width: 100%" alt="">
          </Modal>
          <Divider orientation="left">自定义上传列表</Divider>
          <p style="font-size: small">可以自由控制上传列表，完成各种业务逻辑，示例是一个照片墙，可以查看大图和删除。</p>
          <ul style="padding-left: 40px">
            <li>设置属性 show-upload-list 为 false，可以不显示默认的上传列表。</li>
            <li>设置属性 default-file-list 设置默认已上传的列表。</li>
            <li>通过 on-success 等属性来控制完整的上传过程，详见
              <a href="https://www.iviewui.com/components/upload" target="_blank">API</a>。
            </li>
          </ul>
          <p style="font-size: small">另外，可以通过丰富的配置，来定制上传需求，本例中包含了</p>
          <ul style="padding-left: 40px">
            <li>文件必须是 jpg 或 png 格式的图片</li>
            <li>最多上传5张图片。</li>
            <li>每个文件大小不超过 2M。</li>
          </ul>
        </Card>
      </i-col>
    </Row>
  </div>
</template>
<style lang="less">
  .ivu-card {
    min-height: 160px;
  }

  .demo-upload-list {
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 4px;
  }

  .demo-upload-list img {
    width: 100%;
    height: 100%;
  }

  .demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
  }

  .demo-upload-list:hover .demo-upload-list-cover {
    display: block;
  }

  .demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>
<script>
    import appInfo from '@/store/config/appInfo'

    export default {
        name: 'demoUpload',
        data () {
            return {
                uploadURL: appInfo.uploadURL,
                file: null,
                loadingStatus: false,
                defaultList: [
                    {
                        'name': 'a42bdcc1178e62b4694c830f028db5c0',
                        'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
                    },
                    {
                        'name': 'bc7521e033abdd1e92222d733590f104',
                        'url': 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar'
                    }
                ],
                imgName: '',
                visible: false,
                uploadParam: {
                    filePath: 'file/upload/test'
                },
                uploadHeaders: {
                    Authorization: `${this.$store.state.app.user.tokenType} ${this.$store.state.app.user.token}`
                },
                uploadList: []
            }
        },
        methods: {
            handleUpload (file) {
                this.file = file
                return false
            },
            upload () {
                this.loadingStatus = true
                setTimeout(() => {
                    this.file = null
                    this.loadingStatus = false
                    this.$Message.success('Success')
                }, 1500)
            },
            handleSuccess (res, file, fileList) {
                file.path = res.message
                console.log(file)
                console.log(fileList)
            },
            handleView (name) {
                this.imgName = name
                this.visible = true
            },
            handleRemove (file) {
                const fileList = this.$refs.upload.fileList
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: 'The file format is incorrect',
                    desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
                })
            },
            handleMaxSize (file) {
                this.$Notice.warning({
                    title: 'Exceeding file size limit',
                    desc: 'File  ' + file.name + ' is too large, no more than 2M.'
                })
            },
            handleBeforeUpload () {
                const check = this.uploadList.length < 5
                if (!check) {
                    this.$Notice.warning({
                        title: 'Up to five pictures can be uploaded.'
                    })
                }
                return check
            },
            handlePreview (file) {
                console.log(file)
            }
        },
        mounted () {
            this.uploadList = this.$refs.upload.fileList
        }
    }
</script>
