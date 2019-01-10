<template>
  <section class="component-shareDialog">
    <el-dialog
      :title="head + textFilters(title)"
      :visible.sync="shareDialog"
      :before-close="handleClose">
      <section class="contentBox">
        <section class="start">
          <ul class="clearfix">
            <li><i></i><span>链接分享</span></li>
          </ul>
          <section class="encryption">
            <el-form ref="form" :model="form" v-show="show" style="padding-left: 44px;padding-top: 10px;">
              <el-form-item label="分享形式">
                <el-radio-group v-model="form.encryption" style="margin-left:-14px;margin-right: 20px">
                  <el-radio label="加密"></el-radio>
                </el-radio-group>
                <span class="text">仅限拥有密码者可查看，更加隐私安全</span>
              </el-form-item>
              <el-form-item label="有效期"
                            prop="value"
                            :rules="[
      { required: true, message: '有效期不能为空'} ]"
              >
                <el-select v-model="form.value">
                  <el-option
                    v-for="item in form.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </section>
        </section>
        <section class="end" v-show="!show">
         <div style="color: #54b2eb;">
           <img src="../assets/images/tips_icons_right1.png" alt="" style="vertical-align: middle;">
           成功创建私密链接</div>
          <el-input placeholder="" v-model="input" readonly="readonly"  id="input"></el-input>
          <span id="day">{{form.value==-1?'永久':(form.value + '天')}}</span>
          <el-button class="comBtn aa" @click="copyUrl()">复制链接及密码</el-button>
         <p>
           <span>提取密码：</span> <el-input placeholder="" v-model="inputPsw" readonly="readonly"  id="inputPsw"></el-input>
         </p>
          <p>可以将链接发送给你的QQ等好友</p>
        </section>
      </section>
  <span slot="footer" class="dialog-footer">
     <el-button class="comBtn" @click="newShares('form')" v-show="show">创建链接</el-button>
     <el-button class="comBtns" @click="cancelShares">取 消</el-button>
  </span>
    </el-dialog>
  </section>
</template>

<script>
  import b from '../util/newVue'
  export default {
    name: "shareDialog",
    props: {
      shareDialog: {
        type: Boolean,
        default: false
      },
      shareData: {
        type: Array
      },
    },
    data(){
      return{
        inputPsw:'',
        input:'',
        show:true,
        form:{
          options: [{
            value: '-1',
            label: '永久分享'
          }, {
            value: '7',
            label: '7天'
          }, {
            value: '1',
            label: '1天'
          }],
          encryption:'加密',
          value:'-1'
        },
        title:'全部文件',
        arr:[],
        head:'分享文件(夹):'
      }
    },
    watch:{
      shareData(v){
        this.arr = v
        if(v.length==0){
          return
        }
       if(v.length==1){
          this.title = v[0].name
       }else {
          this.title  =v[0].name + '等'
       }
      }
    },
    methods: {
      //创建连接
      newShares(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.show = false
            const params ={
              ids:this.arr.map(item => item.id).join(','),
              term:this.form.value,
              type:'1'
            }
            this.$http({
              url:'/api/files/share',
              method:'post',
              data:params
            }).then((res)=>{
              this.inputPsw = res.data.data.code
              this.input ='链接:'+ res.data.data.url+'提取码:' +  this.inputPsw
            }).catch((err)=>{
              console.log(err);})
          } else {
            return false;
          }
        })
      },
      //取消创建
      cancelShares(){
        b.$emit("shareDialog",false)
        setTimeout(()=>{
          this.show = true
        },500)
      },
      //复制分享链接
      copyUrl(){
        document.getElementById('input').select()
        document.execCommand('copy')
        this.$message({
          message: '分享链接已复制，快去分享给朋友吧！',
          type: 'success',
          duration:1000
        });
      },
      handleClose(done) {
        b.$emit("shareDialog",false)
        setTimeout(()=>{
          this.show = true
        },500)
      }
    }
  }
</script>

<style lang="scss" scoped>
.component-shareDialog{
  & .contentBox{
    &>.start{
      &>ul{
        background-color: #eaf7ff;
        &>li{
          float: left;
          height: 50px;
          margin-left: 40px;
          position: relative;
          cursor: pointer;
          &>i{
            position: relative;
            display: inline-block;
            width: 24px;
            height: 20px;
            left: 50%;
            margin-left: -12px;
            background:url("../assets/images/icon4_link_selected.png") no-repeat center ;
          }
          &>span{
            position: relative;
            color: #54b2eb;
            display: inline-block;
            width: 100%;
            text-align: center;
            top: 0px;
          }
        }
      }
      &>.encryption{
        & .text{
          font-size: 12px;
          color: #9c9c9c;
        }
      }
    }
    &>.end{
      padding: 0 20px;
      &>div{
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        color: #5a5a5a;
      }
      &>p{
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        color: #5a5a5a;
      }
      & #day{
        display: inline-block;
        position: relative;
        margin-left: -55px;
        padding-left: 10px;
        &::before{
          content:' |';
          position: absolute;
          top: 0px;
          left: 0px;
          height: 100%;
          width: 1px;
          color: #54b2eb;
        }
      }
      & .comBtn.aa{
        margin-left: 20px;
      }
    }
    }
  & .btn{
    background-color: #54b2eb;
    border-radius: 5px;
    height: 34px;
    line-height: 34px;
    text-align: center;
    color: #fff;
  }
}
</style>
