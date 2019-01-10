<template>
  <section class="page-phoneShareInit">
      <!-- 文档标题 -->
    <div v-wechat-title="$route.meta.title" style="display:none;"></div>


    <PhoneHeader :is-need-login="false"/>
    <div class="con" v-show="isDataRes">
      <img src="../assets/images/bg_img03_phone.png" alt="">
      <div class="extract-form">
          <div>
              <img :src="shareInfo.shareHeadImg" />
              <span :title="shareInfo.shareUserName">{{shareInfo.shareUserName}}</span>
              <span>给您加密分享了文件</span>
          </div>
          <div>
              <p>请输入提取密码：</p>
              <div>
                  <el-input placeholder="" v-model="extractVal" @keyup.enter.native="extractBtn();">
                  </el-input>
                  <el-button type="primary" @click.stop="extractBtn();">提取文件</el-button>
              </div>
              
          </div>
      </div>
    </div>
  </section>
</template>

<script>
import PhoneHeader from '../components/phoneHeader'
export default {
  name:'phoneShareInit',
  components:{
       PhoneHeader
  },
  data(){
    return{
      extractVal: '',
      isDataRes:false, ////防止闪现 数据是否返回
      shareInfo:{
          shareUserName:'',
          shareHeadImg:''
      }
    }
  },
  methods:{
    extractBtn(){
        let params = {
            code:this.extractVal,
            parentId:'-1',
            page:'1',
            perpage:'100',
        }
        this.$http({
            url:'/api/files/shareIndex/'+this.$route.params.id,
            method:'post',
            data:params
        }).then(res=>{
            console.log(res)
            if(res.data.code === 100001 ){
                let data=res.data.data;
                localStorage.setItem('extractCode',this.Base64.b64EncodeUnicode(this.extractVal));
                if((data.files.dataList.length==1 && data.files.dataList[0].isFolder != 1) ||  data.files.dataList.length==0){
                    this.$router.push({
                        path:'/phoneShareDownload/'+this.$route.params.id,
                    })
                }else{
                   this.$router.push({
                        path:'/phoneShare/'+this.$route.params.id,
                    })
                }
                
            }
            else {
                this.$message({
                    message: res.data.msg,
                    type: 'error',
                    duration:1500
                });
            }
        })
    },

    getShareInfo(){
        let params={
            urlCode:this.$route.params.id
        }
        this.$http({
            url:'/api/files/shareIndexInfo',
            method:'post',
            data:params
        }).then(res=>{
            if(res.data.code === 100001 ){
                this.shareInfo.shareUserName=res.data.data.nickName;
                this.shareInfo.shareHeadImg=res.data.data.headImg;
            }
            else if(res.data.code === 100101 || res.data.code === 100102 || res.data.code === 100103) {
                this.$router.push({
                    path:'/phoneShareDownload/'+this.$route.params.id,
                })
            }
            this.isDataRes=true;
        })
    },

    BrowserListenJump(){
        if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
            this.getShareInfo();
        }else{
            this.$router.push({
                path:'/ShareInit/'+this.$route.params.id,
            })
        }
    }
  },
  created(){
    this.BrowserListenJump();
  },
}
</script>

<style lang="scss" scoped>
  .page-phoneShareInit{
    width: 100%;
    height: 100vh;
    background-color: #fff;
    overflow: auto;
    & .component-header{
        box-shadow: none;
    }
    & >.con{
      width: 100%;
      height: 100vh;
      padding-top:58px; 
      box-sizing: border-box;
      position: relative;
      &>img{
        width: 100%;
        height: 158px;
      }
      &>.extract-form{
        padding: 0 16px;
        position: absolute;
        box-sizing: border-box;
        top: 130px;
        left: 0;
        width: 100%;
        &>div:nth-of-type(1){
          width: 100%;
          margin-bottom: 45px;
          font-size: 16px;
          color: #000000;
          & img{
              display: inline-block;
              vertical-align: middle;
              width: 26px;
              height: 26px;
              border: 2px solid #5EBDF8;
              border-radius: 3px;
              overflow: hidden;
          }
          & span{
              display: inline-block;
              vertical-align: top;
              margin-left: 6px;
              line-height: 30px;
          }
          & span:nth-of-type(1){
            overflow:hidden; 
            text-overflow:ellipsis; 
            white-space:nowrap;
            max-width: calc(100vw - 230px);
          }
        }
        &>div:nth-of-type(2){
          width: 100%;
          height: 115px;
          background: #EEEEEE;
          border-radius: 15px;
          padding: 16px 18px;
          box-sizing: border-box;
          &>p{
            font-size: 14px;
            color: #080808;
            margin-bottom: 14px;
          }
           &>div{
               display: flex;
            }
        }
      }
    }
  }
  
</style>
<style>
.page-phoneShareInit .el-input {
  flex: 1;
  margin-right: 10px;
}
.page-phoneShareInit .el-input .el-input__inner{
    height: 35px;
    width: 100%;
}
.page-phoneShareInit .el-button--primary{
    background: #5EBDF8;
    border-radius: 3px;
    border:none;
    padding: 11px 20px;
}
</style>
