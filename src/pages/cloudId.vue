<template>
  <section class="page-cloudId">
    <myTitle title="账号设置"></myTitle>
    <inforAside ref="infor" @sendId="toBack"></inforAside>
    <section class="right-content">
      <span  id="btn"  @click="toBack">返回上一级</span>
     <div id="box">
       <el-form label-position="top" label-width="80px" :model="obj"  :rules="rules"  ref = "formData1">
         <el-form-item label="请输入您的掌云ID："
                       prop="userName"
                       :error="errMsg">
           <el-input v-model.trim="obj.userName" auto-complete="off" @keyup.enter.native="submit('formData1')"></el-input>
           <i class="icon icon-submit" @click="submit('formData1')"></i>
           <i class="icon icon-cancel" @click="cancel" ></i>
         </el-form-item>
       </el-form>
       <p>1.掌云ID作为掌云网盘的唯一凭证，不可修改，请您谨慎修改并牢记此ID。</p>
       <p>2.请使用6-20位字母、数字、下划线或-作为您的掌云ID。</p>
       <p>3.不支持中文和纯数字</p>
     </div>
    </section>
  </section>
</template>

<script>
  import myTitle from '@/components/title';
  import inforAside from '@/components/inforAside';
  import rules from '@/util/rules';
  export default {
    name: "personalCenter",
    components:{
      myTitle,inforAside
    },
    data() {
      return {
        obj: {
          userName:''
        },
        errMsg:'',
        rules:rules,
        information:{},
        total:10,
        currentPage:1,
        aws:{},               //s3对象
        awsConfig:{},          //aws配置参数
      }
    },
    methods:{
      toBack(){
        this.$router.push({path:'/personalCenter'})
      },
      setInfor(){
       this.$http({
          url:"api/member/update_info",
          method:"post",
          data:{
            userName:this.obj.userName,
            type:'4'
          }
        }).then((res)=>{
          if(res.data.code == 100001){
            this.errMsg='';
            this.$message({
              message: '修改成功！',
              type: 'success',
              duration:1500
            });
            this.$refs.infor.getInfor(1)
          }
          else {
            if(res.data.code ===110003){
              this.errMsg='掌云ID只可修改一次';
            }else {
              this.errMsg = res.data.msg
            }
          }
        }).catch((err)=>{
          console.log(err);})
      },
      cancel(){
       this.obj.userName = ''
       this.errMsg = ''
      },
      submit(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //ydh 添加删除弹框 this.$confirm
            const h = '<div style="color: #5a5a5a;font-size: 14px">您确定将您的掌云ID设置为</div>' +
              '<div style="color: #5cbbf4;">'+this.obj.userName+'</div>' +
              '<div style="color: #5a5a5a;font-size: 14px">设置成功后不可修改</div>'
            this.$confirm(h, '修改ID', {
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
    created(){
      this.information =JSON.parse( localStorage.getItem('userInfo'))
      if(this.information.userName!=null){
        this.$router.push({path:'/personalCenter'})
      }
    }
  }
</script>
<style lang="scss" scoped>
  .page-cloudId {
    width: 100%;
    height: calc(100vh);
    background-color: #fff;
    font-size: 0;
    overflow:hidden;
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
      padding:0 46px;
      &>h3{
        font-size: 20px;
        color: #5a5a5a;
        margin-top: 85px;
      }
      &>p{
        color: #acb4bb;
        font-size: 12px;
        margin: 10px 0;
        &>span{
          font-size: 12px;
          color: #5cbbf4;
          cursor: pointer;
        }
      }
      &> .table  .tableBottom{
        background: #e9edf3;
        text-align: center;
        &>#pagination{
          display: inline-block;
          padding: 10px;
        }
        & >p{
          display: inline-block;
          float: right;
          margin-top: 18px;
          color: #5cbbf4;
          padding-right: 20px;
          text-align: right;
          font-size: 14px;
          cursor: pointer;
        }
      }
    }
  }
  .router-link-active{
    color: #54b2eb!important;
    background-color: #e9edf3;
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
  #box{
    width: 420px;
    margin-left: 90px;
    margin-top: 108px;
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
    &>p{
      font-size: 12px;
      color: #b3b3b3;
      line-height: 24px;
    }
  }
</style>
