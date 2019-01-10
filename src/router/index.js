import Vue from 'vue'
import Router from 'vue-router'
// import Index from '@/pages/index'
// import Video from '@/pages/video'
// import Music from '@/pages/music'
// import Image from '@/pages/image'
// import Other from '@/pages/other'
// import Doc from '@/pages/doc'
// import Torrent from '@/pages/Torrent'
// import Getpwd1 from '@/pages/getbackpwd1'
// import Getpwd2 from '@/pages/getbackpwd2'
// import Getpwd3 from '@/pages/getbackpwd3'
// import Getpwd4 from '@/pages/getbackpwd4'
// import Login from '@/pages/login'
// import Register from '@/pages/register'
// import Test from '@/pages/testcomponent'
// import PersonalCenter from '@/pages/personalCenter'
// import ChangePsw from '@/pages/changePsw'
// import Player from '@/pages/player'
// import DownLoad from '@/pages/downLoad'
// import Ws from '@/pages/websocket'
// import FolderDetail from '@/pages/folderdetail'
// import Imgdetail from '@/pages/imgdetail'
// import All from '@/pages/all'
// import Share from '@/pages/share'
// import SharePage from '@/pages/sharePage'
// import Recovery from '@/pages/recovery'
// import ShareInit from '@/pages/shareInit'
// import PhoneShare from '@/pages/phoneShare'
// import PhoneShareInit from '@/pages/phoneShareInit'
// import PhoneShareDownload from '@/pages/phoneShareDownload'
// // import test1 from '@/components/test'
// import Sharedetail from '@/pages/sharedetail'
// import Search from '@/pages/search'
const Index = () => import(/* webpackChunkName: "page-list" */ '@/pages/index');
const Video = () => import(/* webpackChunkName: "page-list" */ '@/pages/video');
const Music = () => import(/* webpackChunkName: "page-list" */ '@/pages/music');
const Image = () => import(/* webpackChunkName: "page-list" */ '@/pages/image');
const Other = () => import(/* webpackChunkName: "page-list" */ '@/pages/other');
const Doc = () => import(/* webpackChunkName: "page-list" */ '@/pages/doc');
const Torrent = () => import(/* webpackChunkName: "page-list" */ '@/pages/Torrent');
const FolderDetail = () => import(/* webpackChunkName: "page-list" */ '@/pages/folderdetail');
const Imgdetail = () => import(/* webpackChunkName: "page-list" */ '@/pages/imgdetail');
const All = () => import(/* webpackChunkName: "page-list" */ '@/pages/all');
const SharePage = () => import(/* webpackChunkName: "page-list" */ '@/pages/sharePage');
const Recovery = () => import(/* webpackChunkName: "page-list" */ '@/pages/recovery');
const Search = () => import(/* webpackChunkName: "page-list" */ '@/pages/search');
const Getpwd1 = () => import(/* webpackChunkName: "page-getbackpwd" */ '@/pages/getbackpwd1');
const Getpwd2 = () => import(/* webpackChunkName: "page-getbackpwd" */ '@/pages/getbackpwd2');
const Getpwd3 = () => import(/* webpackChunkName: "page-getbackpwd" */ '@/pages/getbackpwd3');
const Getpwd4 = () => import(/* webpackChunkName: "page-getbackpwd" */ '@/pages/getbackpwd4');
const Login = () => import(/* webpackChunkName: "page-login" */ '@/pages/login');
const Register = () => import(/* webpackChunkName: "page-register" */ '@/pages/register');
const Protocol = () => import(/* webpackChunkName: "page-register" */ '@/pages/protocol');
const Test = () => import(/* webpackChunkName: "page-testcomponent" */ '@/pages/testcomponent');
const Player = () => import(/* webpackChunkName: "page-player" */ '@/pages/player');
const DownLoad = () => import(/* webpackChunkName: "page-downLoad" */ '@/pages/downLoad');
const PersonalCenter = () => import(/* webpackChunkName: "page-personalInfo" */ '@/pages/personalCenter');
const ChangePsw = () => import(/* webpackChunkName: "page-personalInfo" */ '@/pages/changePsw');
const CloudId = () => import(/* webpackChunkName: "page-personalInfo" */ '@/pages/cloudId');
const Feedback = () => import(/* webpackChunkName: "page-personalInfo" */ '@/pages/feedback');
const ErrInfor = () => import(/* webpackChunkName: "page-personalInfo" */ '@/pages/errInfor');
const ChangeInfor= () => import(/* webpackChunkName: "page-personalInfo" */ '@/pages/ChangeInfor');
const IntegralWallet = () => import(/* webpackChunkName: "page-personalInfo" */ '@/pages/integralWallet');
const Share = () => import(/* webpackChunkName: "page-share" */ '@/pages/share');
const ShareInit = () => import(/* webpackChunkName: "page-share" */ '@/pages/shareInit');
const Sharedetail = () => import(/* webpackChunkName: "page-share" */ '@/pages/sharedetail');
const PhoneShare = () => import(/* webpackChunkName: "page-phoneShare" */ '@/pages/phoneShare');
const PhoneShareInit = () => import(/* webpackChunkName: "page-phoneShare" */ '@/pages/phoneShareInit');
const PhoneShareDownload = () => import(/* webpackChunkName: "page-phoneShare" */ '@/pages/phoneShareDownload');
Vue.use(Router)

