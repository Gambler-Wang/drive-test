<template>
    <section class="component-header">
        <router-link tag="p" class="header-logo" to="/all">
          <img src="../assets/images/logo_w.jpg"/>
          <b>掌云网盘</b>
        </router-link>
        <ul class="header-nav">
            <li>网盘</li>
        </ul>
        <section class="header-right">

           <router-link tag="em" to="/integralWallet">会员免费换</router-link>
           <router-link tag="a" to="/downLoad">下载客户端</router-link>
            <i>|</i>
            <section class="popover-box" v-if="userLogIn==true">
                <p><img :src="userInfo.headImg" /><span class="username" :class="{vip:(userInfo.vip=='1')?true:false}" >{{userInfo.nickName}}</span><i class="el-icon-arrow-down"></i></p>
                <transition name = "fade">
                  <section class="popover-wrap">
                    <section class="popover-content">
                        <dl>
                            <dt><img :src="userInfo.headImg" /><span class="username" :class="{vip:(userInfo.vip=='1')?true:false}">{{userInfo.nickName}}</span></dt>
                            <dd><router-link to="/personalCenter">个人资料</router-link></dd>
                            <dd><router-link to="/integralWallet">积分钱包</router-link></dd>
                            <dd><router-link target="_blank" to="/feedback">意见反馈</router-link></dd>
                            <dd><a href="javascript:;" @click="signout">退出账号</a></dd>
                        </dl>
                    </section>
                  </section>
                </transition>
            </section>
            <section class="Log-box" v-if="userLogIn==false">
                <span @click="loginIn">登录</span>
                <span><router-link to="/register">注册</router-link></span>
            </section>
        </section>
    </section>
</template>
<script>
export default {
  name: "Header",
  props: {},
  data() {
    return {
      popoverContent: false, //popover是否显示,
      userInfo:{
          userName:'',

      },
      userLogIn:true,
    };
  },
  methods: {
    loginIn(){
      this.$emit('loginLayer')
    },
    signout() {
      this.$http({
        url: "/api/member/logout",
        method: "post",
        data: {}
      }).then(res => {
        if (res.data.code === 100001) {
          // localStorage.removeItem("token");
          // localStorage.removeItem("userInfo");
          localStorage.clear();
          this.delCookie('pwd');
          this.$router.push({
            path: "/login"
          });
        }
      });
    },
    getInfor(){
      this.$http({
        url:"/api/member/infos",
        method:"post",
        data:{}
      }).then((res)=>{
        if(res.data.code == 100001){
          if(res.data.data.headImg){
            if(localStorage.getItem('userInfo')){
              this.userInfo=JSON.parse(localStorage.getItem('userInfo'));
              this.userInfo.headImg=res.data.data.headImg;
              localStorage.setItem('userInfo',JSON.stringify(this.userInfo));
              this.userLogIn=true;
            }else{
              this.userInfo='';
              this.userLogIn=false;
            }
          }
        }
      }).catch((err)=>{
        console.log(err);})
    },
  },
  created(){
    // if(localStorage.getItem('token')){
    //   this.getInfor();
    // }else{
    //   if(localStorage.getItem('userInfo')){
    //     this.userInfo=JSON.parse(localStorage.getItem('userInfo'));
    //     this.userLogIn=true;
    //   }else{
    //     this.userInfo='';
    //     this.userLogIn=false;
    //   }
    // }
      if(localStorage.getItem('userInfo')){
        this.userInfo=JSON.parse(localStorage.getItem('userInfo'));
        this.userLogIn=true;
      }else{
        this.userInfo='';
        this.userLogIn=false;
      }

  },
};
</script>
<style lang="scss" scoped>
@import "../assets/styles/components";

