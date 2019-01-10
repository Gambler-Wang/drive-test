<template>
  <section class="page-share">
    <Header ref="Header" :flg="flg"></Header>
    <section class="content">
      <section  class="errInfor clearfix">
        <div>啊哦，你所访问的页面不存在了。<br>可能的原因：<br>1.在地址栏中输入了错误的地址。<br>2.你点击的某个链接已过期。</div>
      </section>
    </section>
  </section>
</template>
<script>
  import Header from '../components/header'
  import List from '../components/listShare'

  export default {
    name: 'share',
    components: {
      Header,
      List
    },
    data() {
      return {
        flg:false
      }
    },
  }
</script>
<style lang="scss" scoped>
  .content {
    width: 100%;
    height: 100vh;
    min-width: 1100px;
    min-height: 782px;
    padding: 90px 30px 0;
    background-color: #edf1f5;
    overflow: hidden;
    & .share-box {
      position: relative;
      width: 1000px;
      height: 715px;
      margin: 0 auto;
      background-color: #fff;
      box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.04);
      border-radius: 5px;
    }
    & .errInfor {
      position: relative;
      width: 1000px;
      height: 715px;
      margin: 0 auto;
      background-color: #fff;
      box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.04);
      border-radius: 5px;
      &>div{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
      }
    }
  }

  .share-err {
    display: inline-block;
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -170px;
    margin-top: -100px;
    & > div {
      display: inline-block;
      & img {
        width: 141px;
        height: 137px;
      }
      & p {
        color: #75cbff;
        font-size: 14px;
        margin-top: 20px;
      }
    }
  }

  .share-status {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding-right: 245px;
    & > .left-head {
      height: 117px;
      width: 100%;
      padding: 12px;
      border-bottom: 1px solid #eff8fd;
      box-sizing: border-box;
      & > div:nth-of-type(1) {
        float: left;
        overflow: hidden;
        & p {
          height: 30px;
          margin-top: 20px;
          & .fileIcon {
            vertical-align: middle;
            background: #e4e4e4;
            width: 22px;
            height: 22px;
            background-size: 100%, 100%;
            margin-right: 6px;
          }
          & span {
            display: inline-block;
            font-size: 16px;
            color: #5a5a5a;
            vertical-align: bottom;
          }
          & span.text-overflow {
            width: 200px;
          }
        }
        & p:nth-of-type(2) {
          height: 26px;
          & i {
            display: inline-block;
            width: 12px;
            height: 12px;
            background: url('../assets/images/share_time.png');
            vertical-align: text-top;
            margin-right: 6px;
          }
          & span {
            font-size: 12px;
            line-height: 26px;
          }
          & > span:nth-of-type(1) {
            margin-right: 26px;
          }
        }
      }

      & > div:nth-of-type(2) {
        float: right;
        margin-top: 20px;
        & i {
          display: inline-block;
          vertical-align: top;
          margin-right: 3px;
          width: 15px;
          height: 12px;
        }
        & .comBtns {
          width: 127px;
        }
        & .comBtns.share-no{
          background: url("../assets/images/icon7_cancel_default.png") 20px center no-repeat;
        }
        & .comBtns.share-no.com {
          background: url("../assets/images/icon7_cancel_selected.png") 20px center no-repeat;
          background-color: #5cbbf4;
          & span{
            color: white;
          }
        }
        & .comBtns.share-download{
          background: url("../assets/images/icons_download_default.png") 40px center no-repeat;
        }
        & .comBtns.share-download.com {
          background: url("../assets/images/icons_download_selected.png") 40px center no-repeat;
          background-color: #5cbbf4;
          & a{
            color: white;
          }
        }

        & .comBtns.share-save{
          background: url("../assets/images/icon6_save_default.png") 20px center no-repeat;
        }
        & .comBtns.share-save.com {
          background: url("../assets/images/icon6_save_selected.png") 20px center no-repeat;
          background-color: #5cbbf4;
          & span{
            color: white;
          }
        }
      }

    }
    & > .left-con {
      height: calc(100% - 117px);
      overflow: hidden;
      & > div {
        width: 134px;
        margin: 168px auto 0;
        & .icon {
          width: 134px;
          height: 134px;
          background-size: 100%, 100%;
        }
        & p {
          font-size: 12px;
          color: #848d96;
          text-align: center;
          margin-top: 20px;
        }
      }
    }
  }

  .share-login {
    position: absolute;
    right: 0;
    top: 0;
    width: 245px;
    height: 100%;
    background-color: #eff8fd;
    padding: 20px 26px;
    box-sizing: border-box;
    border-radius: 0 5px 5px 0;
    & #imgBox{
      display: inline-block;
      border: 3px solid #adcfe2;
      border-radius: 50%;
    }
    & > div {
      width: 100%;
      height: 60px;
      font-size: 0;
      & img {
        display: inline-block;
        vertical-align: top;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        overflow: hidden;
      }
      & span {
        position: absolute;
        top: 41px;
        left: 100px;
        width: 100px;
        display: block;
        font-size: 12px;
        color: #5a5a5a;
      }
      & span.text-overflow {
        width: 120px;
      }
    }
  }

  .share-logout {
    position: absolute;
    right: 0;
    top: 0;
    width: 245px;
    height: 100%;
    background-color: #eff8fd;
    padding: 20px;
    box-sizing: border-box;
    & p {
      text-align: center;
      font-size: 14px;
      color: #5a5a5a;
      margin: 20px 0;
    }
    & p + p {
      margin-bottom: 50px;
      font-size: 12px;
      & span {
        color: #5a5a5a;
      }
      & a {
        color: #5cbbf4;
        text-decoration: underline;
        &:hover {
          color: #5cbbf4;
        }
      }
    }
  }

  .pop-box {
    // display: none;
    // position: absolute;
    // width: 100%;
    // height: 100%;
    // top: 0;
    // z-index: 111;
    // background-color: rgba(0,0,0,.3);
    & .login-box {
      width: 450px;
      height: 445px;
      background-color: #fff;
      border-radius: 5px;
      // position:absolute; top:0; right:0;left: 0;bottom: 0;margin: auto;
      overflow: hidden;
      box-sizing: border-box;
      padding-top: 10px;
      & > h1 {
        font-size: 20px;
        color: #5a5a5a;
        text-align: center;
        font-weight: normal;
        line-height: 60px;
      }
      & > form {
        padding: 10px 20px;
        padding-top: 0;
        box-sizing: border-box;
        & > p {
          line-height: 45px;
          height: 45px;
          width: 100%;
          & > span {
            color: #f56066;
            margin-right: 5px;
          }
          & > a {
            color: #5cbbf4;
            text-decoration: underline;
          }
        }
        & > ul {
          width: 100%;
          & > li:first-child {
            border: 1px solid #d3dbe1;
            border-radius: 5px;
            overflow: hidden;
            height: 102px;
            & > p {
              height: 50px;
              & > input {
                width: 100%;
                height: 50px;
                border: none;
                box-sizing: border-box;
                outline: none;
                padding: 18px 12px;
                line-height: 24px;
              }

            }
            & > p + p {
              border-top: 1px solid #d3dbe1
            }

          }
          & > li:nth-of-type(2) {
            padding: 15px 0;
            color: #5a5a5a;
            & > input {
              margin-right: 5px;
              outline: none;
              width: 14px;
              height: 14px;
              vertical-align: middle;
            }
          }
          & > li:nth-of-type(4) {
            position: relative;
            left: 0;
            top: 0;
            & > a {
              display: inline-block;
              vertical-align: top;
              padding: 15px 0;
              color: #5a5a5a;
              &:hover {
                color: #3d3d3d;
              }
            }
            & > a + a {
              float: right;
              color: #5cbbf4;
              &:hover {
                color: #5cbbf4;
              }
            }
          }
        }
      }
      & footer {
        position: absolute;
        left: 0;
        bottom: 0;
        background-color: rgba(92, 187, 244, 0.1);
        color: #5cbbf4;
        text-align: center;
        line-height: 75px;
        width: 100%;
        &:hover {
          color: #5cbbf4;
        }
      }
    }
  }

  .upload {
    color: #5cbbf4;
  }
</style>
<style>
  .page-share .el-button--primary {
    background-color: #5cbbf4;
    border-radius: 5px;
    border-color: #5cbbf4;
    width: 100px;
    height: 34px;
    padding: 10px 36px;
  }

  .el-dialog-login.el-dialog {
    width: 450px !important;
    height: 445px !important;
  }

  .el-dialog-login .el-dialog__body {
    padding: 0;
  }

  .el-dialog-login .el-dialog__header {
    padding: 0;
  }

  #playerBox {
    text-align: center;
  }

  #playerBox > #id_test_video {
    height: 460px;
    width: 700px;
    display: inline-block;
    margin-top: 20px;
  }
</style>



