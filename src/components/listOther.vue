<template>
  <section class="component-list" v-loading="loadingList">
    <section class="page-title">
      <Bread :fileCount="dataList.length"/>
    </section>
    <Pulldown @refresh="getList"
              :totalPage="totalPage"
              :currentPage="currentPage"
              :refreshing="refreshing"
              :clearDone="clearDone"
              ref="pulldown"
              v-if="dataList.length > 0">
      <dl
        class="list-content"
      >
        <dt>
          <!--<section id="cc" @click="changSort('2')" style="cursor:pointer; padding-left:20px;">-->
          <section id="cc"  style="cursor:pointer; padding-left:20px;">
            <p class="p-checkbox">
              <input type="checkbox" :value="checked" v-model="checked" @click.stop="''" @change="selectAll"><i></i>
            </p>
            <span>{{tableHead.name}}
              <!--<i v-if="sorts=='2'&& iconShow =='2'" :class="['icon',rank=='1' ? 'icon-sortup':'icon-sortdown']"></i>-->
            </span>
            <!--取消分享-->
            <el-button v-show="iconShow == '2'  && selectData.length>0"
                       @click.stop="cancelShare(selectData)"
                       style="margin-left: 6px;padding:0 4px;height: 24px;border-radius: 3px;border: solid 1px #b4e3ff;color: #54b2eb;font-size: 12px"
            >
              <img src="../assets/images/icon1_share.png" alt="" class="comImg">
              取消分享
            </el-button>
            <!--回收站-->
            <el-button v-show="iconShow == '3'  && selectData.length>0"
                       @click.stop="recover(selectData)"
                       style="margin-left: 6px;padding:0 4px;height: 24px;border-radius: 3px;border: solid 1px #b4e3ff;color: #54b2eb;font-size: 12px"
            >
              <img src="../assets/images/icon3_reduction.png" alt="" class="comImg">
              还 原
            </el-button>
            <b v-if="selectData.length>0" style="font-weight:normal">已选择{{selectData.length}}文件</b>
          </section>
          <span id="span">{{tableHead.time}}
            <!--<i v-if="sorts=='3' && iconShow =='2'" :class="['icon',rank=='1' ? 'icon-sortup':'icon-sortdown']"></i>-->
          </span>
          <span >{{tableHead.outTime}}
            <!--<i v-if="sorts=='1'&& iconShow =='2'" :class="['icon',rank=='1' ? 'icon-sortup':'icon-sortdown']"></i>-->
          </span>
          <span v-if="$route.name == 'recovery'">{{tableHead.inTime}}</span>
        </dt>
        <dd v-for="(item,key) of dataList" :key="key"  @click="checkTag(item,key)">
          <section class="filename-container">
            <p class="p-checkbox">
              <input type="checkbox"
                     :value="item"
                     v-model="selectData"
                     :disabled="item.disabled"
                     @change="change(item)"
                     @click.stop="'return'"><i></i>
            </p>
            <section class="filename-box">
              <img src="../assets/images/myshare_icon_lock.png" title="分享链接" alt="" v-show="iconShow == '2'"
                   @click.stop='share(item,key)' style="padding: 4px;vertical-align: middle;cursor: pointer">
              <i class="img-size icon"  v-addIcon="item.icon"></i>
              <section>
                <p class="text-overflow" @click.stop="share(item,key)">
                  <!--文件名-->
                  <span class="text-overflow" v-if="$route.name == 'recovery'"  v-maxLength = "item.name"></span>
                  <a href="javascript:;" class="shareName"
                     :class='{del:item.filesDeleted}'
                     @click.stop="urlTo(item,key)"
                     v-maxLength = "item.filesDeleted ? '分享的文件已被删除': (item.termTime == '已过期'? '文件已过期':item.describe) "
                     v-if="$route.name == 'sharePage' "></a>
                </p>
              </section>
            </section>
            <nav class="iconCom" v-show="iconShow == '2' && selectData.length<2">
              <a href="javascript:;" title="取消分享" class="icon icon-noshare" @click="cancelShare(item,key)"></a>
            </nav>
            <nav class="iconCom" v-show="iconShow == '3' && selectData.length<2">
              <a href="javascript:;" title="还原" class="icon icon-recovery" @click="recover(item,key)"></a>
              <a href="javascript:;" title="删除" class="icon icon-delete" @click="deleting(item,key)"></a>
            </nav>
          </section>
          <span class="type" v-if="iconShow == '3'">{{item.fileType == 1 ? '-' : sizeFormat(item.fileSize)}}</span>
          <span class="type" v-else>{{item.fileType == 1 ? '-' : dataFormat(item.createTime)}}</span>
          <span class="type" v-if="iconShow == '2'">{{item.filesDeleted==true? '已失效':(item.termTime=='已过期'?'已失效':item.termTime)}}</span>
          <span class="type" v-else-if="iconShow == '3'">{{dataFormat(item.recycleTime)}}</span>
          <span class="type" v-if="iconShow == '3'"
          :class="{redClass:(item.effectiveTime/86400<=3)}"
          >{{(item.effectiveTime/86400<1) ? '不足1':Math.ceil(item.effectiveTime/86400)}}天</span>
          <div class="shareUrl" v-if="iconShow == '2'">
            <p>
              <span class="com">链接：</span>
              <a href="javaScript:void(0)" class="url dd" @click.stop="urlTo(item , key)">{{item.urlCode}}</a>
              <span class="com">提取密码:</span>
              <span class="url">{{item.code}}</span>
            </p>
            <input class="tag" type="text" :value="'链接: '+item.urlCode + ' 提取码:'+ item.code">
            <el-button class="copy" @click="copyUrl(item ,key)"><i class="icon"></i>复 制</el-button>
          </div>
        </dd>
      </dl>
    </Pulldown>
    <Nodata v-show="Nodatashow"/>
  </section>
