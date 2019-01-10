<template>
  <section class="page-player">
    <Header></Header>
    <div class="title">
      <div class="left text-overflow">{{obj.name}}</div>
      <div class="right">
        <i></i>
        <router-link to="/downLoad" tag="span">安装移动端，躺在床上看</router-link>
      </div>
    </div>
    <div class="player" v-if="!videoLoading" id="id_test_video">
    </div>
    <div class="box" v-else >
      <img v-if="!errFile" class="loading"  src="../assets/images/loading.gif" alt="">
      <p :class="{errFile:errFile }">{{text}}</p>
    </div>
    <footer>
      <el-button size="medium" class="comBtns" @click="shareBtn">
        <i class="fx"></i>
        <span>分 享</span>
      </el-button>
      <el-button size="medium" class="comBtns" @click.prevent="downLoad">
        <i class="down"></i>
        <span>下 载</span>
      </el-button>
    </footer>
    <ShareDialog :shareDialog="shareDialog" :shareData="shareData"></ShareDialog>
  </section>
</template>

<script>
  import Header from '@/components/header'
  import ShareDialog from '@/components/shareDialog'
  import b from '../util/newVue'

  export default {
    name: "personalCenter",
    components: {
      Header, ShareDialog
    },
    data() {
      return {
        playUrl: '',
        shareDialog: false,
        player: '',
        shareData: [],
        videoLoading:false,
        obj:[],
        text:'',
        errFile:false
      }
    },
    methods: {
      getList(){
        const params ={
          id:this.$route.query.id
        }
        this.$http({
          url:'/api/files/detail',
          method:'post',
          data:params
        }).then(res=>{
          if(res.data.code==100001){
            this.obj = res.data.data
            if (res.data.data.previewPath&& res.data.data.previewPath.code && res.data.data.previewPath.code == 100001) {
              this.videoLoading = false
              this.play(res.data.data.previewPath)
            }else {
              this.videoLoading = true
              this.text = '转码中...'
            }
          }else if(res.data.code ==100071){
            // 文件不存在
            this.videoLoading = true
            this.errFile = true
            this.text = res.data.msg
          }
        }).catch(err=>{
          console.log(err);
        })
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
           // 'src': "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1523963187690&di=2399fcae7776f53320e5343138c3ea58&imgtype=0&src=http%3A%2F%2Fimg1.3lian.com%2F2015%2Fa2%2F53%2Fd%2F25.jpg"
          },
          // "wording": {
          //   12: "转码中请稍后...",
          //   4:this.text?this.text: "转码中请稍后..."
          // },
          autoplay: false,
          flash:false,
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
      shareBtn() {
        if(this.errFile){
         this.$message.error('文件不存在！')
          return
        }
        this.shareData = [{id: this.$route.query.id,name:this.obj.name}]
        this.shareDialog = true
      },
      downLoad() {
        if(this.errFile){
          this.$message.error('文件不存在！')
          return
        }
        this.createDownUrl([this.obj])
      },
      getParams(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
          return decodeURIComponent(r[2]);
        }
        return null;
      }
    },
    mounted() {
      this.getList()
      b.$on('shareDialog', (val) => {
        this.shareDialog = val
      })
    },
    destroyed() {
      if(this.player){
        this.player.destroy()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .title {
    text-align: center;
    position: relative;
    height: 40px;
    width: 795px;
    line-height: 1;
    top: 80px;
    left: 50%;
    margin-left: -479px;
    & > .left {
      color: #5a5a5a;
      font-size: 18px;
      position: absolute;
      left: 0px;
      max-width: 500px;
    }
    & > .right {
      color: #3d3d3d;
      font-size: 12px;
      position: absolute;
      right: 0px;
      top: 0;
      & > span {
        line-height: 18px;
        display: inline-block;
        vertical-align: text-bottom;
      }
      & > span:hover {
        cursor: pointer;
        color: #5cbbf4;
      }
      & > i {
        display: inline-block;
        background: url("../assets/images/personaldata_sidenav_icons_phone.png") no-repeat center;
        width: 11px;
        height: 18px;
        background-size: 100%;
        vertical-align: text-bottom;
      }
    }
  }

  .player {
    position: relative;
    height: 500px;
    width: 795px;
    line-height: 1;
    top: 70px;
    left: 50%;
    margin-left: -479px;
    &>div{
      position: relative;
      &>p{
        position: absolute;
        bottom: 80px;
        width: 100%;
        font-size: 14px;
        text-align: center;
      }
      &>.loading{
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
  .box {
    position: absolute;
    height: 500px;
    width: 795px;
    line-height: 1;
    top: 120px;
    left: 50%;
    margin-left: -479px;
    background: #000;
    &>p{
      position: absolute;
      bottom: 40%;
      width: 100%;
      font-size: 14px;
      text-align: center;
      color: white;
    }
    &>p.errFile{
      bottom: 48%;
    }
    &>.loading{
      position: absolute;
      width: 32px;
      height: 32px;
      top: 50%;
      left: 50%;
      margin-left: -16px;
      margin-top: -16px;
    }
  }
  footer {
    position: absolute;
    bottom: 130px;
    width: 795px;
    left: 50%;
    margin-left: -479px;
    & span > i {
      display: inline-block;
      vertical-align: middle;
      background-size: 100%;
    }
    & span > i.fx {
      width: 18px;
      height: 18px;
      margin-top: -2px;
      background: url("../assets/images/common_hover_icons_share.png");
    }
    & span > i.down {
      width: 12px;
      height: 12px;
      background: url("../assets/images/sectab_icons_download.png");
    }
  }
  .page-player{
    position: relative;
    height: 800px;
    min-width: 1100px;
    overflow: hidden;
  }
</style>
