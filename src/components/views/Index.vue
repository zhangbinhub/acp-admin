<template>
  <div class="index">
    <el-card shadow="always">
      <template #header>{{ $t('forms.numberOfOnlineUsers') }}</template>
      <el-row :gutter="8" style="margin-top: -8px">
        <el-col :lg='{span:6}' v-for="(item,index) in onlineMessage" :key="index"
                style="padding: 0;margin-top: 8px">
          <el-card shadow="hover" style="margin: 0 8px">
            <el-row>
              <el-col :span="8">
                <el-icon size="55" color="#67c23a">
                  <el-icon-odometer/>
                </el-icon>
              </el-col>
              <el-col :span="16">
                <div style="color: #9ea7b4;">{{ item.appName }}</div>
                <count-to style="font-size: 30px;color: #409EFF"
                          :start-val="0"
                          :end-val="item.count"
                          :duration="2000"
                          :separator="','"
                          :prefix="''"
                          :suffix="''"
                          :autoplay="true"/>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
    <el-card v-show="showLoginChart" shadow="always" style="margin-top: 16px;">
      <template #header>{{ $t('forms.loginStatistics') }}</template>
      <div id="loginChart" :style="{height: '300px'}"></div>
    </el-card>
  </div>
</template>
<script>
import countTo from '@/plugins/vue-count-to'

export default {
  name: 'index',
  components: {countTo},
  data() {
    return {
      onlineInfo: [],
      loginInfo: []
    }
  },
  computed: {
    onlineMessage() {
      return this.onlineInfo
    },
    showLoginChart() {
      return this.$store.state.app.user.userInfo.levels <= 0
    }
  },
  watch: {
    showLoginChart(newShow) {
      if (newShow) {
        this.loadLoginChart()
      }
    }
  },
  methods: {
    loadLoginChart() {
      this.$api.request.log.getLoginInfo().then(res => {
        if (res.data) {
          this.loginInfo = res.data
          this.initLoginChart()
        }
      })
    },
    initLoginChart() {
      let loginChart = this.$echarts.init(document.getElementById('loginChart'))
      let xAxisData = []
      let appNames = []
      let series = []
      for (let info of this.loginInfo) {
        if (!xAxisData.includes(info.date)) {
          xAxisData.push(info.date)
        }
        if (!appNames.includes(info.appName)) {
          appNames.push(info.appName)
          series.push({
            name: info.appName,
            type: 'bar',
            barGap: '5%',
            showAllSymbol: true,
            smooth: true,
            data: [[info.date, info.count]]
          })
        } else {
          series.filter(item => {
            return item.name === info.appName
          })[0].data.push([info.date, info.count])
        }
      }
      xAxisData.sort()
      loginChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: appNames
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        dataZoom: {
          show: true,
          start: 0
        },
        grid: {
          left: '3%',
          right: '4%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          splitNumber: 10,
          data: xAxisData
        }],
        yAxis: [{
          type: 'value',
          splitNumber: 10
        }],
        series: series
      })
    }
  },
  mounted() {
    this.$api.request.auth.getOnlineInfo().then(res => {
      if (res.data) {
        this.onlineInfo = res.data
      }
    })
    if (this.showLoginChart) {
      this.loadLoginChart()
    }
  }
}
</script>
