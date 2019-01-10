import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
const store = new Vuex.Store({
    state:{
        page:1
    },
    mutations:{
        nextpage(state){
            state.page++;
        }
    }
})
export default store;
