<template>
  <Card>
    <Form ref="searchForm" :model="searchForm" :label-width="100" :inline="true" class="search-form"
          onsubmit="return false;">
      <Row>
        <Form-item :label="$t('forms.remoteIp')" prop="remoteIp">
          <label>
            <Input v-model="searchForm.remoteIp" :disabled="modal_loading" size="small"
                   :placeholder="$t('forms.pleaseEnter') + $t('forms.remoteIp')"
                   @on-enter="handleSearch"></Input>
          </label>
        </Form-item>
        <Form-item :label="$t('forms.gatewayIp')" prop="gatewayIp">
          <label>
            <Input v-model="searchForm.gatewayIp" :disabled="modal_loading" size="small"
                   :placeholder="$t('forms.pleaseEnter') + $t('forms.gatewayIp')"
                   @on-enter="handleSearch"></Input>
          </label>
        </Form-item>
        <Form-item :label="$t('forms.path')" prop="path">
          <label>
            <Input v-model="searchForm.path" :disabled="modal_loading" size="small"
                   :placeholder="$t('forms.pleaseEnter') + $t('forms.path')"
                   @on-enter="handleSearch"></Input>
          </label>
        </Form-item>
        <Form-item :label="$t('forms.serverId')" prop="serverId">
          <label>
            <Input v-model="searchForm.serverId" :disabled="modal_loading" size="small"
                   :placeholder="$t('forms.pleaseEnter') + $t('forms.serverId')"
                   @on-enter="handleSearch"></Input>
          </label>
        </Form-item>
      </Row>
      <Row>
        <Form-item :label="$t('forms.responseStatus')" prop="responseStatus">
          <label>
            <Input v-model="searchForm.responseStatus" :disabled="modal_loading" size="small" type="number"
                   :placeholder="$t('forms.pleaseEnter') + $t('forms.responseStatus')"
                   @on-enter="handleSearch"></Input>
          </label>
        </Form-item>
        <Form-item :label="$t('forms.startDate')" prop="startTime">
          <DatePicker type="date" :disabled="modal_loading" :options="datePickerOptions" size="small"
                      v-model="searchForm.startTime"
                      :placeholder="$t('forms.pleaseEnter') + $t('forms.startDate')"
                      style="width: 162px" @keyup.enter.native="handleSearch"></DatePicker>
        </Form-item>
        <Form-item :label="$t('forms.endDate')" prop="endTime">
          <DatePicker type="date" :disabled="modal_loading" :options="datePickerOptions" size="small"
                      v-model="searchForm.endTime"
                      :placeholder="$t('forms.pleaseEnter') + $t('forms.endDate')"
                      style="width: 162px" @keyup.enter.native="handleSearch"></DatePicker>
        </Form-item>
        <Form-item style="float: right">
          <ButtonGroup style="margin-right: 20px">
            <Button :loading="modal_loading" @click="handleSearch()" type="info" size="small">
              {{$t('forms.buttons.search')}}
            </Button>
            <Button :loading="modal_loading" @click="handleSearchReset('searchForm')" type="info" size="small">
              {{$t('forms.buttons.reset')}}
            </Button>
          </ButtonGroup>
        </Form-item>
      </Row>
    </Form>
    <Table border="" height="388" size="small" :columns="columns" :data="searchData" class="search-table"
           :loading="modal_loading" :no-data-text="$t('messages.tableNoData')" @on-row-dblclick="handleView"
           @on-selection-change="handleSelect" @on-sort-change="handleSortChange">
      <template slot-scope="{ row }" slot="remoteIp">
        <span>{{ row.remoteIp }}</span>
      </template>
      <template slot-scope="{ row }" slot="gatewayIp">
        <span>{{ row.gatewayIp }}</span>
      </template>
      <template slot-scope="{ row }" slot="path">
        <span>{{ row.path }}</span>
      </template>
      <template slot-scope="{ row }" slot="serverId">
        <span>{{ row.serverId }}</span>
      </template>
      <template slot-scope="{ row }" slot="targetUri">
        <span>{{ row.targetUri }}</span>
      </template>
      <template slot-scope="{ row }" slot="requestTime">
        <span>{{formatDate(row.requestTime)}}</span>
      </template>
      <template slot-scope="{ row }" slot="processTime">
        <span>{{row.processTime}} {{$t('forms.millisecond')}}</span>
      </template>
      <template slot-scope="{ row }" slot="responseStatus">
        <span :style="row.responseStatus>=200&&row.responseStatus<300 ? 'color:green':'color:red'">{{row.responseStatus}}</span>
      </template>
      <template slot-scope="{ row }" slot="action">
        <Tooltip :content="$t('forms.buttons.view')" placement="top-start">
          <Icon @click="handleView(row)" type="md-search" size="18" style="cursor: pointer;"></Icon>
        </Tooltip>
      </template>
    </Table>
    <div style="margin-top: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :current="searchForm.currPage" :total="searchForm.totalRows" :page-size="searchForm.pageSize"
              :page-size-opts="searchForm.pageSizeArray" :show-total="true" :show-elevator="true" :show-sizer="true"
              size="small" @on-change="handlePageSearch" @on-page-size-change="handlePageSizeSearch"/>
      </div>
    </div>
    <Modal v-model="editModal" :title="$t('forms.info')" :loading="modal_loading" :mask-closable="false">
      <Form ref="editForm" :model="editForm" :label-width="80" :inline="true" style="padding-right: 25px;">
        <Row>
          <Form-item :label="$t('forms.remoteIp')" prop="remoteIp">
            <Alert>{{editForm.remoteIp}}</Alert>
          </Form-item>
          <Form-item :label="$t('forms.gatewayIp')" prop="gatewayIp">
            <Alert>{{editForm.gatewayIp}}</Alert>
          </Form-item>
        </Row>
        <Row>
          <Form-item :label="$t('forms.serverId')" prop="serverId">
            <Alert>{{editForm.serverId}}</Alert>
          </Form-item>
          <Form-item :label="$t('forms.responseStatus')" prop="responseStatus">
            <Alert :type="editForm.responseStatus>=200&&editForm.responseStatus<300?'success':'error'">
              {{editForm.responseStatus}}
            </Alert>
          </Form-item>
        </Row>
        <Form-item :label="$t('forms.path')" prop="path" style="width: 100%">
          <Alert>{{editForm.path}}</Alert>
        </Form-item>
        <Form-item :label="$t('forms.targetUri')" prop="targetUri" style="width: 100%">
          <Alert>{{editForm.targetUri}}</Alert>
        </Form-item>
        <Form-item :label="$t('forms.requestTime')" prop="requestTime" style="width: 100%">
          <Alert>{{formatDate(editForm.requestTime)}}</Alert>
        </Form-item>
        <Form-item :label="$t('forms.processTime')" prop="processTime" style="width: 100%">
          <Alert>{{editForm.processTime}} {{$t('forms.millisecond')}}</Alert>
        </Form-item>
        <Form-item :label="$t('forms.responseTime')" prop="responseTime" style="width: 100%">
          <Alert>{{formatDate(editForm.responseTime)}}</Alert>
        </Form-item>
      </Form>
      <div slot="footer" style="text-align: center">
        <Button type="default" :loading="modal_loading" @click="doCancel()">
          {{$t('forms.buttons.cancel')}}
        </Button>
      </div>
    </Modal>
  </Card>
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
                        return date.getTime() >= now.getTime()
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
                        key: 'requestTime',
                        order: 'desc'
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
        computed: {
            columns () {
                const columns = [
                    {
                        key: 'remoteIp',
                        title: this.$i18n.t('forms.remoteIp'),
                        width: 130,
                        slot: 'remoteIp'
                    },
                    {
                        key: 'gatewayIp',
                        title: this.$i18n.t('forms.gatewayIp'),
                        width: 130,
                        slot: 'gatewayIp'
                    },
                    {
                        key: 'path',
                        title: this.$i18n.t('forms.path'),
                        slot: 'path',
                        sortable: 'custom'
                    },
                    {
                        key: 'serverId',
                        title: this.$i18n.t('forms.serverId'),
                        slot: 'serverId',
                        sortable: 'custom'
                    },
                    {
                        key: 'targetUri',
                        title: this.$i18n.t('forms.targetUri'),
                        slot: 'targetUri',
                        sortable: 'custom'
                    },
                    {
                        key: 'requestTime',
                        title: this.$i18n.t('forms.requestTime'),
                        width: 150,
                        slot: 'requestTime',
                        sortable: 'custom'
                    },
                    {
                        key: 'processTime',
                        title: this.$i18n.t('forms.processTime'),
                        width: 150,
                        slot: 'processTime',
                        sortable: 'custom'
                    },
                    {
                        key: 'responseStatus',
                        title: this.$i18n.t('forms.responseStatus'),
                        width: 150,
                        slot: 'responseStatus',
                        sortable: 'custom'
                    },
                    {
                        title: this.$i18n.t('forms.action'),
                        width: 90,
                        align: 'center',
                        slot: 'action'
                    }
                ]
                columns.forEach((item) => {
                    if (item.key === this.searchForm.orderParam.key) {
                        item.sortType = this.searchForm.orderParam.order
                        item.sortable = 'custom'
                    }
                })
                return columns
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
                    searchParam.queryParam.orderName = this.searchForm.orderParam.key
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
                this.searchForm.orderParam.key = param.key
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
        }
    }
</script>
