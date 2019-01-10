<template>
  <section class="component-list listCard"  v-loading = "loadingList">
    <section class="page-title" v-show="titleText">
      <Bread :fileCount="dataList.length"/>
    </section>
    <Pulldown @refresh="getList"
              :totalPage="totalPage"
              :currentPage="currentPage"
              :refreshing="refreshing"
              :clearDone="clearDone"
              ref="pulldown"
              v-if="dataList.length > 0 || true"
    >
      <ul class="card-content clearfix" ref="ul">
        <li class="first"  @click="addPic"><i></i><i></i></li>
        <li v-show="createFolderFlag">
          <img src="http://120.79.193.155:8005/img/cover.png" class="img-size" />
          <section class="filename-box">
            <p class="newfolder">
              <input type="text" v-model= "newFolderName" id="newInput" ref="createBox" @keyup.enter="createFolder(newFolderName)" />
              <i class="icon icon-submit" @click.stop="createFolder(newFolderName)"></i>
              <i class="icon icon-cancel"  @click.stop="cancelFolder() "></i>
            </p>
          </section>
        </li>
        <li @click="toAll">
          <img src="http://120.79.193.155:8005/img/cover.png" class="img-size" />
          <section class="filename-box">
            <p class="newfolder">
              <span id="span">全部</span>
            </p>
          </section>
        </li>
        <li v-for="(item,key) of dataList" :key="key"  :class="{'checked':item.checked}"  @click.stop="godetail(item)" >
          <img src="http://120.79.193.155:8005/img/cover.png" class="img-size" >
          <section class="filename-box">
            <p v-if="item.rename" class="newfolder">
              <input class="rename" ref="rename" type="text" :value="item.name"
                     v-focus
                     @focus="focusing"
                     @keyup.enter="submit(item)"/>
              <i class="icon icon-submit" @click.stop="submit(item)"></i>
              <i class="icon icon-cancel" @click.stop="cancel()"></i>
            </p>
            <p v-else>
              <span   v-maxLength = "item.name"></span>
            </p>
          </section>
          <p class="p-checkbox">
            <input type="checkbox" :value="item" :disabled="item.disabled" v-model="selectData" @click.stop="''" @change="change(item)"><i></i>
          </p>
        </li>
      </ul>
    </Pulldown>
  </section>
