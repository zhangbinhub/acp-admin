<template>
  <Card>
    <Form ref="searchForm" :label-width="60" :inline="true" class="search-form">
      <Form-item :label="'名称'">
        <i-input></i-input>
      </Form-item>
      <Form-item :label="'值'">
        <i-input></i-input>
      </Form-item>
      <Form-item>
        <Button>查询</Button>
        <Button style="margin-left: 20px;">重置</Button>
        <Button style="margin-left: 20px;">新增</Button>
        <Button style="margin-left: 20px;">删除</Button>
      </Form-item>
    </Form>
    <Table border height="433" size="small" :columns="columns" :data="data" class="search-table" highlight-row
           no-data-text="-" no-filtered-data-text="-">
      <template slot-scope="{ row, index }" slot="name">
        <i-input type="text" v-model="editName" v-if="editIndex === index"/>
        <span v-else>{{ row.name }}</span>
      </template>
      <template slot-scope="{ row, index }" slot="value">
        <i-input type="text" v-model="editValue" v-if="editIndex === index"/>
        <span v-else>{{ row.value }}</span>
      </template>
      <template slot-scope="{ row, index }" slot="des">
        <i-input type="text" v-model="editDes" v-if="editIndex === index"/>
        <span v-else>{{ row.des }}</span>
      </template>
      <template slot-scope="{ row, index }" slot="action">
        <div v-if="editIndex === index">
          <Button @click="handleSave(index)">保存</Button>
          <Button @click="editIndex = -1">取消</Button>
        </div>
        <div v-else>
          <Button @click="handleEdit(row, index)" size="small">编辑</Button>
          <Button size="small" style="margin-left: 10px;">删除</Button>
        </div>
      </template>
    </Table>
    <div style="margin-top: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :current="2" :total="50" show-total show-elevator show-sizer size="small"/>
      </div>
    </div>
  </Card>
</template>
<script>
  export default {
    name: 'paramConfig',
    data () {
      return {
        columns: [
          {
            type: 'selection',
            width: 50,
            align: 'center'
          },
          {
            key: 'name',
            title: '名称',
            slot: 'name'
          },
          {
            key: 'value',
            title: '值',
            slot: 'value'
          },
          {
            key: 'des',
            title: '描述',
            slot: 'des'
          },
          {
            title: '操作',
            slot: 'action'
          }
        ],
        data: [
          {
            name: '王小明',
            value: 18,
            des: '北京市朝阳区芍药居'
          },
          {
            name: '张小刚',
            value: 25,
            birthday: '696096000000',
            des: '北京市海淀区西二旗'
          },
          {
            name: '李小红',
            value: 30,
            birthday: '563472000000',
            des: '上海市浦东新区世纪大道'
          },
          {
            name: '周小伟',
            value: 26,
            birthday: '687024000000',
            des: '深圳市南山区深南大道'
          },
          {
            name: '周小伟',
            value: 26,
            birthday: '687024000000',
            des: '深圳市南山区深南大道'
          },
          {
            name: '周小伟',
            value: 26,
            birthday: '687024000000',
            des: '深圳市南山区深南大道'
          },
          {
            name: '周小伟',
            value: 26,
            birthday: '687024000000',
            des: '深圳市南山区深南大道'
          },
          {
            name: '周小伟',
            value: 26,
            birthday: '687024000000',
            des: '深圳市南山区深南大道'
          },
          {
            name: '周小伟',
            value: 26,
            birthday: '687024000000',
            des: '深圳市南山区深南大道'
          },
          {
            name: '周小伟',
            value: 26,
            birthday: '687024000000',
            des: '深圳市南山区深南大道'
          }
        ],
        editIndex: -1,
        editName: '',
        editValue: '',
        editDes: ''
      }
    },
    methods: {
      handleEdit (row, index) {
        this.editName = row.name
        this.editValue = row.value
        this.editDes = row.des
        this.editIndex = index
      },
      handleSave (index) {
        this.data[index].name = this.editName
        this.data[index].value = this.editValue
        this.data[index].des = this.editDes
        this.editIndex = -1
      }
    }
  }
</script>
