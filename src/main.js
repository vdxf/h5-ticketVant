import Vue from 'vue'
import App from './App.vue'
import router from "@/router"

import "@/assets/js/flexible"

import { NavBar, Tabbar, TabbarItem, Popup, DatetimePicker, Search, List, Loading, Uploader, Toast, Button } from 'vant';
Vue.use(NavBar);
Vue.use(Tabbar);
Vue.use(TabbarItem);
Vue.use(Popup);
Vue.use(DatetimePicker);
Vue.use(Search);
Vue.use(List);
Vue.use(Loading);
Vue.use(Uploader);
Vue.use(Toast);
Vue.use(Button);


Vue.config.productionTip = false //阻止 vue 在启动时生成生产提示。

new Vue({
    el: '#app',
    render: h => h(App),
    router,
})