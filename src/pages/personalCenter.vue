<template>
    <section class="page-personalCenter ">
      <myTitle title="账号设置"></myTitle>
      <inforAside ></inforAside>
      <section class="right-content">
        <el-button class="comBtn" @click="toBack">返回上一级</el-button>
        <h3>登录历史</h3>
        <p>以下为您最近登录记录，若存在异常情况，请在核实后尽快 <router-link tag="span" to="/changePsw">修改密码</router-link></p>
        <div class="table">
          <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
              prop="created_at"
              label="日期"
              width="200">
              <template slot-scope="scope">
                {{dataFormat(scope.row.createTime)}}
              </template>
            </el-table-column>
            <el-table-column
              prop="loginIp"
              label="IP"
             >
            </el-table-column>
            <el-table-column
              prop="webBrowser"
              label="浏览器">
            </el-table-column>
            <el-table-column
              label="登录方式"
               prop="type"
            >
              <template slot-scope="scope">
               <span v-if="scope.row.type ==1">掌云ID</span>
               <span v-else>手机号</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="devcie"
              label="设备">
              <template slot-scope="scope">
                <span v-if="scope.row.device ==1">web</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="tableBottom">
            <div id="pagination">
              <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-size="10"
                layout="total, prev, pager, next"
                :total="total"
                :current-page.sync="currentPage"
              >
              </el-pagination>
            </div>
            <!--<p @click="allList">查看所有</p>-->
            <p></p>
          </div>
        </div>
        <footer></footer>
      </section>
    </section>
</template>

<script>
  import myTitle from '@/components/title';
  import inforAside from '@/components/inforAside';
    export default {
        name: "personalCenter",
      components:{
        myTitle,inforAside
      },
      data() {
        return {
          postData: {
            token: ''
          },
          tableData: [],
          total:10,
          currentPage:1,
        }
      },
      methods:{
        getList(e,y){
          this.$http({
            url:'/api/member/log',
            method:'post',
            data:{
              perpage:y?1000000:10,
              page:e ? e:1
            }
            }).then((res)=>{
              this.tableData = res.data.data.dataList
              this.total = Number(res.data.data.totalRowsCount)
          })
            .catch((err)=>{
              console.log(err)
            })
        },
        allList(){
          this.getList(1,1)
        },
        handleSizeChange(val) {
          this.getList(val)
        },
        handleCurrentChange(val) {
          this.getList(val)
        },
        toBack() {
          this.$router.push({path: '/all'})
        },
      },
      created(){
        this.getList()
      }
    }
</script>
<style lang="scss" scoped>
  .page-personalCenter {
    width: 100%;
    height: calc(100vh);
    background-color: #fff;
    font-size: 0;
    overflow:hidden;
    & .aside-menu {
      position: relative;
      width: 278px;
      height:100%;
      display: inline-block;
      vertical-align: top;
      font-size: 14px;
      background-color:#e9edf3;
      position:relative;left:0; top:0;
      & dt{
        position: relative;
      }
      & .upload-img{
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 0;
        opacity: 0;
        cursor: pointer;
      }
     &  #changePic{
        cursor: pointer;
        height: 23px;
       width: 100%;
        background-color: #ffffff;
        border-radius: 12px;
        line-height: 23px;
        text-align: center;
        color: #5cbbf4;
        font-size: 14px;
      }
      & > dl{
        padding-top:10px;
        &>dt{
          margin-top: 40px;
          margin-bottom: 20px;
          position: relative;
        }
        &>dt,
        &>dd{
          line-height: 1;
        }
        &>dd{
          border-bottom: 1px solid #fff;
        }
        &>dd.dd{
          border-top: 1px solid #fff;
        }
        &>dt:hover,
        &>dd:hover{
          background-color: #e9edf3;
        }
        & > dt > p,
        & > dd > p{
          display:block; width:100%; height:45px; line-height:45px; overflow:hidden;box-sizing:border-box;padding-left: 24px;
          &.p{
            cursor: pointer;
          }
          &>.text-overflow{
            width: 140px;
          }
          &>i{
            display: inline-block;
            width: 16px;
            height: 24px;
            background-size: 100%;
            vertical-align: top;
            margin-top: 10px;
            margin-right: 10px;
            &.phone{
              background: url("../assets/images/personaldata_sidenav_icons_phone.png") no-repeat center;
            }
            &.psw{
              background: url("../assets/images/personaldata_sidenav_icons_lock.png") no-repeat center;
            }
            &.cloudId{
              width: 26px;
              margin-left: -5px;
              margin-right: 6px;
              background: url("../assets/images/iconcloudID.png") no-repeat center;
            }
        }
          &>i.changeIcon{
            display: inline-block;
            width: 16px;
            height: 15px;
            background: url("../assets/images/bianji.png") center no-repeat;
            cursor: pointer;
            margin-top: 14px;
            margin-left: 16px;
          }
        }
        & > dt > p{
          padding-left:8px;
        }
      }
    }
    & .right-content {
      display: inline-block;
      vertical-align: top;
      width: calc(100vw - 278px);
      font-size: 14px;
      position: absolute;
      top: 62px;
      padding:0 46px;
      &>.comBtn{
        margin-top: 26px;
      }
      &>h3{
        font-size: 20px;
        color: #5a5a5a;
        margin-top: 45px;
      }
      &>p{
        color: #acb4bb;
        font-size: 12px;
        margin: 10px 0;
        &>span{
          font-size: 12px;
          color: #5cbbf4;
          cursor: pointer;
        }
      }
      &> .table  .tableBottom{
        background: #e9edf3;
        text-align: center;
        &>#pagination{
          display: inline-block;
          padding: 10px;
        }
        & >p{
          display: block;
          float: right;
          margin-top: 18px;
          color: #5cbbf4;
          padding-right: 20px;
          text-align: right;
          font-size: 14px;
          cursor: pointer;
        }
      }
    }
  }
  .router-link-active{
    color: #54b2eb!important;
    background-color: #e9edf3;
  }
  footer{
    font-size: 12px;
    color:#5cbbf4;
    width: 100%;
    text-align: center;
    position: fixed;
    bottom: 10px;
    left: 0;
    padding-left: 278px;
  }
</style>
