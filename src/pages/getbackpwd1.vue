<template>
    <section class="page-getpwd1">
        <Title title="找回密码" />
        <section class="form-box">
                <el-form 
                    :model="formData"
                    :rules="rules"
                    label-width="120px"
                    ref = "formData1"
                    class="form-content"
                >
                    <el-form-item label="掌云ID/手机号" prop="userName">
                        <el-input 
                            type="text"
                            v-model="formData.userName"
                            placeholder="请输入掌云ID或手机号" />
                    </el-form-item>
                    <el-form-item label="验证码" prop="num_checkCode" class="getCode">
                        <el-input 
                            type="text"
                            v-model="formData.num_checkCode"
                            placeholder="请输入验证码" />
                        <span class="showCode" @click="getCode">{{checkCode}}</span>
                    </el-form-item>
                    <el-form-item class="form-item-last">
                        <button class="btns large" @click.prevent="sign('formData1')">下一步</button>
                    </el-form-item>
                </el-form>
            </section>
    </section>
</template>
<script>
import Title from '@/components/title';
import rules from '@/util/rules';
export default {
    name:'Getback-step1',
    components:{
        Title,
    },
    data(){
        return {
            formData:{
                userName:'',
                num_checkCode:''
            },
            rules:{
                userName:{required:true,message:'请输入掌云ID或手机号',trigger:'blur'},
                num_checkCode:{required:true,pattern:/^\d{6}$/,message:'请输入6位数字验证码',trigger:'blur'},
            },
            checkCode:'',
        }
    },
    methods:{
        //登录
        sign(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(this.checkCode !== this.formData.num_checkCode){
                        this.$message({
                            message:'验证码错误',
                            type:'warning'
            
                        })
                        this.getCode();
                        return false;
                    }
                    const params = { 
                        // step:'1',
                        userName:this.formData.userName
                    }
                    this.$http({
                        // url:'/api/member/find_pwd_web',
                        url:'/api/member/check_phone',
                        method:'post',
                        data:params
                    }).then(res=>{
                        if(res.data.code === 100001){
                            if( res.data.data.exists=='1' ){
                                this.$router.push({
                                    name:'Getpwd2',
                                    query:{
                                        phone:res.data.data.phone,
                                        userName:this.formData.userName
                                    }
                                })
                            }else{
                                this.$message({
                                    type:'error',
                                    message:'掌云ID不存在'
                                })
                                this.getCode();
                            }
                        } else {
                            this.getCode();
                        }
                    })
                }
            })
        },
        //获取验证码
        getCode(){
            const arr = '1234567890'.split('');
            let str = '';
            for(let i = 6; i--;){
                let random = Math.floor( Math.random() * arr.length );
                str += arr[random];
            }
            this.checkCode = str;
        },
    },
    created(){
        this.getCode();
    }
}
</script>
<style lang="scss" scoped>
    .page-getpwd1{
        .showCode{ display:inline-block;vertical-align:top; text-align:center; cursor:pointer; font-size:18px;}
        .getCode {
            &  a{color:#5cbbf4; margin-left:10px; line-height:46px; padding:0 5px;}
        }
    }
</style>
