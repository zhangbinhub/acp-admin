<template>
  <Row :gutter="16">
    <i-col :lg="{ span: 9 }" style="min-width: 300px;margin-bottom: 16px;">
      <Card>
        <div style="max-height: 500px;overflow: auto;">
          <Tree style="margin-right: 16px;" :data="treeData" :render="renderContent"></Tree>
        </div>
      </Card>
    </i-col>
    <i-col :lg="{ span: 15 }" v-show="currRole.id&&currRole.id!==''" style="margin-bottom: 16px;">
      <Card>
        <p style="margin: 0 16px;">{{currRoleFullPath}}</p>
        <Divider style="margin: 12px 0;"/>
        <Tabs size="small" :capture-focus="true">
          <TabPane :label="$t('forms.basicInfo')" icon="md-text">
            <Form ref="editForm" :model="editForm" :rules="ruleEditForm" :label-width="60">
              <Form-item :label="$t('forms.name')" prop="name">
                <label>
                  <Input ref="name" v-model="editForm.name" :disabled="treeLoading"
                         :placeholder="$t('forms.pleaseEnter') + $t('forms.name')"
                         @on-enter="doSave"></Input>
                </label>
              </Form-item>
              <Form-item :label="$t('forms.code')" prop="code">
                <AutoComplete v-model="editForm.code" :filterable="true" :disabled="treeLoading" :data="roleCode"
                              @keyup.enter.native="doSave"></AutoComplete>
              </Form-item>
              <Form-item :label="$t('forms.level')" prop="levels">
                <InputNumber v-model="editForm.levels" :disabled="treeLoading" style="width: 100%;max-width: 150px;"
                             :placeholder="$t('forms.pleaseEnter') + $t('forms.level')" :min="0"
                             @keyup.enter.native="doSave">
                </InputNumber>
              </Form-item>
              <Form-item :label="$t('forms.sort')" prop="sort">
                <InputNumber v-model="editForm.sort" :disabled="treeLoading" style="width: 100%;max-width: 150px;"
                             :placeholder="$t('forms.pleaseEnter') + $t('forms.sort')" :min="0"
                             @keyup.enter.native="doSave">
                </InputNumber>
              </Form-item>
            </Form>
          </TabPane>
          <TabPane :label="$t('forms.userList')" icon="md-people">
            <Transfer :data="optionalUsers" :target-keys="editForm.userIds" :list-style="listStyle" :filterable="true"
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
            <Tree ref="menuTree" :data="menuData" :show-checkbox="true" :check-directly="true"></Tree>
          </TabPane>
          <TabPane :label="$t('forms.moduleFuncList')" icon="md-apps">
            <Tree ref="moduleFuncTree" :data="moduleFuncData" :show-checkbox="true" :check-directly="true"></Tree>
          </TabPane>
        </Tabs>
        <Divider style="margin: 12px 0;"/>
        <div style="text-align: center">
          <Button type="default" :loading="treeLoading" size="small" style="margin-right: 20px;"
                  @click="doReset">
            {{$t('forms.buttons.reset')}}
          </Button>
          <Button type="primary" :loading="treeLoading" size="small" @click="doSave">
            {{$t('forms.buttons.submit')}}
          </Button>
        </div>
        <Spin size="large" :fix="true" v-if="treeLoading"></Spin>
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
                        {
                            required: true,
                            message: this.$i18n.t('forms.name') + this.$i18n.t('forms.notEmpty'),
                            trigger: 'blur'
                        }
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
                            item.appId = item.id
                            item.name = item.appName
                            item.render = this.rootRenderContent
                            item.expand = true
                            item.title = item.appName
                            item.sort = i
                            item.children = []
                        }
                        this.treeData = appData
                        this.$api.request.role.getList().then((res) => {
                            this.tree_loading = false
                            if (res) {
                                processTreeNode(res.data)
                                for (const item of res.data) {
                                    item.parentId = item.appId
                                    for (const root of this.treeData) {
                                        if (root.id === item.appId) {
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
                            item.label = item.name + '(' + item.loginNo + ')'
                            return item
                        })
                    }
                }).catch(() => {
                    this.tree_loading = false
                })
            },
            reloadMenuList () {
                this.tree_loading = true
                this.$api.request.auth.getMenuList(this.currRole.appId).then((res) => {
                    this.tree_loading = false
                    if (res) {
                        processTreeNode(res.data, 1, this.currRole.menuIds)
                        this.menuData = res.data
                    }
                }).catch(() => {
                    this.tree_loading = false
                })
            },
            reloadModuleFuncList () {
                this.tree_loading = true
                this.$api.request.auth.getModuleFuncList(this.currRole.appId).then((res) => {
                    this.tree_loading = false
                    if (res) {
                        processTreeNode(res.data, 1, this.currRole.moduleFuncIds)
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
            append (data) {
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
                    title: this.$i18n.t('dialog.confirm') + '',
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
                            userIds: this.editForm.userIds,
                            menuIds: this.$refs['menuTree'].getCheckedAndIndeterminateNodes().map(item => item.id),
                            moduleFuncIds: this.$refs['moduleFuncTree'].getCheckedAndIndeterminateNodes().map(item => item.id)
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
                                this.currRoleData.userIds = this.editForm.userIds
                                this.currRoleData.menuIds = this.$refs['menuTree'].getCheckedAndIndeterminateNodes().map(item => item.id)
                                this.currRoleData.moduleFuncIds = this.$refs['moduleFuncTree'].getCheckedAndIndeterminateNodes().map(item => item.id)
                                this.currRole = {
                                    id: this.editForm.id,
                                    appId: this.editForm.appId,
                                    name: this.editForm.name,
                                    code: this.editForm.code,
                                    levels: this.editForm.levels,
                                    sort: this.editForm.sort,
                                    userIds: this.editForm.userIds,
                                    menuIds: this.$refs['menuTree'].getCheckedAndIndeterminateNodes().map(item => item.id),
                                    moduleFuncIds: this.$refs['moduleFuncTree'].getCheckedAndIndeterminateNodes().map(item => item.id)
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
                    appId: this.currRole.appId,
                    name: this.currRole.name,
                    code: this.currRole.code,
                    levels: this.currRole.levels,
                    sort: this.currRole.sort,
                    userIds: this.currRole.userIds,
                    menuIds: this.currRole.menuIds,
                    moduleFuncIds: this.currRole.moduleFuncIds
                }
                this.reloadMenuList()
                this.reloadModuleFuncList()
                this.currRoleFullPath = getTreeFullPathTitle(this.treeData, this.currRole.id)
            },
            handleUserListChange (newTargetKeys) {
                this.editForm.userIds = newTargetKeys
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
