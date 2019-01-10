// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import 'jquery'
import router from './router'
import el from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import store from './action/index'
import plugins from './util/util';
// import plugins from './util/util';
import './assets/styles/common.css'
import './assets/styles/elementStyle.css'
// import './assets/icon/iconfont.css'
import './assets/styles/components.scss';
// import 'babel-polyfill'
import preview from 'vue-photo-preview'
import VueWechatTitle from 'vue-wechat-title' //兼容title
import 'vue-photo-preview/dist/skin.css'
import './assets/styles/iconfont.css'
Vue.use(el);
Vue.use( plugins );
Vue.use(preview);
Vue.use(VueWechatTitle);
// Vue.prototype.$store = store
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
