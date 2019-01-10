<template>
  <section class="page-changeInfor ">
    <myTitle title="账号设置"></myTitle>
    <inforAside
    ref="infor"
    ></inforAside>
    <section class="right-content">
      <span id="btn" @click="toBack">返回上一级</span>
      <div id="box">
        <p v-if="flg"><span>昵称：</span>
          <span class="text-overflow">{{information.nickName}}</span>
          <span class="x" @click="submitInfor">修改</span>
        </p>
        <p v-else>
          <section>
            <el-form label-position="left"  label-width="56px" :model="obj" ref = "formData1"  :rules="rules"  @submit.native.prevent>
              <el-form-item label="昵称："
                            prop="val"
                            :error="errMsg"
              >
                <el-input clearable v-model.trim="obj.val" auto-complete="off" @keyup.enter.native="submit('formData1')"></el-input>
                <i class="icon icon-submit" @click="submit('formData1')"></i>
                <i class="icon icon-cancel" @click="flg ='false'"></i>
              </el-form-item>
            </el-form>
            <div class="one">昵称支持中英文、数字符号-和_</div>
            <div>昵称长度限制在4-14位字符内（一个汉字占两个字符）</div>
          </section>
        </p>
        <section>
          <span>头像：</span>
          <div><img :src="information.headImg" alt="" style="width: 100%;height: 100%"></div>
        </section>
        <input type="file" @change="uploadHeadImg"  class="upload-img" accept="image/*">
        <el-button  class="comBtns" :loading="uploadStatus">{{(uploadStatus)?"上传中":"上传头像"}}</el-button>
      </div>
    </section>
  </section>
</template>

