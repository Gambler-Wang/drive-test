<template>
    <section class="component-coyptext">
        <input type="text" id="input" v-model="text" ref="input"  />
        <!-- <div>{{text}}</div> -->
        <button @click="copy">复制</button>
    </section>
</template>
<script>
export default {
    name:'CoypText',
    props:{
        text:{
            type:String,
            required:true
        }
    },
    methods:{
        copy(text){
            //setSelectionRange(start,end)方法适用于input、textarea标签，必须当标签获取到焦点后才能执行
            this.$refs['input'].focus();
            // console.log(this.text.match(/[^<>/\\\|:""\*\?]+\.\w+$/gi));
            // const reg = /(?<!.+)\.[^\.]+$/gi;
            // console.log(this.text.lastIndexOf('.'))
            this.$refs['input'].setSelectionRange(0,this.text.lastIndexOf('.')); 


            //select()方法可以直接选择input、texterea标签的属性值（全部），无需获取焦点
            // this.$refs['input'].select(); 
            // document.execCommand('copy');
        }
    }
}
</script>
<style lang="scss" scoped>
.component-coyptext{
    width:100%; position:relative;
    // & > #input { position:absolute; left:0; top:0; z-index:-10; }
}
</style>
