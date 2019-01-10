<template>
    <header class="component-title">
      <!--<p class="header-logo"><img src="../assets/images/nav_logo2.png" width="53" height="38"/><b>掌云网盘</b></p>-->
      <router-link tag="p" to="/all" class="header-logo"><img src="../assets/images/nav_logo2.png" /><b>掌云网盘</b></router-link>
         <h2><span>{{title}}</span></h2>
    </header>
</template>
<script>
export default {
    name:'header-title',
    props:{
        title:{
            type:String,
            required:true,
        }
    },
    data(){
        return {}
    }
}
</script>
<style lang="scss" scoped>
.component-title{
    width:100%; height:62px;  background-color:#fff;box-sizing:border-box;
    box-shadow:0 1px 8px 3px #e5e5e5; font-size:0;text-align:left;
    & .header-logo{
        margin-left:20px;display:inline-block;vertical-align:top;cursor: pointer;
        & > img { display: inline-block; vertical-align:top; margin-top:12px;}
        & > b{font-size:22px; color:#5cbbf4; line-height:62px; margin-left:6px;}
    }
    & h2{
        color:#999; font-size:20px;line-height:62px; display:inline-block;vertical-align:top; margin-left:12px;
        position: relative;
        &::after{
            position: absolute;
            content: '';
            width: 1px;
            height: 25px;
            background-color: #d8e2e8;
            left: 0;
            top: 18px;
        }
        & > span{margin-left:12px;color:#5a5a5a;}
    }

  .router-link-active {
    background: #FFF;
  }

}
</style>
