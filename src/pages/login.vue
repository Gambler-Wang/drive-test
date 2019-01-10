<template>
    <section class="page-login">
        <section class="page-bg">
            <p class="header-logo clearfix">
                <img src="../assets/images/nav_logo1.png" />
                <b>掌云网盘</b>
                <section class="header-tab">
                    <router-link to="/all">首页</router-link>
                    <router-link to="/downLoad">下载中心</router-link>
                </section>
            </p>
            <section class="main">
                <section class="login-slogan"></section>
                <section class="login-box">
                    <h1>
                      <p>{{text}}</p>
                      <img v-show="!flg" src="../assets/images/rwm1.png" alt="扫一扫登录" @click="change" >
                      <img v-show="flg" src="../assets/images/dn2.png" alt="扫一扫登录" @click="change" >
                    </h1>
                    <form v-if="!flg">
                        <p v-show="loginErr" class="loginErr"><span>掌云ID或密码有误，请重新输入或</span><router-link to="/getpwd1">找回密码</router-link></p>
                        <p v-show="!loginErr"></p>
                        <ul>
                            <li>
                                <p class="one"><input type="text" name="userName" placeholder="掌云ID/手机号" v-model="formdata.userName"/></p>
                                <p><input type="password" name="pwd"  placeholder="请输入密码" v-model="formdata.pwd" /></p>
                            </li>
                            <li><button class="btns large" @click.prevent="sign">登录</button></li>
                          <!--<li class="three"><input type="checkbox" name="autologin" id="autologin" v-model="checked"><label for="autologin">下次自动登录</label></li>-->
                          <li class="three"><img :src="img" alt="" id="autologin" @click="changeImg"><span>下次自动登录</span></li>
                          <li>
                                <p>
                                  <router-link to="/getpwd1">忘记密码</router-link>
                                  <router-link to="/register">丨新用户注册</router-link>
                                </p>
                          </li>
                        </ul>
                    </form>
                  <section v-else class="box">
                    <img src="../assets/images/qrcode.png" alt="">
                    <p>请使用掌云网盘APP扫描二维码登录</p>
                    <div>
                      <router-link to="/getpwd1">忘记密码</router-link>
                      <router-link to="/register">丨新用户注册</router-link>
                    </div>
                  </section>
                    <!--<footer>扫一扫登录</footer>-->
                </section>
            </section>

        </section>
    </section>
