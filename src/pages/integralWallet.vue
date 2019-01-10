<template>
    <section class="page-integralWallet" v-show="isDataRes">
      <Tip ref="tip"/>
      <Title title="积分钱包" />
      <section class="main">
        <el-button class="comBtn" @click="toBack">返回上一级</el-button>
        <section class="content">
          <section class="integralChange">
            <h3>兑换中心</h3>
            <ul>
              <li v-if="walletChange.hyk.score!=''">
                <section class="prod-img-box">
                  <img src="../assets/images/hyk.png" />
                  <span class="w-color1">{{walletChange.hyk.name}}</span>
                </section>
                <section class="prod-des-box">
                  <h5>会员特权</h5>
                  <p>上传/下载加速<br>每日100个离线下载配额<br>回收站有效期增加至15日</p>
                  <span>注：有效期内不可重复兑换</span>
                </section>
                <section class="prod-change-box">
                  <!-- <el-button class="btns active">200积分兑换</el-button> -->
                  <button class="btns" @click="btnIntegralChangeGoods(walletChange.hyk)" :disabled="walletChange.hyk.disabled" :class="{disable:walletChange.hyk.disabled}">{{(walletChange.hyk.disabled)? walletChange.hyk.effectiveTime+'后到期' :walletChange.hyk.score+'积分兑换'}}</button>
                </section>
              </li>
              <li v-if="walletChange.jsk.score!=''">
                <section class="prod-img-box">
                  <img src="../assets/images/jsk.png" />
                  <span class="w-color2">{{walletChange.jsk.name}}</span>
                </section>
                <section class="prod-des-box">
                  <!-- <h5>会员特权</h5> -->
                  <p>加速期内<br>上传/下载不限速</p>
                  <span>注：有效期内不可重复兑换</span>
                </section>
                <section class="prod-change-box">
                  <!-- <el-button class="btns active">200积分兑换</el-button> -->
                  <button class="btns" @click="btnIntegralChangeGoods(walletChange.jsk)" :disabled="walletChange.jsk.disabled" :class="{disable:walletChange.jsk.disabled}">{{(walletChange.jsk.disabled)? walletChange.jsk.effectiveTime+'后到期' :walletChange.jsk.score+'积分兑换'}}</button>
                </section>
              </li>
              <li v-if="walletChange.lxxz.score!=''">
                <section class="prod-img-box">
                  <img src="../assets/images/lxxz.png" />
                  <span class="w-color3">{{walletChange.lxxz.name}}</span>
                </section>
                <section class="prod-des-box">
                  <!-- <h5>会员特权</h5> -->
                  <p>24小时内<br>增加100个离线下载配额</p>
                  <span>注：有效期内不可重复兑换</span>
                </section>
                <section class="prod-change-box">
                  <!-- <el-button class="btns active">200积分兑换</el-button> -->
                  <button class="btns" @click="btnIntegralChangeGoods(walletChange.lxxz)" :disabled="walletChange.lxxz.disabled" :class="{disable:walletChange.lxxz.disabled}">{{(walletChange.lxxz.disabled)? walletChange.lxxz.effectiveTime+'后到期' :walletChange.lxxz.score+'积分兑换'}}</button>
                </section>
              </li>
              <li v-if="walletChange.krk.score!=''">
                <section class="prod-img-box">
                  <img src="../assets/images/krk.png" />
                  <span class="w-color4">{{walletChange.krk.name}}</span>
                </section>
                <section class="prod-des-box">
                  <!-- <h5>会员特权</h5> -->
                  <p>网盘容量永久扩容1Tb</p>
                  <span>注：仅可兑换一次</span>
                </section>
                <section class="prod-change-box">
                  <!-- <el-button class="btns active">200积分兑换</el-button> -->
                  <button class="btns" @click="btnIntegralChangeGoods(walletChange.krk)" :disabled="walletChange.krk.disabled" :class="{disable:walletChange.krk.disabled}">{{(walletChange.krk.disabled)? '已兑换' :walletChange.krk.score+'积分兑换'}}</button>
                </section>
              </li>
            </ul>
          </section>
          <section class="integralInfo">
            <section class="user-img-box">
              <img :src="userInfo.headImg" alt="">
              <span class="username" :class="{vip:(userInfo.vip=='1')?true:false}">{{userInfo.nickName}}</span>
            </section>
            <section class="user-integral-box">
              <b>我的积分：</b>
              <span>{{taskData.myScore}}</span>
              <em @click="showIntegralGrid">明细</em>
            </section>
            <section class="user-task">
              <h5>任务中心</h5>
              <ul>
                <li>
                  <section class="task-cont-box">
                    <h5><b>签到任务</b><span>（{{(taskBtn.signInDisabled)?'1':'0'}}/1）</span></h5>
                    <p>
                      <span>每日签到获取</span><i>{{taskData.dailyCheckScore}}积分</i>
                    </p>
                  </section>
                  <section class="btn-box">
                    <!-- <el-button class="btns" @click="signFlag && signIn()">签到</el-button> -->
                    <button  v-if="taskData.dailyCheckTaskStatus == 1" class="btns" @click="signIn()" :class="{disable:taskBtn.signInDisabled}" :disabled="taskBtn.signInDisabled">{{(taskBtn.signInDisabled)?'已签到':'签到'}}</button>
                    <button  v-if="taskData.dailyCheckTaskStatus == 0" class="btns disable" disabled="true">已下架</button>
                  </section>
                </li>
                <li>
                  <section class="task-cont-box">
                    <h5><b>邀请好友注册</b><span>（{{taskData.invitedCount}}/{{taskData.inviteRestrict}}）</span></h5>
                    <p>
                      <span>邀请一位好友则获得</span><i>{{taskData.inviteScore}}积分</i>
                      <br>
                      <span>每日至多邀请{{taskData.inviteRestrict}}位
                      <br>
                      每日邀请至第{{taskData.inviteRestrict}}位获得</span><i>{{taskData.inviteLastestScore}}积分</i>
                    </p>
                  </section>
                  <section class="btn-box">
                    <!-- <el-button class="btns" @click="showInviteDialog">去邀请</el-button> -->
                    <button v-if="taskData.inviteTaskStatus == 1" class="btns" @click="showInviteDialog" :class="{disable:taskBtn.inviteDisabled}" :disabled="taskBtn.inviteDisabled">去邀请</button>
                    <button v-if="taskData.inviteTaskStatus == 0" class="btns disable" disabled="true">已下架</button>
                  </section>
                </li>
                <li>
                  <section class="task-cont-box">
                    <h5><b>首次注册并登陆</b><span>（{{(taskBtn.registerDisabled)?'1':'0'}}/1）</span></h5>
                    <p>
                      <span>新用户注册并登录即可领取</span>
                      <br>
                      <i>{{taskData.newMemberScore}}积分</i>
                    </p>
                  </section>
                  <section class="btn-box">
                    <!-- <el-button class="btns" @click="registerGet">立即领取</el-button> -->
                    <button v-if="taskData.newMemberTaskStatus == 1" class="btns" @click="registerGet" :class="{disable:taskBtn.registerDisabled}" :disabled="taskBtn.registerDisabled">{{(taskBtn.registerDisabled)?'已领取':'立即领取'}}</button>
                    <button v-if="taskData.newMemberTaskStatus == 0" class="btns disable" disabled="true">已下架</button>
                  </section>
                </li>
                <li>
                  <section class="task-cont-box">
                    <h5><b>填写邀请码</b><span></span></h5>
                    <p>
                      <span>填写用户邀请码，</span>
                      <i>两人均可<br>获得积分</i>
                    </p>
                  </section>
                  <section class="btn-box">
                    <!-- <el-button class="btns" @click="inputInviteDialog">填写邀请码</el-button> -->
                    <button class="btns" @click="inputInviteDialog" :class="{disable:taskBtn.inputInviteDisabled}" :disabled="taskBtn.inputInviteDisabled">填写邀请码</button>
                  </section>
                </li>
              </ul>
            </section>
          </section>
        </section>
      </section>
      <el-dialog title="积分明细" :visible.sync="integralDialogVisible">
        <el-table :data="grid.gridData" :cell-style="changeCellStyle" :header-cell-style="changeHeaderStyle" height='282px'>
          <el-table-column prop="createTime" :formatter="dateFormatter" label="时间" width="150"></el-table-column>
          <el-table-column prop="scoreType" label="事项" :formatter="scoreEvent" width="auto"></el-table-column>
          <el-table-column label="收支" width="150">
            <template  slot-scope="scope">
                  <span v-if="scope.row.flowType==1" style="color:#F8BD38">+{{ scope.row.score }}</span>
                  <span v-else-if="scope.row.flowType==2" style="color: #FE5958">{{ scope.row.score }}</span>
            </template>
          </el-table-column>
        </el-table>
        <p style="text-align:center;margin-top:10px;">
          <el-pagination
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
            :total="grid.total"
            :page-count='grid.pageCount'
            :page-size='grid.perpage'
            :current-page.sync="grid.currentPage"
            next-text='下一页' prev-text='上一页'>
          </el-pagination>
        </p>
        
      </el-dialog>
      <el-dialog title="邀请注册" :visible.sync="inviteDialogVisible" class="integral-dialogs inviteDialog" 
      width="360px!important" top="calc(50vh - 128px)">
        <p>您的邀请码为：</p>
        <input type="text" id="inviteCode" :value="taskData.inviteCode">
        <span class="inviteCode">{{taskData.inviteCode}}</span>
        <p>告知您的好友，注册时填写邀请码均可获得积分</p>
        <p>
          <!-- <el-button class="btns">复制邀请码</el-button>  -->
          <button class="btns" @click="copyInviteCode()">复制邀请码</button>
        </p>
      </el-dialog>
      <el-dialog title="邀请码输入框" :visible.sync="inputInviteDialogVisible" class="integral-dialogs inputInviteDialog" 
      width="360px!important" top="calc(50vh - 128px)">
        <p>请填写您好友给您的邀请码</p>
        <p><el-input  v-model="taskData.inputInviteCode" placeholder="请输入邀请码"></el-input></p>
        <p>
          <!-- <el-button class="btns">确定</el-button>  -->
          <button class="btns" @click="btnSureInputInviteCode" @keyup.enter="btnSureInputInviteCode">确定</button>
        </p>
      </el-dialog>
      <el-dialog title="兑换中心" :visible.sync="changeDialogVisible" class="integral-dialogs changeDialog" 
      width="360px!important" top="calc(50vh - 128px)">
        <p>您确定用{{walletChange.targetGoods.score}}积分兑换{{walletChange.targetGoods.name}}吗？</p>
        <p>
          <!-- <el-button class="btns">确定</el-button>  -->
          <!-- <el-button class="btns exit">取消</el-button>  -->
          <button class="btns" @click="sureChangeGoods()">确定</button>
          <button class="btns exit" @click="exitChangeGoods()">取消</button>
        </p>
      </el-dialog>
    </section>
