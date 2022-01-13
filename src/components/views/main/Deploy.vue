<template>
  <el-card>
    <el-form ref="searchForm" :model="searchFormModel" label-width="undefined" :inline="true" size="small"
             @submit.native.prevent>
      <el-form-item :label="$t('forms.name')" prop="name">
        <el-input v-model="searchFormModel.name" :disabled="modal_loading"
                  :placeholder="$t('forms.pleaseEnter') + $t('forms.name')"
                  @keyup.enter.native="handleSearch"/>
      </el-form-item>
      <el-form-item :label="$t('forms.execTime')" prop="startTime">
        <el-date-picker v-if="!isMobile" type="daterange" :disabled="modal_loading" :shortcuts="pickerShortcuts"
                        v-model="searchFormModel.startTime"
                        :placeholder="$t('forms.pleaseEnter') + $t('forms.execTime')"/>
        <div v-else>
          <el-date-picker v-model="searchFormModel.startTime[0]" :disabled="modal_loading" type="date"/>
          至
          <el-date-picker v-model="searchFormModel.startTime[1]" :disabled="modal_loading" type="date"/>
        </div>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button-group style="margin-right: 20px">
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
        <el-button :loading="modal_loading" @click="handleOpenFileManager" type="warning">
          {{ $t('forms.buttons.fileManager') }}
        </el-button>
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
        prop="name"
        sortable="custom"
        :label="$t('forms.name')">
      </el-table-column>
      <el-table-column
        prop="scriptFile"
        :label="$t('forms.scriptFile')"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="serverIpRegex"
        :label="$t('forms.serverIpRegex')"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="remarks"
        :label="$t('forms.remarks')"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="createUserName"
        sortable="custom"
        align="center"
        :label="$t('forms.createUserName')"
        width="100">
      </el-table-column>
      <el-table-column
        prop="createTime"
        sortable="custom"
        align="center"
        :label="$t('forms.createTime')"
        width="150">
        <template #default="scope">
          <span>{{ dateTimeFormat(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="execUserName"
        sortable="custom"
        align="center"
        :label="$t('forms.execUserName')"
        width="100">
      </el-table-column>
      <el-table-column
        prop="execTime"
        sortable="custom"
        align="center"
        :label="$t('forms.execTime')"
        width="150">
        <template #default="scope">
          <span>{{ dateTimeFormat(scope.row.execTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :fixed="isMobile?false:'right'"
        prop="action"
        :label="$t('forms.action')"
        align="center"
        width="120">
        <template #default="scope">
          <el-button type="text" @click="handleEdit(scope.row)">
            <el-icon size="15">
              <el-icon-edit/>
            </el-icon>
          </el-button>
          <el-button type="text" @click="handleDeleteRow(scope.row)">
            <el-icon size="15">
              <el-icon-delete/>
            </el-icon>
          </el-button>
          <el-button type="text" @click="handleExecute(scope.row)">
            <el-icon size="15">
              <el-icon-circle-check/>
            </el-icon>
          </el-button>
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
    <el-dialog :fullscreen="isMobile" v-model="editModal" :title="$t('forms.info')">
      <el-form ref="editForm" :model="editFormModel" :rules="ruleAddForm" label-width="undefined" size="small"
               v-loading="modal_loading" @submit.native.prevent>
        <el-form-item :label="$t('forms.name')" prop="name" style="width: 100%">
          <el-input v-model="editFormModel.name" :disabled="modal_loading"
                    :placeholder="$t('forms.pleaseEnter') + $t('forms.name')"
                    @keyup.enter.native="doSave"/>
        </el-form-item>
        <el-form-item :label="$t('forms.scriptFile')" prop="scriptFile" style="width: 100%">
          <el-input v-model="editFormModel.scriptFile" :disabled="modal_loading"
                    :placeholder="$t('forms.pleaseEnter') + $t('forms.scriptFile')"
                    @keyup.enter.native="doSave"/>
        </el-form-item>
        <el-form-item :label="$t('forms.paramFile')" prop="paramFile" style="width: 100%">
          <el-input v-model="editFormModel.paramFile" :disabled="modal_loading"
                    :placeholder="$t('forms.pleaseEnter') + $t('forms.paramFile')"
                    @keyup.enter.native="doSave"/>
        </el-form-item>
        <el-form-item :label="$t('forms.serverIpRegex')" prop="serverIpRegex" style="width: 100%">
          <el-input v-model="editFormModel.serverIpRegex" :disabled="modal_loading"
                    :placeholder="$t('forms.pleaseEnter') + $t('forms.serverIpRegex')"
                    @keyup.enter.native="doSave"/>
        </el-form-item>
        <el-form-item :label="$t('forms.remarks')" prop="remarks" style="width: 100%;">
          <el-input v-model="editFormModel.remarks" :disabled="modal_loading" type="textarea" :rows="5"
                    :placeholder="$t('forms.pleaseEnter') + $t('forms.remarks')"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="text-align: center">
          <el-button type="default" :loading="modal_loading" @click="doCancel()">
            {{ $t('forms.buttons.cancel') }}
          </el-button>
          <el-button type="primary" :loading="modal_loading" @click="doSave">
            {{ $t('forms.buttons.submit') }}
          </el-button>
        </div>
      </template>
      <el-backtop :visibility-height="10" target=".el-dialog"/>
    </el-dialog>
    <el-dialog :fullscreen="isMobile" v-model="fileModal" :title="$t('forms.info')">
      <el-row>
        <el-col :span="24">
          <h3>{{ $t('forms.path') + ': ' + path }}</h3>
        </el-col>
      </el-row>
      <el-form :inline="true" @submit.native.prevent size="small">
        <el-form-item :label="$t('forms.filterKey')">
          <el-input v-model="fileName" :disabled="modal_loading" clearable @keyup.enter.native="handleRefresh"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleReset" :loading="modal_loading"
                     style="margin-left: 10px">
            {{ $t('forms.buttons.reset') }}
          </el-button>
          <el-button type="success" @click="handleRefresh" :loading="modal_loading"
                     style="margin-left: 10px">
            {{ $t('forms.buttons.refresh') }}
          </el-button>
          <el-button type="info" @click="handleBackUp" :loading="modal_loading">
            {{ $t('errorPage.buttons.back') }}
          </el-button>
          <el-button type="warning" @click="handleCreateFold" :loading="modal_loading"
                     style="margin-left: 10px">
            {{ $t('forms.buttons.newFold') }}
          </el-button>
        </el-form-item>
      </el-form>
      <el-scrollbar class="upload-scrollbar" :style="{height: mainHeight+'px'}">
        <el-upload
          multiple
          :action="uploadFileUrl"
          :headers="uploadHeaders"
          :disabled="modal_loading"
          :before-remove="handleBeforeRemoveFile"
          :on-remove="handleRemoveFile"
          :on-preview="handleDownloadFile"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :file-list="fileList">
          <el-button size="small" type="primary" :loading="modal_loading">
            {{ $t('forms.buttons.upload') }}
          </el-button>
        </el-upload>
        <el-backtop :visibility-height="10" target=".upload-scrollbar .el-scrollbar__wrap"/>
      </el-scrollbar>
    </el-dialog>
  </el-card>
</template>
<script>
import moment from 'moment'
import {nextTick, ref} from "vue";
import {isMobileDevice} from "@/libs/tools";

export default {
  name: 'deploy',
  data() {
    return {
      searchFormModel: {
        name: '',
        startTime: [],
        orderParam: {
          prop: 'createTime',
          order: 'descending'
        },
        currPage: 1,
        totalRows: 0,
        pageSize: 10,
        pageSizeArray: [10, 20, 30, 40]
      },
      editFormModel: {
        id: '',
        name: '',
        scriptFile: '',
        paramFile: '',
        serverIpRegex: '',
        remarks: ''
      },
      editModal: false,
      fileModal: false,
      modal_loading: false,
      searchData: [],
      selectedData: [],
      fileList: [],
      action: 0,
      path: '',
      fileName: ''
    }
  },
  watch: {
    'searchFormModel.currPage'() {
      this.handleSearch()
    }
  },
  computed: {
    isMobile() {
      return isMobileDevice()
    },
    mainHeight() {
      return this.$store.state.app.mainHeight - 300
    },
    tableHeight() {
      const minHeight = 300
      const height = this.$store.state.app.mainHeight - 80 - 46 - 42 - 4
      if (height < minHeight) {
        return minHeight - 2
      } else {
        return height
      }
    },
    pickerShortcuts() {
      return [{
        text: this.$i18n.t('forms.buttons.lastWeek'),
        value: (() => {
          const end = new Date()
          const start = new Date()
          end.setHours(0, 0, 0, 0)
          start.setHours(0, 0, 0, 0)
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
          return [start, end]
        })()
      }, {
        text: this.$i18n.t('forms.buttons.lastMonth'),
        value: (() => {
          const end = new Date()
          const start = new Date()
          end.setHours(0, 0, 0, 0)
          start.setHours(0, 0, 0, 0)
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          return [start, end]
        })()
      }, {
        text: this.$i18n.t('forms.buttons.lastThreeMonth'),
        value: (() => {
          const end = new Date()
          const start = new Date()
          end.setHours(0, 0, 0, 0)
          start.setHours(0, 0, 0, 0)
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
          return [start, end]
        })()
      }]
    },
    ruleAddForm() {
      return {
        name: [
          {
            required: true,
            message: this.$i18n.t('forms.name') + this.$i18n.t('forms.notEmpty'),
            trigger: 'blur'
          }
        ],
        scriptFile: [
          {
            required: true,
            message: this.$i18n.t('forms.scriptFile') + this.$i18n.t('forms.notEmpty'),
            trigger: 'blur'
          }
        ]
      }
    },
    uploadFileUrl() {
      return this.$api.request.deploy.uploadFileUrl()
    },
    uploadHeaders() {
      return {
        Authorization: `${this.$store.state.app.user.tokenType} ${this.$store.state.app.user.token}`
      }
    }
  },
  methods: {
    dateTimeFormat(time) {
      return time ? moment(time).format('YYYY-MM-DD HH:mm:ss') : ''
    },
    handleAdd() {
      this.editModal = true
      nextTick(() => {
        this.editForm.resetFields()
        this.action = 0
      })
    },
    handleEdit(row) {
      this.editModal = true
      nextTick(() => {
        this.editForm.resetFields()
        this.editFormModel.id = row.id
        this.editFormModel.name = row.name
        this.editFormModel.scriptFile = row.scriptFile
        this.editFormModel.paramFile = row.paramFile
        this.editFormModel.serverIpRegex = row.serverIpRegex
        this.editFormModel.remarks = row.remarks
        this.editFormModel.createLoginNo = row.createLoginNo
        this.editFormModel.createUserName = row.createUserName
        this.editFormModel.createTime = row.createTime
        this.editFormModel.execLoginNo = row.execLoginNo
        this.editFormModel.execUserName = row.execUserName
        this.editFormModel.execTime = row.execTime
        this.action = 1
      })
    },
    doCancel() {
      this.editModal = false
    },
    doSave() {
      switch (this.action) {
        case 0:
          this.editForm.validate((valid) => {
            if (valid) {
              this.modal_loading = true
              this.$api.request.deploy.create({
                name: this.editFormModel.name,
                scriptFile: this.editFormModel.scriptFile,
                paramFile: this.editFormModel.paramFile,
                serverIpRegex: this.editFormModel.serverIpRegex,
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
            }
          })
          break
        case 1:
          this.editForm.validate((valid) => {
            if (valid) {
              this.modal_loading = true
              this.$api.request.deploy.update({
                id: this.editFormModel.id,
                name: this.editFormModel.name,
                scriptFile: this.editFormModel.scriptFile,
                paramFile: this.editFormModel.paramFile,
                serverIpRegex: this.editFormModel.serverIpRegex,
                remarks: this.editFormModel.remarks
              }).then((res) => {
                this.modal_loading = false
                if (res) {
                  this.$message.success(this.$i18n.t('messages.updateSuccess') + '')
                  this.editModal = false
                  this.handleSearch()
                }
              }).catch(() => {
                this.modal_loading = false
              })
            }
          })
          break
      }
    },
    handleDelete(rowIds) {
      this.modal_loading = true
      this.$api.request.deploy.delete(rowIds).then((res) => {
        this.modal_loading = false
        if (res) {
          this.$message.success(this.$i18n.t('messages.deleteSuccess') + '')
          this.handleSearch()
        }
      }).catch(() => {
        this.modal_loading = false
      })
    },
    handlePageSizeSearch(size) {
      this.searchFormModel.pageSize = size
      this.handleSearch()
    },
    handleSearch() {
      let searchParam = {
        name: this.searchFormModel.name,
        startTime: this.searchFormModel.startTime && this.searchFormModel.startTime.length === 2 ? this.searchFormModel.startTime[0].getTime() : null,
        endTime: this.searchFormModel.startTime && this.searchFormModel.startTime.length === 2 ? this.searchFormModel.startTime[1].getTime() : null,
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
      this.$api.request.deploy.query(searchParam).then((res) => {
        this.modal_loading = false
        if (res) {
          this.selectedData = []
          this.searchFormModel.totalRows = res.data.totalElements
          this.searchData = res.data.content
          nextTick(() => {
            this.table.doLayout()
          })
        }
      }).catch(() => {
        this.searchData = []
        this.selectedData = []
        this.modal_loading = false
      })
    },
    handleRowClick(row) {
      this.table.toggleRowSelection(row)
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
      this.$confirm(this.$i18n.t('messages.deleteDataConfirm') + '[' + row.name + ']', this.$i18n.t('dialog.confirm') + '', {
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
    handleExecute(row) {
      this.$confirm(this.$i18n.t('messages.executeDeployConfirm') + '[' + row.name + ']', this.$i18n.t('dialog.confirm') + '', {
        type: 'warning'
      }).then(() => {
        this.modal_loading = true
        this.$api.request.deploy.execute(row.id).then((res) => {
          this.modal_loading = false
          if (res) {
            this.$message.success(res.data.message)
            this.handleSearch()
          }
        }).catch(() => {
          this.modal_loading = false
        })
      })
    },
    handleOpenFileManager() {
      this.fileModal = true
      this.searchFile()
    },
    handleBeforeRemoveFile(file) {
      return this.$confirm(this.$i18n.t('messages.deleteDataConfirm') + ' ' + file.name, this.$i18n.t('dialog.confirm') + '', {
        type: 'warning'
      })
    },
    handleRemoveFile(file) {
      this.modal_loading = true
      this.$api.request.deploy.deleteFile(this.path, file.name).then((res) => {
        this.modal_loading = false
        if (res) {
          this.$message.success(this.$i18n.t('messages.deleteSuccess') + '')
        }
      }).catch(() => {
        this.modal_loading = false
      })
    },
    handleDownloadFile(file) {
      if (file.directory) {
        if (this.path !== '') {
          this.path += '/'
        }
        this.path += file.name
        this.searchFile()
      } else {
        this.$api.request.deploy.downLoadFile(this.path, file.name)
      }
    },
    handleUploadSuccess(res, file) {
      file.directory = res.directory
      file.lastModified = res.lastModified
      file.name = res.name
      file.size = res.size
    },
    handleUploadError(err) {
      this.$api.errorProcess({response: {data: JSON.parse(String(err).substring(6))}})
    },
    searchFile() {
      this.modal_loading = true
      this.fileList = []
      this.$api.request.deploy.searchFile(this.path, this.fileName).then((res) => {
        this.modal_loading = false
        if (res) {
          this.fileList = res.data
        }
      }).catch(() => {
        this.fileList = []
        this.modal_loading = false
      })
    },
    handleBackUp() {
      if (this.path !== '') {
        if (this.path.indexOf('/') !== -1) {
          this.path = this.path.substring(0, this.path.lastIndexOf('/'))
        } else {
          this.path = ''
        }
      }
      this.searchFile()
    },
    handleReset() {
      this.fileName = ''
    },
    handleRefresh() {
      this.searchFile()
    },
    handleCreateFold() {
      this.$prompt(this.$i18n.t('forms.pleaseEnter') + this.$i18n.t('forms.name'), this.$i18n.t('dialog.info')).then(({value}) => {
        this.modal_loading = true
        this.$api.request.deploy.createFold(this.path, value).then((res) => {
          this.modal_loading = false
          if (res) {
            this.searchFile()
          }
        }).catch(() => {
          this.modal_loading = false
        })
      }).catch(() => {
        this.modal_loading = false
      })
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
    const editForm = ref(null)
    const table = ref(null)
    return {searchForm, editForm, table}
  }
}
</script>