</template>
<script>
  import Pulldown from '@/components/pulldown';
  import Nodata from '@/components/nodata';
  import Bread from '@/components/bread';
  import Reg from '../util/reg'
  import b from '../util/newVue'
  export default {
    name: "List",
    components: {Pulldown,Nodata,Bread},
    props: {
      renameFlag: {
        type: Boolean,
        default: false
      },
      reload: {
        type: Number
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
      data: {
        type: Array
      },
      styleFlag:{
        type:Boolean,
        default:true,
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
          return {name:'文件名', time:'大小', outTime:'时间'}
        }
      }
    },
    data() {
      return {
        createFolderFlag:false,
        loadingList: false,
        checked: false, //全选
        dataList: [],
        selectData: [], //选择的数据
        newFolderName: "",
        styleType:"card",
        currentPage:1,
        refreshing:false,
        totalPage:1,
        dataList:[],
        renameDate:null,
        clearDone:true
      };
    },
    watch: {
      reload(val) {
        this.getList(1);
      },
      sort(newval,oldval){
        this.$refs.pulldown && this.$refs.pulldown.top();
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
        sessionStorage.setItem('picFlag',false)
        let quertData = {
          ...this.sort,
          perpage:100,
          page:this.currentPage,
        };
        this.$http({
          url: "api/img/index",
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
                this.dataList = res.data.data.dataList;
                this.clearDone=false
              } else {
                this.dataList.push(...res.data.data.dataList);
              }
              this.isCheckAll();
              this.totalPage = Number.parseInt(res.data.data.totalPageCount);
              // //图片预览，重载
              // this.$previewRefresh();
              // //无数据时显示login提示
              // if (res.data.data.dataList.length == 0) {
              //   this.Nodatashow = true;
              // }else {
              //   this.Nodatashow = false;
              // }
            }
          })
          .catch(err => {
            this.loadingList = false;
            console.log(err);
          });
      },
      change(data) {
        if(this.renameDate){
          return false;
        }
        if (this.selectData.length === this.dataList.length) {
          this.checked = true;
        } else {
          this.checked = false;
        }
        data.checked = !data.checked;
        this.$emit("getSelectData", this.selectData);
      },
      //全部跳转
      toAll(){
        if(this.renameDate){
          return
        }
        sessionStorage.setItem('styleFlag',false)
        this.$emit('toAll')
      },
      //跳转到详情页
      godetail(item){
        if(this.renameDate){
          return
        }
        sessionStorage.setItem('styleFlag',false)
        let path = this.$route.query.path ? this.$route.query.path:'';
        path = path.split('|');
        path.push(JSON.stringify({id:item.id,filename:item.name}))
        path = path.join('|');
        this.$router.push({
          path:'/imgdetail',
          query:{id:item.id,filename:item.name,path}
        })
      },
      selectAll() {
        if (!this.checked) {
          this.selectData = this.dataList.map(item => item);
        } else {
          this.selectData = [];
        }
        this.$emit("getSelectData", this.selectData);
      },
      //修改文件名称取消事件
      cancel() {
        if(this.renameDate){
          this.renameDate.rename = false;
          this.renameDate.disabled = false;
          this.renameDate = null;
          this.$emit('update:renameFlag',false);
        }
      },
      //修改文件名称确定事件
      submit(item) {
        this.renameDate = item;
        const name =this.$refs.rename[0].value
        const reg = Reg.filename;
        const fileName = this.$refs.rename[0].value.replace(/\s/gi, "");
        if (!fileName) {
          this.$message({
            type: "warning",
            message: "文件名不能为空"
          });
          return;
        }
        if (!name || reg.test(name)) {
          this.$message({
            type: "warning",
            message: "文件夹名格式错误"
          });
          return ;
        }
        if(name == '全部'){
          this.$message({
            type: "warning",
            message: "文件夹名已存在"
          });
          return ;
        }
        this.cancel();
        if(name === item.name) return ;
        const params = {
          name:this.$refs.rename[0].value,
          groupId: item.id,
        };
        this.$http({
          url: "/api/img/update_group",
          method: "post",
          data: params
        })
          .then(res => {
            if (res.data.code === 100001) {
              this.$emit("getSelectData",[]);
              this.getList();
            }
          })
          .catch(err => console.log(err));
      },
      cancelFolder(item) {
        this.createFolderFlag = false;
      },
      createFolder(name) {
        const fileName = name.replace(/\s/gi, "");
        if (!fileName) {
          this.$message({
            type: "warning",
            message: "文件夹名称不能为空"
          });
          return false;
        }
        this.newFolder(name);
      },
      //新建确定
      newFolder(name) {
        const reg = Reg.filename;
        if (!name || reg.test(name)) {
          this.$message({
            type: "warning",
            message: "文件夹名格式错误"
          });
          return ;
        }
        if(name == '全部'){
          this.$message({
            type: "warning",
            message: "文件夹名已存在"
          });
          return ;
        }
        this.loadingList = true;
        const params = {
          name: name
        };
        this.$http({
          url:'./api/img/create_img_group',
          method: "post",
          data: params
        })
          .then(res => {
            this.loadingList = false
            if (res.data.code === 100001) {
              this.createFolderFlag = false;
              const newObj = Object.assign({},res.data.data,{rename:false,disabled:false})
              this.dataList.unshift(newObj);
              // this.Nodatashow = false;
              this.isCheckAll();
            }
          })
          .catch(err => console.log(err));
      },
      //新建分组文件夹
      addPic(){
        if(this.renameDate){
          return
        }
        this.selectData = []
        this.$emit('getSelectData',[])
        this.newFolderName =''
        this.createFolderFlag = true
        this.$nextTick(()=>{
          $('#newInput').focus()
        })
      },
      renameData(item){
        if( this.renameDate ){
          console.log(this.$refs);
          const currentInput = this.$refs.rename[0];
          const value = currentInput.value;
          currentInput.setSelectionRange(0,value.length)
          currentInput.focus();
          return ;
        }
        if(!item){
          this.renameDate = this.selectData[0];
        }else{
          this.renameDate = item;
          this.selectData = [item]
          this.$emit("getSelectData", this.selectData);
        }
        this.renameDate.rename = true;
        this.renameDate.disabled = true;
        this.$emit('update:renameFlag',true);
      },
      focusing(event){
        event.currentTarget.select();
      }
    },
    created() {
      this.getList();
    },
    destroyed(){
      sessionStorage.removeItem('picFlag')
    }
  };
