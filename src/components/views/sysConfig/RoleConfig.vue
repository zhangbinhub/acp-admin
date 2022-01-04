<template>
  <el-row :gutter="16">
    <el-col :lg="{ span: 9 }" style="min-width: 300px;margin-bottom: 16px;">
      <el-card>
        <div style="overflow-x: auto;overflow-y: hidden">
          <el-input v-model="filterText" clearable :placeholder="$t('forms.pleaseEnter') + $t('forms.filterKey')"/>
          <el-tree style="margin-right: 16px;min-height: 100px;margin-top: 10px;" :data="treeData"
                   v-loading="treeLoading"
                   :default-expand-all="true" ref="roleTree" :filter-node-method="filterNode"
                   :expand-on-click-node="false">
            <template #default="{ node, data }">
              <span class="config-tree-node">
                <span v-if="data.isApp">{{ node.label }}</span>
                <span v-else @click="treeClick(data)">{{ node.label }}</span>
                <span>
                  <el-button
                    v-if="data.isApp"
                    type="text"
                    size="small"
                    icon="el-icon-plus"
                    :loading="treeLoading"
                    @click="append(data)">
                  </el-button>
                  <el-button
                    v-else
                    type="text"
                    size="small"
                    icon="el-icon-minus"
                    :loading="treeLoading"
                    @click="remove(node, data)">
                  </el-button>
                </span>
              </span>
            </template>
          </el-tree>
        </div>
      </el-card>
    </el-col>
    <el-col :lg="{ span: 15 }" v-show="currRole.id&&currRole.id!==''" style="margin-bottom: 16px;">
      <el-card>
        <template #header>{{ currRoleFullPath }}</template>
        <el-tabs v-model="activeName">
          <el-tab-pane name="basicInfo">
            <template #label>
              <el-icon style="margin-right: 5px">
                <el-icon-info-filled/>
              </el-icon>
              {{ $t('forms.basicInfo') }}
            </template>
            <el-form ref="editForm" size="small" :model="editFormModel" :rules="ruleEditForm" label-width="auto"
                     v-loading="treeLoading" @submit.native.prevent>
              <el-form-item :label="$t('forms.name')" prop="name">
                <el-input ref="name" v-model="editFormModel.name" :disabled="treeLoading"
                          :placeholder="$t('forms.pleaseEnter') + $t('forms.name')"
                          @keyup.enter.native="doSave"/>
              </el-form-item>
              <el-form-item :label="$t('forms.code')" prop="code">
                <el-autocomplete v-model="editFormModel.code" :disabled="treeLoading" style="width: 100%"
                                 :fetch-suggestions="querySearch"
                                 :placeholder="$t('forms.pleaseEnter') + $t('forms.code')"
                                 @keyup.enter.native="doSave"/>
              </el-form-item>
              <el-form-item :label="$t('forms.level')" prop="levels">
                <el-input-number v-model="editFormModel.levels" :disabled="treeLoading"
                                 style="width: 100%;max-width: 150px;"
                                 :placeholder="$t('forms.pleaseEnter') + $t('forms.level')" :min="0"
                                 @keyup.enter.native="doSave">
                </el-input-number>
              </el-form-item>
              <el-form-item :label="$t('forms.sort')" prop="sort">
                <el-input-number v-model="editFormModel.sort" :disabled="treeLoading"
                                 style="width: 100%;max-width: 150px;"
                                 :placeholder="$t('forms.pleaseEnter') + $t('forms.sort')" :min="0"
                                 @keyup.enter.native="doSave">
                </el-input-number>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane name="people">
            <template #label>
              <el-icon style="margin-right: 5px">
                <el-icon-user/>
              </el-icon>
              {{ $t('forms.userList') }}
            </template>
            <el-transfer :data="optionalUsers" v-model="editFormModel.userIds" v-loading="treeLoading"
                         :filterable="true" :props="{key:'id',label:'label'}"
                         :titles="[$t('forms.optional'),$t('forms.selected')]"
                         :button-texts="[$t('forms.buttons.cancel'),$t('forms.buttons.select')]"
                         @change="handleUserListChange">
            </el-transfer>
          </el-tab-pane>
          <el-tab-pane name="menuList">
            <template #label>
              <el-icon style="margin-right: 5px">
                <el-icon-menu/>
              </el-icon>
              {{ $t('forms.menuList') }}
            </template>
            <el-tree ref="menuTree" :data="menuData" :show-checkbox="true" node-key="id"
                     v-loading="treeLoading" :default-expanded-keys="editFormModel.menuIds"/>
          </el-tab-pane>
          <el-tab-pane name="moduleFuncList">
            <template #label>
              <el-icon style="margin-right: 5px">
                <el-icon-grid/>
              </el-icon>
              {{ $t('forms.moduleFuncList') }}
            </template>
            <el-tree ref="moduleFuncTree" :data="moduleFuncData" :show-checkbox="true" node-key="id"
                     v-loading="treeLoading" :default-expanded-keys="editFormModel.moduleFuncIds"/>
          </el-tab-pane>
        </el-tabs>
        <div style="text-align: center;margin-top: 20px;">
          <el-button type="info" :loading="treeLoading" style="margin-right: 20px;"
                     @click="doReset">
            {{ $t('forms.buttons.reset') }}
          </el-button>
          <el-button type="primary" :loading="treeLoading" @click="doSave">
            {{ $t('forms.buttons.submit') }}
          </el-button>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>
