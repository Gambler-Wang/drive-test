<template>
  <section class="component-bread">
    <section v-if="$route.query.path">
      <el-row>
        <el-col :span="19">
          <a href="javascript:;" v-if="$route.name != 'imgdetail'" @click="goback">返回上一级 |</a>
          <!--图片分组-->
          <a href="javascript:;" v-else @click="toback">返回上一级 |</a>
          <a href="javascript:;" v-show="$route.name != 'imgdetail'" @click="breadAll($route.name)">{{title}} |</a>
          <!--<router-link to="/all" tag="a" @click="breadAll('1')">00全部文件</router-link>-->
          <ul id="breadBox">
            <li v-for="(item,key) of routes" :key="key" :style="{'max-width':maxwidth }">
              <span v-if="key==(routes.length-1) || $route.name == 'search'" @click="godetail(item,key)">{{item.filename}}</span>
              <a href="javascript:;" @click="godetail(item,key)" v-else>{{item.filename}}</a>
            </li>
            <li class="text-overflow" v-if="$route.name == 'search'">| 搜索："{{searchName}}"</li>
          </ul>
        </el-col>
        <el-col :span="5">
          <p style="text-align:right">已加载全部，共{{fileCount}}个</p>
        </el-col>
      </el-row>
    </section>
    <section v-else>
      <el-row :gutter="20">
        <el-col :span="19">
          <!--<router-link to="/all">全部文件</router-link>-->
          <span @click="breadAll($route.query.fileType)" :class="{bgc:$route.name =='search'}">{{title}}</span>
          <p class="searchname" v-if="searchName">| 搜索："{{searchName}}"</p>
        </el-col>
        <el-col :span="5">
          <p style="text-align:right">已加载全部，共{{fileCount}}个</p>
        </el-col>
      </el-row>
    </section>
  </section>
</template>
<script>
  import b from '../util/newVue'

  export default {
    name: 'Bread',
    props: {
      fileCount: {
        type: Number
      },
      searchName: String,
    },
    data() {
      return {
        routes: [],
        maxwidth: '10%',
        flg: false,
        title: '',
        tag:''
      }
    },
    watch: {
      $route(newval, oldval) {
        this.pathFormat();
      }
    },
    mounted() {
      this.pathFormat();
    },
    methods: {
      goback() {
        if (window.history.length > 0) {
          this.$router.go(-1)
        }
      },
      toback() {
        sessionStorage.setItem('picFlag', false)
        this.$router.push({path: '/image'})
      },
      pathFormat() {
        if (this.$route.query.path) {
          const path = this.$route.query.path.split('|');
          this.routes = path.filter(item => item).map(item => JSON.parse(item));
          if(this.$route.name=='search'){
            this.maxwidth = `${Number.parseInt(100 / (this.routes.length+1))}%`;
            return
          }
          this.maxwidth = `${Number.parseInt(100 / this.routes.length)}%`;
        }
      },
      godetail(item, key) {
        if (this.$router.currentRoute.name == 'imgdetail') {
          return
        }
        // if(this.$route.query.tag){
        //   this.tag = '/imgdetail'
        // }else {
        //   this.tag = '/folderdetail'
        // }
          this.tag = '/folderdetail'
          let path = this.routes.slice(0, ++key);
          path = path.map(item => JSON.stringify(item));
          path = path.join('|');
          this.$router.push({
            path: this.tag,
            query: {id: item.id, path}
          })
      },
      breadAll(e) {
        // const tag =(this.$route.query.tag);
        if (!e) {
          return
        }
        switch (e) {
          case '1':
            this.$router.push({path: '/all'})
            break;
          case '2':
            this.$router.push({path: '/image'})
            break;
          case '3':
            this.$router.push({path: '/doc'})
            break;
          case '4':
            this.$router.push({path: '/video'})
            break;
          case '5':
            this.$router.push({path: '/music'})
            break;
          case '6':
            this.$router.push({path: '/torrent'})
            break;
          case '7':
            this.$router.push({path: '/other'})
            break;
          default :
            // if(tag){
            //   sessionStorage.setItem('picFlag',false)
            //   this.$router.push({path: '/image'})
            // }else {
            //   this.$router.push({path: '/all'})
            // }
            this.$router.push({path: '/all'})
            break;
        }
      },
      breadName(a) {
        // const tag =this.$route.query.tag
        switch (a) {
          case 'all':
          case '1':
            this.title = '全部文件'
            break;
          case 'image':
          case '2':
            this.title = '全部图片'
            break;
          case 'doc':
          case '3':
            this.title = '全部文档'
            break;
          case 'video':
          case '4':
            this.title = '全部视频'
            break;
          case 'music':
          case '5':
            this.title = '全部音乐'
            break;
          case 'torrent':
          case '6':
            this.title = '全部种子'
            break;
          case 'other':
          case '7':
            this.title = '全部其他'
            break;
          default :
            // if(tag){
            //   this.title = '全部分组'
            // }else {
            //   this.title = '全部文件'
            // }
            this.title = '全部文件'
            break;
        }
      },
    },
    created() {
      if(this.$route.name=='search'){
        this.breadName(this.$route.query.fileType)
      }else {
        this.breadName(this.$route.name)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .component-bread {
    width: 100%;
    padding: 0;
    line-height: 34px;
    & .searchname {
      display: inline-block;
      vertical-align: top;
      font-size: 14px;
      max-width: 215px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    & .searchname.com {
      padding-left: 0
    }
    & a {
      display: inline-block;
      vertical-align: top;
      height: 34px;
      line-height: 34px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      color: #7DC7F5;
    }
    & .bgc{
      color: #7DC7F5;
      cursor: pointer;
    }
    ul {
      display: inline-block;
      vertical-align: top;
      font-size: 0;
      width: 76%;
      & > li {
        display: inline-block;
        vertical-align: top;
        font-size: 14px;
        position: relative;
        max-width: 215px;
        color: #7DC7F5;
        & a,
        & span {
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding: 0 0 0 10px;
        }
      }
      & > li:before {
        content: '>';
        display: block;
        color: #7DC7F5;
        position: absolute;
        left: 0;
        top: 0;

      }
      & > li.text-overflow {
        width: 160px;
        padding-left: 10px;
      }
      & > li:nth-last-child(1) {
        color: #3d3d3d;
      }
    }
  }
</style>

