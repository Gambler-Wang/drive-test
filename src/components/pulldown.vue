<template>
    <section class="component-pulldown"  @scroll="end" ref="container">
        <slot></slot>
        <p v-if = "done" class="pull-footer">没有更多了</p>
    </section>
</template>
<script>
export default {
  name: "PullDown",
  data() {
    return {
       done:false
    };
  },
  props:{
    //   refresh:{
    //       type:Function | Object,
    //       required:true
    //   }
    currentPage:{
        type:Number,
        default:1,
    },
    totalPage:Number,
    refreshing:{
        type:Boolean,
        default:false,
    },
    clearDone:{
        type:Boolean,
        default:true,
    }
  },
  methods: {
    end(e){
      // //ydh 处理外部分享组件刷新问题
      if(this.clearDone ==false){
        this.done = false
      }
      let dom = this.$refs['container'];
        const availHeight = dom.clientHeight, //文档高度
              scrollTop = dom.scrollTop , // 文档卷上去的高度
              documentHeight = dom.scrollHeight; //屏幕可以用区域高度

        if( documentHeight - scrollTop - availHeight < 80 ){
            if((this.currentPage == this.totalPage)){
              this.done = true;
              //ydh 处理外部分享组件刷新问题
              if(this.currentPage==1&&this.clearDone ==false){
                this.done = false
              }
              return ;
            }
            if( this.refreshing){
              return;
            } else {
              const page = this.currentPage + 1;
                this.$emit('refresh',page);
            }
        }
    },
    top(){
         let dom = this.$refs['container'];
         dom.scrollTop = 0;
    }
  },
  watch:{
    "$route"(n,o){
      this.done = false
    }
  },
  mounted() {
    // ydh判断滚动条是否存在
    let obj=document.getElementsByClassName("component-pulldown")[0];
    if(obj.scrollHeight>obj.clientHeight){
      obj.children[0].firstChild.classList.add('add')
    }
  }
};
</script>
<style lang="scss" scoped>
.component-pulldown{
    height:calc(100vh - 198px);overflow-y:auto;margin-top: 46px;overflow-x: hidden;
    & .pull-footer{
        line-height:47px; text-align:center;
    }
}
.component-pulldown dt.add{
  padding-right: 16px!important;
}
</style>
