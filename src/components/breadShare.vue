<template>
  <section class="component-bread">
    <div class="box">
      <ul>
        <li @click="allTo" :class="{cc:routeArr.length>0}">全部文件</li>
        <li v-show = 'routeArr.length>0'
            v-for="(item,key) in routeArr"
            :key="key"
            :title="item.name"
            @click="add(item,key)"
            :style="{'max-width':maxwidth }"
            class="cc com" >{{item.name}}</li>
      </ul>
    </div>
    <i :class="['icon iconfont',this.styleFlag ? 'icon-tb':'icon-lb']" class="changeStyle"  @click="changeStyle"></i>
  </section>
</template>
<script>
  import b from '../util/newVue'
  export default {
    name:'breadShare',
    // props:{
    //   flg:{
    //     type:Boolean,
    //     default:false
    //   }
    // },
    data(){
      return {
        styleFlag:sessionStorage.getItem('styleFlag') == 'false' ? false :true,
        routeArr:[],
        obj:{},
        maxwidth:'10%'
      }
    },
    watch:{
      routeArr(v){
        this.maxwidth =  `${Number.parseInt(100 / (this.routeArr.length+1))}%`;
      }
    },
    methods: {
      changeStyle() {
        this.styleFlag = !this.styleFlag
        sessionStorage.setItem('styleFlag',this.styleFlag)
        this.$emit('changeStyle', this.styleFlag)
      },
      allTo(){
        this.routeArr = []
        sessionStorage.removeItem('routeArr')
        sessionStorage.removeItem('parentObj')
        this.$emit('routeList', '-1')
      },
      add(v, index) {
        this.routeArr.splice(index+1,this.routeArr.length-index)
        sessionStorage.setItem('routeArr',JSON.stringify(this.routeArr))
        sessionStorage.setItem('parentObj',JSON.stringify({'parentId':this.routeArr[this.routeArr.length-1].parentId,
                               'name':this.routeArr[this.routeArr.length-1].name}))
        this.$emit('routeList', v.parentId)
      }
    },
    created(){
      const routeArr =JSON.parse(sessionStorage.getItem('routeArr'))
      this.routeArr = routeArr ? routeArr:[]
      b.$on('routeArr',(v)=>{
        this.routeArr.push(v)
        sessionStorage.setItem('routeArr',JSON.stringify(this.routeArr))
      })
    },
    destroyed(){
      sessionStorage.removeItem('routeArr')
    }
  }
</script>
<style lang="scss" scoped>
  .component-bread{
    width:100%;line-height:34px;
    &>.box{
      & ul{
        padding: 0 40px 0px 20px;
      }
      & li{
        cursor: pointer;
        color: #7DC7F5;
        display: inline-block;
        vertical-align: top;
        &:nth-last-child(1){
          color: black;
        }
      }
      & .cc.com{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        position: relative;
        padding-left: 10px;
        display: inline-block;
        &::before{
          content: '>';
          display: block;
          color: #7DC7F5;
          position: absolute;
          left: 0;
          top:0;
        }
      }

    }
  }
  .changeStyle{
    position: absolute;
    right: 20px;
    top: 0px;
    width: 20px;
    height: 20px;
    color: #5D5E5F;
  }
</style>

