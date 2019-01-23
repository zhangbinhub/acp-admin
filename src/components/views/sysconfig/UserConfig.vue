<template>
  <Card>
    <Form ref="searchForm" :model="searchForm" :label-width="80" :inline="true" class="search-form">
      <Row>
        <Form-item :label="$t('forms.name')" prop="name">
          <i-input v-model="searchForm.name" :disabled="modal_loading" size="small"
                   :placeholder="$t('forms.pleaseEnter') + $t('forms.name')"
                   @on-enter="handleSearch"></i-input>
        </Form-item>
        <Form-item :label="$t('forms.loginNo')" prop="loginno">
          <i-input v-model="searchForm.loginno" :disabled="modal_loading" size="small"
                   :placeholder="$t('forms.pleaseEnter') + $t('forms.loginNo')"
                   @on-enter="handleSearch"></i-input>
        </Form-item>
        <Form-item :label="$t('forms.organization')" prop="organization_name">
          <i-input v-model="searchForm.organization_name" :disabled="modal_loading" size="small"
                   :placeholder="$t('forms.pleaseEnter') + $t('forms.organization')"
                   @on-enter="handleSearch"></i-input>
        </Form-item>
        <Form-item :label="$t('forms.role')" prop="role_name">
          <i-input v-model="searchForm.role_name" :disabled="modal_loading" size="small"
                   :placeholder="$t('forms.pleaseEnter') + $t('forms.role')"
                   @on-enter="handleSearch"></i-input>
        </Form-item>
      </Row>
      <Row>
        <Form-item :label="$t('forms.status')" prop="enabled">
          <i-select v-model="searchForm.enabled" :disabled="modal_loading" clearable size="small"
                    @keyup.enter.native="handleSearchKeyUp($event)" style="width:170px">
            <Option v-for="item in enabledList" :value="item.value" :key="'search_select_'+item.value">
              {{ item.label }}
            </Option>
          </i-select>
        </Form-item>
        <Form-item style="float: right">
          <ButtonGroup>
            <Button :loading="modal_loading" @click="handleSearch()" type="info" size="small">
              {{$t('forms.buttons.search')}}
            </Button>
            <Button :loading="modal_loading" @click="handleSearchReset('searchForm')" type="info" size="small">
              {{$t('forms.buttons.reset')}}
            </Button>
            <Button :loading="modal_loading" @click="handleAdd()" type="info" size="small">
              {{$t('forms.buttons.add')}}
            </Button>
            <Button :loading="modal_loading" @click="handleDeleteMore()" type="info" size="small">
              {{$t('forms.buttons.delete')}}
            </Button>
          </ButtonGroup>
        </Form-item>
      </Row>
    </Form>
    <Table border height="388" size="small" :columns="columns" :data="searchData" class="search-table"
           :loading="modal_loading" :no-data-text="$t('messages.tableNoData')" @on-selection-change="handleSelect"
           @on-sort-change="handleSortChange">
      <template slot-scope="{ row }" slot="sort">
        <span>{{ row.sort }}</span>
      </template>
      <template slot-scope="{ row }" slot="name">
        <span>{{ row.name }}</span>
      </template>
      <template slot-scope="{ row }" slot="loginno">
        <span>{{ row.loginno }}</span>
      </template>
      <template slot-scope="{ row }" slot="mobile">
        <span>{{ row.mobile }}</span>
      </template>
      <template slot-scope="{ row }" slot="levels">
        <span>{{ row.levels }}</span>
      </template>
      <template slot-scope="{ row }" slot="organization_set">
        <span style="white-space: pre-wrap;">{{ orgNames(row.organization_set) }}</span>
      </template>
      <template slot-scope="{ row }" slot="role_set">
        <span style="white-space: pre-wrap;">{{ row.role_set.map(role => role.name).join(',') }}</span>
      </template>
      <template slot-scope="{ row }" slot="enabled">
        <span :style="row.enabled ? 'color:green':'color:red'">{{enabledText(row.enabled)}}</span>
      </template>
      <template slot-scope="{ row }" slot="action">
        <div>
          <Tooltip :content="$t('forms.buttons.edit')" placement="top-start">
            <Icon @click="handleEdit(row)" type="md-create" size="18" style="cursor: pointer;"></Icon>
          </Tooltip>
          <Tooltip
            v-if="row.id !== $store.state.app.user.userInfo.id && row.levels > $store.state.app.user.userInfo.levels"
            :content="$t('forms.buttons.delete')" placement="top-start">
            <Icon @click="handleDeleteRow(row)" type="md-trash" size="18"
                  style="cursor: pointer;margin-left: 10px;"></Icon>
          </Tooltip>
          <Tooltip v-if="row.levels > $store.state.app.user.userInfo.levels"
                   :content="$t('forms.buttons.resetPwd')" placement="top-start">
            <Icon @click="doResetPwd(row.id)" type="md-unlock" size="18"
                  style="cursor: pointer;margin-left: 10px;"></Icon>
          </Tooltip>
        </div>
      </template>
    </Table>
    <div style="margin-top: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :current="searchForm.currPage" :total="searchForm.totalRows" :page-size="searchForm.pageSize"
              :page-size-opts="searchForm.pageSizeArray" show-total show-elevator show-sizer size="small"
              @on-change="handlePageSearch" @on-page-size-change="handlePageSizeSearch"/>
      </div>
    </div>
    <Modal v-model="editModal" :title="$t('forms.info')" :loading="modal_loading" :mask-closable="false" fullscreen>
      <Row :gutter="10">
        <i-col :md="6" class="card-col">
          <Card>
            <p slot="title">{{$t('forms.basicInfo')}}</p>
            <Form ref="editForm" :model="editForm" :rules="ruleEditForm" :label-width="100">
              <Form-item :label="$t('forms.name')" prop="name">
                <i-input ref="name" v-model="editForm.name" @on-enter="doSave" :disabled="modal_loading"
                         style="width: 100%;max-width: 160px;"
                         :placeholder=" $t('forms.pleaseEnter') + $t('forms.name')"></i-input>
              </Form-item>
              <Form-item :label="$t('forms.loginNo')" prop="loginno">
                <i-input v-model="editForm.loginno" @on-enter="doSave" :disabled="modal_loading"
                         style="width: 100%;max-width: 160px;"
                         :placeholder=" $t('forms.pleaseEnter') + $t('forms.loginNo')"></i-input>
              </Form-item>
              <Form-item :label="$t('forms.mobile')" prop="mobile">
                <i-input v-model="editForm.mobile" @on-enter="doSave" :disabled="modal_loading"
                         style="width: 100%;max-width: 160px;"
                         :placeholder="$t('forms.pleaseEnter') + $t('forms.mobile')"></i-input>
              </Form-item>
              <Form-item :label="$t('forms.level')" prop="levels">
                <InputNumber v-model="editForm.levels" :disabled="modal_loading" style="width: 100%;max-width: 160px;"
                             :placeholder="$t('forms.pleaseEnter') + $t('forms.level')" :min="1"
                             @keyup.enter.native="doSave">
                </InputNumber>
              </Form-item>
              <Form-item :label="$t('forms.sort')" prop="sort">
                <InputNumber v-model="editForm.sort" :disabled="modal_loading" style="width: 100%;max-width: 160px;"
                             :placeholder="$t('forms.pleaseEnter') + $t('forms.sort')" :min="1"
                             @keyup.enter.native="doSave">
                </InputNumber>
              </Form-item>
              <Form-item :label="$t('forms.enabled')" prop="enabled" required>
                <Switch v-model="editForm.enabled" @keyup.enter.native="doSave">
                  <Icon type="md-checkmark" slot="open"></Icon>
                  <Icon type="md-close" slot="close"></Icon>
                </Switch>
              </Form-item>
            </Form>
          </Card>
        </i-col>
        <i-col :md="6" class="card-col">
          <Card>
            <p slot="title">{{$t('forms.orgList')}}</p>
            <Tree ref="orgTree" :data="orgTreeDataS1" show-checkbox check-strictly></Tree>
          </Card>
        </i-col>
        <i-col :md="6" class="card-col">
          <Card>
            <p slot="title">{{$t('forms.orgMngList')}}</p>
            <Tree ref="orgMngTree" :data="orgTreeDataS2" show-checkbox></Tree>
          </Card>
        </i-col>
        <i-col :md="6" class="card-col">
          <Card>
            <p slot="title">{{$t('forms.roleList')}}</p>
            <Tree ref="roleTree" :data="roleTreeData" show-checkbox check-strictly></Tree>
          </Card>
        </i-col>
      </Row>
      <div slot="footer" align="center">
        <Button type="default" :loading="modal_loading" @click="doCancel()">
          {{$t('forms.buttons.cancel')}}
        </Button>
        <Button type="default" :loading="modal_loading" @click="doReset()">
          {{$t('forms.buttons.reset')}}
        </Button>
        <Button type="primary" :loading="modal_loading" @click="doSave()">
          {{$t('forms.buttons.submit')}}
        </Button>
      </div>
    </Modal>
  </Card>