</template>
<script>
  import Pulldown from "@/components/pulldown";
  import Nodata from "@/components/nodata";
  import Bread from "@/components/bread";
  import b from "../util/newVue";
  import Reg from '../util/reg';
  export default {
    name: "List",
    components: { Pulldown, Nodata, Bread },
    props: {
      //列表请求参数
      params: {
        type: Object,
        default: function() {
          return {};
        }
      },
      url: {
        type: String,
        default: "/api/files/index"
      },
      reload: {
        type: Number
      },
      sort: {
        type: Object,
        default: function() {
          return {
            sort: "2",
            rank: "1"
          };
        }
      },
      //分享iocn显示 //回收站iocn显示
      iconShow: {
        type: String,
        default: "1"
      },
      //table 头部文字
      tableHead: {
        type: Object,
        default: function() {
          return { name: "文件名", time: "大小", outTime: "时间" };
        }
      },
    },
    data() {
      return {
        loadingList: false,
        checked: false, //全选
        dataList: [],
        selectData: [], //选择的数据
        currentPage: 1,
        refreshing: false,
        totalPage: 1,
        // showNodata:false,
        rank: "1",
        sorts: "2",
        Nodatashow: false,
        clearDone:true
      };
    },
    watch: {
      reload(val) {
        this.getList(1);
      },
      sort(newval, oldval) {
        this.$refs.pulldown && this.$refs.pulldown.top();
        this.sorts = newval.sort;
        this.rank = newval.rank;
        this.getList(1);
      },
    },
    methods: {
      isCheckAll(){
        if( this.dataList.length > 0 && this.dataList.length === this.selectData.length){
          this.checked = true;
        }else {
          this.checked = false;
        }
      },
      getList(page){
        this.currentPage = page ? page : this.currentPage;
        this.loadingList = true;
        this.refreshing = true;
        let quertData = {
          ...this.params,
          sort: this.sorts,
          rank: this.rank,
          perpage: 100,
          page: this.currentPage
        };
        this.$http({
          url: this.url,
          method: "post",
          data: quertData
        })
          .then(res => {
            this.loadingList = false;
            if (res.data.code == 100001) {
              this.refreshing = false;
              let resultData = res.data.data.dataList
              resultData = resultData.map(item => {item.rename = false; item.disabled = false; return item; }) ;
              if (this.currentPage === 1) {
                this.selectData = [];
                this.$emit("getSelectData", this.selectData);
                this.dataList = res.data.data.dataList;
                this.clearDone=false
              } else {
                this.dataList.push(...res.data.data.dataList);
              }
              this.isCheckAll();
              // this.$emit("getListStatus", this.dataList);
              this.totalPage = Number.parseInt(res.data.data.totalPageCount);
              //图片预览，重载
              this.$previewRefresh();
              //无数据时显示login提示
              if (res.data.data.dataList.length == 0) {
                this.Nodatashow = true;
              }else {
                this.Nodatashow = false;
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
      changSort(sort) {
        if(this.$route.name =='recovery'){
          return
        }
        this.sorts = sort;
        this.rank = this.rank == "1" ? "2" : "1";
        this.checked = false;
        this.selectData = [];
        this.getList(1);
      },
      selectAll(e) {
        this.dataList.forEach((v,i)=>{
          v.checked = this.checked
        })
        if(this.checked === true) {
          this.selectData = this.dataList.map(item => item);
        } else {
          this.selectData = [];
        }
        this.$emit("getSelectData", this.selectData);
      },
      //点击图标显示分享链接
      share(v, i) {
        if (v.filesDeleted == true) {
          return;
        }
        $($(".shareUrl ")[i]).toggleClass("active");
        $($(".shareUrl ")[i])
          .parents("dd")
          .siblings("dd")
          .find(".shareUrl")
          .removeClass("active");
      },
      //图标取消分享
      cancelShare(data, i) {
        if(data.filesDeleted == false){
          $($(".shareUrl ")[i]).addClass("active");
          $($(".shareUrl ")[i])
            .parents("dd")
            .siblings("dd")
            .find(".shareUrl")
            .removeClass("active");
        }
        this.$emit("cancelShare", data);
      },
      //复制分享链接
      copyUrl(data, index) {
        document.querySelectorAll(".tag")[index].select();
        document.execCommand("copy"); // 执行浏览器复制命令
        this.$emit("copyUrl", data);
      },
      shareShow(data) {
        this.$emit("shareShow", data);
      },
      //恢复
      recover(data) {
        this.$emit("recover", data);
      },
      //回收站删除
      deleting(data) {
        this.$emit("deleting", [data]);
      },
      judgeNum(item) {
        const url = item.urlCode.slice(
          item.urlCode.lastIndexOf("shareinit") + 10,
          item.urlCode.length
        );
        const params = {
          parentId: -1,
          sort: this.sorts,
          rank: this.rank,
          perpage: 100,
          page: this.currentPage
        };
        this.$http({
          url: "/api/files/shareIndex/" + url,
          method: "post",
          data: params
        })
          .then(res => {
            if (res.data.code === 100001) {
              localStorage.setItem('fileInfo',JSON.stringify(res.data.data.shareInfo));
              // 点击分享列表判断单文件还是多文件
              if(res.data.data.files.dataList.length==1&&res.data.data.files.dataList[0].fileType!=1){
                //单文件
                this.$router.push({path:'/shareDetail',
                  query: {
                    ids: item.fileIds[0],
                    id: url,
                    // type: res.data.data.files.dataList[0].fileType,
                    sid: item.id,
                    // size: res.data.data.files.dataList[0].fileSize
                  }
                })
              }else {
                // 多文件
                this.$router.push({path:'/share',query:{id:url}})
              }
            }
          })
          .catch(err => {
            console.log(err);
          });
      },
      //分享跳转,判断是不是分享者逻辑
      urlTo(item, index) {
        if (item.filesDeleted == true || item.isTimeOut == true) {
          this.$message({
            message:'该文件已失效',
              type: 'warning'
            })
          return;
        }
        this.judgeNum(item, index);
      },
      deleteData(item,key){
        const h = '<div>确认要把所选文件放入回收站吗？</div><div>删除的文件可以在十天内通过回收站还原</div>'
        this.$confirm(h, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true
        }).then(() => {
          this.$http({
            url:'/api/files/update_status',
            method:'post',
            data:{
              action:'1',
              ids:item.id,
            }
          }).then(res=>{
            if(res.data.code === 100001){
              this.$message({
                type:'success',
                message:'删除成功',
                duration:1000
              })

              this.dataList.splice(key,1);
              this.selectData.splice(0,1);
              //ydh 删除内存空间变化
              localStorage.setItem('usedSpace',res.data.data.usedSpace)
              b.$emit('size',res.data.data.usedSpace)
              // ------end------
            }
          }).catch(err=>console.log(err))
        }).catch(err=>console.log(err));
      },
      checkTag(item,index){
        this.share(item,index)
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
      this.getList();
    }
  };
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
      padding: 0 20px;
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
      & > .listPic {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%!important;
        height: 100%!important;
        opacity: 0;
      }
    }
    & .p-checkbox {
      @extend .inline-block;
      width: 16px;
      height: 16px;
      /*overflow: hidden;*/
      /*border: 1px solid #b5bfc8;*/
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
        background: url(~@/assets/images/tips_password_icon_right1.png) center
        center no-repeat;
      }
    }
    & .newfolder {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      & > input {
        border: none;
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
        /*padding: 10px 20px;*/
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
          width: 60%;
          position: relative;
          line-height: 26px;

          & > nav {
            position: absolute;
            top: 0;
            right: 10px;
            z-index:2;
            display: none;
            & .icon {
              display: inline-block;
              vertical-align: top;
              width: 26px;
              height: 26px;
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
          width: 20%;
          padding-left:10px;
          box-sizing:border-box;
          cursor: pointer;
        }
        &>span.redClass{
          color: red;
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
              /*position: relative;*/
              /*width: 50%;*/
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
              }
              & > p.newfolder {
                width: 240px;
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
        & > section,
        & > span{
          padding:10px 0; padding-left:10px;
        }
        & > section:hover,
        & > span:hover{
          background-color:#e9f0f5;
        }
      }
      // & > dd{ display:none;}
      // & > dd:nth-of-type(2){ display:block ; }
      & > dd{
        & .more-expland{
          display:inline-block; vertical-align:top;position:relative; left:0; top:0; padding-top:10px;height:46px;
          & > nav{ display:none; position: absolute; left:-30px;  top:38px; width:80px; background-color:#fff; border:1px solid #81D0FF; border-radius:3px;overflow:hidden;
            &> a{display: block; width:80px; line-height:30px; text-align:center; color:#81D0FF;}
            &> a:hover{
              background-color:#eaf7ff;color:#5cbbf4;
            }
          }
        }
        & .more-expland:hover{
          & > nav{ display:block;}
        }
      }
      & > dd:hover {
        background-color: #eaf7ff;
        & > section > nav {
          display: block;
          height: 98%;
          margin-top: 1px;
          background: #eaf7ff;
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
        padding: 20px 20px 10px;
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
          height: 130px;
          width: 122px;
          position: relative;
          height: 130px;
          overflow: hidden;
        }
        & .img-size {
          display: inline-block;
          border: none;
          height: 130px;
          width: 122px;
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
          height: 130px;
          width: 122px;
          border: none;
          display: inline-block;
        }
        & .filename-box {
          position: relative;
          left: 0;
          top: 0;
          margin-top: 10px;
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

  .shareName {
    display: inline !important;
  }

  .shareName.del {
    color: #acb4bb !important;
  }
</style>

