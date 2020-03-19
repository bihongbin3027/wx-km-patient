import Vue from 'vue';
import FastClick from 'fastclick';
import './common/recorder';
import App from './App.vue';
import router from './router';
import store from './store/index'
import ajax from './common/ajax';
import 'normalize.css';
import './style/base.scss'

Vue.config.productionTip = false
Vue.prototype.$http = ajax

if ('addEventListener' in document && 'ontouchstart' in window) {
  FastClick.prototype.focus = function (targetElement) {
    targetElement.focus()
  };
  document.addEventListener('DOMContentLoaded', function () {
    FastClick.attach(document.body)
  }, false);
}

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
