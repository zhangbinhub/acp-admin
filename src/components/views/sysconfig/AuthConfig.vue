<template>
  <Tabs capture-focus>
    <TabPane :label="$t('forms.menuList')" icon="md-list">
      <Row :gutter="16">
        <i-col :lg="{ span: 9 }" style="min-width: 300px;margin-bottom: 16px;">
          <Card>
            <div style="max-height: 500px;overflow: auto;">
              <Tree style="margin-right: 16px;" :data="menuTreeData" :render="menuRenderContent"></Tree>
            </div>
          </Card>
        </i-col>
        <i-col :lg="{ span: 15 }" v-show="currMenu.id&&currMenu.id!==''" style="margin-bottom: 16px;">
          <Card>
            <p style="margin: 0 16px;">{{currMenuFullPath}}</p>
            <Divider style="margin: 12px 0;"/>
            <Form ref="menuEditForm" :model="menuEditForm" :rules="ruleMenuEditForm" :label-width="100">
              <Row>
                <i-col :sm="{ span: 12 }">
                  <Form-item :label="$t('forms.name')" prop="name">
                    <i-input v-model="menuEditForm.name" :disabled="treeLoading" size="small"
                             :placeholder="$t('forms.pleaseEnter') + $t('forms.name')"
                             @on-enter="doSaveMenu"></i-input>
                  </Form-item>
                </i-col>
                <i-col :sm="{ span: 12 }">
                  <Form-item :label="$t('forms.iconType')" prop="iconType">
                    <i-input v-model="menuEditForm.iconType" :disabled="treeLoading" size="small"
                             :placeholder="$t('forms.pleaseEnter') + $t('forms.iconType')"
                             @on-enter="doSaveMenu"></i-input>
                  </Form-item>
                </i-col>
              </Row>
              <Row>
                <i-col :sm="{ span: 12 }">
                  <Form-item :label="$t('forms.parent')" prop="menuParentArray">
                    <Cascader :data="menuCascaderData" v-model="menuEditForm.menuParentArray" :disabled="treeLoading"
                              change-on-select
                              @keyup.enter.native="doSaveMenu"></Cascader>
                  </Form-item>
                </i-col>
                <i-col :sm="{ span: 12 }">
                  <Form-item :label="$t('forms.path')" prop="path">
                    <i-input v-model="menuEditForm.path" :disabled="treeLoading" size="small"
                             :placeholder="$t('forms.pleaseEnter') + $t('forms.path')"
                             @on-enter="doSaveMenu"></i-input>
                  </Form-item>
                </i-col>
              </Row>
              <Row>
                <i-col :sm="{ span: 12 }">
                  <Form-item :label="$t('forms.opentype')" prop="opentype">
                    <i-select v-model="menuEditForm.opentype" @keyup.enter.native="doSaveMenu">
                      <i-option v-for="item in openType" :value="item.value" :key="'opentype-'+item.value">
                        {{item.label}}
                      </i-option>
                    </i-select>
                  </Form-item>
                </i-col>
                <i-col :sm="{ span: 12 }">
                  <Form-item :label="$t('forms.sort')" prop="sort">
                    <InputNumber v-model="menuEditForm.sort" :disabled="treeLoading" :min="0"
                                 style="width: 100%;max-width: 150px;"
                                 size="small" :placeholder="$t('forms.pleaseEnter') + $t('forms.sort')"
                                 @keyup.enter.native="doSaveMenu">
                    </InputNumber>
                  </Form-item>
                </i-col>
              </Row>
              <Row>
                <i-col :sm="{ span: 12 }">
                  <Form-item :label="$t('forms.enabled')" prop="enabled" required>
                    <Switch v-model="menuEditForm.enabled" @keyup.enter.native="doSaveMenu">
                      <Icon type="md-checkmark" slot="open"></Icon>
                      <Icon type="md-close" slot="close"></Icon>
                    </Switch>
                  </Form-item>
                </i-col>
              </Row>
              <Form-item :label="$t('forms.roleList')">
                <Transfer :data="optionalMenuRoles" :target-keys="menuEditForm.roleIds" :list-style="listStyle"
                          filterable
                          :titles="[$t('forms.optional'),$t('forms.selected')]"
                          :operations="[$t('forms.buttons.cancel'),$t('forms.buttons.select')]"
                          @on-change="handleMenuRoleListChange">
                  <div :style="{float: 'right', margin: '5px'}">
                    <Button size="small" @click="reloadMenuRoleList" :loading="treeLoading">
                      {{$t('forms.buttons.refresh')}}
                    </Button>
                  </div>
                </Transfer>
              </Form-item>
              <Divider style="margin: 12px 0;"/>
              <div style="text-align: center">
                <Button type="default" size="small" :loading="treeLoading" style="margin-right: 20px;"
                        @click="doResetMenu">
                  {{$t('forms.buttons.reset')}}
                </Button>
                <Button type="primary" size="small" :loading="treeLoading" @click="doSaveMenu">
                  {{$t('forms.buttons.submit')}}
                </Button>
              </div>
            </Form>
            <Spin size="large" fix v-if="treeLoading"></Spin>
          </Card>
        </i-col>
      </Row>
    </TabPane>
    <TabPane :label="$t('forms.moduleFuncList')" icon="md-apps">
      <Row :gutter="16">
        <i-col :lg="{ span: 9 }" style="min-width: 300px;margin-bottom: 16px;">
          <Card>
            <div style="max-height: 500px;overflow: auto;">
              <Tree style="margin-right: 16px;" :data="moduleFuncTreeData" :render="moduleFuncRenderContent"></Tree>
            </div>
          </Card>
        </i-col>
        <i-col :lg="{ span: 15 }" v-show="currModuleFunc.id&&currModuleFunc.id!==''" style="margin-bottom: 16px;">
          <Card>
            <p style="margin: 0 16px;">{{currModuleFuncFullPath}}</p>
            <Divider style="margin: 12px 0;"/>
            <Form ref="moduleFuncEditForm" :model="moduleFuncEditForm" :rules="ruleModuleFuncEditForm"
                  :label-width="100">
              <Row>
                <i-col :sm="{ span: 12 }">
                  <Form-item :label="$t('forms.name')" prop="name">
                    <i-input v-model="moduleFuncEditForm.name" :disabled="treeLoading" size="small"
                             :placeholder="$t('forms.pleaseEnter') + $t('forms.name')"
                             @on-enter="doSaveModuleFunc"></i-input>
                  </Form-item>
                </i-col>
                <i-col :sm="{ span: 12 }">
                  <Form-item :label="$t('forms.code')" prop="code">
                    <i-select v-model="moduleFuncEditForm.code" filterable :disabled="treeLoading" size="small"
                              @keyup.enter.native="doSaveModuleFunc">
                      <Option v-for="item in moduleFuncCodeList" :value="item" :key="item">{{ item }}</Option>
                    </i-select>
                  </Form-item>
                </i-col>
              </Row>
              <Row>
                <i-col :sm="{ span: 24 }">
                  <Form-item :label="$t('forms.parent')" prop="moduleFuncParentArray">
                    <Cascader :data="moduleFuncCascaderData" v-model="moduleFuncEditForm.moduleFuncParentArray"
                              :disabled="treeLoading" change-on-select
                              @keyup.enter.native="doSaveModuleFunc"></Cascader>
                  </Form-item>
                </i-col>
              </Row>
              <Form-item :label="$t('forms.roleList')">
                <Transfer :data="optionalModuleFuncRoles" :target-keys="moduleFuncEditForm.roleIds"
                          :list-style="listStyle" filterable
                          :titles="[$t('forms.optional'),$t('forms.selected')]"
                          :operations="[$t('forms.buttons.cancel'),$t('forms.buttons.select')]"
                          @on-change="handleModuleFuncRoleListChange">
                  <div :style="{float: 'right', margin: '5px'}">
                    <Button size="small" @click="reloadModuleFuncRoleList" :loading="treeLoading">
                      {{$t('forms.buttons.refresh')}}
                    </Button>
                  </div>
                </Transfer>
              </Form-item>
              <Divider style="margin: 12px 0;"/>
              <div style="text-align: center">
                <Button type="default" size="small" :loading="treeLoading" style="margin-right: 20px;"
                        @click="doResetModuleFunc">
                  {{$t('forms.buttons.reset')}}
                </Button>
                <Button type="primary" size="small" :loading="treeLoading" @click="doSaveModuleFunc">
                  {{$t('forms.buttons.submit')}}
                </Button>
              </div>
            </Form>
            <Spin size="large" fix v-if="treeLoading"></Spin>
          </Card>
        </i-col>
      </Row>
    </TabPane>
  </Tabs>
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

  export default {
    name: 'authConfig',
    data () {
      return {
        listStyle: {
          width: '210px',
          height: '283px'
        },
        menuTreeData: [],
        moduleFuncTreeData: [],
        buttonProps: {
          type: 'default',
          size: 'small'
        },
        tree_loading: false,
        moduleFuncCode: [],
        currMenuFullPath: '',
        currMenuData: {},
        currMenu: {},
        menuEditForm: {},
        currModuleFuncFullPath: '',
        currModuleFuncData: {},
        currModuleFunc: {},
        moduleFuncEditForm: {},
        optionalMenuRoles: [],
        optionalModuleFuncRoles: []
      }
    },
    computed: {
      treeLoading () {
        return this.tree_loading
      },
      openType () {
        return [{
          value: 0,
          label: this.$i18n.t('forms.inner')
        }, {
          value: 1,
          label: this.$i18n.t('forms.newTabs')
        }]
      },
      moduleFuncCodeList () {
        return this.moduleFuncCode
      },
      menuCascaderData () {
        const menuTree = copy(this.menuTreeData)
        for (let i = 0; i < menuTree.length; i++) {
          if (menuTree[i].id !== this.menuEditForm.appid) {
            menuTree.splice(i, 1)
            break
          }
        }
        return filterTreeNode(menuTree, [this.menuEditForm.id])
      },
      moduleFuncCascaderData () {
        const moduleFuncTree = copy(this.moduleFuncTreeData)
        for (let i = 0; i < moduleFuncTree.length; i++) {
          if (moduleFuncTree[i].id !== this.moduleFuncEditForm.appid) {
            moduleFuncTree.splice(i, 1)
            break
          }
        }
        return filterTreeNode(moduleFuncTree, [this.moduleFuncEditForm.id])
      },
      menuParentArray () {
        return this.menuEditForm.menuParentArray
      },
      moduleFuncParentArray () {
        return this.moduleFuncEditForm.moduleFuncParentArray
      },
      ruleMenuEditForm () {
        return {
          name: [
            { required: true, message: this.$i18n.t('forms.name') + this.$i18n.t('forms.notEmpty'), trigger: 'blur' }
          ],
          iconType: [
            {
              required: true,
              message: this.$i18n.t('forms.iconType') + this.$i18n.t('forms.notEmpty'),
              trigger: 'blur'
            }
          ],
          path: [
            { required: true, message: this.$i18n.t('forms.path') + this.$i18n.t('forms.notEmpty'), trigger: 'blur' }
          ],
          opentype: [{
            type: 'integer',
            required: true,
            message: this.$i18n.t('forms.opentype') + this.$i18n.t('forms.notEmpty'),
            trigger: 'change'
          }],
          sort: [{
            type: 'integer',
            required: true,
            message: this.$i18n.t('forms.sort') + this.$i18n.t('forms.notEmpty'),
            trigger: 'blur'
          }],
          menuParentArray: [{
            type: 'array',
            required: true,
            message: this.$i18n.t('forms.parent') + this.$i18n.t('forms.notEmpty'),
            trigger: 'on-change'
          }]
        }
      },
      ruleModuleFuncEditForm () {
        return {
          name: [
            { required: true, message: this.$i18n.t('forms.name') + this.$i18n.t('forms.notEmpty'), trigger: 'blur' }
          ],
          code: [{
            type: 'string',
            required: true,
            message: this.$i18n.t('forms.code') + this.$i18n.t('forms.notEmpty'),
            trigger: 'change'
          }],
          moduleFuncParentArray: [{
            type: 'array',
            required: true,
            message: this.$i18n.t('forms.parent') + this.$i18n.t('forms.notEmpty'),
            trigger: 'on-change'
          }]
        }
      }
    },
    watch: {
      menuParentArray (selectedArray) {
        if (selectedArray.length > 0) {
          this.menuEditForm.parentid = selectedArray[selectedArray.length - 1]
        } else {
          this.menuEditForm.parentid = ''
        }
      },
      moduleFuncParentArray (selectedArray) {
        if (selectedArray.length > 0) {
          this.moduleFuncEditForm.parentid = selectedArray[selectedArray.length - 1]
        } else {
          this.moduleFuncEditForm.parentid = ''
        }
      }
    },
    methods: {
      rootMenuRenderContent (h, { root, node, data }) {
        return h('span', {
          style: {
            display: 'inline-block',
            width: '100%'
          }
        }, [
          h('span', [
            h('Icon', {
              props: {
                type: 'md-list'
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
                  this.appendMenu(data)
                }
              }
            })
          ])
        ])
      },
      rootModuleFuncRenderContent (h, { root, node, data }) {
        return h('span', {
          style: {
            display: 'inline-block',
            width: '100%'
          }
        }, [
          h('span', [
            h('Icon', {
              props: {
                type: 'md-apps'
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
                  this.appendModuleFunc(data)
                }
              }
            })
          ])
        ])
      },
      menuRenderContent (h, { root, node, data }) {
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
                  this.menuClick(root, node, data)
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
                icon: 'ios-add',
                loading: this.treeLoading
              }),
              style: {
                marginRight: '8px'
              },
              on: {
                click: () => {
                  this.appendMenu(data)
                }
              }
            }),
            h('Button', {
              props: Object.assign({}, this.buttonProps, {
                icon: 'ios-remove',
                loading: this.treeLoading
              }),
              on: {
                click: () => {
                  this.removeMenu(root, node, data)
                }
              }
            })
          ])
        ])
      },
      moduleFuncRenderContent (h, { root, node, data }) {
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
                  this.moduleFuncClick(root, node, data)
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
                icon: 'ios-add',
                loading: this.treeLoading
              }),
              style: {
                marginRight: '8px'
              },
              on: {
                click: () => {
                  this.appendModuleFunc(data)
                }
              }
            }),
            h('Button', {
              props: Object.assign({}, this.buttonProps, {
                icon: 'ios-remove',
                loading: this.treeLoading
              }),
              on: {
                click: () => {
                  this.removeModuleFunc(root, node, data)
                }
              }
            })
          ])
        ])
      },
      refreshModuleFuncCodeList () {
        this.tree_loading = true
        this.$api.request.auth.getModuleFuncCodeList().then((res) => {
          this.tree_loading = false
          if (res) {
            this.moduleFuncCode = res.data
          }
        }).catch(() => {
          this.tree_loading = false
        })
      },
      reloadMenuRoleList () {
        this.tree_loading = true
        this.$api.request.role.getRoleList(this.currMenu.appid).then((res) => {
          this.tree_loading = false
          if (res) {
            this.optionalMenuRoles = res.data.map(item => {
              item.key = item.id
              item.label = item.name
              return item
            })
          }
        }).catch(() => {
          this.tree_loading = false
        })
      },
      reloadModuleFuncRoleList () {
        this.tree_loading = true
        this.$api.request.role.getRoleList(this.currModuleFunc.appid).then((res) => {
          this.tree_loading = false
          if (res) {
            this.optionalModuleFuncRoles = res.data.map(item => {
              item.key = item.id
              item.label = item.name
              return item
            })
          }
        }).catch(() => {
          this.tree_loading = false
        })
      },
      refreshMenuTree () {
        this.tree_loading = true
        this.$api.request.app.getList().then((appres) => {
          if (appres) {
            const appData = appres.data
            for (let i = 0; i < appData.length; i++) {
              const item = appData[i]
              item.value = item.id
              item.appid = item.id
              item.name = item.appname
              item.label = item.appname
              item.render = this.rootMenuRenderContent
              item.expand = true
              item.title = item.appname
              item.sort = i
              item.children = []
            }
            this.menuTreeData = appData
            this.$api.request.auth.getAllMenuList().then((res) => {
              this.tree_loading = false
              if (res) {
                processTreeNode(res.data)
                for (const item of res.data) {
                  item.parentid = item.appid
                  for (const root of this.menuTreeData) {
                    if (root.id === item.appid) {
                      root.children.push(item)
                    }
                  }
                }
                this.clearMenuCurrObj()
              }
            }).catch(() => {
              this.tree_loading = false
            })
          }
        }).catch(() => {
          this.tree_loading = false
        })
      },
      refreshModuleFuncTree () {
        this.tree_loading = true
        this.$api.request.app.getList().then((appres) => {
          if (appres) {
            const appData = appres.data
            for (let i = 0; i < appData.length; i++) {
              const item = appData[i]
              item.value = item.id
              item.appid = item.id
              item.name = item.appname
              item.label = item.appname
              item.render = this.rootModuleFuncRenderContent
              item.expand = true
              item.title = item.appname
              item.children = []
            }
            this.moduleFuncTreeData = appData
            this.$api.request.auth.getAllModuleFuncList().then((res) => {
              this.tree_loading = false
              if (res) {
                processTreeNode(res.data)
                for (const item of res.data) {
                  item.parentid = item.appid
                  for (const root of this.moduleFuncTreeData) {
                    if (root.id === item.appid) {
                      root.children.push(item)
                    }
                  }
                }
                this.clearModuleFuncCurrObj()
              }
            }).catch(() => {
              this.tree_loading = false
            })
          }
        }).catch(() => {
          this.tree_loading = false
        })
      },
      clearMenuCurrObj (currMenuId) {
        if (!currMenuId || (currMenuId && currMenuId === this.currMenu.id)) {
          this.menuEditForm = {
            id: '',
            appid: '',
            name: '',
            iconType: '',
            path: '',
            enabled: true,
            opentype: 0,
            menuParentArray: [],
            parentid: '',
            sort: 0,
            roleIds: []
          }
          this.currMenu = {
            id: '',
            appid: '',
            name: '',
            iconType: '',
            path: '',
            enabled: true,
            opentype: 0,
            parentid: '',
            sort: 0,
            roleIds: []
          }
          this.currMenuData = {}
        }
      },
      clearModuleFuncCurrObj (currModuleFuncId) {
        if (!currModuleFuncId || (currModuleFuncId && currModuleFuncId === this.currModuleFunc.id)) {
          this.moduleFuncEditForm = {
            id: '',
            appid: '',
            name: '',
            code: '',
            moduleFuncParentArray: [],
            parentid: '',
            roleIds: []
          }
          this.currModuleFunc = {
            id: '',
            appid: '',
            name: '',
            code: '',
            parentid: '',
            roleIds: []
          }
          this.currModuleFuncData = {}
        }
      },
      appendMenu (data) {
        this.tree_loading = true
        this.$api.request.auth.createMenu({
          appid: data.appid,
          name: this.$i18n.t('forms.new') + this.$i18n.t('forms.menu'),
          iconType: 'md-funnel',
          path: '/',
          parentid: data.id,
          enabled: false,
          opentype: 0,
          sort: data.children.length + 1
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
      appendModuleFunc (data) {
        this.tree_loading = true
        this.$api.request.auth.createModuleFunc({
          appid: data.appid,
          name: this.$i18n.t('forms.new') + this.$i18n.t('forms.moduleFunc'),
          code: 'other',
          parentid: data.id
        }).then((res) => {
          this.tree_loading = false
          if (res) {
            this.$Message.success(this.$i18n.t('messages.createSuccess'))
            const children = data.children || []
            processTreeNode([res.data])
            children.push(res.data)
            sortTreeNodes(children, 'code')
            this.$set(data, 'children', children)
          }
        }).catch(() => {
          this.tree_loading = false
        })
      },
      removeMenu (root, node, data) {
        if (!data.covert) {
          this.$Modal.error({
            title: this.$i18n.t('dialog.error'),
            content: this.$i18n.t('messages.tableDataCannotDel') + '<br/>' + getTreeFullPathTitle(this.menuTreeData, data.id)
          })
          return
        }
        this.$Modal.confirm({
          title: this.$i18n.t('dialog.confirm'),
          content: this.$i18n.t('messages.deleteDataConfirm') + '<br/>' + getTreeFullPathTitle(this.menuTreeData, data.id),
          onOk: () => {
            this.tree_loading = true
            this.$api.request.auth.deleteMenu([data.id]).then((res) => {
              this.tree_loading = false
              if (res) {
                this.$Message.success(this.$i18n.t('messages.deleteSuccess'))
                const parentKey = root.find(el => el === node).parent
                const parent = root.find(el => el.nodeKey === parentKey).node
                const index = parent.children.indexOf(data)
                parent.children.splice(index, 1)
                this.clearMenuCurrObj(data.id)
              }
            }).catch(() => {
              this.tree_loading = false
            })
          }
        })
      },
      removeModuleFunc (root, node, data) {
        if (!data.covert) {
          this.$Modal.error({
            title: this.$i18n.t('dialog.error'),
            content: this.$i18n.t('messages.tableDataCannotDel') + '<br/>' + getTreeFullPathTitle(this.menuTreeData, data.id)
          })
          return
        }
        this.$Modal.confirm({
          title: this.$i18n.t('dialog.confirm'),
          content: this.$i18n.t('messages.deleteDataConfirm') + '<br/>' + getTreeFullPathTitle(this.moduleFuncTreeData, data.id),
          onOk: () => {
            this.tree_loading = true
            this.$api.request.auth.deleteModuleFunc([data.id]).then((res) => {
              this.tree_loading = false
              if (res) {
                this.$Message.success(this.$i18n.t('messages.deleteSuccess'))
                const parentKey = root.find(el => el === node).parent
                const parent = root.find(el => el.nodeKey === parentKey).node
                const index = parent.children.indexOf(data)
                parent.children.splice(index, 1)
                this.clearModuleFuncCurrObj(data.id)
              }
            }).catch(() => {
              this.tree_loading = false
            })
          }
        })
      },
      menuClick (root, node, data) {
        this.tree_loading = true
        this.$api.request.auth.getMenuInfo(data.id).then((res) => {
          this.tree_loading = false
          if (res) {
            this.currMenuData = data
            this.currMenuData.roleIds = res.data.roleIds
            this.currMenu = {
              id: this.currMenuData.id,
              appid: this.currMenuData.appid,
              name: this.currMenuData.name,
              iconType: this.currMenuData.iconType,
              path: this.currMenuData.path,
              enabled: this.currMenuData.enabled,
              opentype: this.currMenuData.opentype,
              parentid: this.currMenuData.parentid,
              sort: this.currMenuData.sort,
              roleIds: this.currMenuData.roleIds
            }
            this.doResetMenu()
          }
        }).catch(() => {
          this.tree_loading = false
        })
      },
      moduleFuncClick (root, node, data) {
        this.tree_loading = true
        this.$api.request.auth.getModuleFuncInfo(data.id).then((res) => {
          this.tree_loading = false
          if (res) {
            this.currModuleFuncData = data
            this.currModuleFuncData.roleIds = res.data.roleIds
            this.currModuleFunc = {
              id: this.currModuleFuncData.id,
              appid: this.currModuleFuncData.appid,
              name: this.currModuleFuncData.name,
              code: this.currModuleFuncData.code,
              parentid: this.currModuleFuncData.parentid,
              roleIds: this.currModuleFuncData.roleIds
            }
            this.doResetModuleFunc()
          }
        }).catch(() => {
          this.tree_loading = false
        })
      },
      doSaveMenu () {
        this.$refs['menuEditForm'].validate((valid) => {
          if (valid) {
            this.tree_loading = true
            this.$api.request.auth.doUpdateMenu({
              id: this.menuEditForm.id,
              appid: this.menuEditForm.appid,
              name: this.menuEditForm.name,
              iconType: this.menuEditForm.iconType,
              path: this.menuEditForm.path,
              parentid: this.menuEditForm.parentid,
              enabled: this.menuEditForm.enabled,
              opentype: this.menuEditForm.opentype,
              sort: this.menuEditForm.sort,
              roleIds: this.menuEditForm.roleIds
            }).then((res) => {
              this.tree_loading = false
              if (res) {
                let oldParentId = this.currMenuData.parentid
                this.reloadMenuRoleList()
                this.$Message.success(this.$i18n.t('messages.saveSuccess'))
                this.currMenuData.name = this.menuEditForm.name
                this.currMenuData.title = this.menuEditForm.name
                this.currMenuData.label = this.menuEditForm.name
                this.currMenuData.iconType = this.menuEditForm.iconType
                this.currMenuData.path = this.menuEditForm.path
                this.currMenuData.parentid = this.menuEditForm.parentid
                this.currMenuData.enabled = this.menuEditForm.enabled
                this.currMenuData.opentype = this.menuEditForm.opentype
                this.currMenuData.sort = this.menuEditForm.sort
                this.currMenuData.roleIds = this.menuEditForm.roleIds
                this.currMenu = {
                  id: this.menuEditForm.id,
                  appid: this.menuEditForm.appid,
                  name: this.menuEditForm.name,
                  iconType: this.menuEditForm.iconType,
                  path: this.menuEditForm.path,
                  parentid: this.menuEditForm.parentid,
                  enabled: this.menuEditForm.enabled,
                  opentype: this.menuEditForm.opentype,
                  sort: this.menuEditForm.sort,
                  roleIds: this.menuEditForm.roleIds
                }
                this.currMenuFullPath = getTreeFullPathTitle(this.menuTreeData, this.currMenu.id)
                if (oldParentId === this.currMenuData.parentid) {
                  sortTreeNodes(this.menuTreeData)
                } else {
                  this.refreshMenuTree()
                }
              }
            }).catch(() => {
              this.tree_loading = false
            })
          }
        })
      },
      doSaveModuleFunc () {
        this.$refs['moduleFuncEditForm'].validate((valid) => {
          if (valid) {
            this.tree_loading = true
            this.$api.request.auth.doUpdateModuleFunc({
              id: this.moduleFuncEditForm.id,
              appid: this.moduleFuncEditForm.appid,
              name: this.moduleFuncEditForm.name,
              code: this.moduleFuncEditForm.code,
              parentid: this.moduleFuncEditForm.parentid,
              roleIds: this.moduleFuncEditForm.roleIds
            }).then((res) => {
              this.tree_loading = false
              if (res) {
                let oldParentId = this.currModuleFuncData.parentid
                this.reloadModuleFuncRoleList()
                this.$Message.success(this.$i18n.t('messages.saveSuccess'))
                this.currModuleFuncData.name = this.moduleFuncEditForm.name
                this.currModuleFuncData.title = this.moduleFuncEditForm.name
                this.currModuleFuncData.label = this.moduleFuncEditForm.name
                this.currModuleFuncData.code = this.moduleFuncEditForm.code
                this.currModuleFuncData.parentid = this.moduleFuncEditForm.parentid
                this.currModuleFuncData.roleIds = this.moduleFuncEditForm.roleIds
                this.currModuleFunc = {
                  id: this.moduleFuncEditForm.id,
                  appid: this.moduleFuncEditForm.appid,
                  name: this.moduleFuncEditForm.name,
                  code: this.moduleFuncEditForm.code,
                  parentid: this.moduleFuncEditForm.parentid,
                  roleIds: this.moduleFuncEditForm.roleIds
                }
                this.currModuleFuncFullPath = getTreeFullPathTitle(this.moduleFuncTreeData, this.currModuleFunc.id)
                if (oldParentId === this.currModuleFuncData.parentid) {
                  sortTreeNodes(this.moduleFuncTreeData, 'code')
                } else {
                  this.refreshModuleFuncTree()
                }
              }
            }).catch(() => {
              this.tree_loading = false
            })
          }
        })
      },
      doResetMenu () {
        this.$refs['menuEditForm'].resetFields()
        this.menuEditForm = {
          id: this.currMenu.id,
          appid: this.currMenu.appid,
          name: this.currMenu.name,
          iconType: this.currMenu.iconType,
          path: this.currMenu.path,
          enabled: this.currMenu.enabled,
          opentype: this.currMenu.opentype,
          menuParentArray: getTreeFullPathArray(this.menuTreeData, this.currMenu.parentid).map(item => item.id),
          parentid: this.currMenu.parentid,
          sort: this.currMenu.sort,
          roleIds: this.currMenu.roleIds
        }
        this.reloadMenuRoleList()
        this.currMenuFullPath = getTreeFullPathTitle(this.menuTreeData, this.currMenu.id)
      },
      doResetModuleFunc () {
        this.$refs['moduleFuncEditForm'].resetFields()
        this.moduleFuncEditForm = {
          id: this.currModuleFunc.id,
          appid: this.currModuleFunc.appid,
          name: this.currModuleFunc.name,
          code: this.currModuleFunc.code,
          moduleFuncParentArray: getTreeFullPathArray(this.moduleFuncTreeData, this.currModuleFunc.parentid).map(item => item.id),
          parentid: this.currModuleFunc.parentid,
          roleIds: this.currModuleFunc.roleIds
        }
        this.reloadModuleFuncRoleList()
        this.currModuleFuncFullPath = getTreeFullPathTitle(this.moduleFuncTreeData, this.currModuleFunc.id)
      },
      handleMenuRoleListChange (newTargetKeys) {
        this.menuEditForm.roleIds = newTargetKeys
      },
      handleModuleFuncRoleListChange (newTargetKeys) {
        this.moduleFuncEditForm.roleIds = newTargetKeys
      }
    },
    mounted () {
      this.refreshMenuTree()
      this.refreshModuleFuncTree()
      this.refreshModuleFuncCodeList()
    }
  }
</script>
