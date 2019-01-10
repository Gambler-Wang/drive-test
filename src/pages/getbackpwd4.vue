<template>
    <section class="page-getpwd">
        <Title title="找回密码"/>
        <section class="getpwd-success">
            <h1><i></i>恭喜，密码找回成功</h1>
            <button class="btns large" @click.prevent="go('/login')">返回登录页面</button>
        </section>
    </section>    
</template>
<script>
import Title from '@/components/title';
export default {
    name:'Getback-step1',
    components:{
        Title,
    },
    data(){
        return {}
    },
    methods:{
        //登录
        go(){
            this.$router.push({
                path:'/login',
            })
        }
    },
    created(){
        // console.log( navigator.userAgent )
    }
}
</script>
<style lang="scss" scoped>
 .page-getpwd{
    text-align:center;
    & .getpwd-success{
        display:inline-block; vertical-align:top; width:406px;
        margin:0 auto ; padding-top:115px;
        h1{ font-size:18px; text-align:left; font-weight:bold; color:#3d3d3d;padding:15px 0;vertical-align:top; line-height:35px;margin-bottom:85px;
            & > i { display:inline-block; vertical-align:top; width:35px; height:35px; margin-right:15px;
                background:url(~@/assets/images/tips_icons_right2.png) center center no-repeat;background-size:35px 35px;
            }
        }


    }





 }   
</style>
