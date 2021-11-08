<template>
  <el-card>
    <el-form ref="searchForm" :model="searchForm" label-width="80px" :inline="true" size="mini"
             @submit.native.prevent>
      <el-form-item :label="$t('forms.name')" prop="name">
        <el-input v-model="searchForm.name" :disabled="modal_loading"
                  :placeholder="$t('forms.pleaseEnter') + $t('forms.name')"
                  @keyup.enter.native="handleSearch"/>
      </el-form-item>
      <el-form-item :label="$t('forms.loginNo')" prop="loginNo">
        <el-input v-model="searchForm.loginNo" :disabled="modal_loading"
                  :placeholder="$t('forms.pleaseEnter') + $t('forms.loginNo')"
                  @keyup.enter.native="handleSearch"/>
      </el-form-item>
      <el-form-item :label="$t('forms.organization')" prop=".organizationName">
        <el-input v-model="searchForm.organizationName" :disabled="modal_loading"
                  :placeholder="$t('forms.pleaseEnter') + $t('forms.organization')"
                  @keyup.enter.native="handleSearch"/>
      </el-form-item>
      <el-form-item :label="$t('forms.role')" prop="roleName">
        <el-input v-model="searchForm.roleName" :disabled="modal_loading"
                  :placeholder="$t('forms.pleaseEnter') + $t('forms.role')"
                  @keyup.enter.native="handleSearch"/>
      </el-form-item>
      <el-form-item :label="$t('forms.status')" prop="enabled">
        <el-select v-model="searchForm.enabled" :disabled="modal_loading" :clearable="true" value=""
                   style="width: 162px">
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
        prop="sort"
        align="center"
        sortable="custom"
        width="70"
        :label="$t('forms.sort')">
      </el-table-column>
      <el-table-column
        prop="name"
        :label="$t('forms.name')">
      </el-table-column>
      <el-table-column
        prop="loginNo"
        :label="$t('forms.loginNo')">
      </el-table-column>
      <el-table-column
        prop="mobile"
        width="150"
        :label="$t('forms.mobile')">
      </el-table-column>
      <el-table-column
        prop="levels"
        align="center"
        sortable="custom"
        width="70"
        :label="$t('forms.level')">
      </el-table-column>
      <el-table-column
        prop="organizationSet"
        :label="$t('forms.organization')"
        :show-overflow-tooltip="true">
        <template #default="scope">{{ orgNames(scope.row.organizationSet).join(',') }}</template>
      </el-table-column>
      <el-table-column
        prop="roleSet"
        :label="$t('forms.role')"
        :show-overflow-tooltip="true">
        <template #default="scope">{{ roleNames(scope.row.roleSet) }}</template>
      </el-table-column>
      <el-table-column
        prop="enabled"
        align="center"
        sortable="custom"
        width="100"
        :label="$t('forms.enabled')">
        <template #default="scope">
          <span :style="scope.row.enabled ? 'color:green':'color:red'">{{ enabledText(scope.row.enabled) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        prop="action"
        :label="$t('forms.action')"
        align="center"
        width="120">
        <template #default="scope">
          <el-tooltip :content="$t('forms.buttons.edit')" placement="top-start">
            <el-button type="text" @click="handleEdit(scope.row)"
                       icon="el-icon-edit"/>
          </el-tooltip>
          <el-tooltip
            v-if="scope.row.id !== $store.state.app.user.userInfo.id && scope.row.levels > $store.state.app.user.userInfo.levels"
            :content="$t('forms.buttons.delete')" placement="top-start">
            <el-button type="text" @click="handleDeleteRow(scope.row)"
                       icon="el-icon-delete"/>
          </el-tooltip>
          <el-tooltip v-if="scope.row.levels > $store.state.app.user.userInfo.levels"
                      :content="$t('forms.buttons.resetPwd')" placement="top-start">
            <el-button type="text" @click="doResetPwd(scope.row.id)"
                       icon="el-icon-refresh"/>
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
    <el-dialog v-model="editModal" :title="$t('forms.info')" :fullscreen="true">
      <el-row :gutter="10">
        <el-col :lg="6" class="card-col">
          <el-card>
            <template #header>{{ $t('forms.basicInfo') }}</template>
            <el-form ref="editForm" :model="editForm" :rules="ruleEditForm" label-width="80px"
                     size="mini" v-loading="modal_loading" @submit.native.prevent>
              <el-form-item :label="$t('forms.name')" prop="name">
                <el-input ref="name" v-model="editForm.name" @keyup.enter.native="doSave" :disabled="modal_loading"
                          :placeholder=" $t('forms.pleaseEnter') + $t('forms.name')"/>
              </el-form-item>
              <el-form-item :label="$t('forms.loginNo')" prop="loginNo">
                <el-input v-model="editForm.loginNo" @keyup.enter.native="doSave" :disabled="modal_loading"
                          :placeholder=" $t('forms.pleaseEnter') + $t('forms.loginNo')"/>
              </el-form-item>
              <el-form-item :label="$t('forms.mobile')" prop="mobile">
                <el-input v-model="editForm.mobile" @keyup.enter.native="doSave" :disabled="modal_loading"
                          :placeholder="$t('forms.pleaseEnter') + $t('forms.mobile')"/>
              </el-form-item>
              <el-form-item :label="$t('forms.level')" prop="levels">
                <el-input-number v-model="editForm.levels" :disabled="modal_loading"
                                 :placeholder="$t('forms.pleaseEnter') + $t('forms.level')" :min="0"
                                 @keyup.enter.native="doSave">
                </el-input-number>
              </el-form-item>
              <el-form-item :label="$t('forms.sort')" prop="sort">
                <el-input-number v-model="editForm.sort" :disabled="modal_loading"
                                 :placeholder="$t('forms.pleaseEnter') + $t('forms.sort')" :min="1"
                                 @keyup.enter.native="doSave">
                </el-input-number>
              </el-form-item>
              <el-form-item :label="$t('forms.enabled')" prop="enabled" :required="true">
                <el-switch v-model="editForm.enabled" :disabled="modal_loading"/>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
        <el-col :lg="6" class="card-col">
          <el-card>
            <template #header>{{ $t('forms.orgList') }}</template>
            <div style="overflow-x: auto;overflow-y: hidden">
              <el-tree ref="orgTree" :data="orgTreeDataS1" node-key="id" v-loading="modal_loading"
                       :show-checkbox="true" :check-strictly="true"
                       :default-expanded-keys="currObj.orgIds"/>
            </div>
          </el-card>
        </el-col>
        <el-col :lg="6" class="card-col">
          <el-card>
            <template #header>{{ $t('forms.orgMngList') }}</template>
            <div style="overflow-x: auto;overflow-y: hidden">
              <el-tree ref="orgMngTree" :data="orgTreeDataS2" node-key="id" v-loading="modal_loading"
                       :show-checkbox="true" :check-strictly="true"
                       :default-expanded-keys="currObj.orgMngIds"/>
            </div>
          </el-card>
        </el-col>
        <el-col :lg="6" class="card-col">
          <el-card>
            <template #header>{{ $t('forms.roleList') }}</template>
            <div style="overflow-x: auto;overflow-y: hidden">
              <el-tree ref="roleTree" :data="roleTreeData" node-key="id" v-loading="modal_loading"
                       :default-expand-all="true" :show-checkbox="true" :check-strictly="true"/>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <template #footer>
        <div style="text-align: center">
          <el-button type="info" :loading="modal_loading" @click="doCancel()">
            {{ $t('forms.buttons.cancel') }}
          </el-button>
          <el-button type="warning" :loading="modal_loading" @click="doReset()">
            {{ $t('forms.buttons.reset') }}
          </el-button>
          <el-button type="primary" :loading="modal_loading" @click="doSave()">
            {{ $t('forms.buttons.submit') }}
          </el-button>
        </div>
      </template>
      <el-backtop :visibility-height="10" target=".el-dialog"/>
    </el-dialog>
  </el-card>
</template>
<style type="less" scoped>
.card-col {
  margin-bottom: 10px;
}
</style>
<script>
import {copy, processTreeNode, getTreeFullPathTitle, sortTreeNodes} from '@/libs/tools'
import {nextTick} from "vue";

export default {
  name: 'userConfig',
  data() {
    return {
      roleTreeData: [],
      orgTreeData: [],
      orgTreeDataS1: [],
      orgTreeDataS2: [],
      editModal: false,
      modal_loading: false,
      searchForm: {
        name: '',
        loginNo: '',
        status: '',
        organizationName: '',
        roleName: '',
        orderParam: {
          prop: 'sort',
          order: 'ascending'
        },
        currPage: 1,
        totalRows: 0,
        pageSize: 10,
        pageSizeArray: [10, 20, 30, 40]
      },
      searchData: [],
      selectedData: [],
      currObj: {
        id: '',
        name: '',
        loginNo: '',
        mobile: '',
        levels: 1,
        enabled: true,
        sort: 1,
        orgIds: [],
        organizationSet: [],
        orgMngIds: [],
        organizationMngSet: [],
        roleIds: [],
        roleSet: []
      },
      editForm: {
        id: '',
        name: '',
        loginNo: '',
        mobile: '',
        levels: 1,
        enabled: true,
        sort: 1
      }
    }
  },
  computed: {
    tableHeight() {
      const minHeight = 300
      const height = this.$store.state.app.mainHeight - 80 - 92 - 42 - 4
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
    ruleEditForm() {
      return {
        name: [{
          required: true,
          message: this.$i18n.t('forms.name') + this.$i18n.t('forms.notEmpty'),
          trigger: 'blur'
        }],
        loginNo: [{
          required: true,
          message: this.$i18n.t('forms.loginNo') + this.$i18n.t('forms.notEmpty'),
          trigger: 'blur'
        }],
        mobile: [{
          required: true,
          message: this.$i18n.t('forms.mobile') + this.$i18n.t('forms.notEmpty'),
          trigger: 'blur'
        }, {
          type: 'string',
          pattern: /^1[0-9]{10}$/,
          message: this.$i18n.t('forms.mobile') + this.$i18n.t('forms.invalid'),
          trigger: 'blur'
        }],
        levels: [{
          type: 'number',
          required: true,
          message: this.$i18n.t('forms.level') + this.$i18n.t('forms.notEmpty'),
          trigger: 'blur'
        }],
        sort: [{
          type: 'number',
          required: true,
          message: this.$i18n.t('forms.sort') + this.$i18n.t('forms.notEmpty'),
          trigger: 'blur'
        }]
      }
    }
  },
  watch: {
    'searchForm.currPage'() {
      this.handleSearch()
    }
  },
  methods: {
    selectableFun(row) {
      return !row._disabled
    },
    refreshOrgTree(callBack) {
      this.modal_loading = true
      this.$api.request.org.getOrgList().then((res) => {
        this.modal_loading = false
        if (res) {
          const data1 = copy(res.data)
          const data2 = copy(res.data)
          processTreeNode(data1)
          processTreeNode(data2)
          this.orgTreeDataS1 = data1
          this.orgTreeDataS2 = data2
          processTreeNode(res.data)
          this.orgTreeData = res.data
          if (typeof callBack === 'function') {
            callBack()
          }
        }
      }).catch(() => {
        this.modal_loading = false
      })
    },
    refreshRoleTree(callBack) {
      this.modal_loading = true
      this.$api.request.app.getList().then((appRes) => {
        if (appRes) {
          const appData = appRes.data
          appData.map(item => {
            item.appId = item.id
            item.label = item.appName
            item.disabled = true
            item.children = []
            return item
          })
          this.roleTreeData = appData
          this.modal_loading = true
          this.$api.request.role.getList().then((res) => {
            this.modal_loading = false
            if (res) {
              processTreeNode(res.data)
              const treeNode = res.data
              for (const item of treeNode) {
                item.parentId = item.appId
                for (const root of this.roleTreeData) {
                  if (root.id === item.appId) {
                    root.children.push(item)
                  }
                }
              }
              if (typeof callBack === 'function') {
                callBack()
              }
            }
          }).catch(() => {
            this.modal_loading = false
          })
        }
      }).catch(() => {
        this.modal_loading = false
      })
    },
    enabledText(enabled) {
      return this.enabledList.filter((item) => {
        return item.value === enabled
      })[0].label
    },
    orgNames(organizationSet) {
      const data = copy(organizationSet)
      sortTreeNodes(data)
      return data.map(org => getTreeFullPathTitle(this.orgTreeData, org.id))
    },
    roleNames(roleSet) {
      const data = copy(roleSet)
      return data.sort((obj1, obj2) => {
        if (obj1.sort > obj2.sort) {
          return 1
        } else if (obj1.sort === obj2.sort) {
          return 0
        } else {
          return -1
        }
      }).map(role => role.name).join(',')
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
    handlePageSizeSearch(size) {
      this.searchForm.pageSize = size
      this.handleSearch()
    },
    handleSearch() {
      let searchParam = {
        name: this.searchForm.name,
        loginNo: this.searchForm.loginNo,
        orgName: this.searchForm.organizationName,
        roleName: this.searchForm.roleName,
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
      this.$api.request.user.query(searchParam).then((res) => {
        this.modal_loading = false
        if (res) {
          this.selectedData = []
          this.searchForm.totalRows = res.data.totalElements
          this.searchData = res.data.content.map(item => {
            if (item.id === this.$store.state.app.user.userInfo.id || item.levels <= this.$store.state.app.user.userInfo.levels) {
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
    handleSelect(selection) {
      this.selectedData = selection
    },
    handleDelete(rowIds) {
      this.modal_loading = true
      this.$api.request.user.delete(rowIds).then((res) => {
        this.modal_loading = false
        if (res) {
          this.$message.success(this.$i18n.t('messages.deleteSuccess') + '')
          this.handleSearch()
        }
      }).catch(() => {
        this.modal_loading = false
      })
    },
    handleDeleteRow(row) {
      if (row.id === this.$store.state.app.user.userInfo.id || row.levels <= this.$store.state.app.user.userInfo.levels) {
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
    clearCurrObj() {
      this.currObj = {
        id: '',
        name: '',
        loginNo: '',
        mobile: '',
        levels: 1,
        enabled: true,
        sort: 1,
        orgIds: [],
        organizationSet: [],
        orgMngIds: [],
        organizationMngSet: [],
        roleIds: [],
        roleSet: []
      }
    },
    handleEdit(row) {
      this.editModal = true
      nextTick(() => {
        this.currObj = copy(row)
        this.doReset()
      })
    },
    handleAdd() {
      this.editModal = true
      nextTick(() => {
        this.clearCurrObj()
        this.doReset()
      })
    },
    doCancel() {
      this.editModal = false
    },
    doReset() {
      this.$refs['editForm'].resetFields()
      this.currObj.orgIds = this.currObj.organizationSet.map(item => item.id)
      this.currObj.orgMngIds = this.currObj.organizationMngSet.map(item => item.id)
      this.currObj.roleIds = this.currObj.roleSet.map(item => item.id)
      this.editForm.id = this.currObj.id
      this.editForm.name = this.currObj.name
      this.editForm.loginNo = this.currObj.loginNo
      this.editForm.mobile = this.currObj.mobile
      this.editForm.levels = this.currObj.levels
      this.editForm.enabled = this.currObj.enabled
      this.editForm.sort = this.currObj.sort
      this.refreshOrgTree(() => {
        nextTick(() => {
          this.$refs['orgTree'].setCheckedKeys(this.currObj.orgIds)
          this.$refs['orgMngTree'].setCheckedKeys(this.currObj.orgMngIds)
        })
      })
      this.refreshRoleTree(() => {
        nextTick(() => {
          this.$refs['roleTree'].setCheckedKeys(this.currObj.roleIds)
        })
      })
    },
    doSave() {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          if (this.editForm.id && this.editForm.id !== '') {
            if (this.editForm.loginNo !== this.currObj.loginNo) {
              this.$confirm(this.$i18n.t('messages.modifyLoginNo') + '', this.$i18n.t('dialog.confirm') + '', {
                type: 'warning'
              }).then(() => {
                this.doUpdate()
              }).catch(() => {
              })
            } else {
              this.doUpdate()
            }
          } else {
            this.doCreate()
          }
        }
      })
    },
    doCreate() {
      this.modal_loading = true
      this.$api.request.user.create({
        name: this.editForm.name,
        loginNo: this.editForm.loginNo,
        mobile: this.editForm.mobile,
        levels: this.editForm.levels,
        enabled: this.editForm.enabled,
        sort: this.editForm.sort,
        orgIds: this.$refs['orgTree'].getCheckedNodes().map(item => item.id),
        orgMngIds: this.$refs['orgMngTree'].getCheckedNodes().map(item => item.id),
        roleIds: this.$refs['roleTree'].getCheckedNodes().map(item => item.id)
      }).then((res) => {
        this.modal_loading = false
        if (res) {
          this.$message.success(this.$i18n.t('messages.createSuccess') + '')
          this.editModal = false
          this.handleSearch()
        }
      }).catch(() => {
        this.modal_loading = false
      })
    },
    doUpdate() {
      this.modal_loading = true
      this.$api.request.user.update({
        id: this.editForm.id,
        name: this.editForm.name,
        loginNo: this.editForm.loginNo,
        mobile: this.editForm.mobile,
        levels: this.editForm.levels,
        enabled: this.editForm.enabled,
        sort: this.editForm.sort,
        orgIds: this.$refs['orgTree'].getCheckedNodes().map(item => item.id),
        orgMngIds: this.$refs['orgMngTree'].getCheckedNodes().map(item => item.id),
        roleIds: this.$refs['roleTree'].getCheckedNodes().map(item => item.id)
      }).then((res) => {
        this.modal_loading = false
        if (res) {
          this.$message.success(this.$i18n.t('messages.saveSuccess') + '')
          this.editModal = false
          // 获取用户信息
          this.$api.request.auth.getUserInfo().then((res) => {
            if (res && !res.data.errorDescription) {
              this.$store.commit('SET_USER_INFO', res.data)
            }
          })
          this.handleSearch()
        }
      }).catch(() => {
        this.modal_loading = false
      })
    },
    doResetPwd(userId) {
      this.$confirm(this.$i18n.t('messages.resetPassword') + '', this.$i18n.t('dialog.confirm') + '', {
        type: 'warning'
      }).then(() => {
        this.modal_loading = true
        this.$api.request.user.resetPwd(userId).then((res) => {
          this.modal_loading = false
          if (res) {
            this.$message.success(this.$i18n.t('messages.updateSuccess') + '')
          }
        }).catch(() => {
          this.modal_loading = false
        })
      }).catch(() => {
      })
    }
  },
  activated() {
    this.refreshOrgTree(() => {
      this.handleSearch()
    })
    nextTick(() => {
      this.$refs['table'].doLayout()
    })
  }
}
</script>