</template>
<script>
export default {
    name:'Login',
    components:{},
    data(){
        return {
            checked:true,
            loginErr:false,
            formdata:{
                userName:'',
                pwd:''
            },
          text:'掌云ID密码登录',
          flg:false,
          img:require('../assets/images/xz1.png')
        }
    },
    methods:{
        async sign(){
            const _this = this;
            if(!this.formdata.userName || !this.formdata.pwd){
                this.$message({
                    type:'warning',
                    message:'掌云ID或密码不能为空'
                })
                return;
            }
            const params = {
                type:1,
                userName: this.formdata.userName,
                pwd:this.$md5(this.formdata.pwd),
                webBrowser:this.getBroswer()
            }
            const info = await this.$http({
                url:'/api/member/login',
                method:'post',
                data:params
            })
            await (function(i){
                if(i.data.code === 100001 ){
                    localStorage.setItem('token',JSON.stringify(i.data.data.token));
                    localStorage.setItem('userInfo',JSON.stringify(i.data.data));
                    if(_this.checked){
                        _this.setCookie('userName',_this.Base64.b64EncodeUnicode(_this.formdata.userName),7); 
                        _this.setCookie('pwd',_this.Base64.b64EncodeUnicode(_this.formdata.pwd),7); 
                    }else{
                        _this.delCookie('userName');
                        _this.delCookie('pwd');
                    }
                    
                    _this.$http({
                        url:'/api/member/visit',
                        method:'post',
                        data:{}
                    }).then(res=>{
                        if( res.data.code === 100001 ){
                            sessionStorage.setItem('visit',JSON.stringify(res.data.data));
                            _this.$router.push({path:'/all'})
                        }
                    })
                } else {
                    _this.loginErr = true;
                }
            })(info)
        },
        //获取验证码
        getCode(){

            if(!(/^1\d{10}$/.test(this.loginForm.phone))){
                this.$message({
                    message:'请输入手机号码',
                    type:'warning'
                })
                return false;
            }
            const params = {phone:this.loginForm.phone};
            this.$http({
                url:'/api/sms/send_code',
                method:'post',
                data:params
            }).then(res=>{
                if(res.data.code === 100001 ){
                    this.loginForm.code = res.data.data.code;
                }
            })
        },
        
        go(path){
            this.$router.push(path)
        },
        change(){
        this.flg = !this.flg
        if(this.flg){
          this.text =  '扫一扫登录'
        }else {
          this.text =  '掌云ID密码登录'
        }
      },
       changeImg(){
        this.checked = ! this.checked
         if(!this.checked){
           this.img = require('../assets/images/xz2.png')
         }else {
           this.img = require('../assets/images/xz1.png')
         }
      }
    },
    created(){
        const userName=this.getCookie('userName');
        const pwd=this.getCookie('pwd');
        if(userName || pwd){
            this.formdata.userName=this.Base64.b64DecodeUnicode(decodeURIComponent(this.getCookie('userName')));
            this.formdata.pwd=this.Base64.b64DecodeUnicode(decodeURIComponent((this.getCookie('pwd')?this.getCookie('pwd'):'')));
           if(localStorage.getItem('token')) {
                this.$router.push({
                    path:'/all',
                })
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.page-login{
    width:100%;height:100vh;background:url(~@/assets/images/bg.jpg) left top no-repeat; background-size:cover;min-height:800px;
    & > .page-bg{
        position: relative;width:100%;height:100%;background-color:rgba(0,0,0,.2);
    }
    & .header-logo{
        margin:0 30px; padding-top:20px;font-size:0;
        & > img { display: inline-block; vertical-align:top;}
        & > b{font-size:22px; color:#fff; height:40px; line-height:46px; display: inline-block; vertical-align:top; margin-left:6px;}
        & > .header-tab{
            float: right;font-size: 14px;line-height: 38px;
            & > a{
                display: inline-block;height: 100%;color: #fefefe;background-color: transparent; margin-right:5px;cursor: pointer;
                &:nth-of-type(1){
                    margin-right:70px;
                    color: #5cbbf4;
                }
            }
        }
    }
    & .main{
        width: 1200px;height: 720px;margin:0 auto;position: relative;
        &  .login-slogan{
            width: 543px;position:absolute; bottom:230px;left:0;padding: 30px 30px;
            font-size: 60px;letter-spacing: 0px;color: #fefefe;line-height: 76px;
            background: url(~@/assets/images/slogan.png) no-repeat left top;
            background-size:contain;
        }
        &  .login-box{
            width:450px; height:410px; background-color:#fff; border-radius:5px;position:absolute; top:177px;right: 0;;
            overflow: hidden; box-sizing:border-box;padding-top:10px;
            & > h1 {
              font-size:20px; color:#5a5a5a;font-weight:normal;margin: 0 20px;border-bottom:1px solid #DDDDDD;padding-bottom: 8px;position: relative;
              height: 63px;
              &>p{
                display: inline-block;
                line-height: 1;
                color: #1A1A1A;
                position: relative;
                top: 30px;
              }
              &>img{
                position: absolute;
                right: 0px;
                width: 54px;
                height: 54px;
                display: inline-block;
                vertical-align: bottom;
                cursor: pointer;
                &:hover {
                  opacity: 0.5;
                }
              }
            }
            & > form {
                padding:10px 20px; padding-top:0;box-sizing:border-box;
                & > p {
                    line-height:45px; height:45px; width:100%;
                    & > span{ color:#f56066; margin-right:5px;}
                    & > a{ color:#5cbbf4; text-decoration:underline;}
                }
                & > ul {
                    width:100%;
                    & > li:first-child{border-radius:5px; overflow:hidden;
                        & >p { height:42px;
                           &.one{
                            margin-bottom: 10px;
                          }
                            & > input{ width:100%; height:42px; border:none;box-sizing:border-box;
                            outline:none; padding:0 12px; line-height:24px;background:rgba(244,244,244,1);opacity:1; }
                        }
                    }
                    & > li:nth-of-type(2){
                        padding:20px 0; color:#5a5a5a;
                        & > input { margin-right:5px; outline:none; width:14px; height:14px; vertical-align: middle;background:rgba(244,244,244,1);opacity:1;}
                    }
                  &>li:nth-of-type(3){
                    display: inline-block;
                    position: relative;
                    left: 0;
                    top: 0;
                    color: #9F9F9F;
                  }
                    & > li:nth-of-type(4){
                        position:relative;right:-166px; top:0;display: inline-block;
                       & a{
                         color: #5CBBF4;
                       }
                    }
                }
            }
          &>.box{
            text-align: center;
            &>img{
              margin-top: 41px;
               margin-bottom: 33px;
            }
            &>p{
              font-size: 16px;
              color: #1A1A1A;
              margin-bottom: 22px;
            }
            & a{
              color: #5CBBF4;
            }
          }
            &  footer{
                position:absolute; left:0; bottom:0;background-color:rgba(92,187,244,0.1);
                color:#5cbbf4;text-align:center; line-height:75px;width:100%;
                &:hover{
                    color: #5cbbf4;
                }
            }
        }
    }

}
#autologin{
 vertical-align: middle;
  cursor: pointer;
  margin-right: 4px;
  margin-top: -2px;
}
</style>