</script>
<style lang="scss" scoped>
  .component-list {
    &.listCard   .component-pulldown{
      margin-top: 10px;
    }
    width: 100%;overflow:auto;
    .page-title{
      width:100%; line-height:34px; color:#333; position:relative; left:0; top:0; padding:0 20px;background-color:#f5f5f5;
      & > span{ position:absolute; right:20px; top:0; }
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
        background: url(~@/assets/images/tips_password_icon_right1.png) center
        center no-repeat;
        /*background-size: 10px;*/
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
        height: 22px;
        width: 22px;
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

    & .card-content{
      width:100%; padding:10px 20px; font-size:0;
      & > li{
        & .img-size{display: block;
          width: 95px;
          height: 67px;
          position: absolute;
          left: 50%;
          top: 50%;
          margin-left: -48px;
          margin-top: -34px;}
        & .filename-box{
          position: absolute;
          left: 0;
          width: 100%;
          bottom: -35px;
          margin-top: 15px;
          & > p {
            width: 100%; text-align:center;width:100%; line-height:26px; height:26px;
            & > a,
            & > span {
              display: block;
              width: 100%;
              font-size: 14px;
              @extend .text-overflow;
            }
            & > a:hover {
              color: #54b2eb;
            }
          }
        }
        & .p-checkbox{position:absolute; top:13px; right:13px; display:none;}
        & .newfolder{
          position:relative;font-size:0;
          & > input{width:130px; font-size:14px;}
          & > #span{width:130px; font-size:14px;display: inline-block}
          & > i.icon {
            height: 18px;
            width: 18px;
          }

        }
      }
      &> li {
        position: relative;
        cursor: pointer;
        float: left;
        margin-right: 50px;
        margin-bottom: 44px;
        width: 215px;
        height: 145px;
        display: inline-block;
        background-color: #ffffff;
        box-shadow: 0px 0px 10px 0px rgba(32, 89, 148, 0.08);
        border-radius: 5px;
        border: solid 1px #e0e7ed;
        & > i:first-child {
          width: 45px;
          height: 6px;
          background: #5cbbf4;
          position: absolute;
          top: 50%;
          left: 50%;
          margin-left: -23px;
          margin-top: -3px;
          border-radius: 2px;
          display: inline-block;

        }
        & > i:last-child {
          width: 6px;
          height: 45px;
          background: #5cbbf4;
          position: absolute;
          top: 50%;
          left: 50%;
          margin-left: -3px;
          margin-top: -23px;
          border-radius: 2px;
          display: inline-block;
        }
      }
      & > li:hover{ background-color:#F0F4F9; }
      & > li:hover .p-checkbox{ display:block;}
      & > li.checked{background-color:#F0F4F9;
        .p-checkbox{ display:block;}
      }
    }
    &  .comImg{
      width: 12px;
      height: 12px;
      vertical-align: bottom;
    }
  }
</style>

