<template>
  <section class="page-downLoad">
    <div class="backBox">
      <p class="header-logo clearfix" v-show="flg">
        <router-link to="/all" tag="div">
          <img src="../assets/images/nav_logo1.png"/>
          <b>掌云网盘</b>
        </router-link>
        <section class="header-tab">
          <router-link to="/all">首页</router-link>
          <router-link to="/downLoad">下载中心</router-link>
        </section>
      </p>
      <section id="box" :class="{moved:!flg}">
        <div>
          <div class="title">扫描二维码下载客户端</div>
          <div class="content">
            <div class="left">
              <div ref="android" class="qrcode"></div>
              <a :href="packageUrls.android">
                <div>
                  <img src="../assets/images/Android.png" alt="">
                  <div>Android 版</div>
                </div>
              </a>
            </div>
            <div class="right">
              <div ref="ios" class="qrcode"></div>
              <a :href="packageUrls.ios">
                <div>
                  <img src="../assets/images/iPhone.png" alt="">
                  <div>iPhone 版</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<script>
  import QRCode from 'qrcodejs2';
  export default {
    name: "downLoad",
    data() {
      return {
        flg: true,
        packageUrls:{
          ios:'',
          android:''
        },
      }
    },
    methods: {
      BrowserListenJump() {
        if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
          this.flg = false
        }
      },
      createQRcode(el,url){
        const qrcode = new QRCode(el, {
            text: url,
            width: 146,
            height: 146,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
      },
      getDownloadUrl(){
        this.$http({
          url:'/api/member/get_package_urls',
          method:'post',
          data:{}
        }).then(res=>{
          if(res.data.code === 100001 ){
            this.packageUrls = res.data.data;
            this.createQRcode(this.$refs['ios'],res.data.data.ios);
            this.createQRcode(this.$refs['android'],res.data.data.android);
          }
        })
      }
      
    },
    mounted() {
      this.BrowserListenJump();
      this.getDownloadUrl()
    }
  }
</script>

<style lang="scss" scoped>
  .page-downLoad {
    & .qrcode{ background-color:#fff; border-radius:3px; padding:8px; box-sizing:border-box; overflow:hidden; text-align:center;width:162px; height:162px;}
    & .backBox {
      background: url(~@/assets/images/bg2.png) no-repeat left top;
      height: 100vh;
      background-size: cover;

      & .header-logo {
        margin: 0 30px;
        padding-top: 20px;
        font-size: 0;

        & > div {
          display: inline-block;
          cursor: pointer;

          & > img {
            display: inline-block;
            vertical-align: top;
          }

          & > b {
            font-size: 22px;
            color: #fff;
            height: 40px;
            line-height: 46px;
            display: inline-block;
            vertical-align: top;
            margin-left: 6px;
          }
        }

        & > .header-tab {
          float: right;
          font-size: 14px;
          line-height: 38px;

          & > a {
            display: inline-block;
            height: 100%;
            color: #fefefe;
            background-color: transparent;
            margin-right: 5px;
            cursor: pointer;

            &:nth-of-type(1) {
              margin-right: 70px;
            }

            &:nth-of-type(2) {
              color: #5cbbf4;
            }
          }
        }
      }

      #box {
        @media screen and (min-width: 768px) {
          & > div {
            width: 600px;
            height: 380px;
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            display: inline-block;

            & > .title {
              line-height: 62px;
              text-align: center;
              font-size: 48px;
              color: #fff;
            }

            & > .content {
              position: relative;
              top: 62px;

              & > .left {
                position: absolute;
                left: 62px;
                top: 0;
                width: 162px;
                height: 162px;
                display: inline-block;

                & >a{
                  display: inline-block;
                  width: 100%;
                  top: 18px;
                  position: relative;
                  &> div {
                    position: relative;
                    top: 0px;
                    line-height: 50px;
                    border-radius: 5px;
                    background: #fff;
                    font-size: 16px;
                    color: #333333;

                    & > div {
                      display: inline-block;
                      vertical-align: middle;
                    }

                    & > img {
                      display: inline-block;
                      width: 27px;
                      height: 30px;
                      vertical-align: middle;
                      margin-left: 22px;
                      margin-right: 12px;
                    }
                  }
                }
              }

              & > .right {
                position: absolute;
                right: 62px;
                top: 0;
                width: 162px;
                height: 162px;

                & >a{
                    display: inline-block;
                    width: 100%;
                    top: 18px;
                    position: relative;
                 & > div {
                    position: relative;
                    top: 0px;
                    line-height: 50px;
                    border-radius: 5px;
                    background: #fff;
                    font-size: 16px;
                    color: #333333;
                    & > div {
                      display: inline-block;
                      vertical-align: middle;
                    }

                    & > img {
                      display: inline-block;
                      width: 26px;
                      height: 31px;
                      vertical-align: middle;
                      margin-left: 27px;
                      margin-right: 12px;
                    }
                  }
                }
              }
            }
          }
        }
        @media screen and (max-width: 767px) {
          & {
            a{
              -webkit-tap-highlight-color: transparent;
            }
            height: 100%;
            > div {
              height: 100%;
              overflow-y: auto;
              display: flex;
              flex-direction: column;
              padding: 20px 0;
              box-sizing: border-box;
              & > .title {
                line-height: 62px;
                text-align: center;
                font-size: 20px;
                color: #fff;
              }
              & > .content {
                display: flex;
                flex-direction: column;
                height: 100%;
                align-items: center;
                & > .left {
                  flex-grow:1;
                  margin-bottom: 20px;
                  & > a{
                    display: flex;
                    width: 100%;
                    margin-top: 20px;
                    &>div {
                      width: 100%;
                      display: flex;
                      align-items: center;
                      justify-content: space-around;
                      line-height: 50px;
                      border-radius: 5px;
                      background: #fff;
                      font-size: 16px;
                      color: #333333;
                    }
                  }


                }
                & > .right {
                  flex-grow:1;
                  padding-bottom: 20px;
                  & > a{
                    display: flex;
                    width: 100%;
                    margin-top: 20px;
                    &> div {
                      display: flex;
                      width: 100%;
                      align-items: center;
                      justify-content: space-around;
                      line-height: 50px;
                      border-radius: 5px;
                      background: #fff;
                      font-size: 16px;
                      color: #333333;
                    }
                  }

                }
              }
            }
          }
        }
      }
    }
  }
</style>
