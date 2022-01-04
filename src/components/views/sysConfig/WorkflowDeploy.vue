<template>
  <el-card>
    <el-form ref="searchForm" :model="searchFormModel" label-width="auto" :inline="true" @submit.native.prevent
             size="small">
      <el-form-item :label="$t('forms.processKey')" prop="value">
        <el-input v-model="searchFormModel.processKey" :disabled="modal_loading"
                  :placeholder="$t('forms.pleaseEnter') + $t('forms.processKey')"
                  @keyup.enter.native="handleSearch"/>
      </el-form-item>
      <el-form-item :label="$t('forms.name')" prop="value">
        <el-input v-model="searchFormModel.name" :disabled="modal_loading"
                  :placeholder="$t('forms.pleaseEnter') + $t('forms.name')"
                  @keyup.enter.native="handleSearch"/>
      </el-form-item>
      <el-form-item :label="$t('forms.resourceName')" prop="resourceName">
        <el-input v-model="searchFormModel.resourceName" :disabled="modal_loading"
                  :placeholder="$t('forms.pleaseEnter') + $t('forms.resourceName')"
                  @keyup.enter.native="handleSearch"/>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button-group>
          <el-button :loading="modal_loading" @click="handleSearch" type="primary">
            {{ $t('forms.buttons.search') }}
          </el-button>
          <el-button :loading="modal_loading" @click="handleSearchReset" type="primary">
            {{ $t('forms.buttons.reset') }}
          </el-button>
          <el-button :loading="modal_loading" @click="handleAdd" type="primary">
            {{ $t('forms.buttons.add') }}
          </el-button>
          <el-button :loading="modal_loading" @click="handleDeleteMore" type="primary">
            {{ $t('forms.buttons.delete') }}
          </el-button>
        </el-button-group>
      </el-form-item>
    </el-form>
    <el-table ref="table" border :height="tableHeight" size="small" :default-sort="searchFormModel.orderParam"
              :data="searchData"
              v-loading="modal_loading" :empty-text="$t('messages.tableNoData')"
              @row-click="handleRowClick" @selection-change="handleSelect" @sort-change="handleSortChange"
              header-cell-class-name="query-table-header">
      <el-table-column
        type="selection"
        fixed="left"
        align="center"
        width="40">
      </el-table-column>
      <el-table-column
        prop="processKey"
        sortable="custom"
        :label="$t('forms.processKey')">
      </el-table-column>
      <el-table-column
        prop="name"
        sortable="custom"
        :label="$t('forms.name')">
      </el-table-column>
      <el-table-column
        prop="version"
        sortable="custom"
        width="80"
        :label="$t('forms.version')">
      </el-table-column>
      <el-table-column
        prop="resourceName"
        :label="$t('forms.resourceName')">
      </el-table-column>
      <el-table-column
        prop="remarks"
        :label="$t('forms.remarks')">
      </el-table-column>
      <el-table-column
        prop="createTime"
        sortable="custom"
        width="140"
        :label="$t('forms.createTime')">
        <template #default="scope">
          <span>{{ dateTimeFormat(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="modifyTime"
        sortable="custom"
        width="140"
        :label="$t('forms.modifyTime')">
        <template #default="scope">
          <span>{{ dateTimeFormat(scope.row.modifyTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="deployTime"
        sortable="custom"
        width="140"
        :label="$t('forms.deployTime')">
        <template #default="scope">
          <span>{{ dateTimeFormat(scope.row.deployTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :fixed="isMobile?false:'right'"
        prop="action"
        :label="$t('forms.action')"
        align="center"
        width="90">
        <template #default="scope">
          <el-button type="text" @click="handleEdit(scope.row)"
                     icon="el-icon-edit"/>
          <el-button type="text" @click="handleDeleteRow(scope.row)"
                     icon="el-icon-delete"/>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handlePageSizeSearch"
                   v-model:current-page="searchFormModel.currPage"
                   :page-sizes="searchFormModel.pageSizeArray"
                   v-model:page-size="searchFormModel.pageSize"
                   :layout="isMobile?'prev, pager, next':'total, sizes, prev, pager, next, jumper'" :small="isMobile"
                   :total="searchFormModel.totalRows">
    </el-pagination>
    <el-dialog :fullscreen="isMobile" v-model="editModal" :title="$t('forms.buttons.add')"
               :close-on-click-modal="false">
      <el-form ref="editForm" :model="editFormModel" label-width="auto" size="small"
               v-loading="modal_loading" @submit.native.prevent style="padding-right: 25px;">
        <div v-if="this.action===1">
          <el-form-item :label="$t('forms.processKey')+':'" prop="processKey">
            <span>{{ editFormModel.processKey }}</span>
          </el-form-item>
          <el-form-item :label="$t('forms.name')+':'" prop="name">
            <span>{{ editFormModel.name }}</span>
          </el-form-item>
        </div>
        <el-form-item :label="$t('forms.content')+':'" prop="file">
          <el-upload v-if="action===0"
                     ref="upload"
                     :name="'file'"
                     :limit="1"
                     :action="uploadURL"
                     :headers="uploadHeaders"
                     :data="{remarks:remarks}"
                     :on-change="handleChangeUpload"
                     :on-remove="handleChangeUpload"
                     :before-upload="handleBeforeUpload"
                     :on-success="handleUploadSuccess"
                     :on-error="handleUploadError"
                     :auto-upload="false">
            <el-button size="small" type="primary">
              {{ $t('forms.buttons.chooseFile') }}
            </el-button>
          </el-upload>
          <el-button v-else size="small" type="primary" @click="handleDownLoadFile">
            {{ $t('forms.buttons.downLoadFile') }}
          </el-button>
        </el-form-item>
        <el-form-item :label="$t('forms.remarks')+':'" prop="remarks">
          <el-input v-model="editFormModel.remarks" :disabled="modal_loading" type="textarea" :rows="3"
                    :placeholder="$t('forms.pleaseEnter') + $t('forms.remarks')"/>
        </el-form-item>
        <div v-if="action===1">
          <el-form-item :label="$t('forms.resourceName')+':'" prop="resourceName">
            <span>{{ editFormModel.resourceName }}</span>
          </el-form-item>
          <el-form-item :label="$t('forms.version')+':'" prop="version">
            <span>{{ editFormModel.version }}</span>
          </el-form-item>
          <el-form-item :label="$t('forms.createTime')+':'" prop="createTime">
            <span>{{ dateTimeFormat(editFormModel.createTime) }}</span>
          </el-form-item>
          <el-form-item :label="$t('forms.modifyTime')+':'" prop="modifyTime">
            <span>{{ dateTimeFormat(editFormModel.modifyTime) }}</span>
          </el-form-item>
          <el-form-item :label="$t('forms.deployTime')+':'" prop="deployTime">
            <span>{{ dateTimeFormat(editFormModel.deployTime) }}</span>
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <div>
          <el-button type="info" :loading="modal_loading" @click="doCancel">
            {{ $t('forms.buttons.cancel') }}
          </el-button>
          <el-button type="warning" :loading="modal_loading" @click="doReset">
            {{ $t('forms.buttons.reset') }}
          </el-button>
          <el-button type="primary" :loading="modal_loading" @click="handleSave">
            {{ $t('forms.buttons.submit') }}
          </el-button>
          <div v-if="action===1" style="float: left">
            <el-button type="success" :loading="modal_loading" @click="handleDeploy">
              {{ $t('forms.buttons.deploy') }}
            </el-button>
            <el-button v-if="this.editFormModel.deploymentId && this.editFormModel.deploymentId!==''" type="info"
                       :loading="modal_loading" icon="el-icon-search" @click="handleViewDiagram">
              {{ $t('forms.buttons.view') }}
            </el-button>
          </div>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="diagramModal" :title="$t('forms.buttons.image')" fullscreen>
      <el-scrollbar>
        <el-image :src="viewDiagram" style="padding-bottom: 20px"/>
      </el-scrollbar>
      <el-backtop :visibility-height="10" target=".el-dialog"/>
    </el-dialog>
  </el-card>
</template>
<script>
import moment from 'moment'
import {copy, isMobile} from '@/libs/tools'
import {nextTick, ref} from "vue";

export default {
  name: 'workflowDeploy',
  data() {
    return {
      searchFormModel: {
        resourceName: '',
        processKey: '',
        name: '',
        orderParam: {
          prop: 'createTime',
          order: 'ascending'
        },
        currPage: 1,
        totalRows: 0,
        pageSize: 10,
        pageSizeArray: [10, 20, 30, 40]
      },
      editFormModel: {
        id: '',
        resourceName: '',
        processKey: '',
        name: '',
        content: '',
        version: '',
        remarks: '',
        createTime: '',
        modifyTime: '',
        deployTime: '',
        deploymentId: ''
      },
      editModal: false,
      modal_loading: false,
      diagramModal: false,
      fileList: [],
      searchData: [],
      selectedData: [],
      action: 0,
      currObj: {},
      diagramData: ''
    }
  },
  computed: {
    isMobile() {
      return isMobile()
    },
    viewDiagram() {
      return this.diagramData
    },
    uploadURL() {
      return this.$api.request.workFlowDeploy.uploadUrl()
    },
    uploadHeaders() {
      return {
        Authorization: `${this.$store.state.app.user.tokenType} ${this.$store.state.app.user.token}`
      }
    },
    remarks() {
      return this.editFormModel.remarks
    },
    tableHeight() {
      const minHeight = 300
      const height = this.$store.state.app.mainHeight - 80 - 46 - 42 - 4
      if (height < minHeight) {
        return minHeight - 2
      } else {
        return height
      }
    }
  },
  watch: {
    'searchForm.currPage'() {
      this.handleSearch()
    }
  },
  methods: {
    dateTimeFormat(time) {
      return time ? moment(time).format('YYYY-MM-DD HH:mm:ss') : ''
    },
    doReset() {
      nextTick(() => {
        this.editForm.resetFields()
        if (this.action === 0) {
          this.upload.clearFiles()
        }
        this.fileList = []
        this.editFormModel = copy(this.currObj)
        this.diagramData = ''
      })
    },
    clearCurrObj() {
      nextTick(() => {
        this.currObj = {
          id: '',
          resourceName: '',
          processKey: '',
          name: '',
          content: '',
          version: '',
          remarks: '',
          createTime: '',
          modifyTime: '',
          deployTime: '',
          deploymentId: ''
        }
      })
    },
    handleAdd() {
      this.editModal = true
      this.action = 0
      nextTick(() => {
        this.clearCurrObj()
        this.doReset()
      })
    },
    doCancel() {
      this.editModal = false
    },
    handleDelete(rowIds) {
      this.modal_loading = true
      this.$api.request.workFlowDeploy.delete(rowIds).then((res) => {
        this.modal_loading = false
        if (res) {
          this.$message.success(this.$i18n.t('messages.deleteSuccess') + '')
          this.handleSearch()
        }
      }).catch(() => {
        this.modal_loading = false
      })
    },
    handleSave() {
      this.editForm.validate((valid) => {
        if (valid) {
          switch (this.action) {
            case 0:
              if (this.fileList.length === 0) {
                this.$alert(this.$i18n.t('forms.processFile') + this.$i18n.t('forms.notEmpty'),
                  this.$i18n.t('messages.validateFailed'), {
                    type: 'error',
                    callback: () => {
                    }
                  })
                return
              }
              this.upload.submit()
              break
            case 1:
              this.modal_loading = true
              this.$api.request.workFlowDeploy.update({
                id: this.editFormModel.id,
                processKey: this.editFormModel.processKey,
                name: this.editFormModel.name,
                remarks: this.editFormModel.remarks
              }).then((res) => {
                this.modal_loading = false
                if (res) {
                  this.$message.success(this.$i18n.t('messages.saveSuccess') + '')
                  this.editModal = false
                  this.handleSearch()
                }
              }).catch(() => {
                this.modal_loading = false
              })
              break
          }
        }
      })
    },
    handleDeploy() {
      this.$confirm(this.$i18n.t('messages.deployWorkFlowConfirm') + '', this.$i18n.t('dialog.confirm') + '', {
        type: 'warning'
      }).then(() => {
        this.modal_loading = true
        this.$api.request.workFlowDeploy.deploy(this.editFormModel.id).then((res) => {
          this.modal_loading = false
          if (res) {
            this.$message.success(this.$i18n.t('messages.requestSuccess') + '')
            this.currObj = copy(res.data)
            nextTick(() => {
              this.doReset()
            })
            this.handleSearch()
          }
        }).catch(() => {
          this.modal_loading = false
        })
      }).catch(() => {
      })
    },
    handleViewDiagram() {
      const currObj = this
      this.diagramModal = true
      this.$api.request.workFlowDeploy.diagram(this.editFormModel.deploymentId).then((image) => {
        if (image) {
          const dataInfo = image.data
          const contentType = dataInfo.type
          const reader = new window.FileReader()
          reader.readAsArrayBuffer(dataInfo)
          reader.onload = function (e) {
            const result = e.target.result
            const blob = new Blob([result], {type: contentType})
            currObj.diagramData = window.URL.createObjectURL(blob)
          }
        }
      }).catch(() => {
        this.$api.errorProcess('获取流程图失败！')
      })
    },
    handlePageSizeSearch(size) {
      this.searchFormModel.pageSize = size
      this.handleSearch()
    },
    handleSearch() {
      let searchParam = {
        resourceName: this.searchFormModel.resourceName,
        processKey: this.searchFormModel.processKey,
        name: this.searchFormModel.name,
        queryParam: {
          currPage: this.searchFormModel.currPage,
          pageSize: this.searchFormModel.pageSize
        }
      }
      if (this.searchFormModel.orderParam.order !== 'normal') {
        searchParam.queryParam.orderName = this.searchFormModel.orderParam.prop
        searchParam.queryParam.orderCommand = this.searchFormModel.orderParam.order
      }
      this.modal_loading = true
      this.$api.request.workFlowDeploy.query(searchParam).then((res) => {
        this.modal_loading = false
        if (res) {
          this.selectedData = []
          this.searchFormModel.totalRows = res.data.totalElements
          this.searchData = []
          this.searchData = res.data.content
          nextTick(() => {
            this.upload.doLayout()
          })
        }
      }).catch(() => {
        this.searchData = []
        this.selectedData = []
        this.modal_loading = false
      })
    },
    handleRowClick(row) {
      this.upload.toggleRowSelection(row)
    },
    handleSortChange(param) {
      this.searchFormModel.orderParam.prop = param.prop
      this.searchFormModel.orderParam.order = param.order
      this.handleSearch()
    },
    handleSearchReset() {
      this.searchForm.resetFields()
    },
    handleSelect(selection) {
      this.selectedData = selection
    },
    handleDeleteRow(row) {
      this.$confirm(this.$i18n.t('messages.deleteDataConfirm') + '', this.$i18n.t('dialog.confirm') + '', {
        type: 'warning'
      }).then(() => {
        this.handleDelete([row.id])
      }).catch(() => {
      })
    },
    handleDeleteMore() {
      if (this.selectedData.length > 0) {
        this.$confirm(this.$i18n.t('messages.deleteDataConfirm') + '', this.$i18n.t('dialog.confirm') + '', {
          type: 'warning'
        }).then(() => {
          this.handleDelete(this.selectedData.map(item => item.id))
        }).catch(() => {
        })
      } else {
        this.$alert(this.$i18n.t('messages.selectDataForDelete') + '', this.$i18n.t('dialog.info') + '', {
          type: 'error',
          callback: () => {
          }
        })
      }
    },
    handleEdit(row) {
      this.editModal = true
      this.action = 1
      this.currObj = copy(row)
      nextTick(() => {
        this.doReset()
      })
    },
    handleChangeUpload(file, fileList) {
      this.fileList = fileList
    },
    handleBeforeUpload() {
      this.modal_loading = true
      return true
    },
    handleUploadSuccess() {
      this.editModal = false
      this.modal_loading = false
      this.$message.success(this.$i18n.t('messages.saveSuccess') + '')
      this.handleSearch()
    },
    handleUploadError(err) {
      this.modal_loading = false
      this.$api.errorProcess({response: {data: JSON.parse(String(err).substring(6))}})
    },
    handleDownLoadFile() {
      this.$api.request.workFlowDeploy.downLoadFile(this.editFormModel.id)
    }
  },
  mounted() {
    this.handleSearch()
  },
  activated() {
    nextTick(() => {
      this.table.doLayout()
    })
  },
  setup() {
    const searchForm = ref(null)
    const table = ref(null)
    const editForm = ref(null)
    const upload = ref(null)
    return {searchForm, table, editForm, upload}
  }
}
</script>
