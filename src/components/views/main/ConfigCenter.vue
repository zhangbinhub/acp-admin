<template>
  <Card>
    <Form ref="searchForm" :model="searchForm" :label-width="60" :inline="true" class="search-form">
      <Row>
        <Form-item :label="$t('forms.name')" prop="config_application">
          <i-input v-model="searchForm.config_application" :disabled="modal_loading" size="small"
                   :placeholder="$t('forms.pleaseEnter') + $t('forms.name')"
                   @on-enter="handleSearch"></i-input>
        </Form-item>
        <Form-item :label="$t('forms.profile')" prop="config_profile">
          <i-input v-model="searchForm.config_profile" :disabled="modal_loading" size="small"
                   :placeholder="$t('forms.pleaseEnter') + $t('forms.profile')"
                   @on-enter="handleSearch"></i-input>
        </Form-item>
        <Form-item :label="$t('forms.label')" prop="config_label">
          <i-input v-model="searchForm.config_label" :disabled="modal_loading" size="small"
                   :placeholder="$t('forms.pleaseEnter') + $t('forms.label')"
                   @on-enter="handleSearch"></i-input>
        </Form-item>
        <Form-item :label="$t('forms.status')" prop="enabled">
          <i-select v-model="searchForm.enabled" clearable size="small" :disabled="modal_loading"
                    @keyup.enter.native="handleSearchKeyUp($event)" style="width:100px">
            <Option v-for="item in enabledList" :value="item.value" :key="'search_select_'+item.value">
              {{ item.label }}
            </Option>
          </i-select>
        </Form-item>
      </Row>
      <Row>
        <Form-item :label="$t('forms.key')" prop="config_key" style="width: 80%;max-width: 700px">
          <i-input v-model="searchForm.config_key" :disabled="modal_loading" size="small"
                   :placeholder="$t('forms.pleaseEnter') + $t('forms.key')"
                   @on-enter="handleSearch"></i-input>
        </Form-item>
        <Form-item style="float: right">
          <ButtonGroup style="margin-right: 20px">
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
          <Button :loading="modal_loading" @click="handleRefresh()" type="success" size="small">
            {{$t('forms.buttons.refreshService')}}
          </Button>
        </Form-item>
      </Row>
    </Form>
    <Table border height="433" size="small" :columns="columns" :data="searchData" class="search-table"
           :loading="modal_loading" :no-data-text="$t('messages.tableNoData')" @on-row-dblclick="handleEdit"
           @on-selection-change="handleSelect" @on-sort-change="handleSortChange">
      <template slot-scope="{ row }" slot="config_application">
        <span>{{ row.config_application }}</span>
      </template>
      <template slot-scope="{ row }" slot="config_profile">
        <span>{{ row.config_profile }}</span>
      </template>
      <template slot-scope="{ row }" slot="config_label">
        <span>{{ row.config_label }}</span>
      </template>
      <template slot-scope="{ row }" slot="config_key">
        <span>{{ row.config_key }}</span>
      </template>
      <template slot-scope="{ row }" slot="config_value">
        <span>{{ row.config_value }}</span>
      </template>
      <template slot-scope="{ row }" slot="config_des">
        <span>{{ row.config_des }}</span>
      </template>
      <template slot-scope="{ row }" slot="enabled">
        <span :style="row.enabled ? 'color:green':'color:red'">{{enabledText(row.enabled)}}</span>
      </template>
      <template slot-scope="{ row }" slot="action">
        <Tooltip :content="$t('forms.buttons.edit')" placement="top-start">
          <Icon @click="handleEdit(row)" type="md-create" size="18" style="cursor: pointer;"></Icon>
        </Tooltip>
        <Tooltip :content="$t('forms.buttons.delete')" placement="top-start" v-show="!row.enabled">
          <Icon @click="handleDeleteRow(row)" type="md-trash" size="18"
                style="cursor: pointer;margin-left: 10px;"></Icon>
        </Tooltip>
      </template>
    </Table>
    <div style="margin-top: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :current="searchForm.currPage" :total="searchForm.totalRows" :page-size="searchForm.pageSize"
              :page-size-opts="searchForm.pageSizeArray" show-total show-elevator show-sizer size="small"
              @on-change="handlePageSearch" @on-page-size-change="handlePageSizeSearch"/>
      </div>
    </div>
    <Modal v-model="editModal" :title="$t('forms.info')" :loading="modal_loading" :mask-closable="false">
      <Form ref="editForm" :model="editForm" :rules="ruleAddForm" :label-width="60" style="padding-right: 25px;">
        <Form-item :label="$t('forms.name')" prop="config_application">
          <i-input v-model="editForm.config_application" :disabled="modal_loading" ref="config_application"
                   :placeholder="$t('forms.pleaseEnter') + $t('forms.name')"
                   @on-enter="doSave('editForm')"></i-input>
        </Form-item>
        <Form-item :label="$t('forms.profile')" prop="config_profile">
          <i-input v-model="editForm.config_profile" :disabled="modal_loading"
                   :placeholder="$t('forms.pleaseEnter') + $t('forms.profile')"
                   @on-enter="doSave('editForm')"></i-input>
        </Form-item>
        <Form-item :label="$t('forms.label')" prop="config_label">
          <i-input v-model="editForm.config_label" :disabled="modal_loading"
                   :placeholder="$t('forms.pleaseEnter') + $t('forms.label')"
                   @on-enter="doSave('editForm')"></i-input>
        </Form-item>
        <Form-item :label="$t('forms.key')" prop="config_key">
          <i-input v-model="editForm.config_key" :disabled="modal_loading"
                   :placeholder="$t('forms.pleaseEnter') + $t('forms.key')"
                   @on-enter="doSave('editForm')"></i-input>
        </Form-item>
        <Form-item :label="$t('forms.value')" prop="config_value">
          <i-input v-model="editForm.config_value" :disabled="modal_loading"
                   :placeholder="$t('forms.pleaseEnter') + $t('forms.value')"
                   @on-enter="doSave('editForm')"></i-input>
        </Form-item>
        <Form-item :label="$t('forms.describe')" prop="config_des">
          <i-input v-model="editForm.config_des" :disabled="modal_loading"
                   :placeholder="$t('forms.pleaseEnter') + $t('forms.describe')"
                   @on-enter="doSave('editForm')"></i-input>
        </Form-item>
        <Form-item :label="$t('forms.enabled')" prop="enabled">
          <i-switch v-model="editForm.enabled" :disabled="modal_loading"
                    @keyup.native="handleAddKeyUp($event, 'editForm')">
            <Icon type="md-checkmark" slot="open"></Icon>
            <Icon type="md-close" slot="close"></Icon>
          </i-switch>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="default" :loading="modal_loading" @click="doCancel()">
          {{$t('forms.buttons.cancel')}}
        </Button>
        <Button type="primary" :loading="modal_loading" @click="doSave('editForm')">
          {{$t('forms.buttons.submit')}}
        </Button>
      </div>
    </Modal>
  </Card>
