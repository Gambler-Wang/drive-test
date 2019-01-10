<template>
  <section class="component-phoneShareBread">
      <span v-for="(item,index) in breadItems"  :key="index">
        <span v-if="index==(breadItems.length-1)">{{item.itemName}}</span>
        <a v-else><a href="javascript:;" @click="$emit('jumpBread', item.itemId);">{{item.itemName}}</a> > </a>
      </span>
  </section>
</template>
<script>
export default {
  name: "phoneShareBread",
  props: {
    breadItems:{
      type:Array
    }
  },
  data() {
    return {
      
    };
  },
  created(){
      
  },
  methods: {
    godetail(){

    }
  }
}
</script>
<style lang="scss" scoped>
  .auto-warp{
    word-break: break-all;
    word-wrap: break-word;
  }
  .component-phoneShareBread{
    @extend .auto-warp;
    padding: 3px 15px 2px 15px;
    border-bottom: 1px solid #E3E3E3;
    &>span{
      @extend .auto-warp;
      cursor: pointer;
      line-height: 27px;
      &>a{
        color: #000000;
        font-style:normal;
        &>a{
          color: #7dc7f5;
        }
      }
    }
  }
</style>