.component-header {
  width: 100%;
  min-width: 1100px;
  height: 62px;
  background-color: #F4F4F4;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9;
  & .header-logo,
  & .header-nav {
    display: inline-block;
    vertical-align: top;
  }
  & .header-logo {
    margin-left: 20px;
    cursor: pointer;
    font-size: 0;
    & > img {
      display: inline-block;
      vertical-align: top;
      margin-top: 12px;
    }
    & > b {
      font-size: 22px;
      color: #1A1A1A;
      line-height: 62px;
      margin-left: 6px;
    }
  }
  & .header-nav {
    margin-left: 55px;
    & > li {
      display: inline-block;
      font-size: 16px;
      vertical-align: top;
      position: relative;
      left: 0;
      top: 0;
      color: #5CBBF4;
      margin: 5px 0;
      padding: 0 10px;
      line-height: 42px;
    }
    & > li:after {
      content: "";
      display: block;
      width: 100%;
      height: 4px;
      background-color: #5CBBF4;
      border-radius: 2px;
      position: absolute;
      left: 0;
      bottom: 0;
    }
  }
  & .header-right {
    position: absolute;
    top: 0;
    right: 20px;
    height: 62px;
    line-height: 62px;
    & > a {
      display: inline-block;
      vertical-align: top;
      color: #5D5E5F;
      height: 62px;
      line-height: 62px;
      margin-right: 35px;
    }
    & > em {
      display: inline-block;
      vertical-align: top;
      width: 120px;
      padding-left: 36px;
      color: #ffffff;
      height: 32px;
      line-height: 32px;
      margin: 15px 35px 0 0;
      box-sizing: border-box;
      background-color: #FE5958;
      cursor: pointer;
      border-radius: 16px;
      position: relative;
      &::after{
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 36px;
        height: 100%;
        background: url("../assets/images/hy_free_icon.png") center center no-repeat;
      }
      &:hover{
        background-color: #F99E9D;
      }
    }
    & > i {
      line-height: 62px;
      color: #5D5E5F;
      font-family: 'MicrosoftYaHei',Helvetica, Arial,sans-serif;
    }
    & > .Log-box{
      display: inline-block;
      vertical-align: top;
      margin-left: 35px;
      height: 62px;
      line-height: 62px;
      color: #5D5E5F;
      & span{
        margin-right: 32px;
        cursor: pointer;
        & a{
          color: #5D5E5F;
        }
      }
    }
    & > .popover-box {
      display: inline-block;
      vertical-align: top;
      margin-left: 35px;
      height: 62px;
      line-height: 62px;
      cursor: pointer;
      position: relative;
      left: 0;
      top: 0;
      & > p {
        display: inline-block;
        vertical-align: top;
        & > span {
          display: inline-block;
          vertical-align: top;
          max-width: 150px;
          color: #5D5E5F;
          padding-left: 25px;
          position: relative;
          @extend .text-overflow;
          &::after{
            top: 21px;
          }
        }
        & > i {
          margin-left: 5px;
        }
        & > img {
          display: inline-block;
          vertical-align: top;
          width: 34px;
          height: 34px;
          margin-top: 14px;
          margin-right: 10px;
          border-radius: 50%;
          border: 1px solid #31AAF2;
          overflow: hidden;
        }
      }
      & .popover-wrap{
        position: absolute;top:62px;display:none;right:0;width: 230px;height:10px;
      }
      & .popover-content {
        position: relative;
        margin-top:10px;
        top: 0;
        right: 0;
        box-shadow: 0 0 8px 3px #e5e5e5;
        background-color: #fff;
        border-radius: 5px;

        & > dl {
          width: 100%;
          border-radius: 5px;
          overflow: hidden;
          & > dt {
            padding: 17px 20px;
            line-height: 50px;
            vertical-align: top;
            background-color: #5cbbf4;
            & > img {
              display: inline-block;
              vertical-align: top;
              width: 50px;
              height: 50px;
              border-radius: 50%;
              overflow: hidden;
            }
            & > span {
              display: inline-block;
              vertical-align: top;
              width: 125px;
              color: #fff;
              @extend .text-overflow;
              margin-left: 10px;
              &::after{
                top: 15px;
              }
            }
          }
          & > dd {
            & > a {
              display: block;
              padding: 0 20px;
              line-height: 45px;
              color: #3d3d3d;
            }
          }
          & > dd:hover {
            background-color: #eaf7ff;
          }
        }
      }
      &  .popover-content:after {
        content: "";
        position: absolute;
        right: 30px;
        top: -15px;
        display: block;
        border: 8px solid transparent;
        border-bottom-color: #5cbbf4;
      }
    }
    &  .popover-box:hover > .popover-wrap{ display:block;}
    & .username{
      padding-left:25px;
      box-sizing: border-box;
      position: relative;
      &::after{
        content: '';
        position: absolute;
        left: 0;
        width: 21px;
        height: 17px;
        background: url("../assets/images/vip0.png") center center no-repeat;
      }
      &.vip{
        &::after{
          background: url("../assets/images/vip1.png") center center no-repeat;
        }
      }
    }
  }

  & .popover-content {
    width: 100%;
    // &  dt{}
  }
}
</style>
