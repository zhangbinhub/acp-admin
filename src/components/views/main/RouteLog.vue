<template>
  <el-card>
    <el-form ref="searchForm" :model="searchForm" label-width="100px" :inline="true" size="mini"
             onsubmit="return false;">
      <el-form-item :label="$t('forms.remoteIp')" prop="remoteIp">
        <el-input v-model="searchForm.remoteIp" :disabled="modal_loading"
                  :placeholder="$t('forms.pleaseEnter') + $t('forms.remoteIp')"
                  @keyup.enter.native="handleSearch"></el-input>
      </el-form-item>
      <el-form-item :label="$t('forms.gatewayIp')" prop="gatewayIp">
        <el-input v-model="searchForm.gatewayIp" :disabled="modal_loading"
                  :placeholder="$t('forms.pleaseEnter') + $t('forms.gatewayIp')"
                  @keyup.enter.native="handleSearch"></el-input>
      </el-form-item>
      <el-form-item :label="$t('forms.path')" prop="path">
        <el-input v-model="searchForm.path" :disabled="modal_loading"
                  :placeholder="$t('forms.pleaseEnter') + $t('forms.path')"
                  @keyup.enter.native="handleSearch"></el-input>
      </el-form-item>
      <el-form-item :label="$t('forms.serverId')" prop="serverId">
        <el-input v-model="searchForm.serverId" :disabled="modal_loading"
                  :placeholder="$t('forms.pleaseEnter') + $t('forms.serverId')"
                  @keyup.enter.native="handleSearch"></el-input>
      </el-form-item>
      <el-form-item :label="$t('forms.responseStatus')" prop="responseStatus">
        <el-input v-model="searchForm.responseStatus" :disabled="modal_loading" type="number"
                  :placeholder="$t('forms.pleaseEnter') + $t('forms.responseStatus')"
                  @keyup.enter.native="handleSearch"></el-input>
      </el-form-item>
      <el-form-item :label="$t('forms.startDate')" prop="startTime">
        <el-date-picker type="date" :disabled="modal_loading" :picker-options="datePickerOptions"
                        v-model="searchForm.startTime"
                        :placeholder="$t('forms.pleaseEnter') + $t('forms.startDate')"
                        style="width: 185px"></el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('forms.endDate')" prop="endTime">
        <el-date-picker type="date" :disabled="modal_loading" :picker-options="datePickerOptions"
                        v-model="searchForm.endTime"
                        :placeholder="$t('forms.pleaseEnter') + $t('forms.endDate')"
                        style="width: 185px"></el-date-picker>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button-group style="margin-right: 20px">
          <el-button :loading="modal_loading" @click="handleSearch()" type="primary">
            {{$t('forms.buttons.search')}}
          </el-button>
          <el-button :loading="modal_loading" @click="handleSearchReset('searchForm')" type="primary">
            {{$t('forms.buttons.reset')}}
          </el-button>
        </el-button-group>
      </el-form-item>
    </el-form>
    <el-table ref="table" border height="388" size="mini" :default-sort="searchForm.orderParam" :data="searchData"
              v-loading="modal_loading" :empty-text="$t('messages.tableNoData')"
              @selection-change="handleSelect" @sort-change="handleSortChange"
              header-cell-class-name="query-table-header">
      <el-table-column
        prop="remoteIp"
        :label="this.$i18n.t('forms.remoteIp')"
        width="130">
      </el-table-column>
      <el-table-column
        prop="gatewayIp"
        :label="this.$i18n.t('forms.gatewayIp')"
        width="130">
      </el-table-column>
      <el-table-column
        prop="path"
        sortable="custom"
        :label="this.$i18n.t('forms.path')">
      </el-table-column>
      <el-table-column
        prop="serverId"
        sortable="custom"
        :label="this.$i18n.t('forms.serverId')">
      </el-table-column>
      <el-table-column
        prop="targetUri"
        sortable="custom"
        :label="this.$i18n.t('forms.targetUri')">
      </el-table-column>
      <el-table-column
        prop="requestTime"
        sortable="custom"
        width="150"
        :label="this.$i18n.t('forms.requestTime')">
      </el-table-column>
      <el-table-column
        prop="processTime"
        sortable="custom"
        width="150"
        :label="this.$i18n.t('forms.processTime')+' '+this.$i18n.t('forms.millisecond')">
      </el-table-column>
      <el-table-column
        prop="responseStatus"
        sortable="custom"
        width="150"
        :label="this.$i18n.t('forms.responseStatus')">
        <template slot-scope="scope">
          <span :style="scope.row.responseStatus>=200&&scope.row.responseStatus<300 ? 'color:green':'color:red'">{{scope.row.responseStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="action"
        :label="this.$i18n.t('forms.action')"
        align="center"
        width="50">
        <template slot-scope="scope">
          <el-tooltip :content="$t('forms.buttons.view')" placement="top-start">
            <el-button type="text" @click="handleView(scope.row)">
              <i style="font-size: 15px" class="el-icon-search"></i>
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
    <el-dialog :visible.sync="editModal" :title="$t('forms.info')" :close-on-click-modal="false">
      <el-form ref="editForm" size="mini" :model="editForm" label-width="100px" style="padding-right: 25px;"
               v-loading="modal_loading" onsubmit="return false;">
        <el-row>
          <el-form-item :label="$t('forms.remoteIp')" prop="remoteIp">
            <el-alert type="info" :closable="false">{{editForm.remoteIp}}</el-alert>
          </el-form-item>
          <el-form-item :label="$t('forms.gatewayIp')" prop="gatewayIp">
            <el-alert type="info" :closable="false">{{editForm.gatewayIp}}</el-alert>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="$t('forms.serverId')" prop="serverId">
            <el-alert type="info" :closable="false">{{editForm.serverId}}</el-alert>
          </el-form-item>
          <el-form-item :label="$t('forms.responseStatus')" prop="responseStatus">
            <el-alert :type="editForm.responseStatus>=200&&editForm.responseStatus<300?'success':'error'"
                      :closable="false">
              {{editForm.responseStatus}}
            </el-alert>
          </el-form-item>
        </el-row>
        <el-form-item :label="$t('forms.path')" prop="path" style="width: 100%">
          <el-alert type="info" :closable="false">{{editForm.path}}</el-alert>
        </el-form-item>
        <el-form-item :label="$t('forms.targetUri')" prop="targetUri" style="width: 100%">
          <el-alert type="info" :closable="false">{{editForm.targetUri}}</el-alert>
        </el-form-item>
        <el-form-item :label="$t('forms.requestTime')" prop="requestTime" style="width: 100%">
          <el-alert type="info" :closable="false">{{formatDate(editForm.requestTime)}}</el-alert>
        </el-form-item>
        <el-form-item :label="$t('forms.processTime')" prop="processTime" style="width: 100%">
          <el-alert type="info" :closable="false">{{editForm.processTime}} {{$t('forms.millisecond')}}</el-alert>
        </el-form-item>
        <el-form-item :label="$t('forms.responseTime')" prop="responseTime" style="width: 100%">
          <el-alert type="info" :closable="false">{{formatDate(editForm.responseTime)}}</el-alert>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center">
        <el-button type="info" :loading="modal_loading" @click="doCancel()">
          {{$t('forms.buttons.cancel')}}
        </el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
    export default {
        name: 'routeLog',
        data () {
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
                    gatewayIp: '',
                    path: '',
                    serverId: '',
                    startTime: '',
                    endTime: '',
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
                editForm: {
                    id: '',
                    remoteIp: '',
                    gatewayIp: '',
                    path: '',
                    serverId: '',
                    targetUri: '',
                    requestTime: 0,
                    processTime: 0,
                    responseTime: 0,
                    responseStatus: 0
                },
                editModal: false,
                modal_loading: false,
                searchData: [],
                selectedData: [],
                action: 0
            }
        },
        methods: {
            formatDate: function (value) {
                let date = new Date(value)
                let y = date.getFullYear()
                let MM = date.getMonth() + 1
                MM = MM < 10 ? ('0' + MM) : MM
                let d = date.getDate()
                d = d < 10 ? ('0' + d) : d
                let h = date.getHours()
                h = h < 10 ? ('0' + h) : h
                let m = date.getMinutes()
                m = m < 10 ? ('0' + m) : m
                let s = date.getSeconds()
                s = s < 10 ? ('0' + s) : s
                return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
            },
            doCancel () {
                this.editModal = false
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
                    remoteIp: this.searchForm.remoteIp,
                    gatewayIp: this.searchForm.gatewayIp,
                    path: this.searchForm.path,
                    serverId: this.searchForm.serverId,
                    startTime: this.searchForm.startTime !== '' ? this.searchForm.startTime.getTime() : null,
                    endTime: this.searchForm.endTime !== '' ? this.searchForm.endTime.getTime() : null,
                    responseStatus: this.searchForm.responseStatus !== '' ? parseInt(this.searchForm.responseStatus) : null,
                    queryParam: {
                        currPage: this.searchForm.currPage,
                        pageSize: this.searchForm.pageSize
                    }
                }
                if (this.searchForm.orderParam.order !== 'normal') {
                    searchParam.queryParam.orderName = this.searchForm.orderParam.prop
                    searchParam.queryParam.orderCommond = this.searchForm.orderParam.order
                }
                this.modal_loading = true
                this.$api.request.route.queryLog(searchParam).then((res) => {
                    this.modal_loading = false
                    if (res) {
                        this.selectedData = []
                        this.searchForm.currPage = res.data.pageable.pageNumber + 1
                        this.searchForm.totalRows = res.data.totalElements
                        this.searchData = res.data.content.map(item => {
                            if (item.enabled) {
                                item._disabled = true
                            }
                            return item
                        })
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
            handleSearchKeyUp (event) {
                if (event.which === 13) {
                    this.handleSearch()
                }
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
            handleView (row) {
                this.editForm.remoteIp = row.remoteIp
                this.editForm.gatewayIp = row.gatewayIp
                this.editForm.path = row.path
                this.editForm.serverId = row.serverId
                this.editForm.targetUri = row.targetUri
                this.editForm.requestTime = row.requestTime
                this.editForm.processTime = row.processTime
                this.editForm.responseTime = row.responseTime
                this.editForm.responseStatus = row.responseStatus
                this.editModal = true
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
