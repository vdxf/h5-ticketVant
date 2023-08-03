import Vue from 'vue'
import App from './App.vue'
import router from "@/router"
import Vant from 'vant';
import "@/assets/js/flexible"
import 'vant/lib/index.css';

Vue.use(Vant);

Vue.config.productionTip = false //阻止 vue 在启动时生成生产提示。

new Vue({
    el: '#app',
    render: h => h(App),
    router,
})

Vue.directive('preventReClick', {
    inserted( el, binding ) {
        el.addEventListener('click', () => {
            if (!el.disabled) {
                el.disabled = true
                setTimeout(() => {
                    el.disabled = false
                }, binding.value || 1000)
            }
        })
    }
})