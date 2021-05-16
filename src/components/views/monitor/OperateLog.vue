<template>
  <el-card>
    <el-form ref="searchForm" :model="searchForm" label-width="100px" :inline="true" size="mini"
             @submit.native.prevent>
      <el-row>
        <el-col :lg="{span:6}">
          <el-form-item :label="$t('forms.remoteIp')" prop="remoteIp">
            <el-input v-model="searchForm.remoteIp" :disabled="modal_loading"
                      :placeholder="$t('forms.pleaseEnter') + $t('forms.remoteIp')"
                      @keyup.enter.native="handleSearch"/>
          </el-form-item>
        </el-col>
        <el-col :lg="{span:6}">
          <el-form-item :label="$t('forms.path')" prop="path">
            <el-input v-model="searchForm.path" :disabled="modal_loading"
                      :placeholder="$t('forms.pleaseEnter') + $t('forms.path')"
                      @keyup.enter.native="handleSearch"/>
          </el-form-item>
        </el-col>
        <el-col :lg="{span:6}">
          <el-form-item :label="$t('forms.serverId')" prop="serverId">
            <el-input v-model="searchForm.serverId" :disabled="modal_loading"
                      :placeholder="$t('forms.pleaseEnter') + $t('forms.serverId')"
                      @keyup.enter.native="handleSearch"/>
          </el-form-item>
        </el-col>
        <el-col :lg="{span:6}">
          <el-form-item :label="$t('forms.clientName')" prop="clientName">
            <el-input v-model="searchForm.clientName" :disabled="modal_loading"
                      :placeholder="$t('forms.pleaseEnter') + $t('forms.clientName')"
                      @keyup.enter.native="handleSearch"/>
          </el-form-item>
        </el-col>
        <el-col :lg="{span:6}">
          <el-form-item :label="$t('forms.userName')" prop="userName">
            <el-input v-model="searchForm.userName" :disabled="modal_loading"
                      :placeholder="$t('forms.pleaseEnter') + $t('forms.userName')"
                      @keyup.enter.native="handleSearch"/>
          </el-form-item>
        </el-col>
        <el-col :lg="{span:6}">
          <el-form-item :label="$t('forms.responseStatus')" prop="responseStatus">
            <el-input v-model="searchForm.responseStatus" :disabled="modal_loading" type="number"
                      :placeholder="$t('forms.pleaseEnter') + $t('forms.responseStatus')"
                      @keyup.enter.native="handleSearch"/>
          </el-form-item>
        </el-col>
        <el-col :lg="{span:6}">
          <el-form-item :label="$t('forms.infoType')" prop="history">
            <el-select v-model="searchForm.history" :disabled="modal_loading" value=""
                       style="width:100px">
              <el-option v-for="item in infoTypeList" :value="item.value" :label="item.label"
                         :key="'search_select_'+item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lg="{span:12}">
          <el-form-item :label="$t('forms.startDate')" prop="startTime">
            <el-date-picker v-model="searchForm.startTime" :disabled="modal_loading" type="daterange"
                            :shortcuts="pickerShortcuts"/>
          </el-form-item>
        </el-col>
        <el-form-item style="float: right">
          <el-button-group style="margin-right: 20px">
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
              @selection-change="handleSelect" @sort-change="handleSortChange"
              header-cell-class-name="query-table-header">
      <el-table-column
        prop="remoteIp"
        :label="$t('forms.remoteIp')"
        width="130">
      </el-table-column>
      <el-table-column
        prop="userName"
        sortable="custom"
        width="100"
        :label="$t('forms.userName')">
      </el-table-column>
      <el-table-column
        prop="path"
        sortable="custom"
        :label="$t('forms.path')">
      </el-table-column>
      <el-table-column
        prop="serverId"
        sortable="custom"
        :label="$t('forms.serverId')">
      </el-table-column>
      <el-table-column
        prop="clientName"
        sortable="custom"
        :label="$t('forms.clientName')">
      </el-table-column>
      <el-table-column
        prop="identify"
        sortable="custom"
        width="80"
        :label="$t('forms.identify')">
      </el-table-column>
      <el-table-column
        prop="method"
        sortable="custom"
        width="100"
        :label="$t('forms.method')">
      </el-table-column>
      <el-table-column
        prop="requestTime"
        sortable="custom"
        width="150"
        :label="$t('forms.requestTime')">
        <template #default="scope">
          <span>{{ dateTimeFormat(scope.row.requestTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="processTime"
        sortable="custom"
        width="130"
        :label="$t('forms.processTime')+'('+this.$i18n.t('forms.millisecond')+')'">
      </el-table-column>
      <el-table-column
        prop="responseStatus"
        sortable="custom"
        width="110"
        :label="$t('forms.responseStatus')">
        <template #default="scope">
          <span
            :style="{color:scope.row.responseStatus>=200&&scope.row.responseStatus<300 ? 'green':'red'}">{{
              scope.row.responseStatus
            }}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        prop="action"
        :label="$t('forms.action')"
        align="center"
        width="50">
        <template #default="scope">
          <el-tooltip :content="$t('forms.buttons.view')" placement="top-start">
            <el-button type="text" @click="handleView(scope.row)">
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
    <el-dialog v-model="editModal" :title="$t('forms.info')" width="600px">
      <el-form ref="editForm" size="mini" :model="editForm" label-width="100px" :inline="true"
               v-loading="modal_loading" @submit.native.prevent>
        <el-form-item :label="$t('forms.remoteIp')+':'" prop="remoteIp">
          <span>{{ editForm.remoteIp }}</span>
        </el-form-item>
        <el-form-item :label="$t('forms.gatewayIp')+':'" prop="gatewayIp">
          <span>{{ editForm.gatewayIp }}</span>
        </el-form-item>
        <el-form-item :label="$t('forms.serverId')+':'" prop="serverId">
          <span>{{ editForm.serverId }}</span>
        </el-form-item>
        <el-form-item :label="$t('forms.responseStatus')+':'" prop="responseStatus">
          <span
            :style="{color:editForm.responseStatus>=200&&editForm.responseStatus<300 ? 'green':'red'}">{{
              editForm.responseStatus
            }}</span>
        </el-form-item>
        <el-form-item :label="$t('forms.path')+':'" prop="path" style="width: 100%">
          <span>{{ editForm.path }}</span>
        </el-form-item>
        <el-form-item :label="$t('forms.targetUri')+':'" prop="targetUri" style="width: 100%">
          <span>{{ editForm.targetUri }}</span>
        </el-form-item>
        <el-form-item :label="$t('forms.targetPath')+':'" prop="targetPath" style="width: 100%">
          <span>{{ editForm.targetPath }}</span>
        </el-form-item>
        <el-form-item :label="$t('forms.method')+':'" prop="method" style="width: 100%">
          <span>{{ editForm.method }}</span>
        </el-form-item>
        <el-form-item :label="$t('forms.token')+':'" prop="token" style="width: 100%">
          <span>{{ editForm.token }}</span>
        </el-form-item>
        <el-form-item :label="$t('forms.clientName')+':'" prop="clientName" style="width: 100%">
          <span>{{ editForm.clientName }}</span>
        </el-form-item>
        <el-form-item :label="$t('forms.identify')+':'" prop="identify" style="width: 100%">
          <span>{{ editForm.identify }}</span>
        </el-form-item>
        <el-form-item :label="$t('forms.userName')+':'" prop="userName" style="width: 100%">
          <span>{{ editForm.userName }}</span>
        </el-form-item>
        <el-form-item :label="$t('forms.requestTime')+':'" prop="requestTime" style="width: 100%">
          <span>{{ dateTimeMisFormat(editForm.requestTime) }}</span>
        </el-form-item>
        <el-form-item :label="$t('forms.processTime')+':'" prop="processTime" style="width: 100%">
          <span>{{ editForm.processTime }} {{ $t('forms.millisecond') }}</span>
        </el-form-item>
        <el-form-item :label="$t('forms.responseTime')+':'" prop="responseTime" style="width: 100%">
          <span>{{ dateTimeMisFormat(editForm.responseTime) }}</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="text-align: center">
          <el-button type="info" :loading="modal_loading" @click="doCancel()">
            {{ $t('forms.buttons.cancel') }}
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
  name: 'operateLog',
  data() {
    return {
      datePickerOptions: {
        disabledDate: (date) => {
          const now = new Date()
          now.setHours(0, 0, 0, 0)
          return date.getTime() > now.getTime()
        }
      },
      searchForm: {
        remoteIp: '',
        path: '',
        serverId: '',
        clientName: '',
        userName: '',
        history: 'false',
        startTime: [],
        responseStatus: '',
        orderParam: {
          prop: 'requestTime',
          order: 'descending'
        },
        currPage: 1,
        totalRows: 0,
        pageSize: 10,
        pageSizeArray: [10, 20, 30, 40]
      },
      editForm: {},
      editModal: false,
      modal_loading: false,
      searchData: [],
      selectedData: []
    }
  },
  computed: {
    tableHeight() {
      const minHeight = 300
      const height = this.$store.state.app.mainHeight - 80 - 140 - 42 - 4
      if (height < minHeight) {
        return minHeight - 2
      } else {
        return height
      }
    },
    infoTypeList() {
      return [
        {value: 'false', label: this.$i18n.t('forms.currentInfo')},
        {value: 'true', label: this.$i18n.t('forms.historyInfo')}
      ]
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
    dateTimeMisFormat(time) {
      return time ? moment(time).format('YYYY-MM-DD HH:mm:ss.SSS') : ''
    },
    doCancel() {
      this.editModal = false
    },
    handlePageSizeSearch(size) {
      this.searchForm.pageSize = size
      this.handleSearch()
    },
    handleSearch() {
      let searchParam = {
        remoteIp: this.searchForm.remoteIp,
        path: this.searchForm.path,
        serverId: this.searchForm.serverId,
        clientName: this.searchForm.clientName,
        userName: this.searchForm.userName,
        history: this.searchForm.history === 'true',
        startTime: this.searchForm.startTime && this.searchForm.startTime.length === 2 ? this.searchForm.startTime[0].getTime() : null,
        endTime: this.searchForm.startTime && this.searchForm.startTime.length === 2 ? this.searchForm.startTime[1].getTime() : null,
        responseStatus: this.searchForm.responseStatus !== '' ? parseInt(this.searchForm.responseStatus) : null,
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
      this.$api.request.log.queryOperateLog(searchParam).then((res) => {
        this.modal_loading = false
        if (res) {
          this.selectedData = []
          this.searchForm.totalRows = res.data.totalElements
          this.searchData = res.data.content
          nextTick(() => {
            this.$refs['table'].doLayout()
          })
        }
      }).catch(() => {
        this.searchData = []
        this.selectedData = []
        this.modal_loading = false
      })
    },
    handleSortChange(param) {
      this.searchForm.orderParam.prop = param.prop
      this.searchForm.orderParam.order = param.order
      this.handleSearch()
    },
    handleSearchReset(name) {
      this.$refs[name].resetFields()
    },
    handleSelect(selection) {
      this.selectedData = selection
    },
    handleView(row) {
      this.editForm = row
      this.editModal = true
    }
  },
  activated() {
    this.handleSearch()
    nextTick(() => {
      this.$refs['table'].doLayout()
    })
  }
}
</script>
