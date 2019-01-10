<template>
  <section class="page-phoneShare">
      <!-- 文档标题 -->
    <div v-wechat-title="$route.meta.title=(shareInfo.shareName)? shareInfo.shareName+'_免费高速下载|掌云网盘' : '分享详情_免费高速下载|掌云网盘'" style="display:none;"></div>
    

    <PhoneHeader :is-need-login="false"/>
    <div class="con" v-show="isDataRes" v-if="isLoserFile">
      <div class="singel-file">
        <div class="file-view">
          <img class="file-view-lose" src="../assets/images/homepage_inset.png" alt="">
          <span>文件分享已被取消或删除~</span>
        </div>
      </div>
      
    </div>
    <div class="con" v-show="isDataRes" v-if="!isLoserFile">
      <div class="title">
        <img :src="shareInfo.memberHeadImg" />
        <div>
          <span :title="shareInfo.memberNickName">{{shareInfo.memberNickName}}</span>
          <span>{{shareInfo.termTime}}</span>
        </div>
      </div>
      <!-- 文件类型：1表示文件夹，2表示图片，3表示文档，4表示视频，5表示音乐，6表示种子，7表示其他 -->
      <div class="singel-file" v-cloak>
        <div class="file-view">
          <img :class="(files.previewPath)? '' : 'file-view-img'" :src="(files.previewPath)? files.previewPath.jpg : require('../assets/images/image.png')" alt="" v-if="files.fileType=='2'">
          <img class="file-view-fw" src="../assets/images/fw.png" alt="" v-if="files.fileType=='3'">
          <!-- <video :src="files.previewPath" v-if="files.fileType=='4'"></video> -->
          <div class="file-view-video" id="id-file-view-video"  v-if="files.fileType=='4'" @click="clickVideoPlay()"></div>
           <!-- <img class="file-view-video" src="../assets/images/video.png" alt="" v-if="files.fileType=='4'"> -->
          <img class="file-view-music" src="../assets/images/music.png" alt="" v-if="files.fileType=='5'">
          <img class="file-view-bt" src="../assets/images/bt.png" alt="" v-if="files.fileType=='6'">
          <img class="file-view-zip" src="../assets/images/unknow.png" alt="" v-if="files.fileType=='7'">
        </div>
        <div class="file-title">
          <span>{{dataFormat(files.createTime).split(' ')[0]}}</span>
          <span>{{files.name}}</span>
        </div>
      </div>
      <div class="footer">
        <el-button type="primary" @click.stop="saveSkyDrive();"  v-show="!isUserSelf">保存到掌云网盘</el-button>
        <el-button type="primary" @click.stop="download();">高速下载<span>({{sizeFormat(files.fileSize)}})</span></el-button>
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
      isLoserFile:false, //是否是失效文件
      isUserSelf:true, //是否用户本人
      isDataRes:false, //防止闪现 数据是否返回
      extractVal: '', //验证码
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
      player:null
    }
  },
  watch: {
    
  },
  methods:{
    download(){
      // window.location.href=this.shareInfo.downloadUrl;
      this.$message({
          message: '手机H5页面暂无登录功能,无法获得下载地址',
          type: 'success',
          duration:2000
      });
      // this.createDownUrl(this.files);
    },
    saveSkyDrive(){

    },
    clickVideoPlay(){
      this.$message({
          message: '手机H5页面将跳转到应用宝或者app',
          type: 'success',
          duration:2000
      });
    },
    initPlayer() {
      if(this.files.previewPath){}
        this.player = new TcPlayer('id-file-view-video', {
          "m3u8":(this.files.previewPath)? this.files.previewPath['250p'] : '.mp4',
          // "flv": "http://www.zhiboba.cc/app/flvzb.html?id=FLV地址", //增加了一个flv的播放地址，用于PC平台的播放 请替换成实际可用的播放地址
          "autoplay": false,      //iOS下safari浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
          "definition":210,
          "width": '100%',//视频的显示宽度，请尽量使用视频分辨率宽度
          "height": '100%',//视频的显示高度，请尽量使用视频分辨率高度
        })
      },
    jumpPageData(id,index){
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
                let data=res.data.data;
                if(!data.files.dataList[index]) this.isLoserFile=true;
                this.shareInfo=data.shareInfo;
                this.files=data.files.dataList[index];
                // if(this.files.fileType == '4') this.initPlayer();
            }
            else if(res.data.code === 100101 ) {
                this.isLoserFile=true;
            }
            else if(res.data.code === 100091){
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
    initPage(){
        this.$http({
            url:'/api/files/shareIndexInfo',
            method:'post',
            data:{urlCode:this.$route.params.id}
        }).then(res=>{
            if(res.data.code === 100001 ){
              this.isHasExtractCode();
              if((!this.$route.query.id && this.$route.query.id!= 0) || (!this.$route.query.index && this.$route.query.index!=0)){
                  this.$route.query.id=-1;
                  this.$route.query.index=0;
              }
              this.jumpPageData(this.$route.query.id,this.$route.query.index);
            }
            else if(res.data.code === 100101 || res.data.code === 100102 || res.data.code === 100103) {
                this.isLoserFile=true;
                this.isDataRes=true;
            }
        })
    },
    BrowserListenJump(){
        if((/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent))) {
          this.initPage();
        }else{
          this.$router.push({
                path:'/ShareInit/'+this.$route.params.id,
          })
        }
    }
  },
  updated(){
    if(this.files.fileType == '4' && document.getElementById('id-file-view-video')) this.initPlayer();
  },
  created(){
    this.BrowserListenJump();
  },
  destroyed(){
    if(this.player) this.player.destroy();
    
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
      padding-bottom:86px; 
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
            line-height: 22px;
          }
          &>span:nth-of-type(2){
            font-size: 14px;
            color: #686868;
          }
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
            min-width:132px;
            min-height: 132px;
          }
          & .file-view-zip,
            .file-view-img,
            .file-view-fw,
            .file-view-music,
            .file-view-bt{
            width:132px;
            height: 142px;
            margin-top: 36px;
          }
          & .file-view-lose{
            width:132px;
            height: 132px;
            margin-top: 36px;
          }
          & .file-view-video{
            width: 100%;
            height:calc(0.5*100vw);
            position: relative;
            &::after{
              content: '';
              position: absolute;
              width: 32px;
              height: 32px;
              top: 0;
              bottom: 0;
              left: 0;
              right: 0;
              margin: auto;
              background:url(~@/assets/images/icon_player.png) center center no-repeat;
              background-size: 32px 32px; 
            }
          }
          &> video{
            width: 100%;
            height: auto;
          }
          &>span{
            display: inline-block;
            width: 100%;
            text-align: center;
            color: #5CBBF4;
            margin-top: 20px;
          }
        }
        &>.file-title{
          text-align: center;
          font-size: 14px;
          color: #000000;
          padding: 0 30px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      &>.footer{
        // position: fixed;
        // bottom: 23px;
        // left: 0;
        text-align: center;
        width: 100%;
        z-index: 1;
        padding: 24px 27px;
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
<style>
.page-phoneShare .vcp-poster,
.page-phoneShare .vcp-bigplay,
.page-phoneShare .vcp-controls-panel,
.page-phoneShare .vcp-error-tips{
  display: none!important;
}
</style>


