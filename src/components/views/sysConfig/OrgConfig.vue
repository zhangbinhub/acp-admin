<template>
  <el-row :gutter="16">
    <el-col :lg="{ span: 9 }" style="min-width: 300px;margin-bottom: 16px;">
      <el-card>
        <div style="overflow-x: auto;overflow-y: hidden">
          <el-input v-model="filterText" clearable :placeholder="$t('forms.pleaseEnter') + $t('forms.filterKey')"/>
          <el-tree style="margin-right: 16px;min-height: 100px;margin-top: 10px;" :data="treeData"
                   v-loading="treeLoading"
                   :default-expand-all="true" ref="orgTree" :filter-node-method="filterNode"
                   :expand-on-click-node="false">
            <template #default="{ node, data }">
              <span class="config-tree-node">
              <span v-if="data.id!=='root'" @click="orgClick(data)">{{ node.label }}</span>
              <span v-else>{{ node.label }}</span>
              <span>
                <el-button
                  v-if="data.id!=='root' && node.isLeaf"
                  type="text"
                  size="small"
                  icon="el-icon-minus"
                  :loading="treeLoading"
                  @click="remove(node, data)">
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  icon="el-icon-plus"
                  :loading="treeLoading"
                  @click="append(data)">
                </el-button>
              </span>
            </span>
            </template>
          </el-tree>
        </div>
      </el-card>
    </el-col>
    <el-col :lg="{ span: 15 }" v-show="currOrg.id&&currOrg.id!==''" style="margin-bottom: 16px;">
      <el-card>
        <template #header>{{ currOrgFullPath }}</template>
        <el-form ref="editForm" size="small" :model="editFormModel" :rules="ruleEditForm" label-width="auto"
                 v-loading="treeLoading" @submit.native.prevent>
          <el-row>
            <el-col :sm="{ span: 12 }">
              <el-form-item :label="$t('forms.name')" prop="name">
                <el-input ref="name" v-model="editFormModel.name" :disabled="treeLoading"
                          :placeholder="$t('forms.pleaseEnter') + $t('forms.name')"
                          @keyup.enter.native="doSave"/>
              </el-form-item>
            </el-col>
            <el-col :sm="{ span: 12 }">
              <el-form-item :label="$t('forms.code')" prop="code">
                <el-input v-model="editFormModel.code" :disabled="treeLoading"
                          :placeholder="$t('forms.pleaseEnter') + $t('forms.code')"
                          @keyup.enter.native="doSave"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :sm="{ span: 24 }">
              <el-form-item :label="$t('forms.parent')" prop="parentArray">
                <el-cascader :options="cascaderData" v-model="editFormModel.parentArray" :disabled="treeLoading"
                             style="width: 100%" :props="{checkStrictly: true,value:'id'}"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :sm="{ span: 12 }">
              <el-form-item :label="$t('forms.area')" prop="area">
                <el-input v-model="editFormModel.area" :disabled="treeLoading"
                          :placeholder="$t('forms.pleaseEnter') + $t('forms.area')"
                          @keyup.enter.native="doSave"/>
              </el-form-item>
            </el-col>
            <el-col :sm="{ span: 12 }">
              <el-form-item :label="$t('forms.sort')" prop="sort">
                <el-input-number v-model="editFormModel.sort" :disabled="treeLoading"
                                 :placeholder="$t('forms.pleaseEnter') + $t('forms.sort')" :min="0"
                                 @keyup.enter.native="doSave">
                </el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :sm="{ span: 24 }">
              <el-form-item :label="$t('forms.userList')">
                <el-transfer :data="optionalUsers" v-model="editFormModel.userIds" v-loading="treeLoading"
                             :filterable="true" :props="{key:'id',label:'label'}"
                             :titles="[$t('forms.optional'),$t('forms.selected')]"
                             :button-texts="[$t('forms.buttons.cancel'),$t('forms.buttons.select')]"
                             @change="handleUserListChange">
                </el-transfer>
              </el-form-item>
            </el-col>
          </el-row>
          <div style="text-align: center">
            <el-button type="info" :loading="treeLoading" style="margin-right: 20px;"
                       @click="doReset">
              {{ $t('forms.buttons.reset') }}
            </el-button>
            <el-button type="primary" :loading="treeLoading" @click="doSave">
              {{ $t('forms.buttons.submit') }}
            </el-button>
          </div>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>
<script>
import {
  copy,
  sortTreeNodes,
  processTreeNode,
  getTreeFullPathTitle,
  getTreeFullPathArray,
  filterTreeNode
} from '@/libs/tools'
import {nextTick, ref} from "vue";