const router = new Router({
  mode:'history',
  routes: [
    {
      path: '/all',
      // name: 'index',
      component:Index ,
      children:[
        {
          path:'',
          name:'all',
          meta:{
            requireAuth:true,
          },
          component:All,
        },
        {
            path:'/folderdetail',
            name:'folderdetail',
            meta:{
              requireAuth:true,
           },
            component:FolderDetail
        },
        {
          path:'/search',
          name:'search',
          meta:{
            requireAuth:true,
         },
          component:Search
      },
        {
          path:'/image',
          name:'image',
          meta:{
            requireAuth:true,
          },
          component:Image,
        },
        {
          path:'/imgdetail',
          name:'imgdetail',
          meta:{
            requireAuth:true,
          },
          component:Imgdetail
        },
        {
          path:'/video',
          name:'video',
          meta:{
            requireAuth:true,
          },
          component:Video,
        },
        {
          path:'/doc',
          name:'doc',
          meta:{
            requireAuth:true,
          },
          component:Doc,
        },
        {
          path:'/other',
          name:'other',
          meta:{
            requireAuth:true,
          },
          component:Other,
        },
        {
          path:'/torrent',
          name:'torrent',
          meta:{
            requireAuth:true,
          },
          component:Torrent,
        },
        {
          path:'/music',
          name:'music',
          meta:{
            requireAuth:true,
          },
          component:Music,
        },
        {
          path:'/sharePage',
          name:'sharePage',
          meta:{
            requireAuth:true,
          },
          component:SharePage,
        },
        {
          path:'/recovery',
          name:'recovery',
          meta:{
            requireAuth:true,
          },
          component:Recovery,
        }
      ]
    },
    {
      path:'/',
      name:'login',
      component:Login
    },
    {
      path:'/login',
      redirect:'/'
    },
    {
      path:'/register',
      name:'register',
      component:Register
    },
    {
      path:'/protocol',
      name:'protocol',
      component:Protocol
    },
    {
      path:'/getpwd1',
      name:'Getpwd1',
      component:Getpwd1
    },
    {
      path:'/getpwd2',
      name:'Getpwd2',
      component:Getpwd2
    },
    {
      path:'/getpwd3',
      name:'Getpwd3',
      component:Getpwd3
    },
    {
      path:'/getpwd4',
      name:'Getpwd4',
      component:Getpwd4
    },
    {
      path:"/personalCenter",
      name:"personalCenter",
      component:PersonalCenter,
      meta:{
        requireAuth:true,
      },
    },
    {
      path:"/integralWallet",
      name:"integralWallet",
      component:IntegralWallet,
      meta:{
        requireAuth:true,
      },
    },
    {
      path:"/changePsw",
      name:"changePsw",
      component:ChangePsw,
      meta:{
        requireAuth:true,
      },
    },
    {
      path:"/feedback",
      name:"feedback",
      component:Feedback,
      meta:{
        requireAuth:true,
      },
    },
    {
      path:"/cloudId",
      name:"cloudId",
      component:CloudId,
      meta:{
        requireAuth:true,
      },
    },
    {
      path:"/changeInfor",
      name:"changeInfor",
      component:ChangeInfor,
      meta:{
        requireAuth:true,
      },
    },
    {
      path:"/player",
      name:"player",
      meta:{
        requireAuth:true,
      },
      component:Player
    },
    {
      path:"/downLoad",
      name:"downLoad",
      component:DownLoad
    },
    {
      path:"/errInfor",
      name:"errInfor",
      component:ErrInfor
    },
    // {
    //   path:'/ws',
    //   name:'ws',
    //   component:Ws,
    // },
    {
      path:'/share',
      name:'share',
      component:Share,
    },
    {
      path:'/sharedetail',
      name:'sharedetail',
      component:Sharedetail
    },
    {
      path:'/shareInit/:id',
      name:'shareInit',
      component:ShareInit,
    },
    {
      path:'/phoneShare/:id',
      name:'phoneShare',
      component:PhoneShare,
    },
    {
      path:'/phoneShareDownload/:id',
      name:'phoneShareDownload',
      component:PhoneShareDownload,
    },
    {
      path:'/phoneShareInit/:id',
      name:'phoneShareInit',
      component:PhoneShareInit,
      meta:{
        title:'请输入提取码_掌云网盘'
      },
    },
    {
      path:"/test",
      name:"test",
      component:Test,
    },
    {
      path:'*',
      redirect:'/all'
    }
    // , {
    //   path:"/test1",
    //   name:"test1",
    //   component:test1,
    // }
  ]
});
const vue = new Vue();
router.beforeEach((to,from,next)=>{
  if( to.meta && to.meta.requireAuth ){
    if(!localStorage.getItem('token')){
      vue.$message({
        message:'请登录',
        type:'warning',
        duration:1500
      })
      next({path:'/login'})
    } else{
      if(!sessionStorage.getItem('visit')){
        vue.$http({
            url:'/api/member/visit',
            method:'post',
            data:{}
        }).then( res => {
          if(res.data.code === 100001 ){
            sessionStorage.setItem('visit',JSON.stringify(res.data.data))
          }
          next();
        })
      } else {
        next();
      }
    }
  }else{
    next();
  }
})
export default router;
