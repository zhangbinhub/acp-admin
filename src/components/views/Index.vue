<template>
  <div class="index">
    <Row>
      <Card>
        <p slot="title">{{$t('forms.numberOfOnlineUsers')}}</p>
        <Row :gutter="8">
          <i-col :lg='{span:6}' v-for="(item,index) in onlineMessage" :key="index"
                 style="font-size: 38px;padding: 0">
            <Card style="margin: 0 8px">
              <Row>
                <i-col span="8">
                  <Icon type="md-pulse" :size="38"></Icon>
                </i-col>
                <i-col span="16">
                  <p style="color: #9ea7b4;">{{item.appName}}</p>
                  <h3>{{item.count}}</h3>
                </i-col>
              </Row>
            </Card>
          </i-col>
        </Row>
      </Card>
    </Row>
    <Row v-show="showLoginChart" style="margin-top: 16px;">
      <Card>
        <div id="loginChart" :style="{height: '300px'}"></div>
      </Card>
    </Row>
  </div>
</template>
<script>
    export default {
        name: 'index',
        data () {
            return {
                onlineInfo: [],
                loginInfo: []
            }
        },
        computed: {
            onlineMessage () {
                return this.onlineInfo
            },
            showLoginChart () {
                return this.$store.state.app.user.userInfo.levels <= 0
            }
        },
        watch: {
            showLoginChart (newShow) {
                if (newShow) {
                    this.loadLoginChart()
                }
            }
        },
        methods: {
            loadLoginChart () {
                this.$api.request.auth.getLoginInfo().then(res => {
                    this.loginInfo = res.data
                    this.initLoginChart()
                })
            },
            initLoginChart () {
                let loginChart = this.$echarts.init(document.getElementById('loginChart'))
                let xAxisdata = []
                let appNames = []
                let series = []
                this.loginInfo.forEach(info => {
                    if (!xAxisdata.includes(info.date)) {
                        xAxisdata.push(info.date)
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
                })
                xAxisdata.sort()
                loginChart.setOption({
                    title: {
                        text: this.$i18n.t('forms.loginStatistics')
                    },
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
                        start: 70
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        containLabel: true
                    },
                    xAxis: [{
                        type: 'category',
                        splitNumber: 10,
                        data: xAxisdata
                    }],
                    yAxis: [{
                        type: 'value',
                        splitNumber: 10
                    }],
                    series: series
                })
            }
        },
        mounted () {
            this.$api.request.auth.getOnlineInfo().then(res => {
                this.onlineInfo = res.data
            })
            if (this.showLoginChart) {
                this.loadLoginChart()
            }
        }
    }
</script>