export default {
  name: 'orgConfig',
  data() {
    return {
      treeData: [{
        id: 'root',
        label: this.$i18n.t('forms.organization'),
        children: []
      }],
      tree_loading: false,
      currOrgFullPath: '',
      currOrgData: {},
      currOrg: {},
      editFormModel: {sort: 0},
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
          required: true,
          message: this.$i18n.t('forms.code') + this.$i18n.t('forms.notEmpty'),
          trigger: 'blur'
        }],
        area: [{
          required: true,
          message: this.$i18n.t('forms.area') + this.$i18n.t('forms.notEmpty'),
          trigger: 'blur'
        }],
        sort: [{
          type: 'integer',
          required: true,
          message: this.$i18n.t('forms.sort') + this.$i18n.t('forms.notEmpty'),
          trigger: 'blur'
        }],
        parentArray: [{
          type: 'array',
          required: true,
          message: this.$i18n.t('forms.parent') + this.$i18n.t('forms.notEmpty'),
          trigger: 'on-change'
        }]
      }
    },
    treeLoading() {
      return this.tree_loading
    },
    cascaderData() {
      return filterTreeNode(copy(this.treeData), [this.editFormModel.id])
    },
    parentArray() {
      return this.editFormModel.parentArray
    }
  },
  watch: {
    parentArray(selectedArray) {
      if (selectedArray.length > 0) {
        this.editFormModel.parentId = selectedArray[selectedArray.length - 1]
      } else {
        this.editFormModel.parentId = ''
      }
    },
    filterText(value) {
      this.orgTree.filter(value)
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value || value === '') {
        return true
      }
      return data.label.indexOf(value) !== -1
    },
    clearCurrOrg(currOrgId) {
      if (!currOrgId || (currOrgId && currOrgId === this.currOrg.id)) {
        this.editFormModel = {
          id: '',
          name: '',
          area: '',
          code: '',
          parentArray: [],
          parentId: '',
          sort: 0,
          userIds: []
        }
        this.currOrg = {
          id: '',
          name: '',
          area: '',
          code: '',
          parentId: '',
          sort: 0,
          userIds: []
        }
        this.currOrgData = {}
      }
    },
    refreshOrgTree(clear = true, callBackFun) {
      if (clear) {
        this.clearCurrOrg()
      }
      this.tree_loading = true
      this.$api.request.org.getOrgList().then((res) => {
        this.tree_loading = false
        if (res) {
          processTreeNode(res.data)
          this.treeData[0].children = res.data
          this.filterText = ''
          if (typeof callBackFun === 'function') {
            callBackFun()
          }
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
    append(data) {
      this.tree_loading = true
      this.$api.request.org.createOrg({
        name: this.$i18n.t('forms.new') + this.$i18n.t('forms.organization'),
        parentId: data.id,
        code: 'code',
        area: 'area',
        sort: data.children.length + 1
      }).then((res) => {
        this.tree_loading = false
        if (res) {
          this.$message.success(this.$i18n.t('messages.createSuccess') + '')
          const children = data.children || []
          processTreeNode([res.data])
          children.push(res.data)
          sortTreeNodes(children)
          this.orgClick(res.data)
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
        this.$api.request.org.deleteOrg([data.id]).then((res) => {
          this.tree_loading = false
          if (res) {
            this.$message.success(this.$i18n.t('messages.deleteSuccess') + '')
            const parent = node.parent
            const children = parent.data.children
            const index = children.findIndex(d => d.id === data.id)
            children.splice(index, 1)
            this.clearCurrOrg(data.id)
          }
        }).catch(() => {
          this.tree_loading = false
        })
      }).catch(() => {
      })
    },
    orgClick(data) {
      this.tree_loading = true
      this.$api.request.org.getOrgInfo(data.id).then((res) => {
        this.tree_loading = false
        if (res) {
          this.currOrgData = data
          this.currOrgData.userIds = res.data.userIds
          this.currOrg = {
            id: this.currOrgData.id,
            name: this.currOrgData.name,
            area: this.currOrgData.area,
            code: this.currOrgData.code,
            parentId: this.currOrgData.parentId,
            sort: this.currOrgData.sort,
            userIds: this.currOrgData.userIds
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
          this.$api.request.org.doUpdateOrg({
            id: this.editFormModel.id,
            name: this.editFormModel.name,
            code: this.editFormModel.code,
            area: this.editFormModel.area,
            parentId: this.editFormModel.parentId,
            sort: this.editFormModel.sort,
            userIds: this.editFormModel.userIds
          }).then((res) => {
            this.tree_loading = false
            if (res) {
              this.reloadUserList()
              this.$message.success(this.$i18n.t('messages.saveSuccess') + '')
              this.currOrgData.name = this.editFormModel.name
              this.currOrgData.label = this.editFormModel.code !== '' ? this.editFormModel.name + '(' + this.editFormModel.code + ')' : this.editFormModel.name
              this.currOrgData.area = this.editFormModel.area
              this.currOrgData.code = this.editFormModel.code
              this.currOrgData.parentId = this.editFormModel.parentId
              this.currOrgData.sort = this.editFormModel.sort
              this.currOrgData.userIds = this.editFormModel.userIds
              this.currOrg = {
                id: this.editFormModel.id,
                name: this.editFormModel.name,
                area: this.editFormModel.area,
                code: this.editFormModel.code,
                parentId: this.editFormModel.parentId,
                sort: this.editFormModel.sort,
                userIds: this.editFormModel.userIds
              }
              this.refreshOrgTree(false, (() => {
                this.currOrgFullPath = getTreeFullPathTitle(this.treeData, this.currOrg.id)
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
        id: this.currOrg.id,
        name: this.currOrg.name,
        area: this.currOrg.area,
        code: this.currOrg.code,
        sort: this.currOrg.sort,
        parentArray: getTreeFullPathArray(this.treeData, this.currOrg.parentId).map(item => item.id),
        parentId: this.currOrg.parentId,
        userIds: this.currOrg.userIds
      }
      this.currOrgFullPath = getTreeFullPathTitle(this.treeData, this.currOrg.id)
    },
    handleUserListChange(newTargetKeys) {
      this.editFormModel.userIds = newTargetKeys
    }
  },
  mounted() {
    this.refreshOrgTree()
    this.reloadUserList()
  },
  activated() {
    if (this.currOrg.id && this.currOrg.id !== '') {
      nextTick(() => {
        this.name.focus()
      })
    }
  },
  setup() {
    const orgTree = ref(null)
    const editForm = ref(null)
    const name = ref(null)
    return {orgTree, editForm, name}
  }
}
</script>
