<template>
    <section class="component-inforAside">
      <aside class="aside-menu">
        <dl>
          <dt>
            <div class="left" >
              <img :src="information.headImg" alt="" style="width: 100%;height: 100%" >
            </div>
            <div class="right" >
              <p class="text-overflow username"  :class="{vip:(information.vip=='1')?true:false}" :title="information.nickName">{{information.nickName}}</p>
              <div id="changePic" @click="changeInfor">修改个人资料</div>
            </div>
          </dt>
          <dd class="dd">
            <p class="p" @click="goCloudId">
            <i class="cloudId"></i>
            <span class="text-overflow">掌云ID：<span class="com" :title="information.userName" v-if="information.userName">{{information.userName}}</span>
            <span v-show="flg" style="color: #b3b3b3;">未设置</span></span>
            <i class="changeIcon" v-show="flg" ></i>
           </p>
          </dd>
          <dd><p> <i class="phone"></i><span>手机：{{(information.phone)? phoneFilters(information.phone):''}}</span></p></dd>
          <dd><router-link tag='p'  to="/changePsw" class="p"><i class="psw"></i><span>修改密码</span></router-link></dd>
        </dl>
      </aside>
    </section>
</template>

<script>
    export default {
        name: "inforAside",
      data(){
          return{
            flg:false,
            information:{
              headImg:localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')).headImg : ''
            }
          }
      },
      methods:{
        getInfor(v){
          this.$http({
            url:"/api/member/infos",
            method:"post",
            data:{}
          }).then((res)=>{
            if(res.data.code == 100001){
              this.information = Object.assign({},res.data.data)
              if(this.information.userName == null){
                this.flg = true
              }else {
                this.flg = false
              }
              localStorage.setItem('userInfo',JSON.stringify(this.information));
              if(v){
                this.$emit('sendId')
              }
            }
          }).catch((err)=>{
            console.log(err);})
        },
        changeInfor(){
          this.$router.push({path:'/changeInfor'})
        },
        goCloudId(){
          if(this.information.userName){
            return
          }
          this.$router.push({path:'/cloudId'})
        },
      },
      created(){
        this.information =JSON.parse( localStorage.getItem('userInfo'))
         if( this.information.userName == null){
           this.flg = true
         }else {
           this.flg = false
         }

      }
    }
</script>

<style scoped lang="scss">
  .component-inforAside{
    position: relative;
    width: 278px;
    height:100%;
    display: inline-block;
    vertical-align: top;
    font-size: 14px;
    background-color:#e9edf3;
    position:relative;left:0; top:0;
    &>.aside-menu {
      height:100%;
      & dt{
        position: relative;
      }
      & .upload-img{
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 0;
        opacity: 0;
        cursor: pointer;
      }
      &  #changePic{
        cursor: pointer;
        height: 23px;
        width: 100%;
        /*background-color: #ffffff;*/
        /*border-radius: 12px;*/
        line-height: 23px;
        text-align: left;
        color: #5cbbf4;
        font-size: 14px;
      }
      & > dl{
        padding-top:10px;
        &>dt{
          margin-top: 40px;
          margin-bottom: 20px;
          position: relative;
          &>.left{
            width: 92px;height: 92px;border: solid 2px #ffffff; margin-left: 24px;display: inline-block;margin-right: 22px
          }
          &>.right{
          display: inline-block;text-align: center;position: absolute;bottom: 0;overflow:hidden;
            &>p{
             color: #5a5a5a;font-size: 16px;margin-bottom: 7px;width: 115px;text-align: left;
            }
            & .username{
              padding-left:25px;
              width: 125px;
              box-sizing: border-box;
              position: relative;
              &::after{
                content: '';
                position: absolute;
                left: 0;
                top: -2px;
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
        }
        &>dt,
        &>dd{
          line-height: 1;
        }
        &>dd{
          border-bottom: 1px solid #fff;
        }
        &>dd.dd{
          border-top: 1px solid #fff;
        }
        &>dt:hover,
        &>dd:hover{
          background-color: #e9edf3;
        }
        & > dt > p,
        & > dd > p{
          display:block; width:100%; height:45px; line-height:45px; overflow:hidden;box-sizing:border-box;padding-left: 24px;
          &.p{
            cursor: pointer;
          }
          &>.text-overflow{
            width: 140px;
          }
          &>i{
            display: inline-block;
            width: 16px;
            height: 24px;
            background-size: 100%;
            vertical-align: top;
            margin-top: 10px;
            margin-right: 14px;
            &.phone{
              background: url("../assets/images/personaldata_sidenav_icons_phone.png") no-repeat center;
            }
            &.psw{
              background: url("../assets/images/personaldata_sidenav_icons_lock.png") no-repeat center;
            }
            &.cloudId{
              width: 26px;
              margin-left: -5px;
              margin-right: 6px;
              background: url("../assets/images/iconcloudID.png") no-repeat center;
            }
          }
          &>i.changeIcon{
            display: inline-block;
            width: 16px;
            height: 15px;
            background: url("../assets/images/bianji.png") center no-repeat;
            cursor: pointer;
            margin-top: 14px;
            margin-left: 16px;
          }
        }
        & > dt > p{
          padding-left:8px;
        }
      }
    }
  }

</style>
