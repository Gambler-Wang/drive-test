<template>
  <section class="page-changePsw ">
    <myTitle title="账号设置"></myTitle>
    <inforAside></inforAside>
    <section class="right-content">
      <span  id="btn"  @click="toBack">返回上一级</span>
      <h3>修改密码</h3>
      <el-form :model="formData" status-icon :rules="rules" label-position="top" ref="formData" label-width="100px"
               class="demo-ruleForm">
        <el-form-item label="旧密码" prop="old_pwd">
          <el-input type="password" v-model="formData.old_pwd" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pwd">
          <el-input type="password" v-model="formData.pwd" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="check_pwd">
          <el-input type="password" v-model="formData.check_pwd" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('formData')">提交</el-button>
        </el-form-item>
      </el-form>
      <footer>2018©掌中宝</footer>
    </section>
  </section>
</template>

<script>
  import myTitle from '@/components/title'
  import inforAside from '@/components/inforAside'
  import FormItme from '@/components/form-item';
  import rules from '@/util/rules';
  import reg from '@/util/reg';
  export default {
    name: "personalCenter",
    components: {
      myTitle,inforAside,
      "form-item":FormItme

    },
    data() {
      const checkpwd = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请再次输入密码'))
        } else if (value != this.formData.pwd) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback();
        }
      }
      const check_pwd = {
        check_pwd: [
          {required: true, message: '确认密码不能为空', trigger: 'blur'},
          {required: true, validator: checkpwd, message: '两次密码不一致', trigger: 'blur'},
          {pattern:reg.pwd,message:"密码由6-14位数字、字母以及符号组成",trigger:'blur'},
        ],
        old_pwd:[
            {required: true, message: '确认密码不能为空', trigger: 'blur'},
            {pattern:reg.pwd,message:"密码由6-14位数字、字母以及符号组成",trigger:'blur'},
          ]
      }
      return {
        postData: {
          token: ''
        },
        formData: {
          pwd: '',
          check_pwd: '',
          old_pwd:'',
        },
        rules: Object.assign({}, rules, check_pwd),
        checked: true,
        tableData: [],
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
              const params = {
                oldPwd:this.$md5(this.formData.old_pwd),
                pwd:this.$md5(this.formData.pwd),
                check_pwd:this.$md5(this.formData.check_pwd),
                type:'3',
                // exists:'1'
              }
            this.$http({
                url: '/api/member/update_info',
                method: 'post',
                data:params
              }).then(res => {
                if (res.data.code === 100001) {
                    this.$message({
                        type: 'warning',
                        message:'密码修改成功，请重新登录',
                        duration:1000
                    });
                    localStorage.clear();
                    this.$router.replace('/login')
                }
              }).catch(err => {
                console.log(err);
              })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      toBack(){
        this.$router.push({path:'/personalCenter'})
      }
    }
  }
</script>
<style lang="scss" scoped>
  .page-changePsw {
    width: 100%;
    height: calc(100vh);
    background-color: #fff;
    font-size: 0;
    overflow: hidden;
    & .aside-menu {
      position: relative;
      width: 278px;
      height:100%;
      display: inline-block;
      vertical-align: top;
      font-size: 14px;
      background-color:#e9edf3;
      position:relative;left:0; top:0;
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
        background-color: #ffffff;
        border-radius: 12px;
        line-height: 23px;
        text-align: center;
        color: #5cbbf4;
        font-size: 14px;
      }
      & > dl{
        padding-top:10px;
        &>dt{
          margin-top: 40px;
          margin-bottom: 20px;
          position: relative;
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
          &>i{
            display: inline-block;
            width: 16px;
            height: 24px;
            background-size: 100%;
            vertical-align: top;
            margin-top: 10px;
            margin-right: 10px;
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
    & .right-content {
      display: inline-block;
      vertical-align: top;
      width: calc(100vw - 278px);
      font-size: 14px;
      position: absolute;
      top: 62px;
      padding: 0 46px;
      & > h3 {
        font-size: 20px;
        color: #5a5a5a;
        margin-top: 30px;
        margin-bottom: 40px;
      }
    }
  }

  .router-link-active {
    color: #54b2eb !important;
    background-color: #e9edf3;
  }

  #changePic {
    cursor: pointer;
    width: 87px;
    height: 23px;
    background-color: #ffffff;
    border-radius: 12px;
    line-height: 23px;
    text-align: center;
    color: #5cbbf4;
    font-size: 14px;
  }

  footer {
    font-size: 12px;
    color: #556bca;
    width: 100%;
    text-align: center;
    position: fixed;
    bottom: 10px;
    left: 0;
    padding-left: 278px;
  }
  #btn{
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
</style>
