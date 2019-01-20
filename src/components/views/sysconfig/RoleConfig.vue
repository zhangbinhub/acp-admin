<template>
  <Row :gutter="16">
    <i-col :lg="{ span: 8 }" style="min-width: 300px;margin-bottom: 16px;">
      <Card>
        <Tree :data="treeData" :render="renderContent"></Tree>
      </Card>
    </i-col>
    <i-col :lg="{ span: 16 }" v-show="currRole.id&&currRole.id!==''" style="margin-bottom: 16px;">
      <Card>
        <p style="margin: 0 16px;">{{currRoleFullPath}}</p>
        <Divider style="margin: 12px 0;"/>
        <Tabs size="small">
          <TabPane :label="$t('forms.basicInfo')" icon="md-text">
            <Form ref="editForm" :model="editForm" :rules="ruleEditForm" :label-width="60">
              <Form-item :label="$t('forms.name')" prop="name">
                <i-input ref="name" v-model="editForm.name" :disabled="treeLoading"
                         :placeholder="$t('forms.pleaseEnter') + $t('forms.name')"
                         @on-enter="doSave"></i-input>
              </Form-item>
              <Form-item :label="$t('forms.code')" prop="code">
                <i-select v-model="editForm.code" filterable :disabled="treeLoading" clearable
                          @keyup.enter.native="doSave">
                  <Option v-for="item in roleCodeList" :value="item" :key="item">{{ item }}</Option>
                </i-select>
              </Form-item>
              <Form-item :label="$t('forms.level')" prop="levels">
                <InputNumber v-model="editForm.levels" :disabled="treeLoading" style="width: 100%;max-width: 150px;"
                             :placeholder="$t('forms.pleaseEnter') + $t('forms.level')"
                             @keyup.enter.native="doSave">
                </InputNumber>
              </Form-item>
              <Form-item :label="$t('forms.sort')" prop="sort">
                <InputNumber v-model="editForm.sort" :disabled="treeLoading" style="width: 100%;max-width: 150px;"
                             :placeholder="$t('forms.pleaseEnter') + $t('forms.sort')"
                             @keyup.enter.native="doSave">
                </InputNumber>
              </Form-item>
            </Form>
          </TabPane>
          <TabPane :label="$t('forms.userList')" icon="md-people">
            <Transfer :data="optionalUsers" :target-keys="editForm.user_ids" :list-style="listStyle" filterable
                      :titles="[$t('forms.optional'),$t('forms.selected')]"
                      :operations="[$t('forms.buttons.cancel'),$t('forms.buttons.select')]"
                      @on-change="handleUserListChange">
              <div :style="{float: 'right', margin: '5px'}">
                <Button size="small" @click="reloadUserList" :loading="treeLoading">
                  {{$t('forms.buttons.refresh')}}
                </Button>
              </div>
            </Transfer>
          </TabPane>
          <TabPane :label="$t('forms.menuList')" icon="md-list">
            <Tree ref="menuTree" :data="menuData" show-checkbox multiple
                  style="max-height: 355px;overflow: auto"></Tree>
          </TabPane>
          <TabPane :label="$t('forms.moduleFuncList')" icon="md-apps">
            <Tree ref="moduleFuncTree" :data="moduleFuncData" show-checkbox multiple
                  style="max-height: 355px;overflow: auto"></Tree>
          </TabPane>
        </Tabs>
        <Divider style="margin: 12px 0;"/>
        <div align="center">
          <Button type="default" :loading="treeLoading" size="small" style="margin-right: 20px;"
                  @click="doReset">
            {{$t('forms.buttons.reset')}}
          </Button>
          <Button type="primary" :loading="treeLoading" size="small" @click="doSave">
            {{$t('forms.buttons.submit')}}
          </Button>
        </div>
      </Card>
    </i-col>
  </Row>
