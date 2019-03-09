<template>
  <Card>
    <Form ref="searchForm" :model="searchForm" :label-width="60" :inline="true" class="search-form">
      <Row>
        <Form-item :label="$t('forms.name')" prop="configApplication">
          <i-input v-model="searchForm.configApplication" :disabled="modal_loading" size="small"
                   :placeholder="$t('forms.pleaseEnter') + $t('forms.name')"
                   @on-enter="handleSearch"></i-input>
        </Form-item>
        <Form-item :label="$t('forms.profile')" prop="configProfile">
          <i-input v-model="searchForm.configProfile" :disabled="modal_loading" size="small"
                   :placeholder="$t('forms.pleaseEnter') + $t('forms.profile')"
                   @on-enter="handleSearch"></i-input>
        </Form-item>
        <Form-item :label="$t('forms.label')" prop="configLabel">
          <i-input v-model="searchForm.configLabel" :disabled="modal_loading" size="small"
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
        <Form-item :label="$t('forms.key')" prop="configKey" style="width: 80%;max-width: 700px">
          <i-input v-model="searchForm.configKey" :disabled="modal_loading" size="small"
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
      <template slot-scope="{ row }" slot="configApplication">
        <span>{{ row.configApplication }}</span>
      </template>
      <template slot-scope="{ row }" slot="configProfile">
        <span>{{ row.configProfile }}</span>
      </template>
      <template slot-scope="{ row }" slot="configLabel">
        <span>{{ row.configLabel }}</span>
      </template>
      <template slot-scope="{ row }" slot="configKey">
        <span>{{ row.configKey }}</span>
      </template>
      <template slot-scope="{ row }" slot="configValue">
        <span>{{ row.configValue }}</span>
      </template>
      <template slot-scope="{ row }" slot="configDes">
        <span>{{ row.configDes }}</span>
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
        <Form-item :label="$t('forms.name')" prop="configApplication">
          <i-input v-model="editForm.configApplication" :disabled="modal_loading" ref="configApplication"
                   :placeholder="$t('forms.pleaseEnter') + $t('forms.name')"
                   @on-enter="doSave('editForm')"></i-input>
        </Form-item>
        <Form-item :label="$t('forms.profile')" prop="configProfile">
          <i-input v-model="editForm.configProfile" :disabled="modal_loading"
                   :placeholder="$t('forms.pleaseEnter') + $t('forms.profile')"
                   @on-enter="doSave('editForm')"></i-input>
        </Form-item>
        <Form-item :label="$t('forms.label')" prop="configLabel">
          <i-input v-model="editForm.configLabel" :disabled="modal_loading"
                   :placeholder="$t('forms.pleaseEnter') + $t('forms.label')"
                   @on-enter="doSave('editForm')"></i-input>
        </Form-item>
        <Form-item :label="$t('forms.key')" prop="configKey">
          <i-input v-model="editForm.configKey" :disabled="modal_loading"
                   :placeholder="$t('forms.pleaseEnter') + $t('forms.key')"
                   @on-enter="doSave('editForm')"></i-input>
        </Form-item>
        <Form-item :label="$t('forms.value')" prop="configValue">
          <i-input v-model="editForm.configValue" :disabled="modal_loading"
                   :placeholder="$t('forms.pleaseEnter') + $t('forms.value')"
                   @on-enter="doSave('editForm')"></i-input>
        </Form-item>
        <Form-item :label="$t('forms.describe')" prop="configDes">
          <i-input v-model="editForm.configDes" :disabled="modal_loading"
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
          configApplication: '',
          configProfile: '',
          configLabel: '',
          configKey: '',
          enabled: '',
          orderParam: {
            key: 'configKey',
            order: 'asc'
          },
          currPage: 1,
          totalRows: 0,
          pageSize: 10,
          pageSizeArray: [10, 20, 30, 40]
        },
        editForm: {
          id: '',
          configApplication: '',
          configProfile: '',
          configLabel: '',
          configKey: '',
          configValue: '',
          configDes: '',
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
            this.$refs['configApplication'].focus()
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
            key: 'configApplication',
            title: this.$i18n.t('forms.name'),
            width: 100,
            slot: 'configApplication',
            sortable: 'custom'
          },
          {
            key: 'configProfile',
            title: this.$i18n.t('forms.profile'),
            width: 95,
            slot: 'configProfile',
            sortable: 'custom'
          },
          {
            key: 'configLabel',
            title: this.$i18n.t('forms.label'),
            width: 85,
            slot: 'configLabel',
            sortable: 'custom'
          },
          {
            key: 'configKey',
            title: this.$i18n.t('forms.key'),
            slot: 'configKey',
            sortable: 'custom'
          },
          {
            key: 'configValue',
            title: this.$i18n.t('forms.value'),
            width: 100,
            slot: 'configValue'
          },
          {
            key: 'configDes',
            title: this.$i18n.t('forms.describe'),
            width: 200,
            slot: 'configDes'
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
          configApplication: [
            { required: true, message: this.$i18n.t('forms.name') + this.$i18n.t('forms.notEmpty'), trigger: 'blur' }
          ],
          configProfile: [
            { required: true, message: this.$i18n.t('forms.profile') + this.$i18n.t('forms.notEmpty'), trigger: 'blur' }
          ],
          configLabel: [
            { required: true, message: this.$i18n.t('forms.label') + this.$i18n.t('forms.notEmpty'), trigger: 'blur' }
          ],
          configKey: [
            { required: true, message: this.$i18n.t('forms.key') + this.$i18n.t('forms.notEmpty'), trigger: 'blur' }
          ],
          configValue: [
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
                  configApplication: this.editForm.configApplication,
                  configProfile: this.editForm.configProfile,
                  configLabel: this.editForm.configLabel,
                  configKey: this.editForm.configKey,
                  configValue: this.editForm.configValue,
                  configDes: this.editForm.configDes,
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
                  configApplication: this.editForm.configApplication,
                  configProfile: this.editForm.configProfile,
                  configLabel: this.editForm.configLabel,
                  configKey: this.editForm.configKey,
                  configValue: this.editForm.configValue,
                  configDes: this.editForm.configDes,
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
          configApplication: this.editForm.configApplication,
          configProfile: this.editForm.configProfile,
          configLabel: this.editForm.configLabel,
          configKey: this.editForm.configKey,
          configValue: this.editForm.configValue,
          configDes: this.editForm.describe,
          enabled: this.editEnabled
        }).then((res) => {
          this.modal_loading = false
          if (res) {
            this.searchData[index].configApplication = this.editApplication
            this.searchData[index].configProfile = this.editProfile
            this.searchData[index].configLabel = this.editLabel
            this.searchData[index].configKey = this.editKey
            this.searchData[index].configValue = this.editValue
            this.searchData[index].configDes = this.editDes
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
          configApplication: this.searchForm.configApplication,
          configProfile: this.searchForm.configProfile,
          configLabel: this.searchForm.configLabel,
          configKey: this.searchForm.configKey,
          queryParam: {
            currPage: this.searchForm.currPage,
            pageSize: this.searchForm.pageSize
          }
        }
        if (this.searchForm.enabled === 'true') {
          searchParam.enabled = true
        } else if (this.searchForm.enabled === 'false') {
          searchParam.enabled = false
        }
        if (this.searchForm.orderParam.order !== 'normal') {
          searchParam.queryParam.orderName = this.searchForm.orderParam.key
          searchParam.queryParam.orderCommond = this.searchForm.orderParam.order
        }
        this.modal_loading = true
        this.$api.request.config.query(searchParam).then((res) => {
          this.modal_loading = false
          if (res) {
            this.selectedData = []
            this.searchForm.currPage = res.data.pageable.pageNumber + 1
            this.searchForm.totalRows = res.data.totalElements
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
        this.editForm.configApplication = row.configApplication
        this.editForm.configProfile = row.configProfile
        this.editForm.configLabel = row.configLabel
        this.editForm.configKey = row.configKey
        this.editForm.configValue = row.configValue
        this.editForm.configDes = row.configDes
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
