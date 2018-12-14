import Vue from 'vue'
import Axios from 'axios'
import VueAxios from 'vue-axios'
// import Qs from 'qs'

// var axiosInstance = Axios.create({
//   // config里面有这个transformRquest， 这个选项会在发送参数前进行处理。 这时候我们通过Qs.stringify转换为表单查询参数
//   transformRequest: [function (data) {
//     data = Qs.stringify(data)
//     return data
//   }],
//   headers: {
//     'Content-Type': 'application/x-www-form-urlencoded'
//   }
// })
// Vue.use(VueAxios, axiosInstance)
Vue.use(VueAxios, Axios)
