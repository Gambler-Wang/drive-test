<template>
  <section class="component-list" v-loading = "loadingList">
    <section class="page-title" v-show="titleText">
      <Bread
        @changeStyle="changeStyle"
        @routeList="routeList"
      />
    </section>
    <Pulldown  @refresh="getList"
               :totalPage="totalPage"
               :currentPage="currentPage"
               :refreshing="refreshing"
               :clearDone="clearDone"
               ref="pulldown"
               v-if="dataList.length > 0"
    >
          <dl class="list-content" v-if="styleFlag">
            <dt style="padding: 10px 0px">
              <section id="cc">
                <p class="p-checkbox"><input type="checkbox" :value="checked" v-model="checked" @click.stop="''" @change="selectAll"><i></i></p>
                <span @click="changSort('2')">{{tableHead.name}}<i v-if="sorts=='2'" :class="['icon',rank=='1' ? 'icon-sortup':'icon-sortdown']"></i></span>
                <!--分享详情列表下载-->
                <el-button v-show="selectData.length>0"
                           @click="batchDown(selectData)"
                           style="margin-left: 6px;padding:0 4px;height: 24px;border-radius: 3px;border: solid 1px #b4e3ff;color: #54b2eb;font-size: 12px">
                  <img src="../assets/images/sectab_icons_download.png" alt="" class="comImg">下 载
                </el-button>
              </section>
              <span id="span" @click="changSort('3')">{{tableHead.time}}<i v-if="sorts=='3'" :class="['icon',rank=='1' ? 'icon-sortup':'icon-sortdown']"></i></span>
              <span @click="changSort('1')">{{tableHead.outTime}}<i v-if="sorts=='1'" :class="['icon',rank=='1' ? 'icon-sortup':'icon-sortdown']"></i></span>
            </dt>
            <dd v-for="(item,key) of dataList" :key="key"  @click="checkTag(item,key)">
              <section class="filename-container" @dblclick.stop="godetail(item)">
                <p class="p-checkbox">
                  <input type="checkbox" :value="item" v-model="selectData" :disabled="item.disabled"
                         @change="change(item)" @click.stop="'return'"><i></i>
                </p>
                <section class="filename-box">
                  <i class="img-size icon"  v-addIcon="item.icon"></i>
                  <section>
                    <p >
                      <a href="javascript:;"  class="text-overflow"  @click.stop="godetail(item,key)"  v-if="item.fileType=='1'" v-maxLength = "item.name"></a>
                      <a href="javascript:;"  class="text-overflow"  v-else-if="item.fileType !='2'" @click.stop="playUrl(item)" v-maxLength = "item.name"></a>
                      <a href="javascript:;"  class="text-overflow"   v-else-if="item.fileType == '2'" v-maxLength = "item.name"></a>
                      <span v-else  v-maxLength = "item.name"></span>
                      <img :src="(item.previewPath &&item.previewPath.code=='100001')? item.previewPath.jpg : require('../assets/images/image.png')"
                           class="img-size one listPic"
                           v-if="item.fileType == '2'"
                           preview="1"
                           :title = "item.name"
                           :preview-text="item.name">
                    </p>
                  </section>
                </section>
                <nav v-show="selectData.length<2">
                  <a href="javascript:;" @click.prevent="downUrl([item])" title="下载" class="icon icon-download"></a>
                </nav>
              </section>
              <span  class="type" >{{item.fileType == 1 ? '-' : sizeFormat(item.fileSize)}}</span>
              <span  class="type" >{{ dataFormat(time)}}</span>
            </dd>
          </dl>
          <dl class="card-content" v-else>
            <dt>
              <p class="p-checkbox"><input type="checkbox" :value="checked" v-model="checked" @click.stop="''" @change="selectAll"><i></i></p>
              <p>全选</p>
              <p v-show="selectData.length>0">已选择{{selectData.length}}个文件</p>
            </dt>
            <dd v-for="(item,key) of dataList" :key="key" :class="{'checked':item.checked}"   @click="checkTag(item,key)">
              <div class="imgBox" v-if="item.fileType =='2'">
                <img :src="(item.previewPath &&item.previewPath.code=='100001')? item.previewPath.jpg : require('../assets/images/image.png')"
                     class="img-size one listPic" preview="1" :preview-text="item.name">
              </div>
              <div class="img-size" v-else>
                <i v-if="item.fileType =='1'" class="img-size icon"  v-addIcon="item.icon" @click.stop="godetail(item)"></i>
                <i v-else-if="item.fileType =='4'" class="img-size icon"  v-addIcon="item.icon"  @click.stop="playUrl(item)" ></i>
                <i v-else class="img-size icon"  v-addIcon="item.icon"  ></i>
              </div>
              <section class="filename-box">
                <p class="text-overflow">
                  <a href="javascript:;" v-if="item.fileType=='1'" @click.stop="godetail(item,key)" v-maxLength = "item.name"></a>
                  <a href="javascript:;" v-else-if="item.fileType=='4'" @click.stop="playUrl(item)" v-maxLength = "item.name"></a>
                  <span v-else v-maxLength = "item.name"></span>
                </p>
              </section>
              <p class="p-checkbox">
                <input type="checkbox" :value="item" :disabled="item.disabled" v-model="selectData"
                       @change="change(item)" @click.stop="'return'"><i></i>
              </p>
            </dd>
          </dl>
    </Pulldown>
    <Nodata v-show="Nodatashow && dataList.length==0"/>
  </section>
