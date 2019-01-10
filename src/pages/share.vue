<template>
  <section class="page-share">
    <Header ref="Header" v-on:loginLayer="pop"></Header>
    <section class="content" v-show="statusOk">
      <section  class="share-box clearfix">
        <div class="share-err" v-if="!msgstatus">
          <div>
            <img src="../assets/images/share_pastdue.png" alt="">
            <p v-if="queryData.code == '100102'">该分享文件已删除</p>
            <p v-else-if="queryData.code == '100103'">该分享文件已取消分享</p>
            <p v-else-if="queryData.code == '100101'">该分享文件已过期</p>
            <p v-else>该分享文件已失效</p>
          </div>
        </div>
        <div class="share-status" v-else>
          <div class="left-head clearfix">
            <div>
              <p>
                <img src="../assets/images/folder.png" class="fileIcon" alt="">
                <span class="text-overflow" :title="fileInfo.shareName">{{fileInfo.shareName}}</span>
              </p>
              <p>
                <span><i></i><span>{{dataFormat(fileInfo.createTime)}}</span></span>
                <span><span>失效时间：</span><span>{{fileInfo.termTime}}</span></span>
              </p>
            </div>
            <div>
              <el-button size="medium" class="comBtns share-save" :class="{com:com}" v-if="fileStatues && !logStyle" @click="conserve()">
                <i></i>
                <span>保存到网盘</span>
              </el-button>
              <el-button size="medium" class="comBtns share-save" :class="{com:com}"  v-else-if="fileStatues && logStyle" @click="add">
                <i></i>
                <span>保存到网盘</span>
              </el-button>
              <el-button size="medium" class="comBtns share-no" :class="{com:com}" v-else @click="cancelShare">
                <i></i>
                <span>取消分享</span>
              </el-button>
              <el-button size="medium" class="comBtns share-download" :class="{com:!com}" @click="uploadUrl">
                <i></i>
                <span><a class="upload" href="javaScript:void(0)">下载</a></span>
              </el-button>
            </div>
          </div>
          <!--列表显示-->
          <div class="left-con" v-if="playerViewStatus">
            <List
              :params="queryData"
              :url="url"
              @sendCode="sendCode"
              @getSelectData="getSelectData"
              @sendData="sendData"
              :sort="sort"
              :time="sendTime"
            ></List>
          </div>
        </div>
        <div class="share-login">
          <div v-show="shareStatus == '1'" class="one" >
            <div>
              <div id="imgBox">
                 <img :src="fileInfo.memberHeadImg"/>
              </div>
              <span class="username text-overflow" :class="{vip:(visit.vip=='1')?true:false}" :title="fileInfo.memberNickName">{{fileInfo.memberNickName}}</span>
            </div>
          </div>
          <div v-show="shareStatus == '2'" class="two">
            <p>登录网盘，发现更多</p>
            <p>
              <el-button type="primary" @click="dialogVisible = true">登录</el-button>
            </p>
            <p>
              <span>没有掌云ID？</span>
              <router-link to="/register">立即注册</router-link>
            </p>
          </div>
          <p v-show="shareStatus== '3'"></p>
        </div>
      </section>
      <el-dialog
        :visible.sync="dialogVisible"
        width="30%"
        custom-class='el-dialog-login'>
        <section class="pop-box">
          <section class="login-box">
            <h1>掌云ID密码登录</h1>
            <form>
              <p v-show="loginErr" class="loginErr"><span>掌云ID或密码有误，请重新输入或</span>
                <router-link to="/getpwd1">找回密码</router-link>
              </p>
              <p v-show="!loginErr"></p>
              <ul>
                <li>
                  <p><input type="text" name="userName" placeholder="掌云ID/手机号" v-model="formdata.userName"/></p>
                  <p><input type="password" name="pwd" placeholder="请输入密码" v-model="formdata.pwd"/></p>
                </li>
                <li><input type="checkbox" name="autologin" id="autologin"><label for="autologin">下次自动登录</label></li>
                <li>
                  <button class="btns large" @click.prevent="sign">登录</button>
                </li>
                <li>
                  <router-link to="/getpwd1">忘记密码</router-link>
                  <router-link to="/register">没有掌云ID？立即注册</router-link>
                </li>
              </ul>
            </form>
            <footer>扫一扫登录</footer>
          </section>
        </section>
      </el-dialog>
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
        loginErr: false,
        visit:null,
        userInfo: {
          userName: '',
        },
        formdata: {
          userName: '',
          pwd: ''
        },
        queryData: {
          code: sessionStorage.getItem('code') ? sessionStorage.getItem('code') : '',
          parentId: '-1',
          name: '',
          type: '2',
          id: '-1'
        },
        url: '/api/files/shareIndex/' + this.$route.query.id,
        selectData: [],
        shareData: {},
        sort: {sort: '2', rank: '1'},
        //弹窗状态
        dialogVisible: false,
        // 页面文件当前状态
        fileStatues: true, //['save','cancel','err'],
        //当前文件类型
        fileInfo: {},
        tagId: '',
        logStyle: false,
        msgstatus: true,
        playerViewStatus: true,
        player: '',
        infoObj: {},
        oneId: '',
        playShow: false,
        flg: false,
        code: null,
        sharePath: true,
        sendTime: null,
        com:false,
        errFlg:false,
        statusOk:false,
        shareStatus:0
      }
    },
    methods: {
      getSelectData(data) {
        this.selectData = data;
      },
      getShareInfo() {
        let params = {
          urlCode: this.$route.query.id
        }
        this.$http({
          url: '/api/files/shareIndexInfo',
          method: 'post',
          data: params
        }).then(res => {
          if (res.data.code === 100001) {
            this.statusOk = true
            this.shareStatus ='1'
            this.visit=res.data.data;
            if (res.data.data.isOwner == '1') {
              // console.log('share本人');
            } else {
              // console.log('share不是本人');
              if (!sessionStorage.getItem('code')) {
                this.$router.push({path: '/ShareInit/' + this.$route.query.id});
              }
            }
          }
          else {
            // 失效
            if (res.data.code == 100101 || res.data.code == 100102 || res.data.code == 100103) {
              // 100102原文件删除// 100103取消分享// 100101过期
              this.statusOk = true
              this.msgstatus = false
              this.queryData.code =  res.data.code
              if(localStorage.getItem('token')){
                this.shareStatus ='3'
              }else {
                this.shareStatus ='2'
              }
            }
            if(res.data.code ===110003){
              this.$router.push({path:'/errInfor'})
            }
          }
        }).catch((err) => {

        })
      },
      sendData(v) {
        this.fileInfo = Object.assign({}, v.shareInfo)
        this.sendTime = v.shareInfo.createTime
        localStorage.setItem('fileInfo', JSON.stringify(this.fileInfo))
        this.infoObj = Object.assign({}, v)
        if (v.files.dataList.length == 0) {
          return
        }
        if (v.files.dataList[0].parentId == -1 && v.files.dataList[0].fileType != 1) {
          // 单文件
          this.tagId = Object.assign({}, v.files.dataList[0])
          this.oneId = Object.assign({}, v.files.dataList[0])
        }
        this.alterStatus()
      },
      shareShow(v) {
        this.shareData = v
        this.shareDialog = true
      },
      //弹窗展示
      pop() {
        this.dialogVisible = true;
      },
      // 取消分享
      cancelShare() {
        this.com =true
        const b ='<div style="font-size: 14px">取消分享后，该条分享记录将被删除，</div><div style="font-size: 14px">好友将无法再访问此分享链接。</div>'
        this.$confirm(b, '取消分享', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true
        }).then(() => {
          this.$http({
            url: "/api/files/share/cancel",
            method: "post",
            data: {
              shareIds: this.fileInfo.id
            }
          }).then(res => {
            if (res.data.code === 100001) {
              this.$message({
                message: '成功取消分享！',
                type: 'success',
                duration: 1000
              })
              if (this.sharePath) {
                setTimeout(() => {
                  this.$router.push({path: '/sharePage'})
                }, 1000)
              } else {
                location.reload()
              }
            }
          }).catch((err) => {
            console.log(err)
          })
        }).catch(() => {
        })
      },
      // 保存到网盘
      conserve() {
        if (localStorage.getItem('token')) {
          this.add()
        } else {
          this.com =true
          this.$refs.Header.loginIn()
        }

      },
      //登录功能
      sign() {
        const params = {
          type: 1,
          browser: this.getBroswer(),
          userName: this.formdata.userName,
          pwd: this.$md5(this.formdata.pwd)
        }
        this.$http({
          url: '/api/member/login',
          method: 'post',
          data: params
        }).then(res => {
          if (res.data.code === 100001) {
            localStorage.setItem('token', JSON.stringify(res.data.data.token));
            localStorage.setItem('userInfo', JSON.stringify(res.data.data));
            this.userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : '';
            this.$refs.Header.userInfo = this.userInfo;
            this.$refs.Header.userLogIn = true;
            this.sharePath = false;
            this.dialogVisible = false;
            this.$message({
              message: '登录成功！',
              type: 'success',
              duration: 1500
            });
              if (this.queryData.code == 100101 || this.queryData.code == 100102 || this.queryData.code == 100103) {
              this.shareStatus ='3'
              return
            }
            //登陆者id 与//分享者id比较
            if (res.data.data.id !== this.fileInfo.shareMemberId) {
              this.fileStatues = true
            } else {
              // 分享者本人
              this.fileStatues = false
              //其他界面表示本人的标识
              localStorage.setItem('fileStatues', false)
            }
          } else {
            this.loginErr = true;
          }
        }).catch(err => {
          console.log(err);
        })
      },
      //获取验证码
      getCode() {
        if (!(/^1\d{10}$/.test(this.loginForm.phone))) {
          this.$message({
            message: '请输入手机号码',
            type: 'warning'
          })
          return false;
        }
        const params = {phone: this.loginForm.phone};
        this.$http({
          url: '/api/sms/send_code',
          method: 'post',
          data: params
        }).then(res => {
          if (res.data.code === 100001) {
            this.loginForm.code = res.data.data.code;
          }
        })
      },
      //初始化时配置相关属性
      alterStatus() {
        if (localStorage.getItem('userInfo')) {
          //登录是同一个人
          if (JSON.parse(localStorage.getItem('userInfo')).id == this.fileInfo.shareMemberId) {
            this.fileStatues = false
            this.logStyle = false
          } else {
            //登录不是同一个人
            this.logStyle = true
            this.fileStatues = true
          }
        }
        else {
          //未登录
          this.logStyle = false
          this.fileStatues = true
        }
      },
      add() {
        this.com =true
        this.$http({
          url: '/api/files/share/transfer',
          method: 'post',
          data: {
            shareId: this.fileInfo.id,
            token: JSON.parse(localStorage.getItem('token'))
          }
        }).then(res => {
          if (res.data.code === 100001) {
            this.$message({
              message: res.data.msg,
              type: 'success',
              duration: 1500
            })
          }
        }).catch(err => {
          console.log(err);
        })
      },
      uploadUrl() {
        this.com = false
        if (this.infoObj.files.dataList.length == 0) {
          this.clientApp('文件夹暂无文件')
          return
        }
        if (this.selectData.length == 0) {
          this.$message.error('请选择下载文件')
          return
        }
        if (!localStorage.getItem('token')) {
          this.$refs.Header.loginIn()
        } else {
          this.tagId = this.selectData
          if (this.infoObj.files.dataList.length == 1 && this.infoObj.files.dataList[0].parentId == -1 && this.infoObj.files.dataList[0].fileType != 1) {
            this.createDownUrl([this.oneId])
            return
          }
          if (this.selectData.length == 0) {
            this.$message.error('请选择下载文件')
            return
          } else {
            if (this.selectData.length > 1) {
              this.clientApp('web暂不支持多文件下载，建议使用客户端下载')
              return
            }
          }
          this.createDownUrl(this.tagId)
        }
      },
      sendCode(v) {
        this.msgstatus = v
      },
      getParams(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
          return decodeURIComponent(r[2]);
        }
        return null;
      },
      BrowserListenJump() {
        if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
          this.$router.push({
            path: '/phoneShareInit/' + this.$route.query.id,
          })
        } else {
          this.getShareInfo()
        }
      }
    },
    created() {
      this.BrowserListenJump()
    }
  }
</script>
<style lang="scss" scoped>
  .content {
    width: 100%;
    height: 100vh;
    min-width: 1100px;
    padding: 90px 30px 0;
    background-color: #edf1f5;
    overflow: hidden;
    & .share-box {
      position: relative;
      width: 100%;
      height: 100%;
      margin: 0 auto;
      background-color: #fff;
      box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.04);
      border-radius: 5px;
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
      overflow-y: hidden;
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
    & > div.one {
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
        height: 20px;
        line-height: 20px;
        display: block;
        font-size: 12px;
        color: #5a5a5a;
      }
      & .username{
          padding-left:25px;
          box-sizing: border-box;
          &::after{
              content: '';
              position: absolute;
              top: 0;
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
      & span.text-overflow {
        width: 120px;
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
    padding: 20px;
    box-sizing: border-box;
    &>div.two{
      p {
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