</template>

<script>
import Title from '@/components/title';
import Tip from '@/components/tip';
export default {
  name: "integrallWallet",
  components:{
    Title,Tip
  },
  data() {
    return {
      isDataRes:false,
      userInfo:null,
      integralDialogVisible:false,
      inviteDialogVisible:false,
      inputInviteDialogVisible:false,
      changeDialogVisible:false,
      walletChange:{
        hyk:{
          name:'7天会员体验卡',
          score:'',
          effectiveTime:'',
          duration:'',
          type:1,
          disabled:false,
          key:'hyk'
        },
        jsk:{
          name:'加速体验卡',
          score:'',
          effectiveTime:'',
          duration:'',
          type:3,
          disabled:false,
          key:'jsk'
        },
        lxxz:{
          name:'离线下载配额卡',
          score:'',
          effectiveTime:'',
          duration:'',
          type:2,
          disabled:false,
          key:'lxxz'
        },
        krk:{
          name:'永久扩容卡',
          score:'',
          effectiveTime:'',
          duration:'',
          type:4,
          disabled:false,
          key:'krk'
        },
        targetGoods:{
          name:'',
          score:'',
          effectiveTime:'',
          duration:'',
          type:'',
          key:''
        }
      },
      goodsBtn:{
        hykDisabled:false,
        jskDisabled:false,
        lxxzDisabled:false,
        krkDisabled:false,
      },
      taskBtn:{
        signInDisabled:false,
        inviteDisabled:false,
        registerDisabled:false,
        inputInviteDisabled:false
      },
      taskData:{
        dailyCheckScore:'',
        inviteScore:'',
        newMemberScore:'',
        inviteRestrict:'',
        inviteLastestScore:'',
        inviteCode:'',
        myScore:'',
        inputInviteCode:'',
        invitedCount:'',
        dailyCheckTaskStatus:1,
        inviteTaskStatus:1,
        newMemberTaskStatus:1,
      },
      grid:{
        page:1,
        perpage:6,
        total:0,
        pageCount:0,
        currentPage:1,
        gridData:null
      }
    }
  },
  methods:{
    // 兑换方法
    btnIntegralChangeGoods(goods){
      this.walletChange.targetGoods.score=goods.score;
      this.walletChange.targetGoods.name=goods.name;
      this.walletChange.targetGoods.type=goods.type;
      this.walletChange.targetGoods.key=goods.key;
      this.changeDialogVisible=true;
    },
    // 确定兑换
    sureChangeGoods(){
      this.$http({
          url:'/api/member/score/exchange',
          method:'post',
          data:{
            type:this.walletChange.targetGoods.type
          }
      }).then(res=>{
          if(res.data.code === 100001 ){
            const data=res.data.data;
            this.taskData.myScore=data.totalScore;
            this.$message({
              message: '您兑换了'+this.walletChange.targetGoods.name+"花费积分"+data.score,
              type: 'warning'
            });
            this.walletChange[this.walletChange.targetGoods.key].disabled=true;
            this.walletChange[this.walletChange.targetGoods.key].effectiveTime=this.walletChange[this.walletChange.targetGoods.key].duration;
            sessionStorage.setItem('visit',JSON.stringify(data.privilegeInfo));
            let newUserInfo=Object.assign(JSON.parse(localStorage.getItem('userInfo')),data.privilegeInfo);
            this.userInfo=newUserInfo;
            localStorage.setItem('userInfo',JSON.stringify(newUserInfo));
            this.changeDialogVisible=false;
          }
          if(res.data.code === 110004 ){
            this.changeDialogVisible=false;
          }
      })
    },
    // 取消兑换
    exitChangeGoods(){
      this.changeDialogVisible=false;
    },
    // 明细
    showIntegralGrid(){
      this.grid.page=1;
      this.grid.currentPage=1;
      this.currentGridDataShow(this.grid.page,true);
    },
    currentGridDataShow(page,cbFlag){
      this.$http({
          url:'/api/member/score/flow',
          method:'post',
          data:{
            page:page,
            perpage:this.grid.perpage,
          }
      }).then(res=>{
          if(res.data.code === 100001 ){
            console.log(res);
            const data=res.data.data;
            this.grid.gridData=data.dataList;
            this.grid.total=data.totalRowsCount;
            this.grid.pageCount=data.totalPageCount;
            if(cbFlag) this.integralDialogVisible=true;
          }
      })
    },
    // 分页
    handleCurrentChange(val){
      this.grid.page=val;
      this.currentGridDataShow(val);
    },
    // 表格数据转换
    dateFormatter(row, column){
      let datetime = row.createTime;
      if(datetime){
        return this.dataFormat(datetime);
      }
      return ''
    },
    scoreEvent(row, column){
      const scoreType = row.scoreType;
      const flowType = row.flowType;
      if(flowType==1){
        switch(scoreType){
          case 1:
            return '签到任务';
            break;
          case 2:
            return '邀请用户注册';
            break;
          case 3:
            return '成功注册网盘会员';
            break;
          case 4:
            return '绑定邀请码';
            break;
          default:
            return '';
        }
      }else if(flowType==2){
        switch(scoreType){
          case 1:
            return '兑换网盘会员体验卡（7天）';
            break;
          case 2:
            return '兑换离线下载配额体验卡';
            break;
          case 3:
            return '兑换加速体验卡';
            break;
          case 4:
            return '兑换网盘永久空间扩容';
            break;
          default:
            return '';
        }
      }
    },
    //表格样式修改
    changeCellStyle(e){
      if(e.columnIndex==1){
        return "text-align:center"
      }else if(e.columnIndex==2){
        return "text-align:right"
      }
    },
    changeHeaderStyle(e){
      if(e.columnIndex==1){
        return "text-align:center"
      }else if(e.columnIndex==2){
        return "text-align:right"
      }
    },
    // 签到
    signIn(){
      this.$http({
          url:'/api/member/score/receive_score',
          method:'post',
          data:{
            type:1
          }
      }).then(res=>{
          if(res.data.code === 100001 ){
            //this.$refs.tip.changeCont('签到成功，积分+10'); 
            const data=res.data.data;
            this.taskData.myScore=data.score;
            this.$message({
              message: '签到成功，积分+'+this.taskData.dailyCheckScore,
              type: 'success',
              duration:1000
            });
            this.taskBtn.signInDisabled=true;
          }
      })
    },
    // 展示邀请码
    showInviteDialog(){
      this.$http({
          url:'/api/member/score/invite_code',
          method:'post',
          data:{}
      }).then(res=>{
        console.log(res);
          if(res.data.code === 100001 ){
            const data=res.data.data;
            this.taskData.inviteCode=data.inviteCode;
            this.inviteDialogVisible=true;
          }
      })
    },
    // 注册获取积分
    registerGet(){
      this.$http({
          url:'/api/member/score/receive_score',
          method:'post',
          data:{
            type:3
          }
      }).then(res=>{
          if(res.data.code === 100001 ){
            // this.$refs.tip.changeCont('领取成功，积分+100'); 
            const data=res.data.data;
            this.taskData.myScore=data.score;
            this.$message({
              message: '领取成功，积分+'+this.taskData.newMemberScore,
              type: 'success',
              duration:1000
            });
            this.taskBtn.registerDisabled=true;
          }
      })
    },
    // 展示邀请码填写
    inputInviteDialog(){
      this.inputInviteDialogVisible=true;
    },
    //确定填写邀请码
    btnSureInputInviteCode(){
      if(this.taskData.inputInviteCode==''){
        this.$message({
          message: '请填写邀请码！',
          type: 'error',
          duration:1000
        });
        return;
      }
      this.$http({
          url:'/api/member/score/invite',
          method:'post',
          data:{inviteCode:this.taskData.inputInviteCode}
      }).then(res=>{
          if(res.data.code === 100001 ){
            const data=res.data.data;
            this.$message({
              message: '领取成功，积分+'+data.score,
              type: 'success',
              duration:1000
            });
            this.taskData.myScore=data.totalScore;
            this.inputInviteDialogVisible=false;
          }
      })
    },
    // 复制邀请码    
    copyInviteCode() {
      document.querySelector("#inviteCode").select();
      document.execCommand("copy"); // 执行浏览器复制命令
      this.$message({
        message: '邀请码已复制，快去分享给朋友吧！',
        type: 'success',
        duration:1000
      });
    },
    //返回上一级
    toBack() {
      this.$router.push({path: '/all'})
    },
    // 特选卡状态判定方法封装
    goodsCardFn(data,goods){
      this.walletChange[goods].score=data.score;
      this.walletChange[goods].name=data.name;
      if(data.exchange==1){
        this.walletChange[goods].disabled=true;
        if(data.effectiveTime > 60 * 60 * 24){
          this.walletChange[goods].effectiveTime=Math.ceil(data.effectiveTime/(60 * 60 * 24))+'天';
        }else {
          this.walletChange[goods].effectiveTime=Math.ceil(data.effectiveTime/(60 * 60 ))+'小时';
        }
      }else if(data.exchange==0){
        const durationFormat=data.duration*60*60;
        if(durationFormat > 60 * 60 * 24){
          this.walletChange[goods].duration=Math.ceil(durationFormat/(60 * 60 * 24))+'天';
        }else {
          this.walletChange[goods].duration=Math.ceil(durationFormat/(60 * 60 ))+'小时';
        }
        this.walletChange[goods].disabled=false;
      }
    },

    //获取邀请人数的任务请求
    getInvitePers(){
      
      //获取邀请列表数据
      this.$http({
            url:'/api/member/score/invite/list',
            method:'post',
            data:{}
        }).then(res=>{
          if(res.data.code === 100001 ){
              const data=res.data.data;
              let nowTime=parseInt(new Date().getTime()/1000); 
              let FormartTime=this.dataFormat(nowTime).split(' ')[0];
              let index=0;
              data.forEach((v,i) => {
                if(this.dataFormat(v.createTime).split(' ')[0] == FormartTime && v.score==this.taskData.inviteScore){
                  index++;
                }
              });
              this.taskData.invitedCount=index;
          }
      })
    }
  },
  created(){
    if(localStorage.getItem('userInfo')){
      this.userInfo=JSON.parse(localStorage.getItem('userInfo'));
    }else{
      this.$router.push({
          path:'/login',
      })
    }
    //获取任务数据
    this.$http({
          url:'/api/member/score/task_index',
          method:'post',
          data:{}
      }).then(res=>{
        if(res.data.code === 100001 ){
            const data=res.data.data;
            this.taskData.dailyCheckScore=data.dailyCheckScore;
            this.taskData.inviteScore=data.inviteScore;
            this.taskData.newMemberScore=data.newMemberScore;
            this.taskData.inviteRestrict=data.inviteRestrict;
            this.taskData.inviteLastestScore=data.inviteLastestScore;
            this.taskBtn.signInDisabled=(data.isDailyChecked==0)?false:true;
            this.taskBtn.registerDisabled=(data.isReceivedNewMemberScore==0)?false:true;
            this.taskData.dailyCheckTaskStatus=data.dailyCheckTaskStatus;
            this.taskData.inviteTaskStatus=data.inviteTaskStatus;
            this.taskData.newMemberTaskStatus=data.newMemberTaskStatus;
            this.getInvitePers();
        }
    })
    //获取用户积分数据
    this.$http({
          url:'/api/member/score/my_score',
          method:'post',
          data:{}
      }).then(res=>{
        if(res.data.code === 100001 ){
            const data=res.data.data;
            this.taskData.myScore=data.score;
        }
    })
    //获取我的特权卡数据
    this.$http({
          url:'/api/member/score/goods/index',
          method:'post',
          data:{}
      }).then(res=>{
        if(res.data.code === 100001 ){
            const data=res.data.data.dataList;
            for (let i=0; i<data.length; i++){
              if(data[i].type==1){
                this.goodsCardFn(data[i],'hyk');
              }else if(data[i].type==2){
                this.goodsCardFn(data[i],'lxxz');
              }else if(data[i].type==3){
                this.goodsCardFn(data[i],'jsk');
              }else if(data[i].type==4){
                this.walletChange.krk.score=data[i].score;
                this.walletChange.krk.name=data[i].name;
                if(data[i].exchange==1){
                  this.walletChange.krk.disabled=true;
                  // this.walletChange.krkEffectiveTime=Math.ceil(data[i].effectiveTime/(60 * 60 * 24));
                }else if(data[i].exchange==0){
                  this.walletChange.krk.disabled=false;
                }
              }
            }
            
        }
        this.isDataRes=true;
    })
  }
}
</script>
<style lang="scss" scoped>
  .page-integralWallet {
    width: 100%;
    height: 100vh;
    background-color: #fff;
    overflow:hidden;
    position: relative;
    & > .main{
      height: calc(100vh - 62px);
      overflow-y: auto;
      padding: 10px;
      box-sizing: border-box;
      position: relative;
      & > .comBtn{
        position: absolute;
        top: 15px;
        left: 135px;
      }
      & > .content{
        padding-top: 30px;
        display: flex;
        width: 1200px;
        height: calc(100vh - 82px);
        margin: 0 auto;
        & > .integralChange{
          width: 900px;
          margin-right: 25px;
          & > h3{
            font-weight: 700;
            font-size: 22px;
            color: #1A1A1A;
            padding: 10px 0;
            border-bottom: 1px solid #DDDDDD;
          }  
          & li{
            padding: 20px 0;
            border-bottom: 1px solid #DDDDDD;
            box-sizing: border-box;  
            display: flex;
            justify-content: space-between;
            height: 191px;
            overflow: hidden;
            &>.prod-img-box{
              display: flex;
              flex-direction: column;
              margin: auto 0;
              margin-right: 30px;
              &>img{
                width: 108px;
                margin: 0 auto;
              }
              &>span{
                font-size: 18px;
                margin-top: 20px;
                width: 178px;
                white-space:nowrap;
                text-align: center
              }
              &>.w-color1{
                color: #F6BD00;
              }
              &>.w-color2{
                color: #7777FF;
              }
              &>.w-color3{
                color: #0DAAF6;
              }
              &>.w-color4{
                color: #FE9562;
              }
            }
            &>.prod-des-box{
              margin: auto 0;
              flex: 1;
              &>h5{
                font-weight: 700;
                font-size: 18px;
                color: #1A1A1A;
              }
              &>p{
                color: #5CBBF4;
                line-height: 21px;
                font-weight: 700;
                margin: 10px 0;
              }
              &>span{
                font-size: 16px;
                color: #1A1A1A;
                white-space:nowrap;
              }
            }
            
            &>.prod-change-box{
                margin: auto 0;
                margin-right: 30px;
              &>.btns{
                width: 120px;
                height: 40px;
                line-height: 38px;
                padding: 0;
                &.disable{
                  background-color: #fff;
                  border: 1px solid #9FA9B7;
                  color: #9FA9B7;
                }
              }
            }
          }        
        }
        & >.integralInfo{
          flex: 1;
          &>.user-img-box{
            overflow: hidden;
            height: 84px;
            padding: 20px 0 10px 0;
            &>img{
              width: 54px;
              height: 54px;
              border-radius: 50%;
            }
            &>span{
              margin-left: 10px;
              display: inline-block;
              line-height: 54px;
              vertical-align: top;
            }
            & .username{
                padding-left:25px;
                box-sizing: border-box;
                position: relative;
                &::after{
                    content: '';
                    position: absolute;
                    top: 16px;
                    left: 0;
                    width: 21px;
                    height: 17px;
                    background: url("../assets/images/vip0.png") center center no-repeat;
                }
                &.vip{
                    &::after{
                    background: url("../assets/images/vip1.png") center center no-repeat;
                    }
                }
            }
          }
          &>.user-integral-box{
            height: 50px;
            margin-bottom: 40px;
            &>b{
              font-size: 16px;
              color: #1A1A1A;
            }
            &>span{
              line-height: 50px;
              color: #F8BD38;
              font-size: 36px;
              margin-right: 16px;
            }
            &>em{
              color: #308EFF;
              font-size: 16px;
              cursor: pointer;
            }
          }
          &>.user-integral-box{
            height: 50px;
            margin-bottom: 40px;
            &>b{
              font-size: 16px;
              color: #1A1A1A;
            }
            &>span{
              line-height: 50px;
              color: #F8BD38;
              font-size: 36px;
              margin-right: 16px;
            }
            &>em{
              color: #308EFF;
              font-size: 16px;
              cursor: pointer;
            }
          }
          &>.user-task{
            &>h5{
              font-size: 22px;
              font-weight: 700;
              color: #1A1A1A;
              margin-bottom: 22px;
            }
            &>ul{
              &>li{
                display: flex;
                justify-content: space-between;
                margin-bottom: 24px;
                &>.task-cont-box{
                  &>h5{
                    font-size: 16px;
                    font-weight: 700;
                    color: #1A1A1A;
                    line-height: 22px;
                    margin-bottom: 4px;
                    &>span{
                      font-size: 12px;
                      margin-left: 3px;
                      font-weight: normal;
                    }
                  }
                  &>p{
                    line-height: 18px;
                    &>i{
                      color: #F8BD38;
                      font-style:normal;
                    }
                  }
                }
                &>.btn-box{
                  display: flex;
                  flex-direction: column-reverse;
                  &>.btns{
                    height: 32px;
                    width: 75px;
                    line-height: 30px;
                    padding: 0;
                    font-size: 12px;    
                    &.disable{
                      background-color: #fff;
                      border: 1px solid #9FA9B7;
                      color: #9FA9B7;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    & > .integral-dialogs{
        & p{
          color: #5a5a5a;
          text-align: center;
        }
        & .btns{
          width: 128px;
          height: 40px;
          line-height: 38px;
          margin-top: 20px;
          &.exit{
            border: 1px solid #5CBBF4;
            color: #5CBBF4;
            background-color: #fff;
            margin-left: 15px;
          }
        }
    }
    & > .inviteDialog{
        & .inviteCode{
          display: inline-block;
          width: 100%;
          font-weight: 700;
          font-size: 18px;
          line-height: 24px;
          margin: 12px 0;
          text-align: center;
        }
        & input{
          position: absolute;
          width: 10px;
          height: 10px;
          left: 0;
          top: 0;
          opacity: 0;
        }
    }
    & > .inputInviteDialog{
      & p:nth-of-type(1){
          margin-bottom: 10px;
      }
    }
  }
</style>
<style>
.page-integralWallet .el-dialog__body{
  padding: 20px;
}
.page-integralWallet .el-input__inner{
  width: 278px;
}
@media screen and (max-width:1500px){
#app .page-integralWallet > .main > .comBtn{
    position: absolute;
    top: 15px;
    left: 5px;
 }
}
</style>


