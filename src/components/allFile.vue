<template>
    <section class="component-allFile">
      <div class="left">全部文件</div>
      <div class="right">已加载全部，共{{all}}个</div>
    </section>
</template>

<script>
  import b from '../util/newVue'
    export default {
      name: "allFile",
      props:{
        all:{
          type:Number
        }
      },
      data(){
        return{
          num:0
        }
      },
      mounted(){
        b.$on('num',(val)=>{
          this.num = val
        })
      }
    }
</script>

<style scoped>
.component-allFile{
  display: flex;
  justify-content: space-between;
  padding: 0 15px;
  color: #5a5a5a;
  font-size: 12px;
}
</style>
