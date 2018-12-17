import Vue from 'vue'
import Axios from 'axios'
import VueAxios from 'vue-axios'

let axiosInstance = Axios.create({
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  baseURL: 'http://127.0.0.1:8770'
})
Vue.use(VueAxios, axiosInstance)
