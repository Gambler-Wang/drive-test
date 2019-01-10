<template>
  <section class="page-phoneShare">
      <!-- 文档标题 -->
    <div v-wechat-title="$route.meta.title=(shareInfo.shareName)? shareInfo.shareName:'分享列表'+'_免费高速下载|掌云网盘'" style="display:none;"></div>
   


    <PhoneHeader :is-need-login="false"/>
    <div class="con" v-show="isDataRes">
      <div class="title">
        <img :src="shareInfo.memberHeadImg" />
        <div>
          <span :title="shareInfo.memberNickName">{{shareInfo.memberNickName+'的分享'}}</span>
          <!-- <span>{{shareInfo.termTime}}</span> -->
        </div>
      </div>
      <div class="share-count">
        <span>{{"本分享共有"+fileList.length+"个文件"}}</span>
        <span>{{shareInfo.termTime}}</span>
      </div>
      <PhoneShareBread 
      :breadItems="breadItems"
      @jumpBread="jumpBread"
      />
      <PhoneShareList
      :fileList="fileList"
      @clickItems="clickItems"/>
      <div class="footer">
        <el-button type="primary" @click.stop="saveSkyDrive();" v-if="!isUserSelf">保存到掌云网盘</el-button>
        <el-button type="primary" @click.stop="download();">高速下载</el-button>
      </div>
    </div>
  </section>
</template>

<script>
import PhoneHeader from '../components/phoneHeader'
import PhoneShareBread from '../components/phoneShareBread'
import PhoneShareList from '../components/phoneShareList'
export default {
  name:'phoneShareInit',
  components:{
       PhoneHeader,PhoneShareBread,PhoneShareList
  },
  data(){
    return{
      isUserSelf:true, //是否为本用户
      isDataRes:false, //防止闪现 数据是否返回
      extractVal:'',
      shareInfo:{
        // createTime: 1540177210,
        // describe: null,
        // id: "5bcd3d3ab325205472f59f40",
        // isTimeOut: false,
        // memberHeadImg: "http://pili-vod.whlive.top/iwanli/image_2018/07/12-18:33:47-5b472e8b839dc.png",
        // memberNickName: "网盘用户1539236689",
        // term: -1,
        // termTime: "永久",
        // type: 1,
        // urlCode: "4d23d18a7fcc49ecb221c837452532119a050360380e42d88b509a2586a331fb",
      },
      files:{

      },

      breadItems:[
        {
          itemName:'全部文件',
          itemId:-1,
        },
      ],
      fileList:[
        
      ]
    }
  },
  methods:{
    download(){
      //window.location.href=this.shareInfo.downloadUrl;
      this.$message({
          message: '跳转到应用程序或者跳转到应用宝',
          type: 'success',
          duration:2000
      });
    },
    saveSkyDrive(){

    },

    // 点击列表
    clickItems(obj){
      if(obj.type!=1) {
        this.$router.push({
            path:'/phoneShareDownload/'+this.$route.params.id,
            query:{
                index:obj.index,
                id:this.breadItems[this.breadItems.length-1].itemId
            }
        })         
      } 
      
      this.fileList=[];
      let breadItem={
        itemName:obj.name,
        itemId:obj.id
      }
      this.breadItems.push(breadItem);
      this.getListQues(obj.id);
    },

    // 面包屑跳转逻辑
    jumpBread(id){
      for (let index = 0; index < this.breadItems.length; index++) {
        const el = this.breadItems[index];
        if(el.itemId==id){
          this.getListQues(id);
          this.breadItems.splice(index+1,this.breadItems.length-index-1);
        }
      }
    },

    // 请求
    getListQues(id){
      let params = {
          code:this.extractVal,
          parentId:id,
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
              var data=res.data.data;
              this.shareInfo=data.shareInfo;
              this.files=data.files;
              this.fileList=data.files.dataList;
              if(id==-1 && this.fileList.length == 0){
                this.$router.push({
                    path:'/phoneShareDownload/'+this.$route.params.id,
                })
              }
          }
          else if(res.data.code === 100091  || res.data.code === 100101){
             this.$router.push({
                path:'/phoneShareInit/'+this.$route.params.id,
            }) 
          }
          this.isDataRes=true;
      })
    },
    isHasExtractCode(){
      if(localStorage.getItem('extractCode')){
        this.extractVal=this.Base64.b64DecodeUnicode(localStorage.getItem('extractCode'));
      }
    },
    BrowserListenJump(){
        if((/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent))) {
          this.isHasExtractCode();
          this.getListQues(-1);
        }else{
          this.$router.push({
              path:'/ShareInit/'+this.$route.params.id,
          })
        }
    }
  },
  created(){
    this.BrowserListenJump();
  }
}
</script>

<style lang="scss" scoped>
  .page-phoneShare{
    width: 100%;
    height: 100vh;
    background-color: #fff;    
    overflow: auto;
    & >.con{
      width: 100%;
      height: 100vh;
      padding-top:58px; 
      padding-bottom:110px; 
      position: relative;
      box-sizing: border-box;
      & >.title{
        width: 100%;
        padding: 7px 10px;
        box-sizing: border-box;
        display: flex;
        border: 1px solid #EDEDED;
        & >img{
          width: 46px;
          height: 46px;
          border-radius: 50%;
          vertical-align: middle;
          margin-right: 10px;
          flex: 0 1 46px;
          border: 2px solid #5CBBF4;
        }
        & > div{
          flex: 1;
          display: flex;
          flex-direction: column;
          &>span{
            flex: 1;
            height: 16px;
            line-height: 50px;
          }
        }
      }
      &>.share-count{
        height: 27px;
        background: #ECECEC;
        border-bottom: 1px solid #E3E3E3;
        box-sizing: border-box;
        padding: 0 15px;
        display: flex;
        justify-content: space-between;
        &>span{
          line-height: 27px;
          font-size: 14px;
          color: #686868; 
        }
      }
      &> .singel-file{
        &>.file-view{
          width: 100%;
          padding: 20px 20px 10px 20px;
          box-sizing: border-box;
          text-align: center;
          &>img{
            width: 100%;
          }
          &>.file-view-zip{
            width:132px;
            height: 132px;
            margin-top: 40px;
          }
        }
        &>.file-title{
          text-align: center;
          font-size: 14px;
          color: #000000;
        }
      }
      &>.footer{
        // position: fixed;
        // bottom: 23px;
        // left: 0;
        text-align: center;
        width: 100%;
        padding-bottom:50px;
        z-index: 1;
        padding: 23px 27px;
        display: flex;
        box-sizing: border-box;
        &>button{
          flex:1;
          margin:0;
          background:  #FB8C22;
          border-radius: 3px;
          border:none;
          padding: 0 4vw;
          line-height: 35px;
          margin: 0 8px;
        }
        &>button:nth-of-type(1){
          background: #5EBDF8;
        }
      }
    }
  }
</style>

