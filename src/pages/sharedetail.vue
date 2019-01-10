<template>
  <section class="page-share">
    <Header ref="Header" v-on:loginLayer="pop"></Header>
    <section class="content" v-show="statusOk">
      <section   class="share-box clearfix">
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
                <span class="text-overflow" :title="file.name">{{file.name}}</span>
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
              <el-button size="medium" class="comBtns share-save" :class="{com:com}" v-else-if="fileStatues && logStyle" @click="add">
                <i></i>
                <span>保存到网盘</span>
              </el-button>
              <el-button size="medium" class="comBtns  share-no" :class="{com:com}" v-else @click="cancelShare">
                <i></i>
                <span>取消分享</span>
              </el-button>
              <el-button size="medium" class="comBtns share-download" :class="{com:!com}" @click="uploadUrl">
                <i></i>
                <span><a class="upload" href="javaScript:void(0)">下载({{sizeFormat(file.fileSize)}})</a></span>
              </el-button>
            </div>
          </div>
          <!--视频显示-->
          <div class="player" :class="{'bgc':bgc}" id="id_test_video">
            <div id="box" v-if="file.fileType == 4 && videoLoading">
              <img class="loading" src="../assets/images/loading.gif" alt="">
              <p>转码中...</p>
            </div>
            <div v-if="file.fileType != 4">
              <img id="img" :src="imgUrl" v-if="file.fileType== 2 " alt="">
              <i class="img-size icon icon-excel" v-else-if="file.fileType == 3 "></i>
              <i class="img-size icon icon-music" v-else-if="file.fileType == 5 "></i>
              <i class="img-size icon icon-bts" v-else-if="file.fileType == 6 "></i>
              <i class="img-size icon icon-unknow" v-else-if="file.fileType == 7 "></i>
              <p class="text-overflow" :title="file.name">{{file.name}}</p>
            </div>
          </div>
        </div>
        <div class="share-login">
          <div v-show="shareStatus == '1'" class="one" >
            <div>
              <div id="imgBox">
                <img :src="fileInfo.memberHeadImg"/>
              </div>
              <span class="name text-overflow" :title="fileInfo.memberNickName">{{fileInfo.memberNickName}}</span>
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

  export default {
    name: 'share',
    components: {
      Header
    },
    data() {
      return {
        loginErr: false,
        userInfo: {
          userName: '',
        },
        formdata: {
          userName: '',
          pwd: ''
        },
        queryData: {
          code: '',
          parentId: '-1',
          name: '',
          type: '2',
          id: '-1'
        },
        selectData: [],
        shareData: {},
        sort: {sort: '2', rank: '1'},
        //弹窗状态
        dialogVisible: false,
        // 页面文件当前状态
        fileStatues: true, //['save','cancel','err'],
        //当前文件类型
        fileInfo: {},
        file: {
          name: ''
        },
        tagId: '',
        logStyle: false,
        msgstatus: true,
        player: '',
        infoObj: {},
        oneId: '',
        videoLoading: false,
        type: null,
        sharePath: true,
        imgUrl: '',
        com:true,
        text:'',
        errFlg:false,
        bgc:false,
        statusOk:false,
        shareStatus:0
      }
    },
    methods: {
      getList(e) {
        const params = {
          id: this.$route.query.ids,
          token: JSON.parse(localStorage.getItem('token'))
        }
        if (e) {
          if (!e.code && !params.token) {
            this.$router.push({path: '/ShareInit/' + this.$route.query.id})
          }
          if (e.code && !params.token || (e.code && params.token)) {
            this.$http({
              url: '/api/files/shareIndex/fileinfo',
              method: 'post',
              data: e
            }).then(res => {
              if (res.data.code == 100001) {
                this.file = res.data.data
                this.shareStatus='1'
                if (res.data.data.previewPath&& res.data.data.previewPath.code && res.data.data.previewPath.code == 100001)
                {
                  this.videoLoading = false
                  if (this.file.fileType == 4) {
                    this.play(res.data.data.previewPath)
                  }
                  if (this.file.fileType == 2) {
                    this.imgUrl = res.data.data.previewPath.jpg
                  }
                } else {
                  this.imgUrl = require('../assets/images/image.png')
                  this.videoLoading = true
                  if (this.file.fileType == 4) {
                    this.bgc =true
                  }
                }
              }else {
                if(localStorage.getItem('token')){
                  this.shareStatus ='3'
                }else {
                  this.shareStatus ='2'
                }
              }
            }).catch(err => {
              console.log(err);
            })
          }
          return
        }
        this.getCom(e, params)
      },
      getCom(e, params) {
        this.$http({
          url: '/api/files/detail',
          method: 'post',
          data: e ? e : params
        }).then(res => {
          if (res.data.code == 100001) {
            this.statusOk = true
            this.shareStatus ='1'
            this.file = res.data.data
            if (res.data.data.previewPath &&res.data.data.previewPath.code&& res.data.data.previewPath.code == 100001) {
              this.videoLoading = false
              if (this.file.fileType == 4) {
                this.play(res.data.data.previewPath)
              }
              if (this.file.fileType == 2) {
                this.imgUrl = res.data.data.previewPath.jpg
              }
            }
            else {
              this.imgUrl = require('../assets/images/image.png')
              this.videoLoading = true
              if (this.file.fileType == 4) {
                this.bgc =true
              }
            }
          }else if(res.data.code ==100071 ){
            // 文件不存在
            this.statusOk = false
            this.$message.error(res.data.msg);
            this.$router.push({path:'/errInfor'})
          }else if(res.data.code ===110003){
            this.$router.push({path:'/errInfor'})
          }
        }).catch(err => {
          console.log(err);
        })
      },
      getShareInfo() {
        this.fileInfo = Object.assign({}, JSON.parse(localStorage.getItem('fileInfo')))
        let params = {
          urlCode: this.$route.query.id,
          token: JSON.parse(localStorage.getItem('token'))
        }
        this.$http({
          url: '/api/files/shareIndexInfo',
          method: 'post',
          data: params
        }).then(res => {
          if (res.data.code === 100001) {
            this.statusOk = true
            if (res.data.data.isOwner == '1') {
              this.logStyle = true
              this.fileStatues = false
              // console.log('de本人');
              this.getList()
            } else {
              // console.log('de不是本人');
              if (!sessionStorage.getItem('code')) {
                this.$router.push({path: '/ShareInit/' + this.$route.query.id});
              } else {
                // console.log('de不是本人输入了验证码');
                const params = {
                  urlCode: this.$route.query.id,
                  code: sessionStorage.getItem('code'),
                  fileId: this.$route.query.ids
                }
                this.getList(params)
              }
            }
          } else {// 失效
            if (res.data.code == 100101 || res.data.code == 100102 || res.data.code == 100103) {
              // 100102原文件删除// 100103取消分享// 100101过期
              this.statusOk = true
              this.sharePath = false
              this.msgstatus = false
              this.queryData.code = res.data.code
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
          console.log(err);
        })
      },
      //弹窗展示
      pop() {
        this.dialogVisible = true;
      },
      // 取消分享
      cancelShare() {
        this.com = true
        const params = {shareIds: this.$route.query.one ? this.$route.query.one : JSON.parse(localStorage.getItem('fileInfo')).id}
        const b ='<div style="font-size: 14px">取消分享后，该条分享记录将被删除，</div><div style="font-size: 14px">好友将无法再访问此分享链接。</div>'
        this.$confirm(b, '取消分享', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true
        }).then(() => {
          this.$http({
            url: "/api/files/share/cancel",
            method: "post",
            data: params
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
            console.log(this.shareStatus);
            localStorage.setItem('token', JSON.stringify(res.data.data.token));
            localStorage.setItem('userInfo', JSON.stringify(res.data.data));
            this.userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : '';
            this.$refs.Header.userInfo = this.userInfo;
            this.$refs.Header.userLogIn = true;
            this.dialogVisible = false;
            this.sharePath = false;
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
            if (res.data.data.id !== JSON.parse(localStorage.getItem('fileInfo')).shareMemberId) {
              // console.log('det输入验证码再登录后不是本人');
              this.fileStatues = true
            } else {
              // console.log('det输入验证码再登录后是本人');
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
      add() {
        this.com =true
        const params = {
          shareId: this.$route.query.one ? this.$route.query.one : JSON.parse(localStorage.getItem('fileInfo')).id,
          token: JSON.parse(localStorage.getItem('token'))
        }
        this.$http({
          url: '/api/files/share/transfer',
          method: 'post',
          data: params
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
        if (!localStorage.getItem('token')) {
          this.$refs.Header.loginIn()
        } else {
          // 文件id   this.$route.query.ids
          // 分享id this.$route.query.sid
          const a = {id: this.$route.query.ids, fileSize: this.file.fileSize}
          this.createDownUrl([a])
        }
      },
      play(e) {
        let log = this.getParams('log');
        var options = {
          "m3u8_sd":e['250p'],
          "m3u8_hd": e['1080p'],
          clarity: 'hd',
          clarityLabel: {
            hd: '高清',
            // hd: '高清',
            sd: '标清'
          },
          "coverpic": {
            'style': 'stretch',
            //'src': "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1523963187690&di=2399fcae7776f53320e5343138c3ea58&imgtype=0&src=http%3A%2F%2Fimg1.3lian.com%2F2015%2Fa2%2F53%2Fd%2F25.jpg"
          },
          flash:false,
          autoplay: false,
          "width": '100%',//视频的显示宽度，请尽量使用视频分辨率宽度
          "height": '100%',//视频的显示高度，请尽量使用视频分辨率高度
          listener: function (msg) {
            if (!log) {
              return;
            }
            if (msg.type != 'timeupdate') {
              console.log(msg);
            }
          }
        };
        this.player = new TcPlayer('id_test_video', options);
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
    },
    destroyed() {
      if (this.player) {
        this.player.destroy()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .content {
    width: 100%;
    height: calc(100vh);
    min-width: 1100px;
    padding: 90px 30px 0;
    background-color: #edf1f5;
    overflow: auto;
    & .share-box {
      position: relative;
      width: 1000px;
      height: 700px;
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
            margin-right: 6px;
            vertical-align: middle;
            width: 22px;
            height: 22px;
            background-size: 100%, 100%;
          }
          & span {
            display: inline-block;
            font-size: 16px;
            color: #5a5a5a;
            vertical-align: bottom;
          }
          & span.text-overflow {
            width: 200px;
            font-size: 14px;
          }
        }
        & p:nth-of-type(2) {
          height: 26px;
          & i {
            margin-right: 6px;
            display: inline-block;
            width: 12px;
            height: 12px;
            background: url('../assets/images/share_time.png');
            vertical-align: text-top;
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
          background: url("../assets/images/icons_download_default.png") 10px center no-repeat;
        }
        & .comBtns.share-download.com {
          background: url("../assets/images/icons_download_selected.png") 10px center no-repeat;
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
        display: block;
        font-size: 12px;
        color: #5a5a5a;
      }
      & span.text-overflow {
        width: 120px;
        font-size: 14px;
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

  .player {
    position: relative;
    height: 460px;
    width: 700px;
    line-height: 1;
    top: 50px;
    left: 50%;
    margin-left: -348px;
    & > div {
      position: relative;
      text-align: center;
      height: 100%;
      & > i {
        position: absolute;
        top: 30%;
        left: 50%;
        margin-left: -100px;
        margin-top: -100px;
        width: 200px;
        height: 200px;
      }
      & > p {
        position: absolute;
        bottom: 120px;
        width: 200px;
        display: inline-block;
        left: 50%;
        margin-left: -100px;
        text-align: center;
        line-height: 30px;
      }
      & >i+p {
        position: absolute;
        bottom: 170px;
        width: 200px;
        display: inline-block;
        left: 50%;
        margin-left: -100px;
        text-align: center;
      }
      & > div {
        & > p {
          position: absolute;
          bottom: 80px;
          width: 100%;
          font-size: 14px;
          text-align: center;
        }
        & > .loading {
          position: absolute;
          width: 32px;
          height: 32px;
          top: 50%;
          left: 50%;
          margin-left: -16px;
          margin-top: -16px;
        }
      }
    }
  }
  .player.bgc{
    background: black;
  }
  #img {
    width: auto;
    height: 300px;
  }

  .upload {
    color: #5cbbf4;
  }
  #box{
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 111;
    margin-left: -15px;
    margin-top: -15px;
    &>p{
      position: relative;
       z-index:999;
      top: 38px;
      color: white;
      left: -15px;
    }
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
    height: 500px;
    width: 795px;
    display: inline-block;
    margin-top: 20px;
  }
</style>