<script>
  import myTitle from '@/components/title';
  import inforAside from '@/components/inforAside'; import reg from '@/util/reg';
  const SparkMD5 = require('spark-md5');
  const AWS = require('aws-sdk');
  import rules from '@/util/rules';
  const S3 = require('aws-sdk/clients/s3');
  export default {
    name: "changeInfor",
    components: {
      myTitle,inforAside
    },
    data() {
      return {
        obj: {
          val:''
        },
        errMsg:'',
        rules:rules,
        flg:true,
        information: {},
        total: 10,
        currentPage: 1,
        aws: {},               //s3对象
        awsConfig: {},          //aws配置参数
        currentHeadImgObj:{
          imgObj:null,
          headImgMd5:null
        },
        Timer:null,   // 定时器 循环请求图片地址
        TimerFlag:true,   //是否开启定时器
        uploadStatus:false, //上传状态
        uploadCount:0,  //重复上传次数
      }
    },
    methods: {
      toBack() {
        this.$router.push({path: '/personalCenter'})
      },
      setInfor() {
        this.$http({
          url: "api/member/update_info",
          method: "post",
          data: {
            nickName:this.obj.val,
            type: '2'
          }
        }).then((res) => {
          if (res.data.code == 100001) {
            this.errMsg='';
            this.flg = true
            this.$message({
              message: '修改成功！',
              type: 'success'
            });
            this.information.nickName =this.obj.val
            this.$refs.infor.getInfor()
          }
        }).catch((err) => {
          console.log(err);
        })
      },
      submitInfor(){
        this.flg = false
        this.obj.val = this.information.nickName
      },
      //开始上传
      uploadHeadImg(event) {
        if (navigator.userAgent.indexOf("MSIE 9.0") > 0) {
          this.$message({
            message: '当前浏览器版本过低，请升级您的浏览器',
            type: 'warning'
          });
          return;
        }
        let {files, value: webkitRelativePath} = event.target;
        if(files.length==0) return;
        const file = (files.length > 0) ? files[0] : this.$message.error('请选择正确文件上传!');
        const isJPG = file.type.substr(0, 5) === 'image';
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isJPG) {
          this.$message.error('请选择正确图片格式!');
        } else {
          if (!isLt5M) {
            this.$message.error('上传头像图片大小不能超过 5MB!');
          } else {
            this.showUploadImg(file);
            return isJPG && isLt5M
          }
        }
      },
      showUploadImg(imgObj) {
        var that = this;
        this.uploadCount=0;
        if (typeof FileReader == 'undefined') {
          this.$message.error('您的浏览器版本太低,请升级');
        }
        const fr = new FileReader();
        fr.readAsDataURL(imgObj);
        fr.onloadend = function () {
          // that.information.headImg = fr.result;
          that.uploadStatus=true;
          let headImgMd5 = SparkMD5.hashBinary(fr.result);
          that.currentHeadImgObj.imgObj=imgObj;
          that.currentHeadImgObj.headImgMd5=headImgMd5;
          that.submitImg(imgObj, headImgMd5);
        };
      },
      submitImg(imgObj, headImgMd5) {
        const params = {
          name: imgObj.name,
          md5: headImgMd5
        }
        this.$http({
          url: '/api/ceph/preupload_head_img',
          method: 'post',
          data: params
        }).then(res => {
          if (res.data.code === 100001) {
            this.aws = this.createAws(res.data.data);
            this.awsConfig = res.data.data;
            const params = {
              Body: imgObj,
              Key: this.awsConfig.objectName,
              ContentType: imgObj.type,
              Bucket: this.awsConfig.bucketName
            }
            this.uploadManage(params)
          }
          else if (res.data.code === 100201) {
            if(res.data.data.headImg){
              this.information.headImg = res.data.data.headImg;
              if(localStorage.getItem('userInfo')){
                let userInfo=JSON.parse(localStorage.getItem('userInfo'));
                userInfo.headImg=res.data.data.headImg;
                localStorage.setItem('userInfo',JSON.stringify(userInfo));
                this.$refs.infor.getInfor();
                clearTimeout(this.Timer);  
                this.uploadStatus=false;
                this.$message({
                    type:'success',
                    message:'头像上传成功！'
                });
              }
            }else{
                if(this.TimerFlag){
                  const that=this;
                  this.uploadCount++;
                  if(this.uploadCount <= 12) {
                    this.Timer=setTimeout(function(){that.submitImg(that.currentHeadImgObj.imgObj,that.currentHeadImgObj.headImgMd5)},500);
                  }else{
                    this.$message({
                        type:'error',
                        message:'头像上传失败！'
                    });
                    this.uploadStatus=false;
                  }
                }
            }
          }
        }).catch(err => {
          console.log(err);
        })
      },
      uploadManage(params) {
        this.aws.upload(params, {partSize: 5 * 1024 * 1024, queueSize: 1}, (err, data) => {
          if (err) {
            console.log('上传文件错误', err)
          } else {
            //上传成功
            if (data) {
              this.uploadedHeadImg();
              // const didParams = {preuploadId:config.id,objectName:config.objectName}
              // this.uploaded(didParams,file);
            }
          }
        });
      },
      //上传结束通知后台
      uploadedHeadImg() {
        this.$http({
          url: '/api/ceph/complete_head_img',
          method: 'post',
          data: {preuploadId: this.awsConfig.id}
        }).then(res => {
          if (res.data.code === 100001) {
            this.submitImg(this.currentHeadImgObj.imgObj,this.currentHeadImgObj.headImgMd5);
          }
        }).catch(err => {
          console.log(err);
        })
      },
      createAws(config) {
        const {accessKey, endPoint, id, objectName, secretKey, bucketName} = config;

        AWS.config.credentials = new AWS.Credentials(accessKey, secretKey, null);
        const params = {
          accessKeyId: accessKey,
          endpoint: endPoint,
          secretAccessKey: secretKey
        }
        let aws = new AWS.S3(params);
        return aws;
      },
      submit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //ydh 添加删除弹框 this.$confirm
            const h = '<div style="color: #5a5a5a;font-size: 14px">您确定将您的掌云昵称设置为</div>' +
              '<div style="color: #5cbbf4;">' + this.obj.val + '</div>'
            this.$confirm(h, '修改昵称', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              dangerouslyUseHTMLString: true
            }).then(() => {
              this.setInfor()
            }).catch(() => {
            });
          }
        })
      }
    },
    beforeDestroy() {
        clearTimeout(this.Timer);        
        this.Timer = null;
        this.TimerFlag=false;
    },
    created() {
      this.information =JSON.parse( localStorage.getItem('userInfo'));
    }
  }
