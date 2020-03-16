<template>
  <el-card>
    <el-form ref="searchForm" :model="searchForm" label-width="100px" :inline="true" @submit.native.prevent
             size="mini">
      <el-form-item :label="$t('forms.processKey')" prop="value">
        <el-input v-model="searchForm.processKey" :disabled="modal_loading"
                  :placeholder="$t('forms.pleaseEnter') + $t('forms.processKey')"
                  @keyup.enter.native="handleSearch"/>
      </el-form-item>
      <el-form-item :label="$t('forms.name')" prop="value">
        <el-input v-model="searchForm.name" :disabled="modal_loading"
                  :placeholder="$t('forms.pleaseEnter') + $t('forms.name')"
                  @keyup.enter.native="handleSearch"/>
      </el-form-item>
      <el-form-item :label="$t('forms.resourceName')" prop="resourceName">
        <el-input v-model="searchForm.resourceName" :disabled="modal_loading"
                  :placeholder="$t('forms.pleaseEnter') + $t('forms.resourceName')"
                  @keyup.enter.native="handleSearch"/>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button-group>
          <el-button :loading="modal_loading" @click="handleSearch()" type="primary">
            {{$t('forms.buttons.search')}}
          </el-button>
          <el-button :loading="modal_loading" @click="handleSearchReset('searchForm')" type="primary">
            {{$t('forms.buttons.reset')}}
          </el-button>
          <el-button :loading="modal_loading" @click="handleAdd()" type="primary">
            {{$t('forms.buttons.add')}}
          </el-button>
          <el-button :loading="modal_loading" @click="handleDeleteMore()" type="primary">
            {{$t('forms.buttons.delete')}}
          </el-button>
        </el-button-group>
      </el-form-item>
    </el-form>
    <el-table ref="table" border :height="tableHeight" size="mini" :default-sort="searchForm.orderParam"
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
        :label="this.$i18n.t('forms.processKey')">
      </el-table-column>
      <el-table-column
        prop="name"
        sortable="custom"
        :label="this.$i18n.t('forms.name')">
      </el-table-column>
      <el-table-column
        prop="version"
        sortable="custom"
        width="80"
        :label="this.$i18n.t('forms.version')">
      </el-table-column>
      <el-table-column
        prop="resourceName"
        :label="this.$i18n.t('forms.resourceName')">
      </el-table-column>
      <el-table-column
        prop="remarks"
        :label="this.$i18n.t('forms.remarks')">
      </el-table-column>
      <el-table-column
        prop="createTime"
        sortable="custom"
        width="140"
        :label="this.$i18n.t('forms.createTime')">
        <template slot-scope="scope">
          <span>{{dateTimeFormat(scope.row.createTime)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="modifyTime"
        sortable="custom"
        width="140"
        :label="this.$i18n.t('forms.modifyTime')">
        <template slot-scope="scope">
          <span>{{dateTimeFormat(scope.row.modifyTime)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="deployTime"
        sortable="custom"
        width="140"
        :label="this.$i18n.t('forms.deployTime')">
        <template slot-scope="scope">
          <span>{{dateTimeFormat(scope.row.deployTime)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="action"
        :label="this.$i18n.t('forms.action')"
        align="center"
        width="90">
        <template slot-scope="scope">
          <el-tooltip :content="$t('forms.buttons.edit')" placement="top-start">
            <el-button type="text" @click="handleEdit(scope.row)">
              <i style="font-size: 15px" class="el-icon-edit"/>
            </el-button>
          </el-tooltip>
          <el-tooltip :content="$t('forms.buttons.delete')" placement="top-start">
            <el-button type="text" @click="handleDeleteRow(scope.row)">
              <i style="font-size: 15px" class="el-icon-delete"/>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="margin-top: 10px;text-align: right"
                   @size-change="handlePageSizeSearch"
                   @current-change="handlePageSearch"
                   :current-page="searchForm.currPage"
                   :page-sizes="searchForm.pageSizeArray"
                   :page-size="searchForm.pageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="searchForm.totalRows">
    </el-pagination>
    <el-dialog :visible.sync="editModal" :title="$t('forms.buttons.add')" :close-on-click-modal="false">
      <el-form ref="editForm" :model="editForm" label-width="100px" size="mini"
               v-loading="modal_loading" @submit.native.prevent style="padding-right: 25px;">
        <div v-if="this.action===1">
          <el-form-item :label="$t('forms.processKey')+':'" prop="processKey">
            <span>{{editForm.processKey}}</span>
          </el-form-item>
          <el-form-item :label="$t('forms.name')+':'" prop="name">
            <span>{{editForm.name}}</span>
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
            <el-button slot="trigger" size="mini" type="primary">
              {{$t('forms.buttons.chooseFile')}}
            </el-button>
          </el-upload>
          <el-button v-else size="mini" type="primary" @click="handleDownLoadFile">
            {{$t('forms.buttons.downLoadFile')}}
          </el-button>
        </el-form-item>
        <el-form-item :label="$t('forms.remarks')+':'" prop="remarks">
          <el-input v-model="editForm.remarks" :disabled="modal_loading" type="textarea" :rows="3"
                    :placeholder="$t('forms.pleaseEnter') + $t('forms.remarks')"/>
        </el-form-item>
        <div v-if="action===1">
          <el-form-item :label="$t('forms.resourceName')+':'" prop="resourceName">
            <span>{{editForm.resourceName}}</span>
          </el-form-item>
          <el-form-item :label="$t('forms.version')+':'" prop="version">
            <span>{{editForm.version}}</span>
          </el-form-item>
          <el-form-item :label="$t('forms.createTime')+':'" prop="createTime">
            <span>{{dateTimeFormat(editForm.createTime)}}</span>
          </el-form-item>
          <el-form-item :label="$t('forms.modifyTime')+':'" prop="modifyTime">
            <span>{{dateTimeFormat(editForm.modifyTime)}}</span>
          </el-form-item>
          <el-form-item :label="$t('forms.deployTime')+':'" prop="deployTime">
            <span>{{dateTimeFormat(editForm.deployTime)}}</span>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer">
        <el-button type="info" :loading="modal_loading" @click="doCancel()">
          {{$t('forms.buttons.cancel')}}
        </el-button>
        <el-button type="warning" :loading="modal_loading" @click="doReset()">
          {{$t('forms.buttons.reset')}}
        </el-button>
        <el-button type="primary" :loading="modal_loading" @click="handleSave('editForm')">
          {{$t('forms.buttons.submit')}}
        </el-button>
        <div v-if="action===1" style="float: left">
          <el-button type="success" :loading="modal_loading" @click="handleDeploy">
            {{$t('forms.buttons.deploy')}}
          </el-button>
          <el-button v-if="this.editForm.deploymentId && this.editForm.deploymentId!==''" type="info"
                     :loading="modal_loading" icon="el-icon-search" @click="handleViewDiagram">
            {{$t('forms.buttons.view')}}
          </el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="diagramModal" :title="$t('forms.buttons.image')" fullscreen>
      <el-scrollbar>
        <el-image :src="viewDiagram" style="padding-bottom: 20px"/>
      </el-scrollbar>
    </el-dialog>
  </el-card>
</template>
<script>
  import moment from 'moment'
  import { copy } from '@/libs/tools'

  export default {
    name: 'workflowDeploy',
    data () {
      return {
        searchForm: {
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
        editForm: {
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
      viewDiagram () {
        return this.diagramData
      },
      uploadURL () {
        return this.$api.request.workFlowDeploy.uploadUrl()
      },
      uploadHeaders () {
        return {
          Authorization: `${this.$store.state.app.user.tokenType} ${this.$store.state.app.user.token}`
        }
      },
      remarks () {
        return this.editForm.remarks
      },
      tableHeight () {
        const minHeight = 300
        const height = this.$store.state.app.mainHeight - 80 - 46 - 42 - 4
        if (height < minHeight) {
          return minHeight - 2
        } else {
          return height
        }
      }
    },
    methods: {
      dateTimeFormat (time) {
        return time ? moment(time).format('YYYY-MM-DD HH:mm:ss') : ''
      },
      doReset () {
        this.$nextTick(() => {
          this.$refs['editForm'].resetFields()
          if (this.action === 0) {
            this.$refs['upload'].clearFiles()
          }
          this.fileList = []
          this.editForm = copy(this.currObj)
          this.diagramData = ''
        })
      },
      clearCurrObj () {
        this.$nextTick(() => {
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
      handleAdd () {
        this.editModal = true
        this.action = 0
        this.$nextTick(() => {
          this.clearCurrObj()
          this.doReset()
        })
      },
      doCancel () {
        this.editModal = false
      },
      handleDelete (rowIds) {
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
      handleSave (name) {
        this.$refs[name].validate((valid) => {
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
                this.$refs['upload'].submit()
                break
              case 1:
                this.modal_loading = true
                this.$api.request.workFlowDeploy.update({
                  id: this.editForm.id,
                  processKey: this.editForm.processKey,
                  name: this.editForm.name,
                  remarks: this.editForm.remarks
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
      handleDeploy () {
        this.$confirm(this.$i18n.t('messages.deployWorkFlowConfirm') + '', this.$i18n.t('dialog.confirm') + '', {
          type: 'warning'
        }).then(() => {
          this.modal_loading = true
          this.$api.request.workFlowDeploy.deploy(this.editForm.id).then((res) => {
            this.modal_loading = false
            if (res) {
              this.$message.success(this.$i18n.t('messages.requestSuccess') + '')
              this.currObj = copy(res.data)
              this.$nextTick(() => {
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
      handleViewDiagram () {
        const currObj = this
        this.diagramModal = true
        this.$api.request.workFlowDeploy.diagram(this.editForm.deploymentId).then((image) => {
          if (image) {
            const dataInfo = image.data
            const contentType = dataInfo.type
            const reader = new window.FileReader()
            reader.readAsArrayBuffer(dataInfo)
            reader.onload = function (e) {
              const result = e.target.result
              const blob = new Blob([result], { type: contentType })
              currObj.diagramData = window.URL.createObjectURL(blob)
            }
          }
        })
      },
      handlePageSearch (page) {
        this.searchForm.currPage = page
        this.handleSearch()
      },
      handlePageSizeSearch (size) {
        this.searchForm.pageSize = size
        this.handleSearch()
      },
      handleSearch () {
        let searchParam = {
          resourceName: this.searchForm.resourceName,
          processKey: this.searchForm.processKey,
          name: this.searchForm.name,
          queryParam: {
            currPage: this.searchForm.currPage,
            pageSize: this.searchForm.pageSize
          }
        }
        if (this.searchForm.orderParam.order !== 'normal') {
          searchParam.queryParam.orderName = this.searchForm.orderParam.prop
          searchParam.queryParam.orderCommand = this.searchForm.orderParam.order
        }
        this.modal_loading = true
        this.$api.request.workFlowDeploy.query(searchParam).then((res) => {
          this.modal_loading = false
          if (res) {
            this.selectedData = []
            this.searchForm.currPage = res.data.pageable.pageNumber + 1
            this.searchForm.totalRows = res.data.totalElements
            this.searchData = []
            this.searchData = res.data.content
            this.$nextTick(() => {
              this.$refs['table'].doLayout()
            })
          }
        }).catch(() => {
          this.searchData = []
          this.selectedData = []
          this.modal_loading = false
        })
      },
      handleRowClick (row) {
        this.$refs['table'].toggleRowSelection(row)
      },
      handleSortChange (param) {
        this.searchForm.orderParam.prop = param.prop
        this.searchForm.orderParam.order = param.order
        this.handleSearch()
      },
      handleSearchReset (name) {
        this.$refs[name].resetFields()
      },
      handleSelect (selection) {
        this.selectedData = selection
      },
      handleDeleteRow (row) {
        this.$confirm(this.$i18n.t('messages.deleteDataConfirm') + '', this.$i18n.t('dialog.confirm') + '', {
          type: 'warning'
        }).then(() => {
          this.handleDelete([row.id])
        }).catch(() => {
        })
      },
      handleDeleteMore () {
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
      handleEdit (row) {
        this.editModal = true
        this.action = 1
        this.currObj = copy(row)
        this.$nextTick(() => {
          this.doReset()
        })
      },
      handleChangeUpload (file, fileList) {
        this.fileList = fileList
      },
      handleBeforeUpload () {
        this.modal_loading = true
        return true
      },
      handleUploadSuccess () {
        this.editModal = false
        this.modal_loading = false
        this.$message.success(this.$i18n.t('messages.saveSuccess') + '')
        this.handleSearch()
      },
      handleUploadError (err) {
        this.modal_loading = false
        this.$api.errorProcess({ response: { data: JSON.parse(String(err).substring(6)) } })
      },
      handleDownLoadFile () {
        this.$api.request.workFlowDeploy.downLoadFile(this.editForm.id)
      }
    },
    mounted () {
      this.handleSearch()
    },
    activated () {
      this.$nextTick(() => {
        this.$refs['table'].doLayout()
      })
    }
  }
</script>
