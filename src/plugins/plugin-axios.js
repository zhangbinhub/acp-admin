import Vue from 'vue'
import Axios from 'axios'
import VueAxios from 'vue-axios'

let axiosInstance = Axios.create({
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  },
  baseURL: 'http://127.0.0.1:8770/api',
  timeout: 60000
})

Vue.use(VueAxios, axiosInstance)
