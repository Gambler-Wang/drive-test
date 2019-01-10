<template>
  <section class="page-feedback">
    <myTitle title="意见反馈"></myTitle>
    <section class="right-content">
      <section class="box">
        <section>
          <el-button class="comBtn" @click="toBack">返回上一级</el-button>
          <h3>意见反馈表</h3>
          <p class="com">请描述您遇到的问题（必填）：</p>
          <p>请准确描述您遇到的问题，我们将尽快为您解决（150字以内）</p>
          <el-form :model="ruleForm" :rules="rules"   ref="formName" label-width="0" class="demo-ruleForm">
            <el-form-item  prop="text">
              <el-input type="textarea"
                        :maxlength="maxlength"
                        v-model.trim="ruleForm.text"
                        resize="none"
                        placeholder="限定150个字符"
              ></el-input>
            </el-form-item>
          </el-form>
          <p class="com">请上传包含问题的图片（选填）：</p>
          <p>请您上传有关问题的图片，方便我们快速解决您的问题（仅支持PNG,JPG类型图片，最多三张）</p>
          <section id="imgs" ref="img">
            <el-upload
              action="http://upload.test.zhangling.link:12310/v2/stream_upload_chunk"
              :data="params"
              list-type="picture-card"
              :before-upload="beforeAvatarUpload"
              :on-remove="handleRemove"
              :on-success="onSuccess"
              :on-error="onError"
              :auto-upload="true"
              :limit="num"
              accept=".jpg,.png"
              ref="upload"
            >
              <i class="el-icon-plus"></i>
              <p>点击选择照片</p>
              <p>（需小于1M）</p>
            </el-upload>
          </section>
          <p class="com">请留下您的联系方式（选填）：</p>
          <p>联系方式仅作为客服人员联系您使用，不作任何其他用途</p>
          <el-input placeholder="手机号、QQ或邮箱" clearable v-model.trim="val"></el-input>
          <div class="sub">
            <el-button class="btn" @click="add('formName')">提 交</el-button>
          </div>
        </section>
      </section>
    </section>
  </section>
</template>

<script>
  import myTitle from '@/components/title'
  import rules from '@/util/rules';
  export default {
    name: "feedback",
    components: {myTitle},
    data() {
      return {
        ruleForm:{
          text:''
        },
        rules:rules,
        maxlength:150,
        num:3,
        val:'',
        headers: {
          "Content-Type": "multipart/form-data"
        },
        params:{},
        fileList:[],
        picPath:''
      }
    },
    methods: {
      add(formName){
        this.$refs[formName].validate((valid) => {
          const p = 'http://download.test.zhangling.link:8021/'
          let pic= ''
          if(this.fileList.length>0){
           this.fileList.forEach((v)=>{
             this.picPath =this.picPath +','+ p + v.response.data.filename
           })
            pic = this.picPath.substr(1,this.picPath.length)
         }
          const id = JSON.parse(localStorage.getItem('userInfo')).id
          const params = {
            content:this.ruleForm.text,
            contact:this.val,
            picPaths:pic ? pic:'',
            memberId:id
          }
          if(valid){
            this.$http({
              method:'post',
              url:'/api/member/feedback',
              data:params
            }).then(res=>{
              if(res.data.code == 100001){
                this.$alert('感谢您的反馈，我们将尽快解决您的问题！', '感谢反馈', {
                  confirmButtonText: '确定',
                  callback: action => {
                    window.close()
                  }
                });
              }
            }).catch(err =>{
              console.log(err);
            })

          }
        })
      },
      toBack() {
        this.$router.push({path: '/all'})
      },
      //上传文件之前
      async beforeAvatarUpload(file) {
        const md = await this.getFileMD5(file);
        const size = file.size;
        const p = {
          size:size,
          chunk_size:size,
          clientver:'1',
          md5:md,
          extend_name:file.name.slice(file.name.lastIndexOf('.') + 1,file.name.length),
          offset:'0',
        }
        this.params = Object.assign({},p);
        const isLt2M = file.size / 1024 / 1024 < 1;
        if (!isLt2M) {
          this.$message.error('图片大小不能超过1MB!');
          this.handleRemove(file)
        }
        if(this.$refs.img.childNodes[0].childNodes[0].children.length == 3){
          this.$refs.img.childNodes[0].childNodes[1].style.display = 'none'
        }
        return  isLt2M;
      },
      // 上传成功
      onSuccess(response, file, fileList){
       this.fileList = fileList
      },
      // 上传失败
      onError(response, file, fileList){
        if(fileList.length<3){
          this.$refs.img.childNodes[0].childNodes[1].style.display = 'inline-block'
        }
      },
      //移除
      handleRemove(file, fileList) {
        if(fileList.length<3){
          this.$refs.img.childNodes[0].childNodes[1].style.display = 'inline-block'
        }
      },
    }
  }
</script>
<style lang="scss" scoped>
  .page-feedback{
    &>.right-content{
      height:calc(100vh - 62px);
      text-align: center;
      overflow-y: auto;
    }
    & .box{
      text-align: left;
      width: 770px;
      height: 777px;
      margin-top: 60px;
      display: inline-block;
      border: 1px solid #9FA9B7;
      &>section {
        padding: 0 29px;
        &>.comBtn{
          position: relative;
          top: -48px;
          left: -30px;
        }
        &>h3{
          line-height: 1;
          margin: 15px 0 30px 0;
          text-align: center;
          font-size: 24px;
        }
        &>p.com{
          color: #1A1A1A;
          line-height: 42px;
          font-size: 18px;
        }
        &>p.com + p{
          color: #9FA9B7;
          line-height: 42px;
          font-size: 14px;
        }
        & div{
          text-align: center;
          display: inline-block;
        }
        & div.sub{
          text-align: center;
          display: block;
        }
        &  #imgs{
          line-height: 1;
          height: 128px;
          overflow: hidden;
          & .el-upload p{
            position: relative;
            top: -66px;
            line-height: 16px;
            font-size: 12px;
            color:#9FA9B7;
          }
        }
      }
    }
  }
  .page-feedback  .btn{
    height: 50px;
    width: 256px;
    background-color: #5cbbf4;
    color: white;
    margin-top: 26px;
    font-size: 18px;
  }
</style>
