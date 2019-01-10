import Vue from 'vue';
Vue.directive('timeformat',function(el,binding){
    console.log(binding)
    el.innerHTML = `${binding.value}:test`
})
export default Vue;