</template>
<style type="less">
  .card-col {
    margin-bottom: 10px;
  }
</style>
<script>
  import {
    copy,
    processTreeNode,
    sortTreeNodes,
    getTreeFullPathTitle
  } from '@/libs/tools'

  export default {
    name: 'userConfig',
    data () {
      return {
        roleTreeData: [],
        orgTreeData: [],
        orgTreeDataTemp: [],
        orgTreeDataS1: [],
        orgTreeDataS2: [],
        editModal: false,
        modal_loading: false,
        searchForm: {
          name: '',
          loginno: '',
          status: '',
          organization_name: '',
          role_name: '',
          orderParam: {
            key: 'sort',
            order: 'asc'
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
          loginno: '',
          mobile: '',
          levels: 1,
          enabled: true,
          sort: 1,
          org_ids: [],
          organization_set: [],
          org_mng_ids: [],
          organization_mng_set: [],
          role_ids: [],
          role_set: []
        },
        editForm: {
          id: '',
          name: '',
          loginno: '',
          mobile: '',
          levels: 1,
          enabled: true,
          sort: 1
        }
      }
    },
    computed: {
      enabledList () {
        return [
          { value: 'true', label: this.$i18n.t('forms.enabled') },
          { value: 'false', label: this.$i18n.t('forms.disabled') }
        ]
      },
      columns () {
        const columns = [{
          type: 'selection',
          width: 50,
          align: 'center'
        }, {
          key: 'sort',
          title: this.$i18n.t('forms.sort'),
          slot: 'sort',
          width: 80,
          align: 'center',
          sortable: 'custom'
        }, {
          key: 'name',
          title: this.$i18n.t('forms.name'),
          slot: 'name'
        }, {
          key: 'loginno',
          title: this.$i18n.t('forms.loginNo'),
          slot: 'loginno'
        }, {
          key: 'mobile',
          title: this.$i18n.t('forms.mobile'),
          width: 150,
          slot: 'mobile'
        }, {
          key: 'levels',
          title: this.$i18n.t('forms.level'),
          width: 80,
          align: 'center',
          slot: 'levels',
          sortable: 'custom'
        }, {
          key: 'organization_set',
          title: this.$i18n.t('forms.organization'),
          slot: 'organization_set'
        }, {
          key: 'role_set',
          title: this.$i18n.t('forms.role'),
          slot: 'role_set'
        }, {
          key: 'enabled',
          title: this.$i18n.t('forms.enabled'),
          slot: 'enabled',
          width: 80,
          align: 'center',
          sortable: 'custom'
        }, {
          title: this.$i18n.t('forms.action'),
          width: 120,
          align: 'center',
          slot: 'action'
        }]
        columns.forEach((item) => {
          if (item.key === this.searchForm.orderParam.key) {
            item.sortType = this.searchForm.orderParam.order
            item.sortable = 'custom'
          }
        })
        return columns
      },
      ruleEditForm () {
        return {
          name: [
            { required: true, message: this.$i18n.t('forms.name') + this.$i18n.t('forms.notEmpty'), trigger: 'blur' }
          ],
          loginno: [
            { required: true, message: this.$i18n.t('forms.loginNo') + this.$i18n.t('forms.notEmpty'), trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: this.$i18n.t('forms.mobile') + this.$i18n.t('forms.notEmpty'), trigger: 'blur' },
            {
              type: 'string',
              pattern: /^1[0-9]{10}$/,
              message: this.$i18n.t('forms.mobile') + this.$i18n.t('forms.invalid'),
              trigger: 'blur'
            }
          ],
          levels: [
            {
              type: 'number',
              required: true,
              message: this.$i18n.t('forms.level') + this.$i18n.t('forms.notEmpty'),
              trigger: 'blur'
            }
          ],
          sort: [
            {
              type: 'number',
              required: true,
              message: this.$i18n.t('forms.sort') + this.$i18n.t('forms.notEmpty'),
              trigger: 'blur'
            }
          ]
        }
      }
    },
    watch: {
      orgTreeDataTemp (newData) {
        const data1 = copy(newData)
        const data2 = copy(newData)
        processTreeNode(data1, 1, this.currObj.org_ids)
        processTreeNode(data2, 1, this.currObj.org_mng_ids)
        this.orgTreeDataS1 = data1
        this.orgTreeDataS2 = data2
      }
    },
    methods: {
      refreshOrgTree (callBack) {
        this.modal_loading = true
        this.$api.request.org.getOrgList().then((res) => {
          this.modal_loading = false
          if (res) {
            for (let item of res.data) {
              item.expand = true
            }
            this.orgTreeDataTemp = copy(res.data)
            processTreeNode(res.data, 1)
            this.orgTreeData = res.data
            if (typeof callBack === 'function') {
              callBack()
            }
          }
        }).catch(() => {
          this.modal_loading = false
        })
      },
      refreshRoleTree (callBack) {
        this.modal_loading = true
        this.$api.request.app.getList().then((appres) => {
          if (appres) {
            const appData = appres.data
            for (let i = 0; i < appData.length; i++) {
              const item = appData[i]
              item.appid = item.id
              item.name = item.appname
              item.expand = true
              item.title = item.appname
              item.disableCheckbox = true
              item.sort = i
              item.children = []
            }
            this.roleTreeData = appData
            this.$api.request.role.getList().then((res) => {
              this.modal_loading = false
              if (res) {
                processTreeNode(res.data, 1, this.currObj.role_ids)
                for (const item of res.data) {
                  item.parentid = item.appid
                  for (const root of this.roleTreeData) {
                    if (root.id === item.appid) {
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
      enabledText (enabled) {
        return enabled ? this.$i18n.t('forms.enabled') : this.$i18n.t('forms.disabled')
      },
      orgNames (organizationSet) {
        const data = copy(organizationSet)
        sortTreeNodes(data)
        return data.map(org => getTreeFullPathTitle(this.orgTreeData, org.id)).join('\n')
      },
      handleSearchKeyUp (event) {
        if (event.which === 13) {
          this.handleSearch()
        }
      },
      handleSortChange (param) {
        this.searchForm.orderParam.key = param.key
        this.searchForm.orderParam.order = param.order
        this.handleSearch()
      },
      handleSearchReset (name) {
        this.$refs[name].resetFields()
      },
      handlePageSearch (page) {
        this.searchForm.currPage = page
        this.handleSearch()
      },
      handlePageSizeSearch (size) {
        this.searchForm.pageSize = size
        this.handleSearch()
      },
      handleSearch () {
        let searchParam = {
          name: this.searchForm.name,
          loginno: this.searchForm.loginno,
          org_name: this.searchForm.organization_name,
          role_name: this.searchForm.role_name,
          query_param: {
            curr_page: this.searchForm.currPage,
            page_size: this.searchForm.pageSize
          }
        }
        if (this.searchForm.enabled === 'true') {
          searchParam.enabled = true
        } else if (this.searchForm.enabled === 'false') {
          searchParam.enabled = false
        }
        if (this.searchForm.orderParam.order !== 'normal') {
          searchParam.query_param.order_name = this.searchForm.orderParam.key
          searchParam.query_param.order_commond = this.searchForm.orderParam.order
        }
        this.modal_loading = true
        this.$api.request.user.query(searchParam).then((res) => {
          this.modal_loading = false
          if (res) {
            this.selectedData = []
            this.searchForm.currPage = res.data.pageable.page_number + 1
            this.searchForm.totalRows = res.data.total_elements
            this.searchData = res.data.content.map(item => {
              if (item.id === this.$store.state.app.user.userInfo.id || item.levels <= this.$store.state.app.user.userInfo.levels) {
                item._disabled = true
              }
              return item
            })
          }
        }).catch(() => {
          this.searchData = []
          this.selectedData = []
          this.modal_loading = false
        })
      },
      handleSelect (selection) {
        this.selectedData = selection
      },
      handleDelete (rowIds) {
        this.modal_loading = true
        this.$api.request.user.delete(rowIds).then((res) => {
          this.modal_loading = false
          if (res) {
            this.$Message.success(this.$i18n.t('messages.deleteSuccess'))
            this.handleSearch()
          }
        }).catch(() => {
          this.modal_loading = false
        })
      },
      handleDeleteRow (row) {
        if (row.id === this.$store.state.app.user.userInfo.id || row.levels <= this.$store.state.app.user.userInfo.levels) {
          this.$Modal.error({
            title: this.$i18n.t('dialog.error'),
            content: this.$i18n.t('messages.tableDataCannotDel')
          })
        } else {
          this.$Modal.confirm({
            title: this.$i18n.t('dialog.confirm'),
            content: this.$i18n.t('messages.deleteDataConfirm'),
            onOk: () => {
              this.handleDelete([row.id])
            }
          })
        }
      },
      handleDeleteMore () {
        if (this.selectedData.length > 0) {
          this.$Modal.confirm({
            title: this.$i18n.t('dialog.confirm'),
            content: this.$i18n.t('messages.deleteDataConfirm'),
            onOk: () => {
              this.handleDelete(this.selectedData.map(item => item.id))
            }
          })
        } else {
          this.$Modal.info({
            title: this.$i18n.t('dialog.info'),
            content: this.$i18n.t('messages.selectDataForDelete')
          })
        }
      },
      clearCurrObj () {
        this.currObj = {
          id: '',
          name: '',
          loginno: '',
          mobile: '',
          levels: 1,
          enabled: true,
          sort: 1,
          org_ids: [],
          organization_set: [],
          org_mng_ids: [],
          organization_mng_set: [],
          role_ids: [],
          role_set: []
        }
      },
      handleEdit (row) {
        this.currObj = copy(row)
        this.doReset()
        this.editModal = true
      },
      handleAdd () {
        this.clearCurrObj()
        this.doReset()
        this.editModal = true
      },
      doCancel () {
        this.editModal = false
      },
      doReset () {
        this.$refs['editForm'].resetFields()
        this.editForm.id = this.currObj.id
        this.editForm.name = this.currObj.name
        this.editForm.loginno = this.currObj.loginno
        this.editForm.mobile = this.currObj.mobile
        this.editForm.levels = this.currObj.levels
        this.editForm.enabled = this.currObj.enabled
        this.editForm.sort = this.currObj.sort
        if (this.currObj.organization_set.length > 0) {
          this.currObj.org_ids = this.currObj.organization_set.map(item => item.id)
        }
        if (this.currObj.organization_mng_set.length > 0) {
          this.currObj.org_mng_ids = this.currObj.organization_mng_set.map(item => item.id)
        }
        if (this.currObj.role_set.length > 0) {
          this.currObj.role_ids = this.currObj.role_set.map(item => item.id)
        }
        this.refreshOrgTree()
        this.refreshRoleTree()
      },
      doSave () {
        this.$refs['editForm'].validate((valid) => {
          if (valid) {
            if (this.editForm.id && this.editForm.id !== '') {
              if (this.editForm.loginno !== this.currObj.loginno) {
                this.$Modal.confirm({
                  title: this.$i18n.t('dialog.confirm'),
                  content: this.$i18n.t('messages.modifyLoginNo'),
                  onOk: () => {
                    this.doUpdate()
                  }
                })
              } else {
                this.doUpdate()
              }
            } else {
              this.modal_loading = true
              this.$api.request.user.create({
                name: this.editForm.name,
                loginno: this.editForm.loginno,
                mobile: this.editForm.mobile,
                levels: this.editForm.levels,
                enabled: this.editForm.enabled,
                sort: this.editForm.sort,
                org_ids: this.$refs['orgTree'].getCheckedNodes().map(item => item.id),
                org_mng_ids: this.$refs['orgMngTree'].getCheckedAndIndeterminateNodes().map(item => item.id),
                role_ids: this.$refs['roleTree'].getCheckedNodes().map(item => item.id)
              }).then((res) => {
                this.modal_loading = false
                if (res) {
                  this.$Message.success(this.$i18n.t('messages.createSuccess'))
                  this.editModal = false
                  this.handleSearch()
                }
              }).catch(() => {
                this.modal_loading = false
              })
            }
          }
        })
      },
      doUpdate () {
        this.modal_loading = true
        this.$api.request.user.update({
          id: this.editForm.id,
          name: this.editForm.name,
          loginno: this.editForm.loginno,
          mobile: this.editForm.mobile,
          levels: this.editForm.levels,
          enabled: this.editForm.enabled,
          sort: this.editForm.sort,
          org_ids: this.$refs['orgTree'].getCheckedNodes().map(item => item.id),
          org_mng_ids: this.$refs['orgMngTree'].getCheckedAndIndeterminateNodes().map(item => item.id),
          role_ids: this.$refs['roleTree'].getCheckedNodes().map(item => item.id)
        }).then((res) => {
          this.modal_loading = false
          if (res) {
            this.$Message.success(this.$i18n.t('messages.saveSuccess'))
            this.editModal = false
            this.handleSearch()
          }
        }).catch(() => {
          this.modal_loading = false
        })
      },
      doResetPwd (userId) {
        this.$Modal.confirm({
          title: this.$i18n.t('dialog.confirm'),
          content: this.$i18n.t('messages.resetPassword'),
          onOk: () => {
            this.modal_loading = true
            this.$api.request.user.resetPwd(userId).then((res) => {
              this.modal_loading = false
              if (res) {
                this.$Message.success(this.$i18n.t('messages.updateSuccess'))
              }
            }).catch(() => {
              this.modal_loading = false
            })
          }
        })
      }
    },
    activated () {
      // 获取用户信息
      this.modal_loading = true
      this.$api.request.auth.getUserInfo().then((res) => {
        if (res && !res.data.error_description) {
          this.modal_loading = false
          this.$store.commit('SET_USER_INFO', res.data)
          this.refreshOrgTree(this.handleSearch())
        }
      }).catch(() => {
        this.modal_loading = false
      })
    }
  }
</script>
