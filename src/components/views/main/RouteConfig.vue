<template>
  <el-card>
    <el-form ref="searchForm" :inline="true" :model="searchFormModel" label-width="undefined" size="small"
             @submit.native.prevent>
      <el-form-item :label="$t('forms.routeId')" prop="routeId">
        <el-input v-model="searchFormModel.routeId" :disabled="modal_loading"
                  :placeholder="$t('forms.pleaseEnter') + $t('forms.routeId')"
                  @keyup.enter.native="handleSearch"/>
      </el-form-item>
      <el-form-item :label="$t('forms.status')" prop="enabled">
        <el-select v-model="searchFormModel.enabled" :disabled="modal_loading" value="">
          <el-option v-for="item in enabledList" :key="'search_select_'+item.value" :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button-group style="margin-right: 20px">
          <el-button :loading="modal_loading" type="primary" @click="handleSearch">
            {{ $t('forms.buttons.search') }}
          </el-button>
          <el-button :loading="modal_loading" type="primary" @click="handleSearchReset">
            {{ $t('forms.buttons.reset') }}
          </el-button>
          <el-button :loading="modal_loading" type="primary" @click="handleAdd">
            {{ $t('forms.buttons.add') }}
          </el-button>
          <el-button :loading="modal_loading" type="primary" @click="handleDeleteMore">
            {{ $t('forms.buttons.delete') }}
          </el-button>
        </el-button-group>
        <el-button :loading="modal_loading" type="success" @click="handleRefresh">
          {{ $t('forms.buttons.refreshRoute') }}
        </el-button>
      </el-form-item>
    </el-form>
    <el-table ref="table" v-loading="modal_loading" :data="searchData" :default-sort="searchFormModel.orderParam" :empty-text="$t('messages.tableNoData')"
              :height="tableHeight"
              border header-cell-class-name="query-table-header"
              size="small" @row-click="handleRowClick" @selection-change="handleSelect"
              @sort-change="handleSortChange">
      <el-table-column
        :selectable="selectableFun"
        align="center"
        fixed="left"
        type="selection"
        width="40">
      </el-table-column>
      <el-table-column
        :label="$t('forms.routeId')"
        prop="routeId"
        sortable="custom">
      </el-table-column>
      <el-table-column
        :label="$t('forms.uri')"
        prop="uri">
      </el-table-column>
      <el-table-column
        :label="$t('forms.remarks')"
        prop="remarks">
      </el-table-column>
      <el-table-column
        :label="$t('forms.sort')"
        align="center"
        prop="orderNum"
        sortable="custom"
        width="80">
      </el-table-column>
      <el-table-column
        :label="$t('forms.enabled')"
        align="center"
        prop="enabled"
        sortable="custom"
        width="100">
        <template #default="scope">
          <span :style="scope.row.enabled ? 'color:green':'color:red'">{{ enabledText(scope.row.enabled) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :fixed="isMobile?false:'right'"
        :label="$t('forms.action')"
        align="center"
        prop="action"
        width="90">
        <template #default="scope">
          <el-button icon="el-icon-edit" size="small" type="text"
                     @click="handleEdit(scope.row)"></el-button>
          <el-button icon="el-icon-delete" size="small" type="text"
                     @click="handleDeleteRow(scope.row)"></el-button>
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
    <el-dialog v-model="editModal" :fullscreen="true" :title="$t('forms.info')">
      <el-form ref="editForm" v-loading="modal_loading" :model="editFormModel" :rules="ruleAddForm" label-width="undefined"
               size="small" style="padding-right: 25px;" @submit.native.prevent>
        <el-row>
          <el-col :lg="8">
            <el-form-item :label="$t('forms.routeId')" prop="routeId" style="width: 100%">
              <el-input ref="routeId" v-model="editFormModel.routeId" :disabled="modal_loading"
                        :placeholder="$t('forms.pleaseEnter') + $t('forms.routeId')"
                        @keyup.enter.native="doSave"/>
            </el-form-item>
          </el-col>
          <el-col :lg="8">
            <el-form-item :label="$t('forms.uri')" prop="uri" style="width: 100%">
              <el-input v-model="editFormModel.uri" :disabled="modal_loading"
                        :placeholder="$t('forms.pleaseEnter') + $t('forms.uri')"
                        @keyup.enter.native="doSave"/>
            </el-form-item>
          </el-col>
          <el-col :lg="8">
            <el-form-item :label="$t('forms.sort')" prop="orderNum">
              <el-input-number v-model="editFormModel.orderNum" :disabled="modal_loading"
                               :min="0"
                               :placeholder="$t('forms.pleaseEnter') + $t('forms.sort')" style="width: 100%;max-width: 160px;"
                               @keyup.enter.native="doSave"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :lg="8">
            <el-form-item :label="$t('forms.enabled')" prop="enabled">
              <el-switch v-model="editFormModel.enabled" :disabled="modal_loading">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :lg="16">
            <el-form-item :label="$t('forms.remarks')" prop="remarks" style="width: 100%;">
              <el-input v-model="editFormModel.remarks" :disabled="modal_loading" :placeholder="$t('forms.pleaseEnter') + $t('forms.remarks')" :rows="3"
                        type="textarea"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :lg="12">
            <el-form-item :label="$t('forms.predicates')" prop="predicates" style="width: 100%">
              <vueJsonEditor v-model:value="editFormModel.predicates" :expandedOnStart="true" :lang="jsonEditorLang"
                             :mode="'text'" :modes="jsonEditModes" :showBtns="false"
                             style="width: 100%" @json-change="function(json){editFormModel.predicates=json}"/>
            </el-form-item>
          </el-col>
          <el-col :lg="12">
            <el-form-item :label="$t('forms.filters')" prop="filters" style="width: 100%">
              <vueJsonEditor v-model:value="editFormModel.filters" :expandedOnStart="true" :lang="jsonEditorLang"
                             :mode="'text'" :modes="jsonEditModes" :showBtns="false"
                             style="width: 100%" @json-change="function(json){editFormModel.filters=json}"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :lg="24">
            <el-form-item :label="$t('forms.metadata')" prop="metadata" style="width: 100%">
              <vueJsonEditor v-model:value="editFormModel.metadata" :expandedOnStart="true" :lang="jsonEditorLang"
                             :mode="'text'" :modes="jsonEditModes" :showBtns="false"
                             style="width: 100%" @json-change="function(json){editFormModel.metadata=json}"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div style="text-align: center">
          <el-button :loading="modal_loading" type="default" @click="doCancel()">
            {{ $t('forms.buttons.cancel') }}
          </el-button>
          <el-button :loading="modal_loading" type="primary" @click="doSave">
            {{ $t('forms.buttons.submit') }}
          </el-button>
        </div>
      </template>
      <el-backtop :visibility-height="10" target=".el-dialog"/>
    </el-dialog>
  </el-card>
</template>
<script>
import vueJsonEditor from 'vue-json-editor'
import {nextTick, ref} from "vue";
import {isMobileDevice} from "@/libs/tools";

export default {
  name: 'routeConfig',
  components: {
    vueJsonEditor
  },
  data() {
    return {
      jsonEditModes: ['tree', 'text'],
      searchFormModel: {
        routeId: '',
        enabled: undefined,
        orderParam: {
          prop: 'routeId',
          order: 'ascending'
        },
        currPage: 1,
        totalRows: 0,
        pageSize: 10,
        pageSizeArray: [10, 20, 30, 40]
      },
      editFormModel: {
        id: '',
        routeId: '',
        uri: '',
        predicates: [],
        filters: [],
        metadata: {},
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
    editModal(value) {
      if (value) {
        nextTick(() => {
          this.routeId.focus()
        })
      }
    },
    'searchFormModel.currPage'() {
      this.handleSearch()
    }
  },
  computed: {
    isMobile() {
      return isMobileDevice()
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
    jsonEditorLang() {
      const lang = this.$store.state.app.lang.lang
      if (lang === 'CN') {
        return 'zh'
      } else {
        return 'en'
      }
    },
    enabledList() {
      return [
        {value: true, label: this.$i18n.t('forms.enabled')},
        {value: false, label: this.$i18n.t('forms.disabled')}
      ]
    },
    ruleAddForm() {
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
            message: this.$i18n.t('forms.predicates') + this.$i18n.t('forms.notEmpty')
          }
        ]
      }
    }
  },
  methods: {
    enabledText(enabled) {
      return this.enabledList.filter((item) => {
        return item.value === enabled
      })[0].label
    },
    selectableFun(row) {
      return !row._disabled
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
        this.editFormModel.routeId = row.routeId
        this.editFormModel.uri = row.uri
        this.editFormModel.predicates = row.predicates ? JSON.parse(row.predicates) : []
        this.editFormModel.filters = row.filters ? JSON.parse(row.filters) : []
        this.editFormModel.metadata = row.metadata ? JSON.parse(row.metadata) : {}
        this.editFormModel.orderNum = row.orderNum
        this.editFormModel.enabled = !!row.enabled
        this.editFormModel.remarks = row.remarks
        this.action = 1
      })
    },
    doCancel() {
      this.editModal = false
    },
    doSave() {
      if (!(this.editFormModel.predicates instanceof Array)) {
        this.$notify.error({
          title: this.$i18n.t('messages.validateFailed') + '',
          message: this.$i18n.t('forms.predicates') + this.$i18n.t('forms.incorrect')
        })
        return
      }
      if (!(this.editFormModel.filters instanceof Array)) {
        this.$notify.error({
          title: this.$i18n.t('messages.validateFailed') + '',
          message: this.$i18n.t('forms.filters') + this.$i18n.t('forms.incorrect')
        })
        return
      }
      if (this.editFormModel.metadata instanceof Array) {
        this.$notify.error({
          title: this.$i18n.t('messages.validateFailed') + '',
          message: this.$i18n.t('forms.metadata') + this.$i18n.t('forms.incorrect')
        })
        return
      }
      switch (this.action) {
        case 0:
          this.editForm.validate((valid) => {
            if (valid) {
              this.modal_loading = true
              this.$api.request.route.create({
                routeId: this.editFormModel.routeId,
                uri: this.editFormModel.uri,
                orderNum: this.editFormModel.orderNum,
                predicates: JSON.stringify(this.editFormModel.predicates),
                filters: JSON.stringify(this.editFormModel.filters),
                metadata: JSON.stringify(this.editFormModel.metadata),
                enabled: this.editFormModel.enabled,
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
              this.$api.request.route.update({
                id: this.editFormModel.id,
                routeId: this.editFormModel.routeId,
                uri: this.editFormModel.uri,
                orderNum: this.editFormModel.orderNum,
                predicates: JSON.stringify(this.editFormModel.predicates),
                filters: JSON.stringify(this.editFormModel.filters),
                metadata: JSON.stringify(this.editFormModel.metadata),
                enabled: this.editFormModel.enabled,
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
    handlePageSizeSearch(size) {
      this.searchFormModel.pageSize = size
      this.handleSearch()
    },
    handleSearch() {
      let searchParam = {
        routeId: this.searchFormModel.routeId,
        enabled: this.searchFormModel.enabled,
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
      this.$api.request.route.query(searchParam).then((res) => {
        this.modal_loading = false
        if (res) {
          this.selectedData = []
          this.searchFormModel.totalRows = res.data.totalElements
          this.searchData = res.data.content.map(item => {
            if (item.enabled) {
              item._disabled = true
            }
            return item
          })
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
      if (!row._disabled) {
        this.table.toggleRowSelection(row)
      }
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
      if (row.enabled) {
        this.$alert(this.$i18n.t('messages.tableDataCannotDel') + '', this.$i18n.t('dialog.error') + '', {
          type: 'error',
          callback: () => {
          }
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
    handleRefresh() {
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
    const table = ref(null)
    const editForm = ref(null)
    const routeId = ref(null)
    return {searchForm, table, editForm, routeId}
  }
}
</script>
