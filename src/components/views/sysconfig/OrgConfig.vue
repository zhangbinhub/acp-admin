<template>
  <Row :gutter="16">
    <i-col :lg="{ span: 8 }" style="min-width: 300px;margin-bottom: 16px;">
      <Card>
        <Tree :data="treeData" :render="renderContent"></Tree>
      </Card>
    </i-col>
    <i-col :lg="{ span: 16 }" v-show="currOrg.id!==''" style="margin-bottom: 16px;">
      <Card>
        <p style="margin: 0 16px;">{{currOrgFullPath}}</p>
        <Divider style="margin: 12px 0;"/>
        <Form ref="editForm" :model="editForm" :rules="ruleEditForm" :label-width="60">
          <Row>
            <Form-item :label="$t('forms.name')" prop="name">
              <i-input ref="name" v-model="editForm.name" :disabled="treeLoading" size="small"
                       :placeholder="$t('forms.pleaseEnter') + $t('forms.name')"
                       @on-enter="doSave('editForm')"></i-input>
            </Form-item>
            <i-col span="12">
              <Form-item :label="$t('forms.code')" prop="code">
                <i-input v-model="editForm.code" :disabled="treeLoading" size="small"
                         :placeholder="$t('forms.pleaseEnter') + $t('forms.code')"
                         @on-enter="doSave('editForm')"></i-input>
              </Form-item>
            </i-col>
            <i-col span="12">
              <Form-item :label="$t('forms.sort')" prop="sort">
                <InputNumber v-model="editForm.sort" :disabled="treeLoading" style="width: 100%;max-width: 150px;"
                             size="small" :placeholder="$t('forms.pleaseEnter') + $t('forms.sort')"
                             @keyup.enter.native="doSave('editForm')">
                </InputNumber>
              </Form-item>
            </i-col>
          </Row>
          <Form-item :label="$t('forms.userList')">
            <Transfer :data="optionalUsers" :target-keys="editForm.user_ids" :list-style="listStyle" filterable
                      :titles="[$t('forms.optional'),$t('forms.selected')]"
                      :operations="[$t('forms.buttons.cancel'),$t('forms.buttons.select')]"
                      @on-change="handleUserListChange">
              <div :style="{float: 'right', margin: '5px'}">
                <Button size="small" @click="reloadUserList">{{$t('forms.buttons.refresh')}}</Button>
              </div>
            </Transfer>
          </Form-item>
          <div align="center">
            <Button type="default" size="small" :loading="treeLoading" style="margin-right: 20px;"
                    @click="doReset('editForm')">
              {{$t('forms.buttons.reset')}}
            </Button>
            <Button type="primary" size="small" :loading="treeLoading" @click="doSave('editForm')">
              {{$t('forms.buttons.submit')}}
            </Button>
          </div>
        </Form>
      </Card>
    </i-col>
  </Row>