</template>
<script>
  import Pulldown from '@/components/pulldown';
  import Nodata from '@/components/nodata';
  import Bread from '../components/breadShare';
  import b from '../util/newVue'
  export default {
    name: "List",
    components: {Pulldown,Nodata,Bread},
    props: {
      //列表请求参数
      params: {
        type: Object,
        default: function() {
          return {};
        }
      },
      url:{
        type:String
      },
      time:{
        type:Number
      },
      page:{
        type:Number
      },
      sort:{
        type:Object,
        default:function(){
          return {
            sort:'2',
            rank:'1'
          }
        }
      },
      //标题全部文件显示
      titleText:{
        type:Boolean,
        default:true,
      },
      //分享iocn显示 //回收站iocn显示
      iconShow:{
        type:String,
        default:'1'
      },
      //table 头部文字
      tableHead:{
        type:Object,
        default:function () {
          return {name:'文件名', time:'大小', outTime:'分享时间'}
        }
      }
    },
    data() {
      return {
        loadingList: false,
        checked: false, //全选
        dataList: [],
        selectData: [], //选择的数据
        currentPage:1,
        refreshing:false,
        totalPage:1,
        rank:'1',
        sorts:'2',
        styleFlag:sessionStorage.getItem('styleFlag') == 'false' ? false :true,
        parentObj:{},
        Nodatashow:false,
        obj:{},
        videoLoading:false,
        clearDone:true
      };
    },
    watch: {
      sort(newval,oldval){
        this.$refs.pulldown && this.$refs.pulldown.top();
        this.sorts = newval.sort;
        this.rank = newval.rank;
        this.getList(1);
      }
    },
    methods: {
      isCheckAll(){
        if( this.dataList.length > 0 && this.dataList.length === this.selectData.length){
          this.checked = true;
        }else {
          this.checked = false;
        }
      },
      getList(page) {
        this.currentPage = page ? page : this.currentPage;
        this.loadingList = true;
        this.refreshing = true;
        let quertData = {
          ...this.parentObj,
          sort:this.sorts,
          rank:this.rank,
          perpage:100,
          page:this.currentPage
        };
        this.$http({
          url:this.url,
          method: "post",
          data:quertData
        })
          .then(res => {
            this.loadingList = false;
            if(res.data.code == 100001){
              this.obj =Object.assign({}, res.data.data.shareInfo)
              this.refreshing = false
              let resultData = res.data.data.files.dataList
              resultData = resultData.map(item => {item.rename = false; item.disabled = false; return item; }) ;
              if(this.currentPage === 1 ){
                this.selectData = [];
                this.$emit("getSelectData", this.selectData);
                this.dataList =res.data.data.files.dataList
                this.clearDone=false
              }else{
                this.dataList.push(...res.data.data.files.dataList);
              }
              this.isCheckAll();
              this.totalPage = Number.parseInt(res.data.data.files.totalPageCount);
              this.$emit("sendData", res.data.data);
              //图片预览重载
              this.$previewRefresh()
              //无数据时显示login提示
              if(res.data.data.files.dataList.length==0){
                this.Nodatashow =true
              }else {
                this.Nodatashow = false;
              }
            }
            else if(res.data.code == 100101 || res.data.code == 100102 || res.data.code == 100103){
              this.$emit('sendCode',false)
            }else if(res.data.code ===110003){
              this.$router.push({path:'/errInfor'})
            }else if(res.data.code ===100091){
             if(sessionStorage.getItem('code')){
               this.$router.push({path:'/shareInit/'+this.$route.query.id})
             }
            }
          })
          .catch(err => {
            this.loadingList = false;
            console.log(err);
          });
      },
      change(data) {
        if (this.selectData.length === this.dataList.length) {
          this.checked = true;
        } else {
          this.checked = false;
        }
        data.checked = !data.checked;
        this.$emit("getSelectData", this.selectData);
      },
      //排序
      changSort(sort){
        this.sorts = sort;
        this.rank = this.rank == '1' ? '2' : '1';
        this.getList(1)
      },
      //文件夹以及文件跳转
      godetail(item,index){
        if(item.fileType != 1){
          return
        }
        if(item.fileType=='1'){
          this.parentObj.parentId = item.id
          sessionStorage.setItem('parentObj',JSON.stringify({'parentId':item.id,'name':item.name}))
          this.getList(1)
          b.$emit('routeArr',JSON.parse(sessionStorage.getItem('parentObj')))
        }
        return false
      },
      selectAll(e) {
        this.dataList.forEach((v,i)=>{
          v.checked = this.checked
        })
        if (this.checked===true) {
          this.selectData = this.dataList
        } else {
          this.selectData = [];
        }
        this.$emit("getSelectData", this.selectData);
      },
      changeStyle(v){
        this.styleFlag = v
        sessionStorage.setItem('styleFlag', this.styleFlag)
        this.$previewRefresh()
      },
      routeList(v){
        this.parentObj.parentId = v
        this.getList(1)
      },
      //下载分享文件中某个以及多个文件
      batchDown(v){
        if(!localStorage.getItem('token')){
          this.clientApp('请登录后下载')
          return
        }
        if(v.length>1){
          this.clientApp('web暂不支持多文件下载，建议使用客户端下载')
          return
        }
        this.createDownUrl(v)
      },
      downUrl(v){
        if(!localStorage.getItem('token')){
          this.$message.error('请登录后下载');
          return
        }
        this.createDownUrl(v)
      },
      playUrl(item) {
        this.$router.push({path: '/shareDetail', query: {
          ids:item.id,
          id:this.$route.query.id,
          sid:this.obj.id
        }})
      },
      getParams(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
          return decodeURIComponent(r[2]);
        }
        return null;
      },
      checkTag(item,index){
        item.checked = true
        this.selectData = [item]
        if (this.selectData.length === this.dataList.length) {
          this.checked = true;
        } else {
          this.checked = false;
        }
        this.dataList.forEach((v,i)=>{
          if(index == i){
            item.checked = true
          }else {
            this.dataList[i].checked = false
          }
        })
        this.$emit("getSelectData", this.selectData);
      }
    },
    created() {
      this.parentObj = Object.assign({},this.params)
      if(sessionStorage.getItem('parentObj')){
        this.parentObj.parentId = JSON.parse(sessionStorage.getItem('parentObj')).parentId
      }
      this.getList()
    },
    destroyed(){
      sessionStorage.removeItem('parentObj')
    }
  }
