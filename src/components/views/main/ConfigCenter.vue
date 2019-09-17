<template>
  <el-card>
    <el-form ref="searchForm" :model="searchForm" label-width="60px" :inline="true" size="mini"
             onsubmit="return false;">
      <el-form-item :label="$t('forms.name')" prop="configApplication">
        <el-input v-model="searchForm.configApplication" :disabled="modal_loading"
                  :placeholder="$t('forms.pleaseEnter') + $t('forms.name')"
                  @keyup.enter.native="handleSearch"></el-input>
      </el-form-item>
      <el-form-item :label="$t('forms.profile')" prop="configProfile">
        <el-input v-model="searchForm.configProfile" :disabled="modal_loading"
                  :placeholder="$t('forms.pleaseEnter') + $t('forms.profile')"
                  @keyup.enter.native="handleSearch"></el-input>
      </el-form-item>
      <el-form-item :label="$t('forms.label')" prop="configLabel">
        <el-input v-model="searchForm.configLabel" :disabled="modal_loading"
                  :placeholder="$t('forms.pleaseEnter') + $t('forms.label')"
                  @keyup.enter.native="handleSearch"></el-input>
      </el-form-item>
      <el-form-item :label="$t('forms.status')" prop="enabled">
        <el-select v-model="searchForm.enabled" value="" :clearable="true" :disabled="modal_loading"
                   style="width:100px">
          <el-option v-for="item in enabledList" :value="item.value" :label="item.label"
                     :key="'search_select_'+item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('forms.key')" prop="configKey" style="width: 80%;max-width: 700px">
        <el-input v-model="searchForm.configKey" :disabled="modal_loading"
                  :placeholder="$t('forms.pleaseEnter') + $t('forms.key')"
                  @keyup.enter.native="handleSearch"></el-input>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button-group style="margin-right: 20px">
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
        <el-button :loading="modal_loading" @click="handleRefresh()" type="success">
          {{$t('forms.buttons.refreshService')}}
        </el-button>
      </el-form-item>
    </el-form>
    <el-table ref="table" border :height="tableHeight" :data="searchData" size="mini"
              :default-sort="searchForm.orderParam"
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
        prop="configApplication"
        sortable="custom"
        :label="this.$i18n.t('forms.name')"
        width="100">
      </el-table-column>
      <el-table-column
        prop="configProfile"
        sortable="custom"
        :label="this.$i18n.t('forms.profile')"
        width="95">
      </el-table-column>
      <el-table-column
        prop="configLabel"
        sortable="custom"
        :label="this.$i18n.t('forms.label')"
        width="95">
      </el-table-column>
      <el-table-column
        prop="configKey"
        sortable="custom"
        :label="this.$i18n.t('forms.key')">
      </el-table-column>
      <el-table-column
        prop="configValue"
        :label="this.$i18n.t('forms.value')"
        width="100">
      </el-table-column>
      <el-table-column
        prop="configDes"
        :label="this.$i18n.t('forms.describe')">
      </el-table-column>
      <el-table-column
        prop="enabled"
        :label="this.$i18n.t('forms.enabled')"
        align="center"
        sortable="custom"
        width="100">
        <template slot-scope="scope">
          <span :style="scope.row.enabled ? 'color:green':'color:red'">{{enabledText(scope.row.enabled)}}</span>
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
              <i style="font-size: 15px" class="el-icon-edit"></i>
            </el-button>
          </el-tooltip>
          <el-tooltip :content="$t('forms.buttons.delete')" placement="top-start">
            <el-button type="text" @click="handleDeleteRow(scope.row)">
              <i style="font-size: 15px" class="el-icon-delete"></i>
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
      <el-form ref="editForm" :model="editForm" :rules="ruleAddForm" label-width="80px" style="padding-right: 25px;"
               size="mini" onsubmit="return false;" v-loading="modal_loading">
        <el-form-item :label="$t('forms.name')" prop="configApplication">
          <el-input v-model="editForm.configApplication" :disabled="modal_loading" ref="configApplication"
                    :placeholder="$t('forms.pleaseEnter') + $t('forms.name')"
                    @keyup.enter.native="doSave('editForm')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('forms.profile')" prop="configProfile">
          <el-input v-model="editForm.configProfile" :disabled="modal_loading"
                    :placeholder="$t('forms.pleaseEnter') + $t('forms.profile')"
                    @keyup.enter.native="doSave('editForm')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('forms.label')" prop="configLabel">
          <el-input v-model="editForm.configLabel" :disabled="modal_loading"
                    :placeholder="$t('forms.pleaseEnter') + $t('forms.label')"
                    @keyup.enter.native="doSave('editForm')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('forms.key')" prop="configKey">
          <el-input v-model="editForm.configKey" :disabled="modal_loading"
                    :placeholder="$t('forms.pleaseEnter') + $t('forms.key')"
                    @keyup.enter.native="doSave('editForm')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('forms.value')" prop="configValue">
          <el-input v-model="editForm.configValue" :disabled="modal_loading"
                    :placeholder="$t('forms.pleaseEnter') + $t('forms.value')"
                    @keyup.enter.native="doSave('editForm')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('forms.describe')" prop="configDes">
          <el-input v-model="editForm.configDes" :disabled="modal_loading"
                    :placeholder="$t('forms.pleaseEnter') + $t('forms.describe')"
                    @keyup.enter.native="doSave('editForm')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('forms.enabled')" prop="enabled">
          <el-switch v-model="editForm.enabled" :disabled="modal_loading">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="info" :loading="modal_loading" @click="doCancel()">
          {{$t('forms.buttons.cancel')}}
        </el-button>
        <el-button type="primary" :loading="modal_loading" @click="doSave('editForm')">
          {{$t('forms.buttons.submit')}}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="refreshModal" :title="$t('forms.buttons.refreshService')" :close-on-click-modal="false">
      <el-form ref="refreshForm" :model="refreshForm" style="padding: 0 25px;" onsubmit="return false;"
               v-loading="modal_loading">
        <el-form-item>
          <el-radio-group v-model="refreshForm.refreshType">
            <el-radio label="1">{{$t('forms.configRefreshServer')}}</el-radio>
            <el-radio label="2">{{$t('forms.configRefreshMatcher')}}</el-radio>
            <el-radio label="3">{{$t('forms.configRefreshAll')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="refreshForm.refreshType === '1'">
          <el-select v-model="refreshForm.applicationName" value="" :disabled="modal_loading">
            <el-option v-for="item in refreshForm.applicationList" :value="item" :key="item">{{ item }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="refreshForm.refreshType === '2'">
          <el-alert style="padding: 8px 16px;" :closable="false">
            <p>{{$t('forms.configRefreshMatcherDescribe')}}</p>
            <p>name:ip:port:version:profiles</p>
            <p style="color: red">eg: log-server:**</p>
          </el-alert>
        </el-form-item>
        <el-form-item v-if="refreshForm.refreshType === '2'">
          <el-input v-model="refreshForm.matcher" :disabled="modal_loading"
                    :placeholder="$t('forms.pleaseEnter') + $t('forms.configRefreshMatcher')"
                    @keyup.enter.native="doRefresh()"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="info" :loading="modal_loading" @click="doCancelRefresh()">
          {{$t('forms.buttons.cancel')}}
        </el-button>
        <el-button type="primary" :loading="modal_loading" @click="doRefresh()">
          {{$t('forms.buttons.submit')}}
        </el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
    export default {
        name: 'configCenter',
        data () {
            return {
                searchForm: {
                    configApplication: '',
                    configProfile: '',
                    configLabel: '',
                    configKey: '',
                    enabled: '',
                    orderParam: {
                        prop: 'configKey',
                        order: 'ascending'
                    },
                    currPage: 1,
                    totalRows: 0,
                    pageSize: 10,
                    pageSizeArray: [10, 20, 30, 40]
                },
                editForm: {
                    id: '',
                    configApplication: '',
                    configProfile: '',
                    configLabel: '',
                    configKey: '',
                    configValue: '',
                    configDes: '',
                    enabled: true
                },
                refreshForm: {
                    applicationList: [],
                    refreshType: '1',
                    applicationName: '',
                    matcher: ''
                },
                editModal: false,
                refreshModal: false,
                modal_loading: false,
                searchData: [],
                selectedData: [],
                action: 0
            }
        },
        watch: {
            editModal (value) {
                if (value) {
                    this.$nextTick(() => {
                        this.$refs['configApplication'].focus()
                    })
                }
            }
        },
        computed: {
            tableHeight () {
                const minHeight = 300
                const height = this.$store.state.app.mainHeight - 80 - 92 - 42 - 4
                if (height < minHeight) {
                    return minHeight - 2
                } else {
                    return height
                }
            },
            enabledList () {
                return [
                    { value: 'true', label: this.$i18n.t('forms.enabled') },
                    { value: 'false', label: this.$i18n.t('forms.disabled') }
                ]
            },
            ruleAddForm () {
                return {
                    configApplication: [
                        {
                            required: true,
                            message: this.$i18n.t('forms.name') + this.$i18n.t('forms.notEmpty'),
                            trigger: 'blur'
                        }
                    ],
                    configProfile: [
                        {
                            required: true,
                            message: this.$i18n.t('forms.profile') + this.$i18n.t('forms.notEmpty'),
                            trigger: 'blur'
                        }
                    ],
                    configLabel: [
                        {
                            required: true,
                            message: this.$i18n.t('forms.label') + this.$i18n.t('forms.notEmpty'),
                            trigger: 'blur'
                        }
                    ],
                    configKey: [
                        {
                            required: true,
                            message: this.$i18n.t('forms.key') + this.$i18n.t('forms.notEmpty'),
                            trigger: 'blur'
                        }
                    ],
                    configValue: [
                        {
                            required: true,
                            message: this.$i18n.t('forms.value') + this.$i18n.t('forms.notEmpty'),
                            trigger: 'blur'
                        }
                    ]
                }
            }
        },
        methods: {
            enabledText (enabled) {
                return enabled ? this.$i18n.t('forms.enabled') : this.$i18n.t('forms.disabled')
            },
            handleAdd () {
                this.editModal = true
                this.$nextTick(() => {
                    this.$refs['editForm'].resetFields()
                    this.action = 0
                })
            },
            doCancel () {
                this.editModal = false
            },
            doSave (name) {
                switch (this.action) {
                    case 0:
                        this.$refs[name].validate((valid) => {
                            if (valid) {
                                this.modal_loading = true
                                this.$api.request.config.create({
                                    configApplication: this.editForm.configApplication,
                                    configProfile: this.editForm.configProfile,
                                    configLabel: this.editForm.configLabel,
                                    configKey: this.editForm.configKey,
                                    configValue: this.editForm.configValue,
                                    configDes: this.editForm.configDes,
                                    enabled: this.editForm.enabled
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
                        this.$refs[name].validate((valid) => {
                            if (valid) {
                                this.modal_loading = true
                                this.$api.request.config.update({
                                    id: this.editForm.id,
                                    configApplication: this.editForm.configApplication,
                                    configProfile: this.editForm.configProfile,
                                    configLabel: this.editForm.configLabel,
                                    configKey: this.editForm.configKey,
                                    configValue: this.editForm.configValue,
                                    configDes: this.editForm.configDes,
                                    enabled: this.editForm.enabled
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
            handleDelete (rowIds) {
                this.modal_loading = true
                this.$api.request.config.delete(rowIds).then((res) => {
                    this.modal_loading = false
                    if (res) {
                        this.$message.success(this.$i18n.t('messages.deleteSuccess') + '')
                        this.handleSearch()
                    }
                }).catch(() => {
                    this.modal_loading = false
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
                    configApplication: this.searchForm.configApplication,
                    configProfile: this.searchForm.configProfile,
                    configLabel: this.searchForm.configLabel,
                    configKey: this.searchForm.configKey,
                    queryParam: {
                        currPage: this.searchForm.currPage,
                        pageSize: this.searchForm.pageSize
                    }
                }
                if (this.searchForm.enabled === 'true') {
                    searchParam.enabled = true
                } else if (this.searchForm.enabled === 'false') {
                    searchParam.enabled = false
                }
                if (this.searchForm.orderParam.order !== 'normal') {
                    searchParam.queryParam.orderName = this.searchForm.orderParam.prop
                    searchParam.queryParam.orderCommond = this.searchForm.orderParam.order
                }
                this.modal_loading = true
                this.$api.request.config.query(searchParam).then((res) => {
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
                if (row.enabled) {
                    this.$alert(this.$i18n.t('messages.tableDataCannotDel') + '', this.$i18n.t('dialog.error') + '', {
                        type: 'error'
                    })
                } else {
                    this.$confirm(this.$i18n.t('messages.deleteDataConfirm') + '', this.$i18n.t('dialog.confirm') + '', {
                        type: 'warning'
                    }).then(() => {
                        this.handleDelete([row.id])
                    }).catch(() => {
                    })
                }
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
                        type: 'error'
                    })
                }
            },
            handleEdit (row) {
                this.editModal = true
                this.$nextTick(() => {
                    this.$refs['editForm'].resetFields()
                    this.editForm.id = row.id
                    this.editForm.configApplication = row.configApplication
                    this.editForm.configProfile = row.configProfile
                    this.editForm.configLabel = row.configLabel
                    this.editForm.configKey = row.configKey
                    this.editForm.configValue = row.configValue
                    this.editForm.configDes = row.configDes
                    this.editForm.enabled = !!row.enabled
                    this.action = 1
                })
            },
            handleRefresh () {
                this.modal_loading = true
                this.$api.request.config.getServerList().then((res) => {
                    this.modal_loading = false
                    if (res) {
                        this.refreshForm.applicationList = res.data
                        this.refreshModal = true
                    }
                }).catch(() => {
                    this.modal_loading = false
                })
            },
            doCancelRefresh () {
                this.refreshModal = false
            },
            doRefresh () {
                switch (this.refreshForm.refreshType) {
                    case '1':
                        if (this.refreshForm.applicationName !== '') {
                            this.handleRefreshApp(this.refreshForm.applicationName)
                        } else {
                            this.$message.error(this.$i18n.t('forms.configRefreshServer') + this.$i18n.t('forms.notEmpty'))
                        }
                        break
                    case '2':
                        if (this.refreshForm.matcher !== '') {
                            this.handleRefreshMatcher(this.refreshForm.matcher)
                        } else {
                            this.$message.error(this.$i18n.t('forms.configRefreshMatcher') + this.$i18n.t('forms.notEmpty'))
                        }
                        break
                    case '3':
                        this.handleRefreshAll()
                        break
                }
            },
            handleRefreshAll () {
                this.$confirm(this.$i18n.t('messages.refreshServiceConfirm') + '', this.$i18n.t('dialog.confirm') + '', {
                    type: 'warning'
                }).then(() => {
                    this.modal_loading = true
                    this.$api.request.config.refreshAll().then((res) => {
                        this.modal_loading = false
                        if (res) {
                            this.$message.success(res.data.message)
                            this.refreshModal = false
                            this.handleSearch()
                        }
                    }).catch(() => {
                        this.modal_loading = false
                    })
                }).catch(() => {
                })
            },
            handleRefreshApp (applicationName) {
                this.$confirm(this.$i18n.t('messages.refreshServiceConfirm') + '[' + applicationName + ']', this.$i18n.t('dialog.confirm') + '', {
                    type: 'warning'
                }).then(() => {
                    this.modal_loading = true
                    this.$api.request.config.refreshApp(applicationName).then((res) => {
                        this.modal_loading = false
                        if (res) {
                            this.$message.success(res.data.message)
                            this.refreshModal = false
                            this.handleSearch()
                        }
                    }).catch(() => {
                        this.modal_loading = false
                    })
                }).catch(() => {
                })
            },
            handleRefreshMatcher (matcher) {
                this.$confirm(this.$i18n.t('messages.refreshServiceConfirm') + '[' + matcher + ']', this.$i18n.t('dialog.confirm') + '', {
                    type: 'warning'
                }).then(() => {
                    this.modal_loading = true
                    this.$api.request.config.refreshMatcher(matcher).then((res) => {
                        this.modal_loading = false
                        if (res) {
                            this.$message.success(res.data.message)
                            this.refreshModal = false
                            this.handleSearch()
                        }
                    }).catch(() => {
                        this.modal_loading = false
                    })
                })
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