</template>
<script>
  export default {
    name: 'configCenter',
    data () {
      return {
        searchForm: {
          config_application: '',
          config_profile: '',
          config_label: '',
          config_key: '',
          enabled: '',
          orderParam: {
            key: 'config_key',
            order: 'asc'
          },
          currPage: 1,
          totalRows: 0,
          pageSize: 10,
          pageSizeArray: [10, 20, 30, 40]
        },
        editForm: {
          id: '',
          config_application: '',
          config_profile: '',
          config_label: '',
          config_key: '',
          config_value: '',
          config_des: '',
          enabled: true
        },
        editModal: false,
        modal_loading: false,
        searchData: [],
        selectedData: [],
        action: 0
      }
    },
    watch: {
      editModal (value) {
        if (value) {
          this.$nextTick(() => {
            this.$refs['config_application'].focus()
          })
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
        const columns = [
          {
            type: 'selection',
            width: 50,
            align: 'center'
          },
          {
            key: 'config_application',
            title: this.$i18n.t('forms.name'),
            width: 100,
            slot: 'config_application',
            sortable: 'custom'
          },
          {
            key: 'config_profile',
            title: this.$i18n.t('forms.profile'),
            width: 95,
            slot: 'config_profile',
            sortable: 'custom'
          },
          {
            key: 'config_label',
            title: this.$i18n.t('forms.label'),
            width: 85,
            slot: 'config_label',
            sortable: 'custom'
          },
          {
            key: 'config_key',
            title: this.$i18n.t('forms.key'),
            slot: 'config_key',
            sortable: 'custom'
          },
          {
            key: 'config_value',
            title: this.$i18n.t('forms.value'),
            width: 100,
            slot: 'config_value'
          },
          {
            key: 'config_des',
            title: this.$i18n.t('forms.describe'),
            width: 200,
            slot: 'config_des'
          },
          {
            key: 'enabled',
            title: this.$i18n.t('forms.enabled'),
            width: 100,
            slot: 'enabled',
            sortable: 'custom'
          },
          {
            title: this.$i18n.t('forms.action'),
            width: 90,
            align: 'center',
            slot: 'action'
          }
        ]
        columns.forEach((item) => {
          if (item.key === this.searchForm.orderParam.key) {
            item.sortType = this.searchForm.orderParam.order
            item.sortable = 'custom'
          }
        })
        return columns
      },
      ruleAddForm () {
        return {
          config_application: [
            { required: true, message: this.$i18n.t('forms.name') + this.$i18n.t('forms.notEmpty'), trigger: 'blur' }
          ],
          config_profile: [
            { required: true, message: this.$i18n.t('forms.profile') + this.$i18n.t('forms.notEmpty'), trigger: 'blur' }
          ],
          config_label: [
            { required: true, message: this.$i18n.t('forms.label') + this.$i18n.t('forms.notEmpty'), trigger: 'blur' }
          ],
          config_key: [
            { required: true, message: this.$i18n.t('forms.key') + this.$i18n.t('forms.notEmpty'), trigger: 'blur' }
          ],
          config_value: [
            { required: true, message: this.$i18n.t('forms.value') + this.$i18n.t('forms.notEmpty'), trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      enabledText (enabled) {
        return enabled ? this.$i18n.t('forms.enabled') : this.$i18n.t('forms.disabled')
      },
      handleAdd () {
        this.$refs['editForm'].resetFields()
        this.editModal = true
        this.action = 0
      },
      handleAddKeyUp (event, name) {
        if (event.which === 13) {
          this.doSave(name)
        }
      },
      doCancel () {
        this.editModal = false
      },
      doSave (name) {
        switch (this.action) {
          case 0:
            this.$refs[name].validate((valid) => {
              if (valid) {
                this.modal_loading = true
                this.$api.request.config.create({
                  config_application: this.editForm.config_application,
                  config_profile: this.editForm.config_profile,
                  config_label: this.editForm.config_label,
                  config_key: this.editForm.config_key,
                  config_value: this.editForm.config_value,
                  config_des: this.editForm.config_des,
                  enabled: this.editForm.enabled
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
              }
            })
            break
          case 1:
            this.$refs[name].validate((valid) => {
              if (valid) {
                this.modal_loading = true
                this.$api.request.config.update({
                  id: this.editForm.id,
                  config_application: this.editForm.config_application,
                  config_profile: this.editForm.config_profile,
                  config_label: this.editForm.config_label,
                  config_key: this.editForm.config_key,
                  config_value: this.editForm.config_value,
                  config_des: this.editForm.config_des,
                  enabled: this.editForm.enabled
                }).then((res) => {
                  this.modal_loading = false
                  if (res) {
                    this.$Message.success(this.$i18n.t('messages.updateSuccess'))
                    this.editModal = false
                    this.handleSearch()
                  }
                }).catch(() => {
                  this.modal_loading = false
                })
              }
            })
            break
        }
      },
      handleDelete (rowIds) {
        this.modal_loading = true
        this.$api.request.config.delete(rowIds).then((res) => {
          this.modal_loading = false
          if (res) {
            this.$Message.success(this.$i18n.t('messages.deleteSuccess'))
            this.handleSearch()
          }
        }).catch(() => {
          this.modal_loading = false
        })
      },
      handleSave (index) {
        this.modal_loading = true
        this.$api.request.runtime.update({
          id: this.searchData[index].id,
          config_application: this.editForm.config_application,
          config_profile: this.editForm.config_profile,
          config_label: this.editForm.config_label,
          config_key: this.editForm.config_key,
          config_value: this.editForm.config_value,
          config_des: this.editForm.describe,
          enabled: this.editEnabled
        }).then((res) => {
          this.modal_loading = false
          if (res) {
            this.searchData[index].config_application = this.editApplication
            this.searchData[index].config_profile = this.editProfile
            this.searchData[index].config_label = this.editLabel
            this.searchData[index].config_key = this.editKey
            this.searchData[index].config_value = this.editValue
            this.searchData[index].config_des = this.editDes
            this.searchData[index].enabled = this.editEnabled
            this.editIndex = -1
            this.$Message.success(this.$i18n.t('messages.updateSuccess'))
          }
        }).catch(() => {
          this.modal_loading = false
        })
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
          config_application: this.searchForm.config_application,
          config_profile: this.searchForm.config_profile,
          config_label: this.searchForm.config_label,
          config_key: this.searchForm.config_key,
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
        this.$api.request.config.query(searchParam).then((res) => {
          this.modal_loading = false
          if (res) {
            this.selectedData = []
            this.searchForm.currPage = res.data.pageable.page_number + 1
            this.searchForm.totalRows = res.data.total_elements
            this.searchData = res.data.content.map(item => {
              if (item.enabled) {
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
      handleSelect (selection) {
        this.selectedData = selection
      },
      handleDeleteRow (row) {
        if (row.enabled) {
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
      handleEdit (row) {
        this.$refs['editForm'].resetFields()
        this.editForm.id = row.id
        this.editForm.config_application = row.config_application
        this.editForm.config_profile = row.config_profile
        this.editForm.config_label = row.config_label
        this.editForm.config_key = row.config_key
        this.editForm.config_value = row.config_value
        this.editForm.config_des = row.config_des
        this.editForm.enabled = !!row.enabled
        this.editModal = true
        this.action = 1
      },
      handleKeyUp (event, index) {
        switch (event.which) {
          case 13:
            this.handleSave(index)
            break
          case 27:
            this.editIndex = -1
            break
        }
      },
      handleCancel (event) {
        if (event.which === 27) {
          this.editIndex = -1
        }
      },
      handleRefresh () {
        this.$Modal.confirm({
          title: this.$i18n.t('dialog.confirm'),
          content: this.$i18n.t('messages.refreshServiceConfirm'),
          onOk: () => {
            this.modal_loading = true
            this.$api.request.config.refreshAll().then((res) => {
              this.modal_loading = false
              if (res) {
                this.$Message.success(this.$i18n.t('messages.updateSuccess'))
                this.handleSearch()
              }
            }).catch(() => {
              this.modal_loading = false
            })
          }
        })
      }
    },
    mounted () {
      this.handleSearch()
    }
  }
</script>
