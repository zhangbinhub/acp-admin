<template>
  <el-card>
    <el-form ref="searchForm" :model="searchForm" label-width="60px" :inline="true" size="mini"
             @submit.native.prevent>
      <el-form-item :label="$t('forms.name')" prop="appName">
        <el-input v-model="searchForm.appName" :disabled="modal_loading"
                  :placeholder="$t('forms.pleaseEnter') + $t('forms.name')"
                  @keyup.enter.native="handleSearch"/>
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
              v-loading="modal_loading" :empty-text="$t('messages.tableNoData')" @selection-change="handleSelect"
              @row-click="handleRowClick" @sort-change="handleSortChange" header-cell-class-name="query-table-header">
      <el-table-column
        type="selection"
        fixed="left"
        align="center"
        :selectable="selectableFun"
        width="40">
      </el-table-column>
      <el-table-column
        prop="id"
        align="center"
        width="250"
        :label="'ID'">
      </el-table-column>
      <el-table-column
        prop="appName"
        sortable="custom"
        :label="$t('forms.name')">
      </el-table-column>
      <el-table-column
        prop="accessTokenValiditySeconds"
        :label="$t('forms.accessTokenValiditySeconds')">
      </el-table-column>
      <el-table-column
        prop="refreshTokenValiditySeconds"
        :label="$t('forms.refreshTokenValiditySeconds')">
      </el-table-column>
      <el-table-column
        prop="identify"
        sortable="custom"
        :label="$t('forms.identify')">
      </el-table-column>
      <el-table-column
        prop="scope"
        :label="$t('forms.scope')">
      </el-table-column>
      <el-table-column
        fixed="right"
        prop="action"
        :label="$t('forms.action')"
        align="center"
        width="120">
        <template #default="scope">
          <el-tooltip :content="$t('forms.buttons.edit')" placement="top-start">
            <el-button type="text" @click="handleEdit(scope.row,1)"
                       icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip :content="$t('forms.buttons.view')" placement="top-start"
                      v-if="scope.row.secret!==$store.state.app.appInfo.appSecret">
            <el-button type="text" @click="handleEdit(scope.row,2,scope.$index)"
                       icon="el-icon-search"></el-button>
          </el-tooltip>
          <el-tooltip :content="$t('forms.buttons.delete')" placement="top-start" v-if="scope.row.covert">
            <el-button type="text" @click="handleDeleteRow(scope.row)"
                       icon="el-icon-delete"></el-button>
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
    <el-dialog v-model="editModal" :title="$t('forms.info')" :close-on-click-modal="false">
      <el-form ref="editForm" :model="editForm" :rules="ruleEditForm" label-width="150px" style="padding-right: 25px;"
               size="mini" v-loading="modal_loading" @submit.native.prevent>
        <el-form-item :label="'appId:'" prop="id" v-if="action===2">
          <span style="color: green">{{ editForm.id }}</span>
        </el-form-item>
        <el-form-item :label="'secret:'" prop="secret" v-if="action===2">
          <span style="color: red">{{ editForm.secret }}</span>
        </el-form-item>
        <el-form-item :label="$t('forms.name')+':'" prop="appName">
          <el-input ref="appName" v-model="editForm.appName" :disabled="modal_loading" v-if="action!==2"
                    :placeholder="$t('forms.pleaseEnter') + $t('forms.name')"
                    @keyup.enter.native="doSave('editForm')"/>
          <span v-else>{{ editForm.appName }}</span>
        </el-form-item>
        <el-form-item :label="$t('forms.identify')+':'" prop="identify">
          <el-input v-model="editForm.identify" :disabled="modal_loading" v-if="action!==2"
                    :placeholder="$t('forms.pleaseEnter') + $t('forms.identify')"
                    @keyup.enter.native="doSave('editForm')"/>
          <span v-else>{{ editForm.identify }}</span>
        </el-form-item>
        <el-form-item :label="$t('forms.scope')+':'" prop="scope"
                      v-if="editForm.secret!==$store.state.app.appInfo.appSecret">
          <el-input v-model="editForm.scope" :disabled="modal_loading" v-if="action!==2"
                    type="textarea" :rows="2"
                    :placeholder="$t('forms.pleaseEnter') + $t('forms.scope')"/>
          <span v-else>{{ editForm.scope }}</span>
        </el-form-item>
        <el-form-item :label="$t('forms.accessTokenValiditySeconds')+':'" prop="accessTokenValiditySeconds">
          <el-input v-model="editForm.accessTokenValiditySeconds" :disabled="modal_loading" v-if="action!==2"
                    :placeholder="$t('forms.pleaseEnter') + $t('forms.accessTokenValiditySeconds')"
                    @keyup.enter.native="doSave('editForm')">
            <template #append>{{ $t('forms.seconds') }}</template>
          </el-input>
          <span v-else>{{ editForm.accessTokenValiditySeconds }}
            {{ $t('forms.seconds') }}
          </span>
        </el-form-item>
        <el-form-item :label="$t('forms.refreshTokenValiditySeconds')+':'" prop="refreshTokenValiditySeconds">
          <el-input v-model="editForm.refreshTokenValiditySeconds" :disabled="modal_loading" v-if="action!==2"
                    :placeholder="$t('forms.pleaseEnter') + $t('forms.refreshTokenValiditySeconds')"
                    @keyup.enter.native="doSave('editForm')">
            <template #append>{{ $t('forms.seconds') }}</template>
          </el-input>
          <span v-else>{{ editForm.refreshTokenValiditySeconds }}
            {{ $t('forms.seconds') }}
          </span>
        </el-form-item>
      </el-form>
      <template #footer>
        <div>
          <el-button type="info" :loading="modal_loading" @click="doCancel()">
            {{ $t('forms.buttons.cancel') }}
          </el-button>
          <el-button v-if="action===0||action===1" type="primary" :loading="modal_loading"
                     @click="doSave('editForm')">
            {{ $t('forms.buttons.submit') }}
          </el-button>
          <el-button v-else type="primary" :loading="modal_loading"
                     @click="doSave('editForm')">
            {{ $t('forms.buttons.updateSecret') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </el-card>
</template>
<script>
import {nextTick} from "vue";

export default {
  name: 'appConfig',
  data() {
    return {
      searchForm: {
        appName: '',
        orderParam: {
          prop: 'identify',
          order: 'ascending'
        },
        currPage: 1,
        totalRows: 0,
        pageSize: 10,
        pageSizeArray: [10, 20, 30, 40]
      },
      editForm: {
        id: '',
        appName: '',
        scope: '',
        identify: '',
        accessTokenValiditySeconds: '',
        refreshTokenValiditySeconds: '',
        secret: '',
        index: -1
      },
      editModal: false,
      action: 0, // 0-add, 1-update, 2-view
      modal_loading: false,
      searchData: [],
      selectedData: []
    }
  },
  watch: {
    editModal(value) {
      if (value) {
        nextTick(() => {
          if (this.action !== 2) {
            this.$refs['appName'].focus()
          }
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
    ruleEditForm() {
      return {
        appName: [{
          required: true,
          message: this.$i18n.t('forms.name') + this.$i18n.t('forms.notEmpty'),
          trigger: 'blur'
        }],
        accessTokenValiditySeconds: [{
          required: true,
          message: this.$i18n.t('forms.accessTokenValiditySeconds') + this.$i18n.t('forms.notEmpty'),
          trigger: 'blur'
        }, {
          type: 'string',
          pattern: /^[0-9]*$/,
          message: this.$i18n.t('forms.accessTokenValiditySeconds') + this.$i18n.t('forms.incorrect'),
          trigger: 'blur'
        }],
        refreshTokenValiditySeconds: [{
          required: true,
          message: this.$i18n.t('forms.accessTokenValiditySeconds') + this.$i18n.t('forms.notEmpty'),
          trigger: 'blur'
        }, {
          type: 'string',
          pattern: /^[0-9]*$/,
          message: this.$i18n.t('forms.accessTokenValiditySeconds') + this.$i18n.t('forms.incorrect'),
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    selectableFun(row) {
      return !row._disabled
    },
    handleAdd() {
      this.editModal = true
      nextTick(() => {
        this.$refs['editForm'].resetFields()
        this.editForm.id = ''
        this.editForm.appName = ''
        this.editForm.scope = ''
        this.editForm.identify = ''
        this.editForm.accessTokenValiditySeconds = ''
        this.editForm.refreshTokenValiditySeconds = ''
        this.editForm.secret = ''
        this.editForm.index = -1
        this.action = 0
      })
    },
    doCancel() {
      this.editModal = false
    },
    doSave(name) {
      switch (this.action) {
        case 0: // 新增
          this.$refs[name].validate((valid) => {
            if (valid) {
              this.modal_loading = true
              this.$api.request.app.create({
                appName: this.editForm.appName,
                scope: this.editForm.scope,
                identify: this.editForm.identify,
                accessTokenValiditySeconds: Number(this.editForm.accessTokenValiditySeconds),
                refreshTokenValiditySeconds: Number(this.editForm.refreshTokenValiditySeconds)
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
        case 1: // 更新
          this.$refs[name].validate((valid) => {
            if (valid) {
              this.modal_loading = true
              this.$api.request.app.update({
                id: this.editForm.id,
                appName: this.editForm.appName,
                scope: this.editForm.scope,
                identify: this.editForm.identify,
                accessTokenValiditySeconds: Number(this.editForm.accessTokenValiditySeconds),
                refreshTokenValiditySeconds: Number(this.editForm.refreshTokenValiditySeconds)
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
        case 2:
          this.modal_loading = true
          this.$api.request.app.getNewSecret(this.editForm.id).then((res) => {
            this.modal_loading = false
            this.$message.success(this.$i18n.t('messages.updateSuccess') + '')
            this.editForm.secret = res.data.secret
            this.searchData[this.editForm.index].secret = res.data.secret
          }).catch(() => {
            this.modal_loading = false
          })
          break
      }
    },
    handleDelete(rowIds) {
      this.modal_loading = true
      this.$api.request.app.delete(rowIds).then((res) => {
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
      this.searchForm.pageSize = size
      this.handleSearch()
    },
    handleSearch() {
      let searchParam = {
        appName: this.searchForm.appName,
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
      this.$api.request.app.query(searchParam).then((res) => {
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
    handleSortChange(param) {
      this.searchForm.orderParam.prop = param.prop
      this.searchForm.orderParam.order = param.order
      this.handleSearch()
    },
    handleRowClick(row) {
      if (!row._disabled) {
        this.$refs['table'].toggleRowSelection(row)
      }
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
    handleEdit(row, action, index) {
      this.editModal = true
      nextTick(() => {
        this.$refs['editForm'].resetFields()
        this.editForm.id = row.id
        this.editForm.appName = row.appName
        this.editForm.accessTokenValiditySeconds = row.accessTokenValiditySeconds + ''
        this.editForm.refreshTokenValiditySeconds = row.refreshTokenValiditySeconds + ''
        this.editForm.secret = row.secret
        this.editForm.scope = row.scope
        this.editForm.identify = row.identify
        this.editForm.index = index
        this.action = action
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
