<template>
  <section>
    <Header/>
    <section class="content">
      <aside class="aside-menu">
        <dl>
          <dt>
            <router-link tag='p' :exact="true" to="/all"><i class="icon icon-files"></i>全部文件</router-link>
          </dt>
          <dd>
            <router-link tag='p' to="/image"><i class="iconfont  icon-tp"></i>图片</router-link>
          </dd>
          <dd>
            <router-link tag='p' to="/doc"><i class="iconfont icon-wd"></i>文档</router-link>
          </dd>
          <dd>
            <router-link tag='p' to="/video"><i class="iconfont icon-sp"></i>视频</router-link>
          </dd>
          <dd>
            <router-link tag='p' to="/torrent"><i class="iconfont icon-bt"></i>种子</router-link>
          </dd>
          <dd>
            <router-link tag='p' to="/music"><i class="iconfont icon-yy"></i>音乐</router-link>
          </dd>
          <dd>
            <router-link tag='p' to="/other"><i class="iconfont icon-gd"></i>其它</router-link>
          </dd>
          <dt>
            <router-link tag='p' to="/sharePage"><i class="icon icon-share"></i>我的分享</router-link>
          </dt>
          <dt>
            <router-link tag='p' to="/recovery"><i class="icon icon-delete"></i>回收站</router-link>
          </dt>
        </dl>
        <div id="leftBar-bottom">
          <div class="SpeedBox">
            <div class="speed" :style="{width:startSpend}"></div>
            <div class="all"></div>
          </div>
          <div class="size">{{sizeFormat(size)}}/{{allSize}}G</div>
          <div class="login">
            <router-link class="android" tag="div" :to="{path:'/downLoad'}"></router-link>
            <router-link class="ios" tag="div" :to="{path:'/downLoad'}"></router-link>
          </div>
        </div>
      </aside>
      <section class="right-content">
        <router-view ref="contentbox" @uploadFiles="getFiles"></router-view>
      </section>
    </section>
    <Dialog
      :showDialog="showDialog"
      :files="files"
      @close="showDialog = !showDialog"
      @uploaded="uploaded"
      ref="uploads"
    />

  </section>
</template>
<script>
  import Header from '@/components/header'
  import  b from '../util/newVue'
  import Dialog from '@/components/dialog';
  export default {
    name:'Index',
    components: {
      Dialog,
      Header
    },
    data() {
      return {
        showDialog:false,
        files:[],
        startSpend:'',
        size:'' ,
        allSize:''
      }
    },
    created() {
      const userInfo = localStorage.getItem('userInfo');
      b.$on('size',(v)=>{
        this.size = v
        this.startSpend = ( Number(this.size)  /  Number(JSON.parse(userInfo).totalSpace) *100 ) +'%'

      })
      if(userInfo){
        this.size = localStorage.getItem('usedSpace')?localStorage.getItem('usedSpace'): JSON.parse(userInfo).usedSpace
        this.allSize = Math.round(JSON.parse(userInfo).totalSpace/1024/1024/1024);
        this.startSpend = ( Number(this.size )  /  Number(JSON.parse(userInfo).totalSpace) *100 ) +'%'
      }
    },
    methods: {
      getFiles(files){
        this.showDialog = true;
        this.files = files;
      },
      uploaded(){
        this.$refs['contentbox'].uploaded();
      },
    }
  }
</script>
<style lang="scss" scoped>
  .content {
    width: 100%;
    background-color: #fff;
    font-size: 0;
    position: relative;
    left: 0;
    top: 62px;
    & .aside-menu {
      position:fixed;
      width: 195px;
      height: 100%;
      display: inline-block;
      vertical-align: top;
      font-size: 14px;
      z-index:2;
      background-color: #F4F4F4;
      left: 0;
      top:0;
      padding-top:60px;
      box-sizing:border-box;
      & > dl {
        /*padding-top: 10px;*/
        & > dt,
        & > dd {
          cursor: pointer;
        }
        & > dt:hover,
        & > dd:hover {
          background-color: #dde4eb;
        }
        & > dt > p,
        & > dd > p {
          display: block;
          width: 100%;
          height: 45px;
          line-height: 45px;
          overflow: hidden;
          box-sizing: border-box;
          padding-left: 53px;
        }
        & > dd > p {
          padding-left: 8px;
          color: #3d3d3d;
          &>i{
            display: inline-block;
            width: 45px;
            height: 45px;
            text-align: center;
          }
        }
        & > dt > p {
          padding-left: 8px;
        }
      }
      & > #leftBar-bottom {
        position: absolute;
        bottom: 0;
        width: 100%;
        box-sizing: border-box;
        padding: 0 20px 20px 20px;
        & > .SpeedBox {
          background: #cad5e0;
          position: relative;
          box-sizing: border-box;
          width: 100%;
          height: 8px;
          border-radius: 4px;
          overflow: hidden;
          & > .speed {
            position: relative;
            top: 0;
            left: 0;
            height: 8px;
            width: 0px;
            background-color: #87e34b;
            border-radius: 4px;
            z-index: 111;
          }
          & > .all {
            position: relative;
            top: 0;
            left: 0;
            height: 8px;
            width: 100%;
            border-radius: 4px;
          }
        }
        & > .size {
          margin-top: 10px;
        }
        & > .login {
          display: flex;
          justify-content: space-around;
          margin-top: 20px;
          & > .android {
            background: url("../assets/images/dc_icon_android.png") no-repeat center;
            background-size: 100%;
            width: 16px;
            height: 18px;
            cursor: pointer;
          }
          & > .ios {
            background: url("../assets/images/dc_icon_iphone.png") no-repeat center;
            background-size: 100%;
            width: 16px;
            height: 18px;
            cursor: pointer;
          }
        }
      }
    }
    & .right-content {
      display: inline-block;
      vertical-align: top;
      width:100%;
      padding-left:195px;
      font-size: 14px;
      position: relative;
    }
  }

  .router-link-active {
    color: #54b2eb !important;
    background-color: #E6E6E6;
  }

</style>