</template>
<script>
  import {
    sortTreeNodes,
    processTreeNode,
    getTreeFullPathTitle
  } from '@/libs/tools'

  export default {
    name: 'roleConfig',
    data () {
      return {
        listStyle: {
          width: '210px',
          height: '350px'
        },
        treeData: [],
        menuData: [],
        moduleFuncData: [],
        buttonProps: {
          type: 'default',
          size: 'small'
        },
        tree_loading: false,
        roleCode: [],
        currRoleFullPath: '',
        currRoleData: {},
        currRole: {},
        editForm: {},
        optionalUsers: []
      }
    },
    computed: {
      ruleEditForm () {
        return {
          name: [
            { required: true, message: this.$i18n.t('forms.name') + this.$i18n.t('forms.notEmpty'), trigger: 'blur' }
          ],
          code: [
            {
              type: 'string',
              required: true,
              message: this.$i18n.t('forms.code') + this.$i18n.t('forms.notEmpty'),
              trigger: 'change'
            }
          ],
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
      treeLoading () {
        return this.tree_loading
      },
      roleCodeList () {
        return this.roleCode
      }
    },
    methods: {
      rootRenderContent (h, { root, node, data }) {
        return h('span', {
          style: {
            display: 'inline-block',
            width: '100%'
          }
        }, [
          h('span', [
            h('Icon', {
              props: {
                type: 'md-contacts'
              },
              style: {
                marginRight: '8px'
              }
            }),
            h('span', data.title)
          ]),
          h('span', {
            style: {
              display: 'inline-block',
              float: 'right',
              marginRight: '32px'
            }
          }, [
            h('Button', {
              props: Object.assign({}, this.buttonProps, {
                icon: 'ios-add',
                type: 'primary',
                loading: this.treeLoading
              }),
              style: {
                width: '64px'
              },
              on: {
                click: () => {
                  this.append(data)
                }
              }
            })
          ])
        ])
      },
      renderContent (h, { root, node, data }) {
        return h('span', {
          style: {
            cursor: 'pointer',
            display: 'inline-block',
            width: '100%'
          }
        }, [
          h('span', [
            h('span', {
              class: 'ivu-tree-title',
              on: {
                click: () => {
                  this.treeClick(root, node, data)
                }
              }
            }, data.title)
          ]),
          h('span', {
            style: {
              display: 'inline-block',
              float: 'right',
              marginRight: '32px'
            }
          }, [
            h('Button', {
              props: Object.assign({}, this.buttonProps, {
                icon: 'ios-remove',
                loading: this.treeLoading
              }),
              style: {
                width: '64px'
              },
              on: {
                click: () => {
                  this.remove(root, node, data)
                }
              }
            })
          ])
        ])
      },
      refreshTree () {
        this.tree_loading = true
        this.$api.request.app.getList().then((appres) => {
          if (appres) {
            const appData = appres.data
            for (let i = 0; i < appData.length; i++) {
              const item = appData[i]
              item.name = item.appname
              item.render = this.rootRenderContent
              item.expand = true
              item.title = item.appname
              item.sort = i
              item.children = []
            }
            this.treeData = appData
            this.$api.request.role.getList().then((res) => {
              this.tree_loading = false
              if (res) {
                processTreeNode(res.data)
                for (const item of res.data) {
                  item.parentid = item.appid
                  for (const root of this.treeData) {
                    if (root.id === item.appid) {
                      root.children.push(item)
                    }
                  }
                }
                this.clearCurrObj()
              }
            }).catch(() => {
              this.tree_loading = false
            })
          }
        }).catch(() => {
          this.tree_loading = false
        })
      },
      refreshRoleCodeList () {
        this.tree_loading = true
        this.$api.request.role.getCodeList().then((res) => {
          this.tree_loading = false
          if (res) {
            this.roleCode = res.data
          }
        }).catch(() => {
          this.tree_loading = false
        })
      },
      reloadUserList () {
        this.tree_loading = true
        this.$api.request.user.getModifiableUser().then((res) => {
          this.tree_loading = false
          if (res) {
            this.optionalUsers = res.data.map(item => {
              item.key = item.id
              item.label = item.name + '(' + item.loginno + ')'
              return item
            })
          }
        }).catch(() => {
          this.tree_loading = false
        })
      },
      reloadMenuList () {
        this.tree_loading = true
        this.$api.request.auth.getMenuList(this.currRole.appid).then((res) => {
          this.tree_loading = false
          if (res) {
            processTreeNode(res.data, 1, this.currRole.menu_ids)
            this.menuData = res.data
          }
        }).catch(() => {
          this.tree_loading = false
        })
      },
      reloadModuleFuncList () {
        this.tree_loading = true
        this.$api.request.auth.getModuleFuncList(this.currRole.appid).then((res) => {
          this.tree_loading = false
          if (res) {
            processTreeNode(res.data, 1, this.currRole.module_func_ids)
            this.moduleFuncData = res.data
          }
        }).catch(() => {
          this.tree_loading = false
        })
      },
      clearCurrObj (currRoleId) {
        if (!currRoleId || (currRoleId && currRoleId === this.currRole.id)) {
          this.editForm = {
            id: '',
            name: '',
            code: '',
            levels: 1,
            sort: 0,
            user_ids: [],
            menu_ids: [],
            module_func_ids: []
          }
          this.currRole = {
            id: '',
            appid: '',
            name: '',
            code: '',
            levels: 1,
            sort: 0,
            user_ids: [],
            menu_ids: [],
            module_func_ids: []
          }
          this.currRoleData = {}
        }
      },
      append (data) {
        this.tree_loading = true
        this.$api.request.role.createRole({
          name: this.$i18n.t('forms.new') + this.$i18n.t('forms.role'),
          appid: data.id,
          sort: data.children.length + 1,
          code: 'OTHER',
          levels: 999
        }).then((res) => {
          this.tree_loading = false
          if (res) {
            this.$Message.success(this.$i18n.t('messages.createSuccess'))
            const children = data.children || []
            processTreeNode([res.data])
            children.push(res.data)
            sortTreeNodes(children)
            this.$set(data, 'children', children)
          }
        }).catch(() => {
          this.tree_loading = false
        })
      },
      remove (root, node, data) {
        this.$Modal.confirm({
          title: this.$i18n.t('dialog.confirm'),
          content: this.$i18n.t('messages.deleteDataConfirm') + '<br/>' + getTreeFullPathTitle(this.treeData, data.id),
          onOk: () => {
            this.tree_loading = true
            this.$api.request.role.deleteRole([data.id]).then((res) => {
              this.tree_loading = false
              if (res) {
                this.$Message.success(this.$i18n.t('messages.deleteSuccess'))
                const parentKey = root.find(el => el === node).parent
                const parent = root.find(el => el.nodeKey === parentKey).node
                const index = parent.children.indexOf(data)
                parent.children.splice(index, 1)
                this.clearCurrObj(data.id)
              }
            }).catch(() => {
              this.tree_loading = false
            })
          }
        })
      },
      treeClick (root, node, data) {
        this.tree_loading = true
        this.$api.request.role.getRoleInfo(data.id).then((res) => {
          this.tree_loading = false
          if (res) {
            this.currRoleData = data
            this.currRoleData.user_ids = res.data.user_ids
            this.currRoleData.menu_ids = res.data.menu_ids
            this.currRoleData.module_func_ids = res.data.module_func_ids
            this.currRole = {
              id: this.currRoleData.id,
              appid: this.currRoleData.appid,
              name: this.currRoleData.name,
              code: this.currRoleData.code,
              levels: this.currRoleData.levels,
              sort: this.currRoleData.sort,
              user_ids: this.currRoleData.user_ids,
              menu_ids: this.currRoleData.menu_ids,
              module_func_ids: this.currRoleData.module_func_ids
            }
            this.doReset()
            this.$nextTick(() => {
              this.$refs['name'].focus()
            })
          }
        }).catch(() => {
          this.tree_loading = false
        })
      },
      doSave () {
        this.$refs['editForm'].validate((valid) => {
          if (valid) {
            this.tree_loading = true
            this.$api.request.role.doUpdateRole({
              id: this.editForm.id,
              name: this.editForm.name,
              code: this.editForm.code,
              levels: this.editForm.levels,
              sort: this.editForm.sort,
              user_ids: this.editForm.user_ids,
              menu_ids: this.$refs['menuTree'].getCheckedAndIndeterminateNodes().map(item => item.id),
              module_func_ids: this.$refs['moduleFuncTree'].getCheckedAndIndeterminateNodes().map(item => item.id)
            }).then((res) => {
              this.tree_loading = false
              if (res) {
                this.reloadUserList()
                this.$Message.success(this.$i18n.t('messages.saveSuccess'))
                this.currRoleData.name = this.editForm.name
                this.currRoleData.title = this.editForm.name
                this.currRoleData.label = this.editForm.name
                this.currRoleData.code = this.editForm.code
                this.currRoleData.levels = this.editForm.levels
                this.currRoleData.sort = this.editForm.sort
                this.currRoleData.user_ids = this.editForm.user_ids
                this.currRoleData.menu_ids = this.$refs['menuTree'].getCheckedAndIndeterminateNodes().map(item => item.id)
                this.currRoleData.module_func_ids = this.$refs['moduleFuncTree'].getCheckedAndIndeterminateNodes().map(item => item.id)
                this.currRole = {
                  id: this.editForm.id,
                  appid: this.editForm.appid,
                  name: this.editForm.name,
                  code: this.editForm.code,
                  levels: this.editForm.levels,
                  sort: this.editForm.sort,
                  user_ids: this.editForm.user_ids,
                  menu_ids: this.$refs['menuTree'].getCheckedAndIndeterminateNodes().map(item => item.id),
                  module_func_ids: this.$refs['moduleFuncTree'].getCheckedAndIndeterminateNodes().map(item => item.id)
                }
                this.reloadMenuList()
                this.reloadModuleFuncList()
                this.currRoleFullPath = getTreeFullPathTitle(this.treeData, this.currRole.id)
                sortTreeNodes(this.treeData)
              }
            }).catch(() => {
              this.tree_loading = false
            })
          }
        })
      },
      doReset () {
        this.reloadUserList()
        this.$refs['editForm'].resetFields()
        this.editForm = {
          id: this.currRole.id,
          appid: this.currRole.appid,
          name: this.currRole.name,
          code: this.currRole.code,
          levels: this.currRole.levels,
          sort: this.currRole.sort,
          user_ids: this.currRole.user_ids,
          menu_ids: this.currRole.menu_ids,
          module_func_ids: this.currRole.module_func_ids
        }
        this.reloadMenuList()
        this.reloadModuleFuncList()
        this.currRoleFullPath = getTreeFullPathTitle(this.treeData, this.currRole.id)
      },
      handleUserListChange (newTargetKeys) {
        this.editForm.user_ids = newTargetKeys
      }
    },
    mounted () {
      this.refreshTree()
      this.reloadUserList()
      this.refreshRoleCodeList()
    },
    activated () {
      if (this.currRole.id && this.currRole.id !== '') {
        this.$nextTick(() => {
          this.$refs['name'].focus()
        })
      }
    }
  }
</script>