</script>
<style lang="scss" scoped>
  .component-list {
    width: 100%;
    overflow: auto;
    min-height: calc(100vh - 118px);
    position: relative;
    .page-title {
      width: 100%;
      line-height: 34px;
      color: #333;
      position: relative;
      left: 0;
      top: 0;
      background-color: #f5f5f5;
      & > span {
        position: absolute;
        right: 20px;
        top: 0;
      }
    }
    .inline-block {
      display: inline-block;
      vertical-align: top;
      font-size: 14px;
    }
    .text-overflow {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    & .p-checkbox {
      @extend .inline-block;
      width: 16px;
      height: 16px;
      /*overflow: hidden;*/
      /*border: 1px solid #B5BFC8;*/
      border: 1px solid #009FFF;
      border-radius: 2px;
      position: relative;
      margin-top: 5px;
      margin-right: 5px;
      & > input[type="checkbox"] {
        opacity: 0;
        width: 40px;
        height: 43px;
        position: absolute;
        left: -18px;
        top: -15px;
        display: block;
        cursor: pointer;
      }
      & > i {
        display: block;
        width: 100%;
        height: 100%;
      }
      & > input[type="checkbox"]:checked + i {
        background: url(~@/assets/images/tips_password_icon_right1.png) center center no-repeat;
      }
    }
    & .newfolder {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      & > input {
        border: none;
        width: 170px;
        height: 26px;
        line-height: 20px;
        padding: 3px;
        box-shadow: 0px 0px 7px 0px #54b2eb;
        background-color: #fff;
        border-radius: 3px;
      }
      & > i.icon {
        height: 22px !important;
        width: 22px !important;
        margin-top: 2px;
        background-size: 10px 10px;
        background-position: center center;
        border: 1px solid #b6e4ff;
        box-sizing: border-box;
        margin-left: 4px;
        background-color: #fff;
        border-radius: 3px;
        cursor: pointer;
      }
    }
    & .list-content {
      width: 100%;
      & > dt,
      & > dd {
        font-size: 0;
        border-bottom: 1px solid #cbe6f6;
        box-sizing: border-box;
        color: #444;
        line-height: 26px;
        & > .filename-container {
          padding-left: 20px;
          padding-top: 10px;
          padding-bottom: 10px;
          position: relative;
        }
        & > .type {
          padding-top: 10px;
        }
        & > span,
        & > section {
          @extend .inline-block;
          font-size: 14px;
          width: 59%;
          position: relative;
          line-height: 26px;
          & > nav {
            position: absolute;
            top: 0;
            right: 10px;
            display: none;
            & > .icon {
              display: inline-block;
              vertical-align: top;
              width: 26px;
              height: 26px;
              margin-top: 10px;
              background-position: center center;
            }
          }
          & > span {
            cursor: pointer;
          }
          & .icon {
            width: 26px;
            height: 26px;
            vertical-align: top;
          }
        }
        & > span {
          width: 19%;
          cursor: pointer;

        }
        & .filename-container {
          & > section,
          & > section > section {
            @extend .inline-block;
          }
          & .img-size {
            @extend .inline-block;
            height: 20px;
            width: 20px;
            margin: 0;
            margin-right: 8px;
            vertical-align: middle;
            margin-top: -2px;
          }
          & .filename-box {
            width: 100%;
            padding-right: 30px;
            position: absolute;
            padding-left: 4px;
            & > section {
              min-width: 200px;
              /*width: 80%;*/
              /*max-width: 900px;*/
              position: relative;
              & > p {
                width: 100%;
                & > a,
                & > span {
                  display: block;
                  width: 100%;
                  color: #444;
                  @extend .text-overflow;
                }
                & > a:hover {
                  color: #54b2eb;
                }
                & >.listPic{
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%!important;
                  height: 100%!important;
                  opacity: 0;
                }
              }
            }
          }
        }
      }
      & > dt {
        font-weight: bold;
        position: absolute;
        top: 34px;
        left: 0;
        width: 100%;
        height: 47px;
        z-index: 1;
        background: white;
        border-bottom: 1px solid #f5f5f5;
      }
      & > dd:hover {
        background-color: #eaf7ff;
        & > section > nav {
          display: block;
          height: 100%;
          background: #eaf7ff;
          padding: 0 10px;
        }
      }
      & .shareUrl.active {
        display: block;
        position: relative;
      }
      & .shareUrl {
        display: none;
        font-size: 12px;
        padding: 10px 20px;
        border-top: 1px solid #cbe6f6;
        & > p {
          display: inline-block;
          & > .com {
            color: #5a5a5a;
          }
          & > .url {
            color: #5cbbf4;
            &:hover {
              text-decoration: underline;
            }
          }
        }
        & > input {
          position: absolute;
          left: -10px;
          top: 16px;
          background: transparent;
          border: none;
          width: 1px;
        }
      }
      & .iconCom > .icon {
        margin-top: 10px;
      }
    }
    & .card-content {
      width: 100%;
      padding: 10px 20px;
      font-size: 0;
      & > dt{
        font-weight: bold;
        position: absolute;
        top: 34px;
        left: 0;
        width: 100%;
        height: 47px;
        z-index: 1;
        background: white;
        border-bottom: 1px solid #f5f5f5;
        &>p{
          display: inline-block;
          font-size: 14px;
          font-weight: normal;
          line-height: 47px;
        }
        &>p:last-of-type{
          margin-left:10px ;
        }
        &>p.p-checkbox{
          margin-top: 15px;
          margin-left: 20px;
          margin-right: 10px;
        }
      }
      & > dd {
        display: inline-block;
        vertical-align: top;
        font-size: 14px;
        /*padding: 20px 20px 10px;*/
        margin-right: 5px;
        margin-bottom: 5px;
        position: relative;
        left: 0;
        top: 0;
        text-align: center;
        & .imgBox {
          /*text-align: center;*/
          /*height: 130px;*/
          text-align: center;
          height: 102px;
          width: 98px;
          margin-top: 12px;
          position: relative;
          overflow: hidden;
          display: inline-block;
        }
        & .img-size {
          display: inline-block;
          border: none;
          height: 118px;
          width: 98px;
        }
        & .img-size.one {
          display: inline-block;
          border: none;
          height: auto;
          width: auto;
        }
        & .img-size.one.listPic {
          position: absolute;
          top: 50%;
          left: 50%;
          max-width: 100%;
          max-height: 100%;
          transform: translate(-50%,-50%);
        }
        & .img-size.icon {
          height: 102px;
          width: 98px;
          border: none;
          display: inline-block;
          margin-top: 12px;
        }
        & .filename-box {
          position: relative;
          left: 0;
          top: 0;
          text-align: center;
          margin: 0 7px;
          & > p {
            width: 108px;
            display: inline-block;
            text-align: center;
            line-height: 26px;
            height: 26px;
            & > a,
            & > span {
              display: inline-block;
              width: 100%;
              color: #444;
              @extend .text-overflow;
            }
            & > a:hover {
              color: #54b2eb;
            }
          }
        }
        & .filename-box > p.ww {
          width: inherit;
        }
        & .p-checkbox {
          position: absolute;
          top: 0px;
          right: 0px;
          display: none;
        }
        & .newfolder {
          position: relative;
          font-size: 0;
          width: 100%!important;
          margin-left: 0;
          & > input {
            width: 90px;
            font-size: 14px;
          }
          & > i.icon {
            height: 18px;
            width: 18px;
          }
        }
      }
      & > dd:hover {
        background-color: #f0f4f9;
      }
      & > dd:hover .p-checkbox {
        display: block;
      }
      & > dd.checked {
        background-color: #f0f4f9;
        .p-checkbox {
          display: block;
        }
      }
    }
    & .comImg {
      width: 12px;
      height: 12px;
      vertical-align: bottom;
    }
  }
  #cc{
    padding-left: 20px;
  }
</style>