</template>
<script>
  export default {
    name: 'orgConfig',
    data () {
      return {
        listStyle: {
          width: '210px',
          height: '295px'
        },
        treeData: [{
          id: 'root',
          title: this.$i18n.t('forms.organization'),
          expand: true,
          render: this.rootRenderContent,
          children: []
        }],
        buttonProps: {
          type: 'default',
          size: 'small'
        },
        tree_loading: false,
        currOrgFullPath: '',
        currOrgData: {},
        currOrg: {},
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
      sortOrgTree (orgList) {
        orgList.sort((obj1, obj2) => {
          if (obj1.sort > obj2.sort) {
            return 1
          } else if (obj1.sort === obj2.sort) {
            return 0
          } else {
            return -1
          }
        })
        for (let item of orgList) {
          if (item.children && item.children.length > 0) {
            this.sortOrgTree(item.children)
          }
        }
      },
      processNodeList (datas) {
        for (let i = 0; i < datas.length; i++) {
          datas[i].title = datas[i].name
          datas[i].expand = true
          datas[i].children = this.processNodeList(datas[i].children)
        }
        return datas
      },
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
                type: 'md-git-network'
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
                  this.orgClick(root, node, data)
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
                  this.append(data)
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
                  this.remove(root, node, data)
                }
              }
            })
          ])
        ])
      },
      getOrgFullPath (orgList, currOrgId) {
        for (let item of orgList) {
          if (item.id === currOrgId) {
            return item.name
          } else {
            if (item.children && item.children.length > 0) {
              const childrenPath = this.getOrgFullPath(item.children, currOrgId)
              if (childrenPath !== '') {
                if (item.id === 'root') {
                  return childrenPath
                } else {
                  return item.name + ' > ' + childrenPath
                }
              }
            }
          }
        }
        return ''
      },
      clearCurrOrg (currOrgId) {
        if (!currOrgId || (currOrgId && currOrgId === this.currOrg.id)) {
          this.editForm = {
            id: '',
            name: '',
            code: '',
            parentid: '',
            sort: 0,
            user_ids: []
          }
          this.currOrg = {
            id: '',
            name: '',
            code: '',
            parentid: '',
            sort: 0,
            user_ids: []
          }
          this.currOrgData = {}
        }
      },
      refreshOrgTree () {
        this.tree_loading = true
        this.$api.request.org.getOrgList().then((res) => {
          this.tree_loading = false
          if (res) {
            this.treeData[0].children = this.processNodeList(res.data)
            this.clearCurrOrg()
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
      append (data) {
        this.tree_loading = true
        this.$api.request.org.createOrg({
          name: this.$i18n.t('forms.new') + this.$i18n.t('forms.organization'),
          parentid: data.id,
          sort: data.children.length + 1
        }).then((res) => {
          this.tree_loading = false
          if (res) {
            this.$Message.success(this.$i18n.t('messages.createSuccess'))
            const children = data.children || []
            const newOrg = res.data
            newOrg.title = newOrg.name
            newOrg.expand = true
            newOrg.user_ids = []
            children.push(newOrg)
            this.sortOrgTree(children)
            this.$set(data, 'children', children)
          }
        }).catch(() => {
          this.tree_loading = false
        })
      },
      remove (root, node, data) {
        this.$Modal.confirm({
          title: this.$i18n.t('dialog.confirm'),
          content: this.$i18n.t('messages.deleteDataConfirm') + '<br/>' + this.getOrgFullPath(this.treeData, data.id),
          onOk: () => {
            this.tree_loading = true
            this.$api.request.org.deleteOrg([data.id]).then((res) => {
              this.tree_loading = false
              if (res) {
                this.$Message.success(this.$i18n.t('messages.deleteSuccess'))
                const parentKey = root.find(el => el === node).parent
                const parent = root.find(el => el.nodeKey === parentKey).node
                const index = parent.children.indexOf(data)
                parent.children.splice(index, 1)
                this.clearCurrOrg(data.id)
              }
            }).catch(() => {
              this.tree_loading = false
            })
          }
        })
      },
      orgClick (root, node, data) {
        this.reloadUserList()
        this.tree_loading = true
        this.$api.request.org.getOrgInfo(data.id).then((res) => {
          this.tree_loading = false
          if (res) {
            this.currOrgData = data
            this.currOrgData.name = res.data.name
            this.currOrgData.title = res.data.name
            this.currOrgData.code = res.data.code
            this.currOrgData.parentid = res.data.parentid
            this.currOrgData.sort = res.data.sort
            this.currOrgData.user_ids = res.data.user_ids
            this.currOrg = {
              id: this.currOrgData.id,
              name: this.currOrgData.name,
              code: this.currOrgData.code,
              parentid: this.currOrgData.parentid,
              sort: this.currOrgData.sort,
              user_ids: this.currOrgData.user_ids
            }
            this.editForm = {
              id: this.currOrgData.id,
              name: this.currOrgData.name,
              code: this.currOrgData.code,
              parentid: this.currOrgData.parentid,
              sort: this.currOrgData.sort,
              user_ids: this.currOrgData.user_ids
            }
            this.currOrgFullPath = this.getOrgFullPath(this.treeData, this.currOrgData.id)
            this.$nextTick(() => {
              this.$refs['name'].focus()
            })
          }
        }).catch(() => {
          this.tree_loading = false
        })
      },
      doSave (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.tree_loading = true
            this.$api.request.org.doUpdateOrg({
              id: this.editForm.id,
              name: this.editForm.name,
              code: this.editForm.code,
              parentid: this.editForm.parentid,
              sort: this.editForm.sort,
              user_ids: this.editForm.user_ids
            }).then((res) => {
              this.tree_loading = false
              if (res) {
                this.reloadUserList()
                this.$Message.success(this.$i18n.t('messages.saveSuccess'))
                this.currOrgData.name = this.editForm.name
                this.currOrgData.title = this.editForm.name
                this.currOrgData.code = this.editForm.code
                this.currOrgData.sort = this.editForm.sort
                this.currOrgData.user_ids = this.editForm.user_ids
                this.currOrgFullPath = this.getOrgFullPath(this.treeData, this.currOrgData.id)
                this.currOrg = {
                  id: this.editForm.id,
                  name: this.editForm.name,
                  code: this.editForm.code,
                  parentid: this.editForm.parentid,
                  sort: this.editForm.sort,
                  user_ids: this.editForm.user_ids
                }
                this.sortOrgTree(this.treeData)
              }
            }).catch(() => {
              this.tree_loading = false
            })
          }
        })
      },
      doReset (name) {
        this.reloadUserList()
        this.$refs[name].resetFields()
        this.editForm = {
          name: this.currOrg.name,
          code: this.currOrg.code,
          sort: this.currOrg.sort,
          user_ids: this.currOrg.user_ids
        }
      },
      handleUserListChange (newTargetKeys) {
        this.editForm.user_ids = newTargetKeys
      }
    },
    mounted () {
      this.refreshOrgTree()
      this.reloadUserList()
    },
    activated () {
      if (this.currOrg.id && this.currOrg.id !== '') {
        this.$nextTick(() => {
          this.$refs['name'].focus()
        })
      }
    }
  }
</script>
