<template>
    <section>
        <Title title="找回密码" />
        <section class="form-box">

            <el-form
                :model="formData"
                :rules="rules"
                label-width="80px"
                ref = "formData1"
                class="form-content"
            >
                <h2 class="form-item-title"><span>手机号</span>{{phoneFilters(queryData.phone)}}</h2>
                <el-form-item label="验证码" prop="code" class="getCode"
                :error="codeErrMsg">
                    <el-input
                        type="text"
                        v-model="formData.code"
                        placeholder="请输入验证码"
                         />
                    <!-- <button class="btn" @click.prevent="getCode">获取验证码</button> -->
                    <code-btn @getCode="getCode" type="3" :userName="queryData.userName"></code-btn>
                </el-form-item>
                <el-form-item>
                    <button class="btns large" @click.prevent="sign('formData1')">下一步</button>
                </el-form-item>
            </el-form>
        </section>
    </section>
</template>
<script>
import Title from '@/components/title';
import rules from '@/util/rules';
import CodeBtn from '@/components/codebtn';
export default {
    name:'Getback-step1',
    components:{
        Title,CodeBtn
    },
    data(){
        return {
            formData:{
                code:'',
                usrename:''
            },
            queryData:{},
            rules:rules,
            codeErrMsg:'',
        }
    },
    methods:{
        //登录
        sign(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    const params = {
                        step:'2',
                        code:this.formData.code,
                        userName:this.queryData.userName,
                        phone:this.queryData.phone
                    }
                    this.codeErrMsg='';
                    this.$http({
                        url:'/api/member/find_pwd_web',
                        method:'post',
                        data:params
                    }).then(res=>{
                        if(res.data.code === 100001 ){
                            this.$router.push({
                                name:'Getpwd3',
                                query:{
                                    userName:this.queryData.userName,
                                    phone:this.queryData.phone
                                }
                            })
                        }else if(res.data.code === 100041){
                            this.codeErrMsg=res.data.msg;
                        }
                    })
                }
            })
        },
        getCode( code ){
            this.formData.code = code;
        }
        //获取验证码
        // getCode(){
        //     const params = {
        //         step:'1',
        //         username:this.$route.query.username
        //     }
        //     this.$http({
        //         url:'/api/member/find_pwd',
        //         method:'post',
        //         data:params
        //     }).then(res=>{
        //         if(res.data.code === 100001 ){
        //             this.queryData = Object.assign({},this.queryData,res.data.data[0]);
        //         }
        //     })
        // },
    },

    created(){
        this.queryData = Object.assign({},this.queryData,this.$route.query);
    }
}
</script>

