<template>
    <section class="component-loading">
        <p><i class="el-icon-loading"></i><span>{{message}}</span></p>
    </section>
</template>
<script>
export default {
    name:'Loading',
    props:{
        message:{
            type:String,
            default:"加载中..."
        }
    },
    data(){
        return {}
    }
}
</script>
<style lang="scss" scoped>
.component-loading{
    display:inline-block;vertical-align:top; border-radius:3px; background-color:#5CBBF4; color:#fff; padding:10px 15px; line-height:22px;
    & span{ margin-left:10px;}
    & i{ font-size:14px;}
}
</style>