<script>
import {
  sortTreeNodes,
  processTreeNode,
  getTreeFullPathTitle,
  findCheckedTreeNode
} from '@/libs/tools'
import {nextTick, ref} from "vue";

export default {
  name: 'roleConfig',
  data() {
    return {
      activeName: 'basicInfo',
      treeData: [],
      menuData: [],
      moduleFuncData: [],
      tree_loading: false,
      roleCode: [],
      currRoleFullPath: '',
      currRoleData: {},
      currRole: {},
      editFormModel: {
        id: '',
        appId: '',
        name: '',
        code: '',
        levels: 999,
        sort: 1,
        userIds: [],
        menuIds: [],
        moduleFuncIds: []
      },
      optionalUsers: [],
      filterText: ''
    }
  },
  computed: {
    ruleEditForm() {
      return {
        name: [{
          required: true,
          message: this.$i18n.t('forms.name') + this.$i18n.t('forms.notEmpty'),
          trigger: 'blur'
        }],
        code: [{
          type: 'string',
          required: true,
          message: this.$i18n.t('forms.code') + this.$i18n.t('forms.notEmpty'),
          trigger: 'none'
        }],
        levels: [{
          type: 'integer',
          required: true,
          message: this.$i18n.t('forms.level') + this.$i18n.t('forms.notEmpty'),
          trigger: 'blur'
        }],
        sort: [{
          type: 'integer',
          required: true,
          message: this.$i18n.t('forms.sort') + this.$i18n.t('forms.notEmpty'),
          trigger: 'blur'
        }]
      }
    },
    treeLoading() {
      return this.tree_loading
    }
  },
  watch: {
    filterText(value) {
      this.roleTree.filter(value)
    }
  },
  methods: {
    querySearch(queryString, cb) {
      let restaurants = this.roleCode
      let results = queryString ? restaurants.filter(item => {
        return item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }) : restaurants
      cb(results)
    },
    filterNode(value, data) {
      if (!value || value === '') {
        return true
      }
      return data.label.indexOf(value) !== -1
    },
    refreshTree(clear = true, callBackFun) {
      if (clear) {
        this.clearCurrObj()
      }
      this.tree_loading = true
      this.$api.request.app.getList().then((appRes) => {
        if (appRes) {
          const appData = appRes.data
          for (let i = 0; i < appData.length; i++) {
            const item = appData[i]
            item.isApp = true
            item.appId = item.id
            item.name = item.appName
            item.label = item.appName
            item.sort = i
            item.children = []
          }
          this.tree_loading = true
          this.$api.request.role.getList().then((res) => {
            this.tree_loading = false
            if (res) {
              processTreeNode(res.data)
              for (const item of res.data) {
                item.parentId = item.appId
                for (const root of appData) {
                  if (root.id === item.appId) {
                    root.children.push(item)
                  }
                }
              }
              this.treeData = appData
              if (typeof callBackFun === 'function') {
                callBackFun()
              }
            }
          }).catch(() => {
            this.tree_loading = false
          })
        }
      }).catch(() => {
        this.tree_loading = false
      })
    },
    refreshRoleCodeList() {
      this.tree_loading = true
      this.$api.request.role.getCodeList().then((res) => {
        this.tree_loading = false
        if (res) {
          this.roleCode = res.data.map(item => {
            const obj = {}
            obj.value = item
            return obj
          })
        }
      }).catch(() => {
        this.tree_loading = false
      })
    },
    reloadUserList() {
      this.tree_loading = true
      this.$api.request.user.getModifiableUser().then((res) => {
        this.tree_loading = false
        if (res) {
          this.optionalUsers = res.data.map(item => {
            item.label = item.name + '(' + item.loginNo + ')'
            return item
          })
        }
        nextTick(() => {
          this.name.focus()
        })
      }).catch(() => {
        this.tree_loading = false
      })
    },
    reloadMenuList(callBack) {
      this.tree_loading = true
      this.$api.request.auth.getMenuList(this.currRole.appId).then((res) => {
        this.tree_loading = false
        if (res) {
          processTreeNode(res.data)
          this.menuData = res.data
          if (typeof callBack === 'function') {
            callBack()
          }
        }
      }).catch(() => {
        this.tree_loading = false
      })
    },
    reloadModuleFuncList(callBack) {
      this.tree_loading = true
      this.$api.request.auth.getModuleFuncList(this.currRole.appId).then((res) => {
        this.tree_loading = false
        if (res) {
          processTreeNode(res.data)
          this.moduleFuncData = res.data
          if (typeof callBack === 'function') {
            callBack()
          }
        }
      }).catch(() => {
        this.tree_loading = false
      })
    },
    clearCurrObj(currRoleId) {
      if (!currRoleId || (currRoleId && currRoleId === this.currRole.id)) {
        this.editFormModel = {
          id: '',
          name: '',
          code: '',
          levels: 1,
          sort: 0,
          userIds: [],
          menuIds: [],
          moduleFuncIds: []
        }
        this.currRole = {
          id: '',
          appId: '',
          name: '',
          code: '',
          levels: 1,
          sort: 0,
          userIds: [],
          menuIds: [],
          moduleFuncIds: []
        }
        this.currRoleData = {}
      }
    },
    append(data) {
      this.tree_loading = true
      this.$api.request.role.createRole({
        name: this.$i18n.t('forms.new') + this.$i18n.t('forms.role'),
        appId: data.appId,
        sort: data.children.length + 1,
        code: 'BUSINESS',
        levels: 999
      }).then((res) => {
        this.tree_loading = false
        if (res) {
          this.$message.success(this.$i18n.t('messages.createSuccess') + '')
          const children = data.children || []
          processTreeNode([res.data])
          children.push(res.data)
          sortTreeNodes(children)
          this.treeClick(res.data)
          this.$set(data, 'children', children)
        }
      }).catch(() => {
        this.tree_loading = false
      })
    },
    remove(node, data) {
      this.$confirm(this.$i18n.t('messages.deleteDataConfirm') + ': ' + getTreeFullPathTitle(this.treeData, data.id),
        this.$i18n.t('dialog.confirm') + '', {
          type: 'warning'
        }).then(() => {
        this.tree_loading = true
        this.$api.request.role.deleteRole([data.id]).then((res) => {
          this.tree_loading = false
          if (res) {
            this.$message.success(this.$i18n.t('messages.deleteSuccess') + '')
            const parent = node.parent
            const children = parent.data.children
            const index = children.findIndex(d => d.id === data.id)
            children.splice(index, 1)
            this.clearCurrObj(data.id)
          }
        }).catch(() => {
          this.tree_loading = false
        })
      }).catch(() => {
      })
    },
    treeClick(data) {
      this.tree_loading = true
      this.$api.request.role.getRoleInfo(data.id).then((res) => {
        this.tree_loading = false
        if (res) {
          this.currRoleData = data
          this.currRoleData.userIds = res.data.userIds
          this.currRoleData.menuIds = res.data.menuIds
          this.currRoleData.moduleFuncIds = res.data.moduleFuncIds
          this.currRole = {
            id: this.currRoleData.id,
            appId: this.currRoleData.appId,
            name: this.currRoleData.name,
            code: this.currRoleData.code,
            levels: this.currRoleData.levels,
            sort: this.currRoleData.sort,
            userIds: this.currRoleData.userIds,
            menuIds: this.currRoleData.menuIds,
            moduleFuncIds: this.currRoleData.moduleFuncIds
          }
          this.doReset()
        }
      }).catch(() => {
        this.tree_loading = false
      })
    },
    doSave() {
      this.editForm.validate((valid) => {
        if (valid) {
          this.tree_loading = true
          this.$api.request.role.doUpdateRole({
            id: this.editFormModel.id,
            name: this.editFormModel.name,
            code: this.editFormModel.code,
            levels: this.editFormModel.levels,
            sort: this.editFormModel.sort,
            userIds: this.editFormModel.userIds,
            menuIds: this.menuTree.getCheckedNodes(false, true).map(item => item.id),
            moduleFuncIds: this.moduleFuncTree.getCheckedNodes(false, true).map(item => item.id)
          }).then((res) => {
            this.tree_loading = false
            if (res) {
              this.reloadUserList()
              this.$message.success(this.$i18n.t('messages.saveSuccess') + '')
              this.currRoleData.name = this.editFormModel.name
              this.currRoleData.label = this.editFormModel.code !== '' ? this.editFormModel.name + '(' + this.editFormModel.code + ')' : this.editFormModel.name
              this.currRoleData.code = this.editFormModel.code
              this.currRoleData.levels = this.editFormModel.levels
              this.currRoleData.sort = this.editFormModel.sort
              this.currRoleData.userIds = this.editFormModel.userIds
              this.currRoleData.menuIds = this.menuTree.getCheckedNodes(false, true).map(item => item.id)
              this.currRoleData.moduleFuncIds = this.moduleFuncTree.getCheckedNodes(false, true).map(item => item.id)
              this.currRole = {
                id: this.editFormModel.id,
                appId: this.editFormModel.appId,
                name: this.editFormModel.name,
                code: this.editFormModel.code,
                levels: this.editFormModel.levels,
                sort: this.editFormModel.sort,
                userIds: this.editFormModel.userIds,
                menuIds: this.menuTree.getCheckedNodes(false, true).map(item => item.id),
                moduleFuncIds: this.moduleFuncTree.getCheckedNodes(false, true).map(item => item.id)
              }
              this.editFormModel.menuIds = this.currRole.menuIds
              this.editFormModel.moduleFuncIds = this.currRole.moduleFuncIds
              this.reloadMenuList(() => {
                nextTick(() => {
                  const checkedResult = findCheckedTreeNode(this.menuData, this.editFormModel.menuIds)
                  this.menuTree.setCheckedKeys(checkedResult.checkedIdList)
                })
              })
              this.reloadModuleFuncList(() => {
                nextTick(() => {
                  const checkedResult = findCheckedTreeNode(this.moduleFuncData, this.editFormModel.moduleFuncIds)
                  this.moduleFuncTree.setCheckedKeys(checkedResult.checkedIdList)
                })
              })
              this.refreshTree(false, (() => {
                this.currRoleFullPath = getTreeFullPathTitle(this.treeData, this.currRole.id)
                nextTick(() => {
                  this.name.focus()
                })
              }))
            }
          }).catch(() => {
            this.tree_loading = false
          })
        }
      })
    },
    doReset() {
      this.reloadUserList()
      this.editForm.resetFields()
      this.editFormModel = {
        id: this.currRole.id,
        appId: this.currRole.appId,
        name: this.currRole.name,
        code: this.currRole.code,
        levels: this.currRole.levels,
        sort: this.currRole.sort,
        userIds: this.currRole.userIds,
        menuIds: this.currRole.menuIds,
        moduleFuncIds: this.currRole.moduleFuncIds
      }
      this.reloadMenuList(() => {
        nextTick(() => {
          const checkedResult = findCheckedTreeNode(this.menuData, this.editFormModel.menuIds)
          this.menuTree.setCheckedKeys(checkedResult.checkedIdList)
          this.name.focus()
        })
      })
      this.reloadModuleFuncList(() => {
        nextTick(() => {
          const checkedResult = findCheckedTreeNode(this.moduleFuncData, this.editFormModel.moduleFuncIds)
          this.moduleFuncTree.setCheckedKeys(checkedResult.checkedIdList)
          this.name.focus()
        })
      })
      this.currRoleFullPath = getTreeFullPathTitle(this.treeData, this.currRole.id)
    },
    handleUserListChange(newTargetKeys) {
      this.editFormModel.userIds = newTargetKeys
    }
  },
  mounted() {
    this.refreshTree()
    this.reloadUserList()
    this.refreshRoleCodeList()
  },
  activated() {
    if (this.currRole.id && this.currRole.id !== '') {
      nextTick(() => {
        this.name.focus()
      })
    }
  },
  setup() {
    const roleTree = ref(null)
    const editForm = ref(null)
    const name = ref(null)
    const menuTree = ref(null)
    const moduleFuncTree = ref(null)
    return {roleTree, editForm, name, menuTree, moduleFuncTree}
  }
}
</script>
