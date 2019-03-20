<template>
  <Card>
    <Form ref="searchForm" :model="searchForm" :label-width="60" :inline="true" class="search-form"
          onsubmit="return false;">
      <Form-item :label="$t('forms.routeId')" prop="routeid">
        <i-input v-model="searchForm.routeid" :disabled="modal_loading" size="small"
                 :placeholder="$t('forms.pleaseEnter') + $t('forms.routeId')"
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
          {{$t('forms.buttons.refreshRoute')}}
        </Button>
      </Form-item>
    </Form>
    <Table border height="433" size="small" :columns="columns" :data="searchData" class="search-table"
           :loading="modal_loading" :no-data-text="$t('messages.tableNoData')" @on-row-dblclick="handleEdit"
           @on-selection-change="handleSelect" @on-sort-change="handleSortChange">
      <template slot-scope="{ row }" slot="routeid">
        <span>{{ row.routeid }}</span>
      </template>
      <template slot-scope="{ row }" slot="uri">
        <span>{{ row.uri }}</span>
      </template>
      <template slot-scope="{ row }" slot="predicates">
        <span>{{ row.predicates }}</span>
      </template>
      <template slot-scope="{ row }" slot="filters">
        <span>{{ row.filters }}</span>
      </template>
      <template slot-scope="{ row }" slot="orderNum">
        <span>{{ row.orderNum }}</span>
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
    <Modal v-model="editModal" :title="$t('forms.info')" :loading="modal_loading" :mask-closable="false" fullscreen>
      <Form ref="editForm" :model="editForm" :rules="ruleAddForm" :label-width="80" :inline="true"
            style="padding-right: 25px;">
        <Row>
          <i-col :xl="8">
            <Form-item :label="$t('forms.routeId')" prop="routeid" style="width: 100%">
              <i-input v-model="editForm.routeid" :disabled="modal_loading" ref="routeid"
                       :placeholder="$t('forms.pleaseEnter') + $t('forms.routeId')"
                       @on-enter="doSave('editForm')"></i-input>
            </Form-item>
          </i-col>
          <i-col :xl="8">
            <Form-item :label="$t('forms.uri')" prop="uri" style="width: 100%">
              <i-input v-model="editForm.uri" :disabled="modal_loading"
                       :placeholder="$t('forms.pleaseEnter') + $t('forms.uri')"
                       @on-enter="doSave('editForm')"></i-input>
            </Form-item>
          </i-col>
          <i-col :xl="4">
            <Form-item :label="$t('forms.sort')" prop="orderNum">
              <InputNumber v-model="editForm.orderNum" :disabled="modal_loading" style="width: 100%;max-width: 160px;"
                           :placeholder="$t('forms.pleaseEnter') + $t('forms.sort')" :min="0"
                           @keyup.enter.native="doSave('editForm')"></InputNumber>
            </Form-item>
          </i-col>
          <i-col :xl="4">
            <Form-item :label="$t('forms.enabled')" prop="enabled">
              <i-switch v-model="editForm.enabled" :disabled="modal_loading"
                        @keyup.native="handleAddKeyUp($event, 'editForm')">
                <Icon type="md-checkmark" slot="open"></Icon>
                <Icon type="md-close" slot="close"></Icon>
              </i-switch>
            </Form-item>
          </i-col>
        </Row>
        <Row>
          <i-col :xl="12">
            <Form-item :label="$t('forms.predicates')" prop="predicates" style="width: 100%">
              <vueJsonEditor v-model="editForm.predicates" :showBtns="false"></vueJsonEditor>
            </Form-item>
          </i-col>
          <i-col :xl="12">
            <Form-item :label="$t('forms.filters')" prop="filters" style="width: 100%">
              <vueJsonEditor v-model="editForm.filters" :showBtns="false"></vueJsonEditor>
            </Form-item>
          </i-col>
        </Row>
      </Form>
      <div slot="footer" align="center">
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
  import vueJsonEditor from 'vue-json-editor'

  export default {
    name: 'routeConfig',
    components: {
      vueJsonEditor
    },
    data () {
      return {
        searchForm: {
          routeid: '',
          enabled: '',
          orderParam: {
            key: 'routeid',
            order: 'asc'
          },
          currPage: 1,
          totalRows: 0,
          pageSize: 10,
          pageSizeArray: [10, 20, 30, 40]
        },
        editForm: {
          id: '',
          routeid: '',
          uri: '',
          predicates: [],
          filters: [],
          orderNum: 0,
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
            this.$refs['routeid'].focus()
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
            key: 'routeid',
            title: this.$i18n.t('forms.routeId'),
            width: 150,
            slot: 'routeid',
            sortable: 'custom'
          },
          {
            key: 'uri',
            title: this.$i18n.t('forms.uri'),
            width: 150,
            slot: 'uri'
          },
          {
            key: 'predicates',
            title: this.$i18n.t('forms.predicates'),
            slot: 'predicates'
          },
          {
            key: 'filters',
            title: this.$i18n.t('forms.filters'),
            slot: 'filters'
          },
          {
            key: 'orderNum',
            title: this.$i18n.t('forms.sort'),
            width: 80,
            align: 'center',
            slot: 'orderNum',
            sortable: 'custom'
          },
          {
            key: 'enabled',
            title: this.$i18n.t('forms.enabled'),
            width: 80,
            align: 'center',
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
          routeid: [
            { required: true, message: this.$i18n.t('forms.routeId') + this.$i18n.t('forms.notEmpty'), trigger: 'blur' }
          ],
          uri: [
            { required: true, message: this.$i18n.t('forms.uri') + this.$i18n.t('forms.notEmpty'), trigger: 'blur' }
          ],
          orderNum: [
            {
              type: 'number',
              required: true,
              message: this.$i18n.t('forms.sort') + this.$i18n.t('forms.notEmpty'),
              trigger: 'blur'
            }
          ],
          predicates: [
            {
              required: true,
              type: 'array',
              min: 1,
              message: this.$i18n.t('forms.predicates') + this.$i18n.t('forms.notEmpty'),
              trigger: 'blur'
            }
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
                this.$api.request.route.create({
                  routeid: this.editForm.routeid,
                  uri: this.editForm.uri,
                  orderNum: this.editForm.orderNum,
                  predicates: JSON.stringify(this.editForm.predicates),
                  filters: JSON.stringify(this.editForm.filters),
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
                this.$api.request.route.update({
                  id: this.editForm.id,
                  routeid: this.editForm.routeid,
                  uri: this.editForm.uri,
                  orderNum: this.editForm.orderNum,
                  predicates: JSON.stringify(this.editForm.predicates),
                  filters: JSON.stringify(this.editForm.filters),
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
        this.$api.request.route.delete(rowIds).then((res) => {
          this.modal_loading = false
          if (res) {
            this.$Message.success(this.$i18n.t('messages.deleteSuccess'))
            this.handleSearch()
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
          routeid: this.searchForm.routeid,
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
        this.$api.request.route.query(searchParam).then((res) => {
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
        this.editForm.routeid = row.routeid
        this.editForm.uri = row.uri
        this.editForm.predicates = JSON.parse(row.predicates)
        this.editForm.filters = JSON.parse(row.filters)
        this.editForm.orderNum = row.orderNum
        this.editForm.enabled = !!row.enabled
        this.editModal = true
        this.action = 1
      },
      handleRefresh () {
        this.$Modal.confirm({
          title: this.$i18n.t('dialog.confirm'),
          content: this.$i18n.t('messages.refreshRouteConfirm'),
          onOk: () => {
            this.modal_loading = true
            this.$api.request.route.refreshRoute().then((res) => {
              this.modal_loading = false
              if (res) {
                this.$Message.success(res.data.message)
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
