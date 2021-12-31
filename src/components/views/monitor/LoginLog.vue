<template>
  <el-card>
    <el-form ref="searchForm" :model="searchForm" label-width="auto" :inline="true" size="small"
             @submit.native.prevent>
      <el-form-item :label="$t('forms.remoteIp')" prop="remoteIp">
        <el-input v-model="searchForm.remoteIp" :disabled="modal_loading"
                  :placeholder="$t('forms.pleaseEnter') + $t('forms.remoteIp')"
                  @keyup.enter.native="handleSearch"/>
      </el-form-item>
      <el-form-item :label="$t('forms.clientName')" prop="clientName">
        <el-input v-model="searchForm.clientName" :disabled="modal_loading"
                  :placeholder="$t('forms.pleaseEnter') + $t('forms.clientName')"
                  @keyup.enter.native="handleSearch"/>
      </el-form-item>
      <el-form-item :label="$t('forms.userName')" prop="userName">
        <el-input v-model="searchForm.userName" :disabled="modal_loading"
                  :placeholder="$t('forms.pleaseEnter') + $t('forms.userName')"
                  @keyup.enter.native="handleSearch"/>
      </el-form-item>
      <el-form-item :label="$t('forms.infoType')" prop="history">
        <el-select v-model="searchForm.history" :disabled="modal_loading" value=""
                   style="width:100px">
          <el-option v-for="item in infoTypeList" :value="item.value" :label="item.label"
                     :key="'search_select_'+item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('forms.startDate')" prop="startTime">
        <el-date-picker v-model="searchForm.startTime" :disabled="modal_loading" type="daterange"
                        :shortcuts="pickerShortcuts" :class="{mobile:isMobile}"/>
      </el-form-item>
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
    </el-form>
    <el-table ref="table" border :height="tableHeight" size="small" :default-sort="searchForm.orderParam"
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
        prop="loginNo"
        sortable="custom"
        width="100"
        :label="$t('forms.loginNo')">
      </el-table-column>
      <el-table-column
        prop="userName"
        sortable="custom"
        width="100"
        :label="$t('forms.userName')">
      </el-table-column>
      <el-table-column
        prop="clientName"
        sortable="custom"
        :label="$t('forms.clientName')">
      </el-table-column>
      <el-table-column
        prop="clientId"
        sortable="custom"
        :label="$t('forms.clientId')">
      </el-table-column>
      <el-table-column
        prop="identify"
        sortable="custom"
        width="80"
        :label="$t('forms.identify')">
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
        :fixed="isMobile?false:'right'"
        prop="action"
        :label="$t('forms.action')"
        align="center"
        width="50">
        <template #default="scope">
          <el-button type="text" @click="handleView(scope.row)"
                     icon="el-icon-search"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handlePageSizeSearch"
                   v-model:current-page="searchForm.currPage"
                   :page-sizes="searchForm.pageSizeArray"
                   v-model:page-size="searchForm.pageSize"
                   :layout="isMobile?'prev, pager, next':'total, sizes, prev, pager, next, jumper'" :small="isMobile"
                   :total="searchForm.totalRows">
    </el-pagination>
    <el-dialog :fullscreen="isMobile" v-model="editModal" :title="$t('forms.info')" width="600px">
      <el-descriptions :column="2" size="small" border>
        <el-descriptions-item label-align="right" :label="$t('forms.remoteIp')">
          <span>{{ editForm.remoteIp }}</span>
        </el-descriptions-item>
        <el-descriptions-item label-align="right" :label="$t('forms.gatewayIp')">
          <span>{{ editForm.gatewayIp }}</span>
        </el-descriptions-item>
        <el-descriptions-item label-align="right" :label="$t('forms.serverId')">
          <span>{{ editForm.serverId }}</span>
        </el-descriptions-item>
        <el-descriptions-item label-align="right" :label="$t('forms.responseStatus')">
          <span
            :style="{color:editForm.responseStatus>=200&&editForm.responseStatus<300 ? 'green':'red'}">{{
              editForm.responseStatus
            }}</span>
        </el-descriptions-item>
        <el-descriptions-item label-align="right" :label="$t('forms.path') " span="2">
          <span>{{ editForm.path }}</span>
        </el-descriptions-item>
        <el-descriptions-item label-align="right" :label="$t('forms.targetUri')" span="2">
          <span>{{ editForm.targetUri }}</span>
        </el-descriptions-item>
        <el-descriptions-item label-align="right" :label="$t('forms.targetPath')" span="2">
          <span>{{ editForm.targetPath }}</span>
        </el-descriptions-item>
        <el-descriptions-item label-align="right" :label="$t('forms.method')" span="2">
          <span>{{ editForm.method }}</span>
        </el-descriptions-item>
        <el-descriptions-item label-align="right" :label="$t('forms.token')" span="2">
          <span>{{ editForm.token }}</span>
        </el-descriptions-item>
        <el-descriptions-item label-align="right" :label="$t('forms.clientName')" span="2">
          <span>{{ editForm.clientName }}</span>
        </el-descriptions-item>
        <el-descriptions-item label-align="right" :label="$t('forms.identify')" span="2">
          <span>{{ editForm.identify }}</span>
        </el-descriptions-item>
        <el-descriptions-item label-align="right" :label="$t('forms.userName')" span="2">
          <span>{{ editForm.userName }}</span>
        </el-descriptions-item>
        <el-descriptions-item label-align="right" :label="$t('forms.requestTime')" span="2">
          <span>{{ dateTimeMisFormat(editForm.requestTime) }}</span>
        </el-descriptions-item>
        <el-descriptions-item label-align="right" :label="$t('forms.processTime')" span="2">
          <span>{{ editForm.processTime }} {{ $t('forms.millisecond') }}</span>
        </el-descriptions-item>
        <el-descriptions-item label-align="right" :label="$t('forms.responseTime')" span="2">
          <span>{{ dateTimeMisFormat(editForm.responseTime) }}</span>
        </el-descriptions-item>
      </el-descriptions>
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
import {isMobile} from "@/libs/tools";

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
      searchForm: {
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
      return isMobile()
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
      this.$api.request.log.queryLoginLog(searchParam).then((res) => {
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
