<template>
  <section class="component-list" v-loading="loadingList">
    <section class="page-title" v-show="titleText">
      <Bread :fileCount="dataList.length" :searchName="searchName"/>
    </section>
    <Pulldown @refresh="getList"
              :totalPage="totalPage"
              :currentPage="currentPage"
              :refreshing="refreshing"
              :clearDone="clearDone"
              ref="pulldown"
              v-if="dataList.length > 0 || createFolderFlag"
    >
      <dl
        class="list-content" v-if="styleFlag"
      >
        <dt>
          <section id="cc" @click="changSort('2')" style="cursor:pointer; padding-left:20px;">
            <p class="p-checkbox"><input type="checkbox" :value="checked" v-model="checked" @click.stop="''" @change="selectAll"><i></i></p>
            <span>{{tableHead.name}}
              <i v-if="sorts=='2'" :class="['icon',rank=='1' ? 'icon-sortup':'icon-sortdown']"></i>
            </span>
            <b v-if="selectData.length>0" style="font-weight:normal">已选择{{selectData.length}}文件</b>
          </section>
          <span id="span" @click="changSort('3')">{{tableHead.time}}<i v-if="sorts=='3'"
                                                                       :class="['icon',rank=='1' ? 'icon-sortup':'icon-sortdown']"></i></span>
          <span @click="changSort('1')">{{tableHead.outTime}}<i v-if="sorts=='1'"
                                                                :class="['icon',rank=='1' ? 'icon-sortup':'icon-sortdown']"></i></span>
        </dt>
        <dd v-show="createFolderFlag">
          <section class="filename-container">
            <p class="p-checkbox"><input type="checkbox" disabled><i></i></p>
            <section class="filename-box">
              <i class="img-size icon icon-folder"></i>
              <section>
                <p class="newfolder">
                  <input type="text" v-model="newFolderName" class="new" ref="createBox" @keyup.enter="createFolder(newFolderName)"  />
                  <i class="icon icon-submit" @click.stop="createFolder(newFolderName)"></i>
                  <i class="icon icon-cancel" @click.stop="cancelFolder()"></i>
                </p>
              </section>
            </section>
          </section>
        </dd>
        <dd v-for="(item,key) of dataList" :key="key"  @click="checkTag(item,key)">
          <section class="filename-container" @dblclick.capture="godetail(item)">
             <p class="p-checkbox">
               <input type="checkbox" :value="item" v-model="selectData" :disabled="item.disabled"
                      @change="change(item)" @click.stop="'return'"><i></i>
             </p>
            <section class="filename-box">
              <i class="img-size icon"  v-addIcon="item.icon"></i>
              <section>
                <p v-if="item.rename" class="newfolder">
                  <input class="rename" ref="rename" type="text"
                          @keyup.enter="submit(item)"
                         :value="item.fileType == 1 ? item.name : filterName(item.name)"/>
                  <i class="icon icon-submit" @click.stop="submit(item)"></i>
                  <i class="icon icon-cancel" @click.stop="cancel(item)"></i>
                </p>
                <p v-else class="text-overflow">
                  <a href="javascript:;" class="text-overflow" v-if="item.fileType=='1'"
                     @click.stop="godetail(item)"   v-maxLength = "item.name"></a>
                  <a href="javascript:;" class="text-overflow" v-else-if="item.fileType=='4'"
                     @click="playUrl(item)" v-maxLength = "item.name"></a>
                  <a href="javascript:;" class="text-overflow" v-else-if="item.fileType == '2'" v-maxLength = "item.name"></a>
                  <span class="text-overflow"  v-else v-maxLength = "item.name"></span>
                  <img :src="(item.previewPath &&item.previewPath.code=='100001')? item.previewPath.jpg : require('../assets/images/image.png')"
                       class="img-size one listPic"
                       preview="1"
                       :preview-text="item.name"
                       :title = "item.name"
                       v-if=" item.fileType == '2'"
                  >
                </p>
              </section>
            </section>
            <nav class="iconCom" v-show="selectData.length<2">
              <a href="javascript:;" title="分享" class="icon icon-share" @click.prevent="shareShow(item)"></a>
              <a href="javascript:;" @click.prevent="createDownUrl([item])" title="下载" class="icon icon-download"></a>
              <section class="more-expland">
                  <a href="javascript:;" title="更多" class="icon icon-more"></a>
                  <nav>
                    <a href="javascript:;" title="移动" @click.prevent="moveOrCopy(item,1)">移动</a>
                    <a href="javascript:;" title="复制" @click.prevent="moveOrCopy(item,2)">复制</a>
                    <a href="javascript:;" title="删除"  @click.prevent="deleteData(item,key)">删除</a>
                    <a href="javascript:;" title="重命名" @click.prevent="renameData(item,key)">重命名</a>
                  </nav>
              </section>
            </nav>
          </section>
          <span class="type">{{item.fileType == 1 ? '-' : sizeFormat(item.fileSize)}}</span>
          <span class="type" >{{dataFormat(item.updateTime)}}</span>
        </dd>
      </dl>
      <dl class="card-content" v-else>
        <dt>
          <p class="p-checkbox"><input type="checkbox" :value="checked" v-model="checked" @click.stop="''" @change="selectAll"><i></i></p>
          <p>全选</p>
          <p v-show="selectData.length>0">已选择{{selectData.length}}个文件</p>
        </dt>
        <dd v-show="createFolderFlag">
          <i class="img-size icon icon-folder"></i>
          <section class="filename-box">
            <p class="newfolder ww">
              <input type="text" v-model.trim="newFolderName"  ref="createBox" @keyup.enter="createFolder(newFolderName)"  />
              <i class="icon icon-submit" @click.stop="createFolder(newFolderName)"></i>
              <i class="icon icon-cancel" @click.stop="cancelFolder()"></i>
            </p>
          </section>
        </dd>
        <dd v-for="(item,key) of dataList" :key="key" @click="checkTag(item,key)"  :class="{'checked':item.checked}">
          <div class="imgBox" v-if="item.fileType =='2'">
            <img :src="(item.previewPath && item.previewPath.code == '100001')? item.previewPath.jpg : require('../assets/images/image.png')"
                 class="img-size one listPic" preview="1" :preview-text="item.name">
          </div>
          <div class="img-size" v-else>
            <i v-if="item.fileType =='1'" class="img-size icon"  v-addIcon="item.icon" @click.stop="godetail(item)"></i>
            <i v-else-if="item.fileType =='4'" class="img-size icon"  v-addIcon="item.icon"  @click.stop="playUrl(item)" ></i>
            <i v-else class="img-size icon"  v-addIcon="item.icon"  ></i>
          </div>
          <section class="filename-box">
            <p v-if="item.rename" class="newfolder">
              <input class="rename" ref="rename" type="text"  @keyup.enter="submit(item)"
                     :value="item.fileType == 1 ? item.name : filterName(item.name)"/>
              <i class="icon icon-submit" @click.stop="submit(item)"></i>
              <i class="icon icon-cancel" @click.stop="cancel(item)"></i>
            </p>
            <p v-else class="text-overflow">
              <a href="javascript:;" v-if="item.fileType =='1'" @click.stop="godetail(item)" v-maxLength = "item.name"></a>
              <a href="javascript:;" v-else-if="item.fileType =='4'" @click.stop="playUrl(item)" v-maxLength = "item.name"></a>
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
    <Nodata v-if="Nodatashow"  :flg="text" />
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
    //创建文件夹
    // createFolderFlag: {
    //   type: Boolean,
    //   default: false
    // },
    renameFlag: {
      type: Boolean,
      default: false
    },
    reload: {
      type: Number
    },
    page: {
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
    data: {
      type: Array
    },
    styleFlag: {
      type: Boolean,
      default: sessionStorage.getItem("styleFlag") == "false" ? false : true
    },
    //标题全部文件显示
    titleText: {
      type: Boolean,
      default: true
    },
    //table 头部文字
    tableHead: {
      type: Object,
      default: function() {
        return { name: "文件名", time: "大小", outTime: "时间" };
      }
    },
    //搜索
    searchName: {
      type: String
    }
  },
  data() {
    return {
      tagUrl: "",
      loadingList: false,
      checked: false, //全选
      dataList: [],
      selectData: [], //选择的数据
      newFolderName: "新建文件夹",
      currentPage: 1,
      refreshing: false,
      totalPage: 1,
      // showNodata:false,
      rank: "1",
      sorts: "2",
      Nodatashow: false,
      renameDate:null,
      createFolderFlag:false,
      text:false,
      clearDone:true
    };
  },
  watch: {
    // renameFlag(newval) {
    //   if (newval) {
    //     if(!this.renameDate){
    //       this.renameDate = this.selectData[0];
    //     }
    //     this.renameDate.rename = true;
    //     this.renameDate.disabled = true;
    //     // this.dataList = this.dataList.map(item => {
    //     //   if (item.id === this.selectData[0].id) {
    //     //     item.rename = true;
    //     //     item.disabled = true;
    //     //   }
    //     //   return item;
    //     // });
    //     // console.log( this.selectData );
    //   } else {
    //     //取消重命名
    //     if(!this.renameDate){
    //       this.renameDate = this.selectData[0];
    //     }
    //     this.renameDate.rename = false;
    //     this.renameDate.disabled = false;
    //     this.renameDate = null;
    //     // this.dataList = this.dataList.map(item => {
    //     //   if (item.id === this.selectData[0].id) {
    //     //     item.rename = false;
    //     //     item.disabled = false;
    //     //   }
    //     //   return item;
    //     // });
    //   }
    // },
    reload(val) {
      this.getList(1);
    },
    sort(newval, oldval) {
      this.$refs.pulldown && this.$refs.pulldown.top();
      this.sorts = newval.sort;
      this.rank = newval.rank;
      this.getList(1);
    },
    // checked(newval, oldval){
    //   if(newval) {
    //     this.selectData = this.dataList.map(item => item);
    //   }
    //   this.$emit("getSelectData", this.selectData);
    // }
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
      this.cancel();
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
              //处理搜索结果无内容  提示文本
              if(quertData.name!= ''){
                this.text = true
              }
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
      this.sorts = sort;
      this.rank = this.rank == "1" ? "2" : "1";
      this.checked = false;
      this.selectData = [];
      this.getList(1);
    },
    //跳转到详情页
    godetail(item) {
      if(item.fileType != 1 || this.renameDate){
        return
      }
      this.text = false
      let path = this.$route.query.path ? this.$route.query.path : "";
      path = path.split("|");
      path.push(JSON.stringify({ id: item.id, filename: item.name }));
      path = path.join("|");
      this.$router.push({
        path: "/folderdetail",
        query: { id: item.id, filename: item.name, path }
      });
    },
    playUrl(item) {
      this.$router.push({ path: "/player", query: { id: item.id } });
    },
    selectAll(e) {
      // this.checked = e.target.value;
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
    //修改文件名称的确定、和取消事件
    cancel(item) {
      if(this.renameDate){
        this.renameDate.rename = false;
        this.renameDate.disabled = false;
        this.renameDate = null;
        this.$emit('update:renameFlag',false);
      }
      // this.$emit("rename");
      //图片预览，重载
      this.$previewRefresh();
    },
    submit(item) {
      // const fileName =item.name.value.replace(/\s/gi,'');
      // this.renameDate = item;
      
      let replaceName = this.$refs.rename[0].value;
      const reg = Reg.filename;
      if (!replaceName || reg.test(replaceName)) {
        this.$message({
          type: "warning",
          message: "文件夹名格式错误"
        });
        return;
      } else if( replaceName.length > 100){
        this.$message({
          type: "warning",
          message: "文件名不能多于100字符"
        });
        return;
      }
      else{
        if( item.fileType != '1' ){
          if(item.name.lastIndexOf(".")==-1){
            replaceName = this.$refs.rename[0].value
          }else {
            replaceName = replaceName + item.name.slice(item.name.lastIndexOf("."), item.name.length)
          }

        }
      }
      this.cancel();
      if(replaceName === item.name) return ;
      const params = {
        name: replaceName,
        id: item.id
      };
      this.$http({
        url: "/api/files/rename_file",
        method: "post",
        data: params
      }).then(res => {
        if (res.data.code === 100001) {
          item.name = res.data.data.name;
          // this.getList();
          //图片预览，重载
          this.$previewRefresh();
        }
      }).catch(err => console.log(err));
    },
    //创建文件夹的确定、和取消事件
    showCreateFolderBox(){
      if(this.createFolderFlag){
        const currentInput = this.$refs.createBox;
        const value = currentInput.value;
        currentInput.setSelectionRange(0,value.length)
        currentInput.focus();
        return ;
      }
      this.createFolderFlag = true;
      this.$nextTick(()=>{
        const currentInput = this.$refs.createBox;
        const value = currentInput.value;
        currentInput.setSelectionRange(0,value.length)
        currentInput.focus();
      })

    },
    cancelFolder(item) {
      this.createFolderFlag = false;
      this.newFolderName = "新建文件夹";
      // this.$emit("getListStatus", this.dataList);
    },
    createFolder(name) {
      const reg = Reg.filename;
      if (!name || reg.test(name)) {
        this.$message({
          type: "warning",
          message: "文件夹名格式错误"
        });
        return false;
      } else if( name.length > 100){
        this.$message({
          type: "warning",
          message: "文件名不能多于100字符"
        });
        return;
      }
      this.newFolder(name);
      this.cancelFolder();
      // this.createFolderFlag = false;
    },
    newFolder(name) {
      this.loadingList = true;
      const params = {
        name: name,
        parentId: this.$route.query.id ? this.$route.query.id : "-1"
      };
      this.$http({
        url: "/api/files/create_folder",
        method: "post",
        data: params
      })
        .then(res => {
          this.loadingList = false;
          if (res.data.code === 100001) {
            const newObj = Object.assign({},res.data.data,{rename:false,disabled:false})
            this.dataList.unshift(newObj);
            // this.selectData = [];
            this.Nodatashow = false;
            // this.getList();
            this.isCheckAll();
          }
        })
        .catch(err => {
          this.loadingList = false;
          console.log(err);
        });
      // this.createFolderFlag =  false
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
            // 点击分享列表判断单文件还是多文件
            if(res.data.data.files.dataList.length==1&&res.data.data.files.dataList[0].fileType!=1){
             //单文件
               this.$router.push({path:'/shareDetail',
                query: {
                  ids: item.fileIds[0],
                  id: url,
                  type: res.data.data.files.dataList[0].fileType,
                  sid: item.id,
                  size: res.data.data.files.dataList[0].fileSize
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
      if (item.filesDeleted == true) {
        return;
      }
      this.judgeNum(item, index);
    },
    renameData(item,index){
      if( this.renameDate ){
        const currentInput = this.$refs.rename[0];
        const value = currentInput.value;
        currentInput.setSelectionRange(0,value.length)
        currentInput.focus();
        return ;
      }
      if(!item){
        this.renameDate = this.selectData[0];
      }else{
        // ydh
        this.dataList.forEach((v,i)=>{
          if(index == i){
            item.checked = true
          }else {
            this.dataList[i].checked = false
          }
        })
       //
        this.renameDate = item;
        this.selectData = [item]
        this.$emit("getSelectData", this.selectData);
      }
      this.renameDate.rename = true;
      this.renameDate.disabled = true;
      this.$emit('update:renameFlag',true);

      this.$nextTick(()=>{
        const currentInput = this.$refs.rename[0];
        const value = currentInput.value;
        currentInput.setSelectionRange(0,value.length)
        currentInput.focus();
      })
    },
    moveOrCopy(item,action){
      if(this.renameDate){
        return ;
      }
      this.$emit('moveOrCopy',item,action)
    },
    deleteData(item,key){
      if(this.renameDate){
        return ;
      }
      const h = '<div>确认要把所选文件放入回收站吗？</div><div>删除的文件可以在十天内通过回收站还原</div>'
      this.$confirm(h, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true
      }).then(() => {
        this.cancel();
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
      if(this.renameDate){return}
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
    // this.data ? (this.dataList = this.data) : this.getList(this.params);
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
      /*background-size:10px;*/
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
      width: 170px;
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
              width: 260px;
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

.shareName {
  display: inline !important;
}

.shareName.del {
  color: #acb4bb !important;
}
</style>

