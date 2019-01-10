<template>
    <button class="btn" ref="codebtn" :disabled = "disabled" @click.prevent="getCode">{{text}}</button>
</template>

<script>
    import Reg from '@/util/reg';
    export default {
        name:"CodeBtn",
        props:{
            phone:{
                type:String | Number  //电话号码
            },
            userName:String,
            type:String,
        },
        data(){
            return {
                disabled:false,
                text:'获取短信验证码',
            }
        },
        methods: {
            getCode() {
                
                if( !this.phone && !this.userName ){
                    this.$message({
                        message:'请输入手机号码',
                        type:'warning',
                    })
                    return false;
                }
                if(this.phone && !(Reg.phone.test(this.phone))){
                    this.$message({
                        message:'手机号格式错误',
                        type:'warning',
                    })
                    return false;
                }
                
                if(this.userName){
                    this.getCodeUsername();
                    return false;
                }
                const params = {
                    phone:this.phone,
                    type : this.type
                };
                this.getCodeUsername(params)
            },
            //获取验证码
            getCodeUsername( arg ){
                const params = arg ? arg : { 
                    type:this.type,
                    userName:this.$route.query.userName,
                    phone:this.$route.query.phone,
                }
                this.$http({
                    url:'/api/member/send_code',
                    method:'post',
                    data:params
                }).then(res=>{
                    if(res.data.code === 100001 ){
                        if(res.data.data.exists === '1' && this.type === '2'){
                            this.$message({
                                type:'warning',
                                message:'手机号已存在'
                            })
                        } else {
                            this.disabled = true;
                            let time = 60;
                            let setTime = setInterval(()=>{
                                if(time === 1 ){
                                    this.text = `获取短信验证码`;
                                    this.disabled = false;
                                    clearInterval(setTime);
                                } else {
                                    time--;
                                    this.text = `${time}秒后重新获取验证码`
                                }
                            },1000);
                        }
                    }
                })   
            },
        },
    }
</script>

<style scoped>
    
</style>