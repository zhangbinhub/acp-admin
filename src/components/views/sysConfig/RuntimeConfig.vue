<template>
  <el-card>
    <el-form ref="searchForm" :model="searchForm" label-width="60px" :inline="true" @submit.native.prevent
             size="mini">
      <el-form-item :label="$t('forms.name')" prop="name">
        <el-input v-model="searchForm.name" :disabled="modal_loading"
                  :placeholder="$t('forms.pleaseEnter') + $t('forms.name')"
                  @keyup.enter.native="handleSearch"/>
      </el-form-item>
      <el-form-item :label="$t('forms.value')" prop="value">
        <el-input v-model="searchForm.value" :disabled="modal_loading"
                  :placeholder="$t('forms.pleaseEnter') + $t('forms.value')"
                  @keyup.enter.native="handleSearch"/>
      </el-form-item>
      <el-form-item :label="$t('forms.status')" prop="enabled">
        <el-select v-model="searchForm.enabled" :clearable="true" :disabled="modal_loading" value=""
                   style="width:200px">
          <el-option v-for="item in enabledList" :value="item.value" :label="item.label"
                     :key="'search_select_'+item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button-group>
          <el-button :loading="modal_loading" @click="handleSearch()" type="primary">
            {{ $t('forms.buttons.search') }}
          </el-button>
          <el-button :loading="modal_loading" @click="handleSearchReset('searchForm')" type="primary">
            {{ $t('forms.buttons.reset') }}
          </el-button>
          <el-button :loading="modal_loading" @click="handleAdd()" type="primary">
            {{ $t('forms.buttons.add') }}
          </el-button>
          <el-button :loading="modal_loading" @click="handleDeleteMore()" type="primary">
            {{ $t('forms.buttons.delete') }}
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
        :selectable="selectableFun"
        width="40">
      </el-table-column>
      <el-table-column
        prop="name"
        sortable="custom"
        :label="$t('forms.name')">
      </el-table-column>
      <el-table-column
        prop="value"
        :label="$t('forms.value')">
        <template #default="scope">
          <el-input type="text" v-model="editValue" v-if="editIndex === scope.$index"
                    @keyup.enter.native="handleSave(scope.$index)"
                    @keyup.esc.native="handleCancel"/>
          <span v-else>{{ scope.row.value }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="configDes"
        :label="$t('forms.describe')">
        <template #default="scope">
          <el-input type="text" v-model="editDes" v-if="editIndex === scope.$index"
                    @keyup.enter.native="handleSave(scope.$index)"
                    @keyup.esc.native="handleCancel"/>
          <span v-else>{{ scope.row.configDes }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="enabled"
        align="center"
        sortable="custom"
        width="100"
        :label="$t('forms.enabled')">
        <template #default="scope">
          <el-switch v-if="editIndex === scope.$index" v-model="editEnabled" :disabled="modal_loading"/>
          <span v-else
                :style="scope.row.enabled ? 'color:green':'color:red'">{{ enabledText(scope.row.enabled) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        prop="action"
        :label="$t('forms.action')"
        align="center"
        width="90">
        <template #default="scope">
          <div v-if="editIndex === scope.$index">
            <el-tooltip :content="$t('forms.buttons.save')" placement="top-start">
              <el-button type="text" @click="handleSave(scope.$index)"
                         icon="el-icon-check" style="color: green">
              </el-button>
            </el-tooltip>
            <el-tooltip :content="$t('forms.buttons.cancel')" placement="top-start">
              <el-button type="text" @click="editIndex = -1"
                         icon="el-icon-close" style="color: red"/>
            </el-tooltip>
          </div>
          <div v-else>
            <el-tooltip :content="$t('forms.buttons.edit')" placement="top-start">
              <el-button type="text" @click="handleEdit(scope.row,scope.$index)"
                         icon="el-icon-edit"/>
            </el-tooltip>
            <el-tooltip :content="$t('forms.buttons.delete')" placement="top-start" v-if="scope.row.covert">
              <el-button type="text" @click="handleDeleteRow(scope.row)"
                         icon="el-icon-delete"/>
            </el-tooltip>
          </div>
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
    <el-dialog v-model="addModal" :title="$t('forms.buttons.add')" :close-on-click-modal="false">
      <el-form ref="addForm" :model="addForm" :rules="ruleAddForm" label-width="60px" size="mini"
               v-loading="modal_loading" @submit.native.prevent style="padding-right: 25px;">
        <el-form-item :label="$t('forms.name')" prop="name">
          <el-input v-model="addForm.name" :disabled="modal_loading" ref="name"
                    :placeholder="$t('forms.pleaseEnter') + $t('forms.name')"
                    @keyup.enter.native="doAdd('addForm')"/>
        </el-form-item>
        <el-form-item :label="$t('forms.value')" prop="value">
          <el-input v-model="addForm.value" :disabled="modal_loading"
                    :placeholder="$t('forms.pleaseEnter') + $t('forms.value')"
                    @keyup.enter.native="doAdd('addForm')"/>
        </el-form-item>
        <el-form-item :label="$t('forms.describe')" prop="describe">
          <el-input v-model="addForm.describe" :disabled="modal_loading"
                    :placeholder="$t('forms.pleaseEnter') + $t('forms.describe')"
                    @keyup.enter.native="doAdd('addForm')"/>
        </el-form-item>
        <el-form-item :label="$t('forms.enabled')" prop="enabled">
          <el-switch v-model="addForm.enabled" :disabled="modal_loading"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div>
          <el-button type="info" :loading="modal_loading" @click="doCancel()">
            {{ $t('forms.buttons.cancel') }}
          </el-button>
          <el-button type="primary" :loading="modal_loading" @click="doAdd('addForm')">
            {{ $t('forms.buttons.submit') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </el-card>
</template>
<script>
import {nextTick} from "vue";

export default {
  name: 'runtimeConfig',
  data() {
    return {
      searchForm: {
        name: '',
        value: '',
        enabled: '',
        orderParam: {
          prop: 'name',
          order: 'ascending'
        },
        currPage: 1,
        totalRows: 0,
        pageSize: 10,
        pageSizeArray: [10, 20, 30, 40]
      },
      addForm: {
        name: '',
        value: '',
        describe: '',
        enabled: true
      },
      addModal: false,
      modal_loading: false,
      searchData: [],
      editIndex: -1,
      editName: '',
      editValue: '',
      editDes: '',
      editEnabled: true,
      selectedData: []
    }
  },
  watch: {
    addModal(value) {
      if (value) {
        nextTick(() => {
          this.$refs['name'].focus()
        })
      }
    },
    'searchForm.currPage'() {
      this.handleSearch()
    }
  },
  computed: {
    tableHeight() {
      const minHeight = 300
      const height = this.$store.state.app.mainHeight - 80 - 46 - 42 - 4
      if (height < minHeight) {
        return minHeight - 2
      } else {
        return height
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
        name: [
          {
            required: true,
            message: this.$i18n.t('forms.name') + this.$i18n.t('forms.notEmpty'),
            trigger: 'blur'
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
      this.addModal = true
      nextTick(() => {
        this.$refs['addForm'].resetFields()
      })
    },
    doCancel() {
      this.addModal = false
    },
    doAdd(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.modal_loading = true
          this.$api.request.runtime.create({
            name: this.addForm.name,
            value: this.addForm.value,
            configDes: this.addForm.describe,
            enabled: this.addForm.enabled
          }).then((res) => {
            this.modal_loading = false
            if (res) {
              this.$message.success(this.$i18n.t('messages.saveSuccess') + '')
              this.addModal = false
              this.handleSearch()
            }
          }).catch(() => {
            this.modal_loading = false
          })
        }
      })
    },
    handleDelete(rowIds) {
      this.modal_loading = true
      this.$api.request.runtime.delete(rowIds).then((res) => {
        this.modal_loading = false
        if (res) {
          this.$message.success(this.$i18n.t('messages.deleteSuccess') + '')
          this.handleSearch()
        }
      }).catch(() => {
        this.modal_loading = false
      })
    },
    handleSave(index) {
      this.modal_loading = true
      this.$api.request.runtime.update({
        id: this.searchData[index].id,
        name: this.editName,
        value: this.editValue,
        configDes: this.editDes,
        enabled: this.editEnabled
      }).then((res) => {
        this.modal_loading = false
        if (res) {
          this.searchData[index].value = this.editValue
          this.searchData[index].configDes = this.editDes
          this.searchData[index].enabled = this.editEnabled
          this.editIndex = -1
          this.$message.success(this.$i18n.t('messages.updateSuccess') + '')
        }
      }).catch(() => {
        this.modal_loading = false
      })
    },
    handlePageSizeSearch(size) {
      this.searchForm.pageSize = size
      this.handleSearch()
    },
    handleSearch() {
      let searchParam = {
        name: this.searchForm.name,
        value: this.searchForm.value,
        enabled: this.searchForm.enabled,
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
      this.$api.request.runtime.query(searchParam).then((res) => {
        this.modal_loading = false
        if (res) {
          this.selectedData = []
          this.searchForm.totalRows = res.data.totalElements
          this.searchData = res.data.content.map(item => {
            if (!item.covert) {
              item._disabled = true
            }
            return item
          })
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
    handleRowClick(row) {
      if (!row._disabled) {
        this.$refs['table'].toggleRowSelection(row)
      }
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
    handleDeleteRow(row) {
      if (!row.covert) {
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
    handleEdit(row, index) {
      this.editName = row.name
      this.editValue = row.value
      this.editDes = row.configDes
      this.editEnabled = !!row.enabled
      this.editIndex = index
    },
    handleCancel() {
      this.editIndex = -1
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
