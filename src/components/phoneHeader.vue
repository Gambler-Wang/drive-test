<template>
  <section class="component-phoneHeader">
    <div class="logo-box">
      <img src="../assets/images/logo_phone.png" alt="">
      <span>掌云网盘</span>
    </div>
    <div class="login-box" v-if="isNeedLogin">
      <router-link to="/login">登录</router-link> |
      <router-link to="/register">注册</router-link>
    </div>
  </section>
</template>
<script>
export default {
  name: "phoneHeader",
  props: {
    isNeedLogin:{
      type:Boolean,
      default:true
    }
  },
  data() {
    return {
      popoverContent: false, //popover是否显示,
      userInfo:{
          userName:'',

      },
      userLogIn:true,
    };
  },
  created(){
      if(localStorage.getItem('userInfo')){
        this.userInfo=JSON.parse(localStorage.getItem('userInfo'));
        this.userLogIn=true;
      }else{
        this.userInfo='';
        this.userLogIn=false;
      }
  },
  methods: {
    signout() {
      this.$http({
        url: "/api/member/logout",
        method: "post",
        data: {}
      }).then(res => {
        if (res.data.code === 100001) {
          localStorage.removeItem("token");
          localStorage.removeItem("userInfo");
          this.$router.push({
            path: "/login"
          });
        }
      });
    }
  }
}
</script>
<style lang="scss" scoped>
  .component-phoneHeader{
    padding: 8px;
    padding-bottom:4px;
    display: flex;
    background: #FFFFFF;
    box-shadow: 0 1px 4px 0 rgba(0,0,0,0.28);
    position:fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1;
    & .logo-box{
      flex: 1;
      &>img{
        width: 46px;
        height: 43px;
        vertical-align: middle;
        margin-bottom: 3px;
      }
      & >span{
        font-size: 18px;
        color: #000000;
        letter-spacing: 0;
        text-align: left;
        font-weight: 700;
      }
    }
    & .login-box{
      color: #5CBBF4;
      line-height: 46px;
      margin-right: 10px;
      & a{
        font-size: 16px;
        color: #5CBBF4;
      }
    }
    
  }
</style>


