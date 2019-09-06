<template>
  <el-card>
    <el-form ref="searchForm" :model="searchForm" label-width="60px" :inline="true" size="mini"
             onsubmit="return false;">
      <el-form-item :label="$t('forms.routeId')" prop="routeId">
        <el-input v-model="searchForm.routeId" :disabled="modal_loading"
                  :placeholder="$t('forms.pleaseEnter') + $t('forms.routeId')"
                  @keyup.enter.native="handleSearch"></el-input>
      </el-form-item>
      <el-form-item :label="$t('forms.status')" prop="enabled">
        <el-select v-model="searchForm.enabled" :clearable="true" :disabled="modal_loading" value=""
                   style="width:100px">
          <el-option v-for="item in enabledList" :value="item.value" :label="item.label"
                     :key="'search_select_'+item.value">
          </el-option>
        </el-select>
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
          {{$t('forms.buttons.refreshRoute')}}
        </el-button>
      </el-form-item>
    </el-form>
    <el-table ref="table" border height="433" size="mini" :default-sort="searchForm.orderParam" :data="searchData"
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
        prop="routeId"
        sortable="custom"
        :label="this.$i18n.t('forms.routeId')"
        width="150">
      </el-table-column>
      <el-table-column
        prop="uri"
        :label="this.$i18n.t('forms.uri')"
        width="150">
      </el-table-column>
      <el-table-column
        prop="predicates"
        :label="this.$i18n.t('forms.predicates')">
      </el-table-column>
      <el-table-column
        prop="filters"
        :label="this.$i18n.t('forms.filters')">
      </el-table-column>
      <el-table-column
        prop="remarks"
        :label="this.$i18n.t('forms.remarks')"
        width="150">
      </el-table-column>
      <el-table-column
        prop="orderNum"
        sortable="custom"
        align="center"
        :label="this.$i18n.t('forms.sort')"
        width="80">
      </el-table-column>
      <el-table-column
        prop="enabled"
        sortable="custom"
        align="center"
        :label="this.$i18n.t('forms.enabled')"
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
    <el-dialog :visible.sync="editModal" :title="$t('forms.info')" :close-on-click-modal="false"
               :fullscreen="true">
      <el-form ref="editForm" :model="editForm" :rules="ruleAddForm" label-width="80px" size="mini"
               style="padding-right: 25px;" v-loading="modal_loading" onsubmit="return false;">
        <el-row>
          <el-col :lg="8">
            <el-form-item :label="$t('forms.routeId')" prop="routeId" style="width: 100%">
              <el-input v-model="editForm.routeId" :disabled="modal_loading" ref="routeId"
                        :placeholder="$t('forms.pleaseEnter') + $t('forms.routeId')"
                        @keyup.enter.native="doSave('editForm')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="8">
            <el-form-item :label="$t('forms.uri')" prop="uri" style="width: 100%">
              <el-input v-model="editForm.uri" :disabled="modal_loading"
                        :placeholder="$t('forms.pleaseEnter') + $t('forms.uri')"
                        @keyup.enter.native="doSave('editForm')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="8">
            <el-form-item :label="$t('forms.sort')" prop="orderNum">
              <el-input-number v-model="editForm.orderNum" :disabled="modal_loading"
                               style="width: 100%;max-width: 160px;"
                               :placeholder="$t('forms.pleaseEnter') + $t('forms.sort')" :min="0"
                               @keyup.enter.native="doSave('editForm')"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :lg="8">
            <el-form-item :label="$t('forms.enabled')" prop="enabled">
              <el-switch v-model="editForm.enabled" :disabled="modal_loading">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :lg="16">
            <el-form-item :label="$t('forms.remarks')" prop="remarks" style="width: 100%;">
              <el-input v-model="editForm.remarks" :disabled="modal_loading"
                        :placeholder="$t('forms.pleaseEnter') + $t('forms.remarks')"
                        @keyup.enter.native="doSave('editForm')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :lg="12">
            <el-form-item :label="$t('forms.predicates')" prop="predicates" style="width: 100%">
              <vueJsonEditor v-model="editForm.predicates" :lang="jsonEditorLang" :showBtns="false"
                             :modes="jsonEditModes"
                             :mode="'tree'"></vueJsonEditor>
            </el-form-item>
          </el-col>
          <el-col :lg="12">
            <el-form-item :label="$t('forms.filters')" prop="filters" style="width: 100%">
              <vueJsonEditor v-model="editForm.filters" :lang="jsonEditorLang" :showBtns="false"
                             :modes="jsonEditModes"
                             :mode="'tree'"></vueJsonEditor>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" style="text-align: center">
        <el-button type="default" :loading="modal_loading" @click="doCancel()">
          {{$t('forms.buttons.cancel')}}
        </el-button>
        <el-button type="primary" :loading="modal_loading" @click="doSave('editForm')">
          {{$t('forms.buttons.submit')}}
        </el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
    import vueJsonEditor from 'vue-json-editor'

    export default {
        name: 'routeConfig',
        components: {
            vueJsonEditor
        },
        data () {
            return {
                jsonEditModes: ['tree', 'text'],
                searchForm: {
                    routeId: '',
                    enabled: '',
                    orderParam: {
                        prop: 'routeId',
                        order: 'ascending'
                    },
                    currPage: 1,
                    totalRows: 0,
                    pageSize: 10,
                    pageSizeArray: [10, 20, 30, 40]
                },
                editForm: {
                    id: '',
                    routeId: '',
                    uri: '',
                    predicates: [],
                    filters: [],
                    orderNum: 0,
                    enabled: true,
                    remarks: ''
                },
                editModal: false,
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
                        this.$refs['routeId'].focus()
                    })
                }
            }
        },
        computed: {
            jsonEditorLang () {
                const lang = this.$store.state.app.lang.lang
                if (lang === 'CN') {
                    return 'zh'
                } else {
                    return 'en'
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
                    routeId: [
                        {
                            required: true,
                            message: this.$i18n.t('forms.routeId') + this.$i18n.t('forms.notEmpty'),
                            trigger: 'blur'
                        }
                    ],
                    uri: [
                        {
                            required: true,
                            message: this.$i18n.t('forms.uri') + this.$i18n.t('forms.notEmpty'),
                            trigger: 'blur'
                        }
                    ],
                    orderNum: [
                        {
                            type: 'number',
                            required: true,
                            message: this.$i18n.t('forms.sort') + this.$i18n.t('forms.notEmpty'),
                            trigger: 'blur'
                        }
                    ],
                    predicates: [
                        {
                            required: true,
                            type: 'array',
                            min: 1,
                            message: this.$i18n.t('forms.predicates') + this.$i18n.t('forms.notEmpty'),
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
                                this.$api.request.route.create({
                                    routeId: this.editForm.routeId,
                                    uri: this.editForm.uri,
                                    orderNum: this.editForm.orderNum,
                                    predicates: JSON.stringify(this.editForm.predicates),
                                    filters: JSON.stringify(this.editForm.filters),
                                    enabled: this.editForm.enabled,
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
                            }
                        })
                        break
                    case 1:
                        this.$refs[name].validate((valid) => {
                            if (valid) {
                                this.modal_loading = true
                                this.$api.request.route.update({
                                    id: this.editForm.id,
                                    routeId: this.editForm.routeId,
                                    uri: this.editForm.uri,
                                    orderNum: this.editForm.orderNum,
                                    predicates: JSON.stringify(this.editForm.predicates),
                                    filters: JSON.stringify(this.editForm.filters),
                                    enabled: this.editForm.enabled,
                                    remarks: this.editForm.remarks
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
                this.$api.request.route.delete(rowIds).then((res) => {
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
                    routeId: this.searchForm.routeId,
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
                this.$api.request.route.query(searchParam).then((res) => {
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
                    this.editForm.routeId = row.routeId
                    this.editForm.uri = row.uri
                    this.editForm.predicates = JSON.parse(row.predicates)
                    this.editForm.filters = JSON.parse(row.filters)
                    this.editForm.orderNum = row.orderNum
                    this.editForm.enabled = !!row.enabled
                    this.editForm.remarks = row.remarks
                    this.action = 1
                })
            },
            handleRefresh () {
                this.$confirm(this.$i18n.t('messages.refreshRouteConfirm') + '', this.$i18n.t('dialog.confirm') + '', {
                    type: 'warning'
                }).then(() => {
                    this.modal_loading = true
                    this.$api.request.route.refreshRoute().then((res) => {
                        this.modal_loading = false
                        if (res) {
                            this.$message.success(res.data.message)
                            this.handleSearch()
                        }
                    }).catch(() => {
                        this.modal_loading = false
                    })
                }).catch(() => {
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
<style>
  .jsoneditor-vue div.jsoneditor-outer {
    min-height: 150px;
  }

  .jsoneditor-vue div.jsoneditor-tree {
    height: 350px;
  }
</style>
