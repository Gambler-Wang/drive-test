<template>
  <section class="component-newCard"  id="picBox" >
    <p class="page-title">全部文件<span>已加载全部，共{{picData.length}}个</span></p>
    <ul class="clearfix">
      <li class="first" @click="addPic"><i></i><i></i></li>
      <!--新建-->
      <li v-show="newPic">
        <input type="text" v-model="newInput" placeholder="" id="newInput" v-on:keyup.13="submit" v-on:blur="blurs">
      </li>
      <li>
        <img src="http://120.79.193.155:8005/img/cover.png" alt="">
        <p tag="p" @click="picAll">全 部</p>
      </li>
      <li v-for="(item,index) in picData" class="tag">
        <img :src="item.cover" alt="">
        <router-link tag="p" :to="{name:'imgdetail',query:{id:item.id,filename:item.name}}">{{item.name}}</router-link>
      </li>
    </ul>
  </section>
</template>
<script>
  export default {
    name:'List',
    props:{
      picData:{
        type:Array,
        default:[]
      }
    },
    data(){
      return {
        newInput:'',
        newPic:false,
      }
    },
    methods: {
      getList(){
        this.$http({
          url:'./api/img/create_img',
          method:'post',
          data:{
            name:this.newInput
          }
        }).then((res)=>{
          if(res.data.code == 100001){
            this.newPic = false
            this.$emit('changList')
          }
        }).catch((err)=>{
          console.log(err)
        })
      },
      //新建分组文件夹
      addPic(){
        this.newPic = true
        this.$nextTick(()=>{
          $('#newInput').focus()
        })
      },
      submit(){
        if(this.newInput == ''){
              this.newPic = false
          return
            }
        this.getList()
      },
      blurs(){
        if(this.newInput == ''){
          this.newPic = false
          return
        }
        this.getList()
      },
      picAll(){
        this.$emit('picAll',false)
      }
    },
    mounted(){
      // let wrap = document.querySelectorAll(".tag")
      // document.oncontextmenu = function(e){
      //   var e = event || window.event;
      //   console.log(wrap);
      //   console.log(e);
      //     // wrap.style.display = "block";
      //     // wrap.style.left = e.clientX+'px';
      //     // wrap.style.right = e.clientY +'px';
      //      return false;//取消右键点击的默认事件
      //   }
    }
  }
</script>
<style lang="scss" scoped>
  #picBox {
    /*margin-top: 60px;*/
    &>ul{
      padding:20px;
      &> li {
        width: 215px;
        height: 145px;
        position: relative;
        float: left;
        display: inline-block;
        margin-right: 50px;
        margin-bottom: 50px;
        background-color: #ffffff;
        box-shadow: 0px 0px 10px 0px rgba(32, 89, 148, 0.08);
        border-radius: 5px;
        border: solid 1px #e0e7ed;
        &>img{
          width: 140px;
          position: absolute;
          left: 50%;
          top: 50%;
          margin-left: -70px;
          margin-top: -50px;
        }
        &.first {
          position: relative;
          cursor: pointer;
          & > i:first-child {
            width: 45px;
            height: 6px;
            background: #5cbbf4;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-left: -23px;
            margin-top: -3px;
            border-radius: 2px;
            display: inline-block;

          }
          & > i:last-child {
            width: 6px;
            height: 45px;
            background: #5cbbf4;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-left: -3px;
            margin-top: -23px;
            border-radius: 2px;
            display: inline-block;
          }
        }
        & #newInput{
          position: absolute;
          bottom: -36px;
          left: 50%;
          width: 130px;
          margin-left: -65px;
          height: 25px;
          line-height: 25px;
          font-size: 14px;
          padding: 6px;
          border: solid 1px #5cbbf4;
        }
        &>p{
          cursor: pointer;
          position: absolute;
          bottom: -36px;
          left: 50%;
          width: 130px;
          text-align: center;
          margin-left: -65px;
          height: 25px;
          line-height: 25px;
          font-size: 14px;
          padding: 6px;
        }
      }
    }
  }
  .page-title{ line-height:34px; color:#333; position:relative; left:0; top:0; padding:0 20px;background-color:#f5f5f5;
    & > span{ position:absolute; right:20px; top:0; }
  }
</style>

