<template>
    <section class="component-form">
        <input type="text"  :value="synctest" @input="e=>$emit('update:synctest',e.target.value)" v-if="synctest" />
        <!-- <form>
            <solt></solt>
        </form> -->
        <input type="text" :value="vmodel" @input="e=>$emit('input',e.target.value)" v-else />
    </section>
</template>
<script>
export default {
    name:'testsync',
    model:{
        prop:'vmodel',
        event:'input'
    },
    props:['synctest','vmodel'],
    data(){
        return {}
    }
}
</script>

