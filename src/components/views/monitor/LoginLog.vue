<template>
  <el-card>
    <el-form ref="searchForm" :inline="true" :model="searchFormModel" label-width="undefined" size="small"
             @submit.native.prevent>
      <el-form-item :label="$t('forms.remoteIp')" prop="remoteIp">
        <el-input v-model="searchFormModel.remoteIp" :disabled="modal_loading"
                  :placeholder="$t('forms.pleaseEnter') + $t('forms.remoteIp')"
                  @keyup.enter.native="handleSearch"/>
      </el-form-item>
      <el-form-item :label="$t('forms.clientName')" prop="clientName">
        <el-input v-model="searchFormModel.clientName" :disabled="modal_loading"
                  :placeholder="$t('forms.pleaseEnter') + $t('forms.clientName')"
                  @keyup.enter.native="handleSearch"/>
      </el-form-item>
      <el-form-item :label="$t('forms.userName')" prop="userName">
        <el-input v-model="searchFormModel.userName" :disabled="modal_loading"
                  :placeholder="$t('forms.pleaseEnter') + $t('forms.userName')"
                  @keyup.enter.native="handleSearch"/>
      </el-form-item>
      <el-form-item :label="$t('forms.infoType')" prop="history">
        <el-select v-model="searchFormModel.history" :disabled="modal_loading" value="">
          <el-option v-for="item in infoTypeList" :key="'search_select_'+item.value" :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('forms.startDate')" prop="startTime">
        <el-date-picker v-if="!isMobile" v-model="searchFormModel.startTime" :disabled="modal_loading" :shortcuts="pickerShortcuts"
                        type="daterange"/>
        <div v-else>
          <el-date-picker v-model="searchFormModel.startTime[0]" :disabled="modal_loading" type="date"/>
          至
          <el-date-picker v-model="searchFormModel.startTime[1]" :disabled="modal_loading" type="date"/>
        </div>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button-group style="margin-right: 20px">
          <el-button :loading="modal_loading" type="primary" @click="handleSearch">
            {{ $t('forms.buttons.search') }}
          </el-button>
          <el-button :loading="modal_loading" type="primary" @click="handleSearchReset">
            {{ $t('forms.buttons.reset') }}
          </el-button>
        </el-button-group>
      </el-form-item>
    </el-form>
    <el-table ref="table" v-loading="modal_loading" :data="searchData" :default-sort="searchFormModel.orderParam" :empty-text="$t('messages.tableNoData')"
              :height="tableHeight"
              border header-cell-class-name="query-table-header"
              size="small" @selection-change="handleSelect"
              @sort-change="handleSortChange">
      <el-table-column
        :label="$t('forms.remoteIp')"
        prop="remoteIp"
        width="130">
      </el-table-column>
      <el-table-column
        :label="$t('forms.loginNo')"
        prop="loginNo"
        sortable="custom"
        width="100">
      </el-table-column>
      <el-table-column
        :label="$t('forms.userName')"
        prop="userName"
        sortable="custom"
        width="100">
      </el-table-column>
      <el-table-column
        :label="$t('forms.clientName')"
        prop="clientName"
        sortable="custom">
      </el-table-column>
      <el-table-column
        :label="$t('forms.clientId')"
        prop="clientId"
        sortable="custom">
      </el-table-column>
      <el-table-column
        :label="$t('forms.identify')"
        prop="identify"
        sortable="custom"
        width="80">
      </el-table-column>
      <el-table-column
        :label="$t('forms.requestTime')"
        prop="requestTime"
        sortable="custom"
        width="150">
        <template #default="scope">
          <span>{{ dateTimeFormat(scope.row.requestTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('forms.processTime')+'('+this.$i18n.t('forms.millisecond')+')'"
        prop="processTime"
        sortable="custom"
        width="130">
      </el-table-column>
      <el-table-column
        :fixed="isMobile?false:'right'"
        :label="$t('forms.action')"
        align="center"
        prop="action"
        width="50">
        <template #default="scope">
          <el-button icon="el-icon-search" type="text"
                     @click="handleView(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="searchFormModel.currPage"
                   v-model:page-size="searchFormModel.pageSize"
                   :layout="isMobile?'prev, pager, next':'total, sizes, prev, pager, next, jumper'"
                   :page-sizes="searchFormModel.pageSizeArray"
                   :small="isMobile" :total="searchFormModel.totalRows"
                   @size-change="handlePageSizeSearch">
    </el-pagination>
    <el-dialog v-model="editModal" :fullscreen="isMobile" :title="$t('forms.info')" width="600px">
      <el-descriptions :column="2" border size="small">
        <el-descriptions-item :label="$t('forms.remoteIp')" label-align="right">
          <span>{{ editForm.remoteIp }}</span>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('forms.gatewayIp')" label-align="right">
          <span>{{ editForm.gatewayIp }}</span>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('forms.serverId')" label-align="right">
          <span>{{ editForm.serverId }}</span>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('forms.responseStatus')" label-align="right">
          <span
            :style="{color:editForm.responseStatus>=200&&editForm.responseStatus<300 ? 'green':'red'}">{{
              editForm.responseStatus
            }}</span>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('forms.path') " label-align="right" span="2">
          <span>{{ editForm.path }}</span>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('forms.targetUri')" label-align="right" span="2">
          <span>{{ editForm.targetUri }}</span>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('forms.targetPath')" label-align="right" span="2">
          <span>{{ editForm.targetPath }}</span>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('forms.method')" label-align="right" span="2">
          <span>{{ editForm.method }}</span>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('forms.token')" label-align="right" span="2">
          <span>{{ editForm.token }}</span>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('forms.clientName')" label-align="right" span="2">
          <span>{{ editForm.clientName }}</span>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('forms.identify')" label-align="right" span="2">
          <span>{{ editForm.identify }}</span>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('forms.userName')" label-align="right" span="2">
          <span>{{ editForm.userName }}</span>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('forms.requestTime')" label-align="right" span="2">
          <span>{{ dateTimeMisFormat(editForm.requestTime) }}</span>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('forms.processTime')" label-align="right" span="2">
          <span>{{ editForm.processTime }} {{ $t('forms.millisecond') }}</span>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('forms.responseTime')" label-align="right" span="2">
          <span>{{ dateTimeMisFormat(editForm.responseTime) }}</span>
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <div style="text-align: center">
          <el-button :loading="modal_loading" type="info" @click="doCancel()">
            {{ $t('forms.buttons.cancel') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </el-card>
</template>
<script>
import moment from 'moment'
import {nextTick, ref} from "vue";
import {isMobileDevice} from "@/libs/tools";

export default {
  name: 'loginLog',
  data() {
    return {
      datePickerOptions: {
        disabledDate: (date) => {
          const now = new Date()
          now.setHours(0, 0, 0, 0)
          return date.getTime() > now.getTime()
        }
      },
      searchFormModel: {
        remoteIp: '',
        clientName: '',
        userName: '',
        history: 'false',
        startTime: [],
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
    isMobile() {
      return isMobileDevice()
    },
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
    'searchFormModel.currPage'() {
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
      this.searchFormModel.pageSize = size
      this.handleSearch()
    },
    handleSearch() {
      let searchParam = {
        remoteIp: this.searchFormModel.remoteIp,
        path: this.searchFormModel.path,
        serverId: this.searchFormModel.serverId,
        clientName: this.searchFormModel.clientName,
        userName: this.searchFormModel.userName,
        history: this.searchFormModel.history === 'true',
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
      this.$api.request.log.queryLoginLog(searchParam).then((res) => {
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
    handleSortChange(param) {
      this.searchFormModel.orderParam.prop = param.prop
      this.searchFormModel.orderParam.order = param.order
      this.handleSearch()
    },
    handleSearchReset() {
      this.searchFormModel.resetFields()
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
      this.table.doLayout()
    })
  },
  setup() {
    const searchForm = ref(null)
    const table = ref(null)
    return {searchForm, table}
  }
}
</script>
