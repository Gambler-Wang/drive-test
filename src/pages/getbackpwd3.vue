<template>
    <section class="page-getpwd">
        <Title title="找回密码" />
        <section class="form-box">
            <el-form 
                :model="formData"
                :rules="rules"
                label-width="80px"
                ref = "formData1"
                class="form-content"
            >
                <h2 class="form-item-title"><span>你要找回的掌云ID是：</span>{{queryData.userName}}</h2>
                <el-form-item prop="pwd" label="新密码">
                    <el-input 
                        type="password"
                        v-model="formData.pwd"
                        placeholder="密码，6-16位字母及数字组合" />
                </el-form-item>
                <el-form-item prop="check_pwd" label="确认密码">
                    <el-input 
                        type="password"
                        v-model="formData.check_pwd"
                        placeholder="确认密码" />
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
import reg from '@/util/reg';
export default {
    name:'Getback-step1',
    components:{
        Title,
    },
    data(){
        const checkpwd=(rule,value,callback)=>{
            if(!value){
                callback(new Error('请再次输入密码'))
            }else if(value != this.formData.pwd){
                callback(new Error('两次输入密码不一致'))
            }else{
                callback();
            }
        }
        return {
            formData:{
                pwd:'',
                check_pwd:''
            },
            queryData:{},
            rules:{
                pwd:rules.pwd,
                check_pwd:[
                    {required:true,message:'确认密码不能为空',trigger:'blur'},
                    {required:true,validator:checkpwd,message:'两次密码不一致',trigger:'blur'},
                    {pattern:reg.pwd,message:"密码由6-14位数字、字母以及符号组成",trigger:'blur'},
                ]
            }
        }
    },
    methods:{
        //登录
        sign(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    const params = { 
                        pwd:this.$md5(this.formData.pwd),
                        check_pwd:this.$md5(this.formData.check_pwd),
                        userName:this.$route.query.userName,
                        phone:this.$route.query.phone,
                        step:'3'
                    }
                    this.$http({
                        url:'/api/member/find_pwd_web',
                        method:'post',
                        data:params
                    }).then(res=>{
                        if(res.data.code === 100001 ){
                            this.$router.push({
                                path:'/getpwd4',
                            })
                        }
                    })
                }
            })
        },
        //获取验证码
        getCode(){
            if(!(/^1\d{10}$/.test(this.formData.phone))){
                this.$message({
                    message:'请输入手机号码',
                    type:'warning'
                })
                return false;
            }
            const params = {phone:this.formData.phone};
            this.$http({
                url:'/api/sms/send_code',
                method:'post',
                data:params
            }).then(res=>{
                if(res.data.code === 100001 ){
                    this.formData.code = res.data.data.code;
                }
            })
        },
    },
    created(){
        this.queryData = Object.assign({},this.queryData,this.$route.query);
    }
}
</script>


