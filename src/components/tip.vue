<template>
    <section class="component-tip" :class="{ active: isActive }">
      <p>
        <span>{{cont}}</span>
      </p>
    </section>
</template>
<script>
export default {
    name:'Tip',
    data(){
        return {
          isActive:false,
          cont:'',
        }
    },
    methods:{
      changeCont(newVal){
        const that=this;
        this.cont = newVal;
        this.isActive = true;
        const timer=setTimeout(()=>{that.isActive=false},1000);
      }
    }
}
</script>
<style lang="scss" scoped>
.component-tip{
  width: 100vw;
  height: 100vh;
  position: absolute;
  bottom: 0;
  left: 0;
  background: transparent;
  z-index: 111;
  overflow: hidden;
  display: none;
  &.active{
    display: block;
  }
  & p{
    margin-top: 85vh;
    text-align: center;
    & span{
      display: inline-block;
      padding: 0 20px;
      line-height: 28px;
      border-radius:14px;
      background: rgba(0,0,0,.5);
      color: #fff; 
    }
  }
}
</style>