</script>
<style lang="scss" scoped>
  .page-changeInfor {
    width: 100%;
    height: calc(100vh);
    background-color: #fff;
    font-size: 0;
    overflow: hidden;
    & .aside-menu {
      position: relative;
      width: 278px;
      height: 100%;
      display: inline-block;
      vertical-align: top;
      font-size: 14px;
      background-color: #e9edf3;
      position: relative;
      left: 0;
      top: 0;
      & dt {
        position: relative;
      }
      & .upload-img {
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 0;
        opacity: 0;
        cursor: pointer;
      }
      & #changePic {
        cursor: pointer;
        height: 23px;
        width: 100%;
        background-color: #ffffff;
        border-radius: 12px;
        line-height: 23px;
        text-align: center;
        color: #5cbbf4;
        font-size: 14px;
      }
      & > dl {
        padding-top: 10px;
        & > dt {
          margin-top: 40px;
          margin-bottom: 20px;
          position: relative;
        }
        & > dt,
        & > dd {
          line-height: 1;
        }
        & > dd {
          border-bottom: 1px solid #fff;
        }
        & > dd.dd {
          border-top: 1px solid #fff;
        }
        & > dt:hover,
        & > dd:hover {
          background-color: #e9edf3;
        }
        & > dt > p,
        & > dd > p {
          display: block;
          width: 100%;
          height: 45px;
          line-height: 45px;
          overflow: hidden;
          box-sizing: border-box;
          padding-left: 24px;
          &.p {
            cursor: pointer;
          }
          & > .text-overflow {
            width: 140px;
          }
          & > i {
            display: inline-block;
            width: 16px;
            height: 24px;
            background-size: 100%;
            vertical-align: top;
            margin-top: 10px;
            margin-right: 10px;
            &.phone {
              background: url("../assets/images/personaldata_sidenav_icons_phone.png") no-repeat center;
            }
            &.psw {
              background: url("../assets/images/personaldata_sidenav_icons_lock.png") no-repeat center;
            }
            &.cloudId {
              width: 26px;
              margin-left: -5px;
              margin-right: 6px;
              background: url("../assets/images/iconcloudID.png") no-repeat center;
            }
          }
          & > i.changeIcon {
            display: inline-block;
            width: 16px;
            height: 15px;
            background: url("../assets/images/bianji.png") center no-repeat;
            cursor: pointer;
            margin-top: 14px;
            margin-left: 16px;
          }
        }
        & > dt > p {
          padding-left: 8px;
        }
      }
    }
    & .right-content {
      display: inline-block;
      vertical-align: top;
      width: calc(100vw - 278px);
      font-size: 14px;
      position: absolute;
      top: 62px;
      padding: 0 46px;
    }
    #btn {
      display: inline-block;
      line-height: 34px;
      padding: 0 10px;
      color: white;
      background: #5cbbf4;
      margin-top: 20px;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
    }
    #box {
      width: 400px;
      margin-left: 90px;
      margin-top: 108px;
      & > p {
        line-height: 40px;
        vertical-align: middle;
        min-height: 98px;
        & span {
          display: inline-block;
          color: #5a5a5a;
        }
        & span.x {
          color: #5cbbf4;
          cursor: pointer;
        }
        & span.text-overflow {
          max-width: 200px;
          padding: 0 20px 0 10px;
          vertical-align: top;
        }
        &>section {
          &>div{
            line-height:1;
            color: #b3b3b3;
            font-size: 12px;
            margin-left: 55px;
          }
          &>div:nth-of-type(1){
            padding: 13px 0 7px 0;
          }
          &>form{
            & i{
              height: 22px;
              width: 22px;
              margin-top: -2px;
              vertical-align: middle;
              background-size: 10px 10px;
              background-position: center center;
              border: 1px solid #b6e4ff;
              -webkit-box-sizing: border-box;
              box-sizing: border-box;
              margin-left: 4px;
              background-color: #fff;
              border-radius: 3px;
              cursor: pointer;
            }
          }
        }
      }
      & > section {
        & > span {
          color: #5a5a5a;
        }
        & > div {
          vertical-align: top;
          width: 144px;
          height: 144px;
          border: solid 2px #efefef;
          display: inline-block;
          margin-left: 6px;
        }
      }
      & > .upload-img {
        width: 144px;
        position: absolute;
        left: 189px;
        bottom: 0;
        height: 34px;
        opacity: 0;
        cursor: pointer;
      }
      & > #changePic {
        cursor: pointer;
        height: 23px;
        width: 100%;
        background-color: #ffffff;
        border-radius: 12px;
        line-height: 23px;
        text-align: center;
        color: #5cbbf4;
        font-size: 14px;
      }
    }
  }

  .router-link-active {
    color: #54b2eb !important;
    background-color: #e9edf3;
  }
</style>
