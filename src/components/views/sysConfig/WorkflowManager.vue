<template>
  <el-card>
    <el-form ref="searchForm" :model="searchForm" label-width="150px" :inline="true" size="mini"
             @submit.native.prevent>
      <el-row>
        <el-col :lg="{span:8}">
          <el-form-item :label="$t('forms.processKey')" prop="processDefinitionKey">
            <el-input v-model="searchForm.processDefinitionKey" :disabled="modal_loading" style="width: 200px"
                      :placeholder="$t('forms.pleaseEnter') + $t('forms.processKey')"
                      @keyup.enter.native="handleSearch"/>
          </el-form-item>
        </el-col>
        <el-col :lg="{span:8}">
          <el-form-item :label="$t('forms.processInstanceId')" prop="processInstanceId">
            <el-input v-model="searchForm.processInstanceId" :disabled="modal_loading" style="width: 200px"
                      :placeholder="$t('forms.pleaseEnter') + $t('forms.processInstanceId')"
                      @keyup.enter.native="handleSearch"/>
          </el-form-item>
        </el-col>
        <el-col :lg="{span:8}">
          <el-form-item :label="$t('forms.processBusinessKey')" prop="processBusinessKey">
            <el-input v-model="searchForm.processBusinessKey" :disabled="modal_loading" style="width: 200px"
                      :placeholder="$t('forms.pleaseEnter') + $t('forms.processBusinessKey')"
                      @keyup.enter.native="handleSearch"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :lg="{span:8}">
          <el-form-item :label="$t('forms.flowStatus')" prop="history">
            <el-select v-model="searchForm.history" :disabled="modal_loading" value=""
                       style="width:100px">
              <el-option v-for="item in infoTypeList" :value="item.value" :label="item.label"
                         :key="'search_select_'+item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lg="{span:10}">
          <el-form-item :label="$t('forms.startDate')" prop="startTime">
            <el-date-picker v-model="searchForm.startTime" :disabled="modal_loading" type="daterange"
                            :align="'right'" unlink-panels :picker-options="pickerOptions"/>
          </el-form-item>
        </el-col>
        <el-form-item style="float: right">
          <el-button-group>
            <el-button :loading="modal_loading" @click="handleSearch()" type="primary">
              {{ $t('forms.buttons.search') }}
            </el-button>
            <el-button :loading="modal_loading" @click="handleSearchReset('searchForm')" type="primary">
              {{ $t('forms.buttons.reset') }}
            </el-button>
          </el-button-group>
        </el-form-item>
      </el-row>
    </el-form>
    <el-table ref="table" border :height="tableHeight" size="mini" :default-sort="searchForm.orderParam"
              :data="searchData"
              v-loading="modal_loading" :empty-text="$t('messages.tableNoData')"
              header-cell-class-name="query-table-header">
      <el-table-column
        prop="businessKey"
        :label="$t('forms.processBusinessKey')"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="startTime"
        width="150"
        :label="$t('forms.beginTime')">
        <template #default="scope">
          <span>{{ dateTimeFormat(scope.row.startTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="flowName"
        :label="$t('forms.flowName')"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="title"
        :label="$t('forms.title')"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="description"
        :label="$t('forms.description')"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="endTime"
        width="150"
        :label="$t('forms.finishTime')">
        <template #default="scope">
          <span>{{ scope.row.endTime > 0 ? dateTimeFormat(scope.row.endTime) : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="isFinished"
        width="80"
        :label="$t('forms.flowStatus')">
        <template #default="scope">
          <span>{{ statusText(scope.row.finished) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('forms.currentUser')">
        <template #default="scope">
          <span>{{
              scope.row.activityUser.map((user) => {
                return user.name + '（' + user.loginNo + '）'
              }).join(',')
            }}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        prop="action"
        :label="$t('forms.action')"
        align="center"
        width="80">
        <template #default="scope">
          <el-tooltip :content="$t('forms.buttons.view')" placement="top-start">
            <el-button type="text" @click="gotoFlowView(scope.row)">
              <i style="font-size: 15px" class="el-icon-search"/>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="margin-top: 10px;text-align: right"
                   @size-change="handlePageSizeSearch"
                   v-model:current-page="searchForm.currPage"
                   :page-sizes="searchForm.pageSizeArray"
                   v-model:page-size="searchForm.pageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="searchForm.totalRows">
    </el-pagination>
    <el-dialog v-model="viewModal" :title="$t('forms.info')" :fullscreen="true">
      <div>
        <el-card shadow="hover">
          <template #header>
            <span>{{ $t('forms.basicInfo') }}</span><i class="el-icon-info" style="color: #409EFF; margin-left: 5px"/>
          </template>
          <el-form size="mini" :model="currObj" label-width="100px" :inline="true"
                   @submit.native.prevent>
            <el-row :gutter="10">
              <el-col :lg="{span: 8}">
                <el-form-item :label="$t('forms.processInstanceId')+':'" prop="processInstanceId">
                  <span>{{ currObj.processInstanceId }}</span>
                </el-form-item>
              </el-col>
              <el-col :lg="{span: 8}">
                <el-form-item :label="$t('forms.processBusinessKey')+':'" prop="businessKey">
                  <span>{{ currObj.businessKey }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :lg="{span: 8}">
                <el-form-item :label="$t('forms.processKey')+':'" prop="processDefinitionKey">
                  <span>{{ currObj.processDefinitionKey }}</span>
                </el-form-item>
              </el-col>
              <el-col :lg="{span: 8}">
                <el-form-item :label="$t('forms.flowName')+':'" prop="flowName">
                  <span>{{ currObj.flowName }}</span>
                </el-form-item>
              </el-col>
              <el-col :lg="{span: 8}">
                <el-form-item :label="$t('forms.title')+':'" prop="title">
                  <span>{{ currObj.title }}</span>
                </el-form-item>
              </el-col>
              <el-col :lg="{span: 8}">
                <el-form-item :label="$t('forms.isFinished')+':'" prop="finished">
                  <span
                    :style="{color:currObj.finished?'green':'red'}">{{
                      currObj.finished ? $t('forms.yes') : $t('forms.no')
                    }}</span>
                </el-form-item>
              </el-col>
              <el-col :lg="{span: 8}">
                <el-form-item :label="$t('forms.beginTime')+':'" prop="startTime">
                  <span>{{ dateTimeFormat(currObj.startTime) }}</span>
                </el-form-item>
              </el-col>
              <el-col :lg="{span: 8}">
                <el-form-item :label="$t('forms.finishTime')+':'" prop="endTime">
                  <span>{{ dateTimeFormat(currObj.endTime) }}</span>
                </el-form-item>
              </el-col>
              <el-col :lg="{span: 8}">
                <el-form-item :label="$t('forms.startUser')+':'" prop="startUser">
                  <span>{{
                      currObj.startUser && currObj.startUser.name ? currObj.startUser.name + '（' + currObj.startUser.loginNo + '）' : ''
                    }}</span>
                </el-form-item>
              </el-col>
              <el-col :lg="{span: 8}">
                <el-form-item :label="$t('forms.currentUser')+':'" prop="activityUser">
                  <span>{{
                      currObj.activityUser ? currObj.activityUser.map((item) => {
                        return item.name + '（' + item.loginNo + '）'
                      }).join(',') : ''
                    }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-form size="mini" :model="currObj" label-width="100px"
                   @submit.native.prevent>
            <el-row :gutter="10">
              <el-col :lg="{span: 24}">
                <el-form-item :label="$t('forms.description')+':'" prop="description">
                  <el-input v-model="currObj.description" type="textarea" :rows="3" readonly/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-form size="mini" :model="currObj" label-width="100px"
                   v-if="currObj.deleteReason&&currObj.deleteReason!==''"
                   @submit.native.prevent>
            <el-row :gutter="10">
              <el-col :lg="{span: 24}">
                <el-form-item prop="deleteReason" style="color:red">
                  <template #label>
                    <span style="color: red">{{ $t('forms.deleteReason') + ':' }}</span>
                  </template>
                  <el-input v-model="currObj.deleteReason" type="textarea" :rows="3" readonly/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-row>
            <el-col :lg="{span:24}">
              <el-collapse>
                <el-collapse-item>
                  <template #title>
                    <span>{{ $t('forms.processParams') }}</span>
                    <i class="el-icon-info" style="color: #409EFF; margin-left: 5px"/>
                  </template>
                  <el-table size="mini" :stripe="true" :data="params">
                    <el-table-column
                      type="index"
                      align="center"
                      width="50">
                    </el-table-column>
                    <el-table-column
                      prop="name"
                      width="300"
                      :label="$t('forms.name')"
                      :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column
                      prop="type"
                      width="200"
                      :label="$t('forms.type')"
                      :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column
                      prop="value"
                      :label="$t('forms.value')"
                      :show-overflow-tooltip="true">
                    </el-table-column>
                  </el-table>
                </el-collapse-item>
              </el-collapse>
            </el-col>
          </el-row>
        </el-card>
        <el-card shadow="hover" style="margin-top: 10px">
          <template #header>
            <span>{{ $t('forms.buttons.image') }}</span>
            <i class="el-icon-info" style="color: #409EFF; margin-left: 5px"/>
          </template>
          <el-scrollbar>
            <el-image :src="viewDiagram" style="padding-bottom: 20px"/>
          </el-scrollbar>
        </el-card>
        <el-card shadow="hover" style="margin-top: 10px">
          <template #header>
            <span>{{ $t('forms.processActivityRecords') }}</span>
            <i class="el-icon-info" style="color: #409EFF; margin-left: 5px"/>
          </template>
          <el-table size="mini" :stripe="true" :data="processActivityList">
            <el-table-column
              prop="activityName"
              :label="$t('forms.name')">
            </el-table-column>
            <el-table-column
              :label="$t('forms.processUser')">
              <template #default="scope">
                <span>{{ scope.row.user.name + '（' + scope.row.user.loginNo + '）' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="pass"
              :label="$t('forms.isPass')">
              <template #default="scope">
                <span :style="{color:scope.row.pass?'green':'red'}">{{ scope.row.pass ? '通过' : '不通过' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="comment"
              :label="$t('forms.comment')"
              :show-overflow-tooltip="true">
              <template #default="scope">
                <span style="white-space: pre-line">{{ scope.row.comment }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="startTime"
              :label="$t('forms.beginTime')">
              <template #default="scope">
                <span>{{ dateTimeFormat(scope.row.startTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="endTime"
              :label="$t('forms.finishTime')">
              <template #default="scope">
                <span>{{ dateTimeFormat(scope.row.endTime) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
      <template #footer>
        <div v-if="!currObj.finished" style="text-align: left">
          <el-button type="danger" :loading="modal_loading" @click="termination()">
            {{ $t('forms.buttons.delete') }}
          </el-button>
        </div>
      </template>
      <el-backtop :visibility-height="10" target=".el-dialog"/>
    </el-dialog>
    <el-dialog v-model="deleteModal" :title="$t('forms.info')" :close-on-click-modal="false" append-to-body>
      <el-form v-loading="modal_loading" @submit.native.prevent>
        <el-form-item :label="$t('forms.deleteReason')" required>
          <el-input v-model="deleteReason" type="textarea" :rows="3"
                    :placeholder="$t('forms.pleaseEnter')+$t('forms.deleteReason')"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="text-align: center">
          <el-button type="info" :loading="modal_loading" @click="doCancel()">
            {{ $t('forms.buttons.cancel') }}
          </el-button>
          <el-button type="primary" :loading="modal_loading" @click="doTermination()">
            {{ $t('forms.buttons.submit') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </el-card>
</template>
<script>
import moment from 'moment'
import {nextTick} from "vue";

export default {
  name: 'workflowManager',
  data() {
    return {
      searchForm: {
        processDefinitionKey: '',
        processInstanceId: '',
        processBusinessKey: '',
        history: 'false',
        startTime: [],
        orderParam: {
          prop: 'startTime',
          order: 'ascending'
        },
        currPage: 1,
        totalRows: 0,
        pageSize: 10,
        pageSizeArray: [10, 20, 30, 40]
      },
      modal_loading: false,
      deleteModal: false,
      viewModal: false,
      currObj: {},
      diagramData: '',
      deleteReason: '',
      processActivityList: [],
      searchData: [],
      params: []
    }
  },
  computed: {
    tableHeight() {
      const minHeight = 300
      const height = this.$store.state.app.mainHeight - 80 - 92 - 42 - 4
      if (height < minHeight) {
        return minHeight - 2
      } else {
        return height
      }
    },
    infoTypeList() {
      return [
        {value: 'false', label: this.$i18n.t('forms.running')},
        {value: 'true', label: this.$i18n.t('forms.ended')}
      ]
    },
    pickerOptions() {
      return {
        disabledDate: (date) => {
          const now = new Date()
          now.setHours(0, 0, 0, 0)
          return date.getTime() > now.getTime()
        },
        shortcuts: [{
          text: this.$i18n.t('forms.buttons.lastWeek'),
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setHours(0, 0, 0, 0)
            start.setHours(0, 0, 0, 0)
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: this.$i18n.t('forms.buttons.lastMonth'),
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setHours(0, 0, 0, 0)
            start.setHours(0, 0, 0, 0)
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: this.$i18n.t('forms.buttons.lastThreeMonth'),
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setHours(0, 0, 0, 0)
            start.setHours(0, 0, 0, 0)
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    },
    viewDiagram() {
      return this.diagramData
    }
  },
  watch: {
    'searchForm.currPage'() {
      this.handleSearch()
    },
    currObj(processInstance) {
      this.doInitData(processInstance.processInstanceId)
    }
  },
  methods: {
    dateTimeFormat(time) {
      return time ? moment(time).format('YYYY-MM-DD HH:mm:ss') : ''
    },
    statusText(isFinished) {
      return this.infoTypeList.filter((item) => {
        return item.value === isFinished.toString()
      })[0].label
    },
    handlePageSizeSearch(size) {
      this.searchForm.pageSize = size
      this.handleSearch()
    },
    handleSortChange(param) {
      this.searchForm.orderParam.prop = param.prop
      this.searchForm.orderParam.order = param.order
      this.handleSearch()
    },
    handleSearchReset(name) {
      this.$refs[name].resetFields()
    },
    handleSearch() {
      let searchParam = {
        processDefinitionKeys: [],
        processInstanceIds: [],
        processBusinessKey: this.searchForm.processBusinessKey,
        startTime: this.searchForm.startTime && this.searchForm.startTime.length === 2 ? this.searchForm.startTime[0].getTime() : null,
        endTime: this.searchForm.startTime && this.searchForm.startTime.length === 2 ? this.searchForm.startTime[1].getTime() + (24 * 60 * 60 * 1000) : null,
        queryParam: {
          currPage: this.searchForm.currPage,
          pageSize: this.searchForm.pageSize
        }
      }
      if (this.searchForm.processDefinitionKey && this.searchForm.processDefinitionKey !== '') {
        searchParam.processDefinitionKeys.push(this.searchForm.processDefinitionKey)
      }
      if (this.searchForm.processInstanceId && this.searchForm.processInstanceId !== '') {
        searchParam.processInstanceIds.push(this.searchForm.processInstanceId)
      }
      if (this.searchForm.orderParam.order !== 'normal') {
        searchParam.queryParam.orderName = this.searchForm.orderParam.prop
        searchParam.queryParam.orderCommand = this.searchForm.orderParam.order
      }
      this.modal_loading = true
      this.$api.request.workFlow.queryInstance(this.searchForm.history === 'true', searchParam).then((res) => {
        this.modal_loading = false
        if (res) {
          this.searchForm.totalRows = res.data.totalElements
          this.searchData = res.data.content
          nextTick(() => {
            this.$refs['table'].doLayout()
          })
        }
      }).catch(() => {
        this.searchData = []
        this.modal_loading = false
      })
    },
    gotoFlowView(processInstance) {
      this.viewModal = true
      this.currObj = processInstance
    },
    doInitData(processInstanceId) {
      // 获取流程图
      const currObj = this
      this.$api.request.workFlow.diagram(processInstanceId).then((image) => {
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
      // 获取流程处理记录
      this.$api.request.workFlow.getInstanceActivity(processInstanceId).then((res) => {
        if (res) {
          this.processActivityList = res.data
        }
      }).catch(() => {
        this.processActivityList = []
      })
      this.params = []
      Object.keys(this.currObj.params).forEach((item) => {
        const value = this.currObj.params[item]
        this.params.push({
          name: item,
          type: typeof value,
          value: String(value)
        })
      })
    },
    doCancel() {
      this.deleteModal = false
    },
    termination() {
      this.deleteModal = true
    },
    doTermination() {
      if (!this.deleteReason && this.deleteReason === '') {
        this.$message.error(this.$i18n.t('forms.pleaseEnter') + this.$i18n.t('forms.deleteReason'))
        return
      }
      this.$confirm(this.$i18n.t('messages.deleteDataConfirm'), this.$i18n.t('dialog.confirm'), {
        type: 'warning'
      }).then(() => {
        this.modal_loading = true
        this.$api.request.workFlow.termination(this.currObj.processInstanceId, this.deleteReason).then((res) => {
          this.modal_loading = false
          if (res) {
            this.$message.success(this.$i18n.t('messages.requestSuccess') + '')
            this.deleteModal = false
            this.viewModal = false
            this.handleSearch()
          }
        }).catch(() => {
          this.modal_loading = false
        })
      }).catch(() => {
      })
    }
  },
  mounted() {
    this.handleSearch()
  },
  activated() {
    nextTick(() => {
      this.$refs['table'].doLayout()
    })
  }
}
</script>
