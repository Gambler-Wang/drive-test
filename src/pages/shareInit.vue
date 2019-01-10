<template>
    <section class="page-shareInit" v-cloak v-show="isDateRn">
        <section class="extract-box">
            <div class="share-logo">
                <img src="../assets/images/share_logo.png" alt="">
                <span>掌云网盘</span>
                <p>
                    <img src="../assets/images/share_word.png" alt="">
                </p>
            </div>
            <div class="extract-form">
                <div>
                    <img :src="shareInfo.shareHeadImg" />
                    <span class="username" :class="{vip:(this.shareInfo.shareVip=='1')?true:false}">{{shareInfo.shareUserName}}</span>
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
        </section>
        <div class="cloud"></div>
    </section>
</template>
<script>
export default {
    name:'shareInit',
    components:{
    },
    data(){
        return {
            extractVal: '',
            shareInfo:{
                shareUserName:'',
                shareHeadImg:'',
                shareVip:'',
            },
            isDateRn:false,
        }
    },
    methods:{
       extractBtn(){
         if(!this.extractVal){
           this.$message({
             message: '请输入提取码！',
             type: 'error',
             duration:1500
           });
           return
         }
         let params = {
             code:this.extractVal,
             parentId:'-1',
             page:'1',
             perpage:'100'
           }
            this.$http({
                url:'/api/files/shareIndex/'+this.$route.params.id,
                method:'post',
                data:params
            }).then(res=>{
              if(res.data.code === 100001 ){
                sessionStorage.setItem('code',this.extractVal)
                localStorage.setItem('fileInfo',JSON.stringify(res.data.data.shareInfo));
                if((res.data.data.files.dataList.length==1 && res.data.data.files.dataList[0].fileType==1) ||res.data.data.files.dataList.length>1 ){
                  this.$router.push({path:'/share',query:{id:this.$route.params.id}})
                }else if(res.data.data.files.dataList.length==1 && res.data.data.files.dataList[0].fileType!=1){
                  this.$router.push({path:'/shareDetail',query:{ids:res.data.data.files.dataList[0].id,id:this.$route.params.id,type:res.data.data.files.dataList[0].icon}})
                 }
                }
              if(res.data.code === 100091 ){
                this.$message({
                  message:res.data.msg,
                  type: 'error',
                  duration:1500
                });
              }
            }).catch((err)=>{
              console.log(err);
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
                    this.shareInfo.shareVip=res.data.data.vip;
                    if(res.data.data.isOwner == '1'){
                      this.$router.push({path:'/share',query:{id:this.$route.params.id}})
                    }
                }else {
                  this.$router.push({path:'/share',query:{id:this.$route.params.id}})
                }
                this.isDateRn=true;
            }).catch((err)=>{
              console.log(err);
              this.isDateRn=true;
            })
       },
        BrowserListenJump(){
            if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
              this.$router.push({
                    path:'/phoneShareInit/'+this.$route.params.id,
                })
            }else{
              this.getShareInfo()
            }
        }

    },
    created(){
      this.BrowserListenJump()
    }
}
</script>
<style lang="scss" scoped>
.page-shareInit{
    width: 100%;height: 100vh;background:#eff3f6;position: relative;
    & .cloud{
        position: absolute;width: 100%;height: 473px;bottom: 0;left: 0;box-shadow: 0px -9px 215px 0px rgba(197, 222, 243, 0.2);
        background:url(~@/assets/images/share_cloud.png);background-size:100% 100%;
    }
    & .extract-box{
        position: absolute;width: 490px;height: 374px;top: 144px;left: 50%;margin-left: -245px;z-index: 1;
        & .share-logo{
            text-align: center;
            margin-bottom: 20px;
            & img{
                width: 84px;height: 53px;margin-right: 18px;vertical-align: top;
            }
            & span{
              font-size: 44px;color: #3e3e3e;font-family: droid;font-weight: bold;
            }
            & p{
                margin-top: 10px;
                & img{
                    width: 254px;height: 20px;margin-right: 0;
                }
            }
        }
        & .extract-form{
            height:267px;border-radius:5px; background-color: #ffffff;
            & >div:nth-of-type(1){
                width: 100%;padding: 16px 32px;box-sizing: border-box;border-radius: 5px 5px 0 0;
                background-color: #5cbbf4;
                & img{
                    display: inline-block;
                    vertical-align: top;
                    width: 54px;
                    height: 54px;
                    border-radius: 50%;
                    overflow: hidden;
                }
                & span{
                    display: inline-block;
                    vertical-align: top;
                    margin-left: 10px;
                    line-height: 54px;
                    font-size: 16px;
                    color: #ffffff;
                }
                & span + span{
                    font-size: 14px;color: #ffffff;font-family: PingFangSC-Medium;
                }
                & .username{
                    padding-left:25px;
                    box-sizing: border-box;
                    position: relative;
                    &::after{
                        content: '';
                        position: absolute;
                        top: 18px;
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
            }
            & >div:nth-of-type(2){
                padding: 30px;box-sizing: border-box;
                & p{
                    font-size: 14px;
                    color: #5a5a5a;
                    margin: 20px 0;
                }
                &>div{
                    display: flex;
                }
            }
        }
    }
}
[v-cloak] {
  display: none;
}
</style>
<style>
.page-shareInit .el-input .el-input__inner{
    border: none;background: #eaf7ff;border-radius: 5px;margin-right: 20px;height: 40px;
}
.page-shareInit .el-button--primary{
    background-color: #5cbbf4;border-radius: 5px;border-color: #5cbbf4;
}
</style>




