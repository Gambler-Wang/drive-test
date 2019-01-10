<template>
    <section class="page-register">
        <Title title="注册掌云掌云ID" />
        <!-- <section class="register-box">
            <form class="form" 
                :rules = "testrules"
            >
                <ul>
                    <li :class="['form-item',valid ? 'valid':'invaild']">
                        <label>手机号</label>
                        <input type="text" v-model="formdata.phone" 
                            placeholder="可用于登录和密码找回"
                            @blur="checkInput(rules.phone)"
                        >
                        <section class="form-item-tip">
                            <p>请输入中国大陆手机号</p>
                        </section>
                        <section class=" form-item-invalid">
                            <p>手机号格式错误</p>
                        </section>
                        <section class="form-item-valid"></section> 
                    </li>
                    <li class="form-item">
                        <label>掌云ID</label>
                        <input type="text" v-model="formdata.userName" placeholder="请设置掌云ID">
                        <section class="form-item-tip form-item-err">
                            <p>设置后不可更改</p>
                            <p>最长为7个汉字或者14个英文字母</p>
                        </section> 
                    </li>
                    <li class="form-item">
                        <label>密码</label>
                        <input type="passwrod" v-model="formdata.pwd" placeholder="请设置登录密码">
                        <section  class="form-item-tip form-item-err">   
                            <ol>
                                <li>长度为6-14个字符</li>
                                <li>支持数字、大小写字母和标点符号</li>
                                <li>不允许有空格</li>
                            </ol>
                        </section>
                    </li>
                    <li class="form-item">
                        <label>确认密码</label>
                        <input type="passwrod" v-model="formdata.check_pwd" placeholder="请确认登录密码">
                        <section class="form-item-invalid">
                            <p>两次输入的面不一致</p>
                        </section> 
                    </li>
                    <li class="form-item getCode">
                        <label>验证码</label>
                        <input type="text" v-model="formdata.code" placeholder="请输入验证码">
                        <button class="btn">获取短信验证码</button>
                        <section class="form-item-invalid">
                            <p>请输入手机号</p>
                        </section> 
                    </li>
                    <li class="form-item protocol">
                        <input type="checkbox" checked id="protocol">
                        <label for="protocol">阅读并同意</label><router-link to="/protocol">《网盘使用协议》</router-link>
                        <section class="form-item-invalid">
                            <p>请勾选“阅读并同意网盘使用协议”</p>
                        </section>
                    </li>
                    <li class="form-item"><button class="btns large" @click.prevent="sign('formData1')">注册</button></li>
                </ul>
            </form>
        </section> -->
        
        <section class="form-box">
            <el-form
                :model="formData"
                :rules="rules"
                label-width="80px"
                ref = "formData1"
                class="form-content"
            > 
                <el-form-item prop="userName" label="掌云ID" :error="errMsg.userNameErrMsg">
                    <el-input
                        type="text"
                        v-model="formData.userName"
                        placeholder="掌云ID设置后不可更改" 
                        @focus="tips('userName')" @blur="currentInput = ''" 
                    />
                    <!-- <p class="info-tips" v-if="currentInput === 'userName'">掌云ID设置后不可更改</p> -->
                    <section class="info-tips" v-if="currentInput === 'userName'">   
                        <ol>
                            <li>掌云ID设置后不可更改</li>
                            <li>长度为6-20位字符</li>
                            <li>支持数字、大小写字母、下划线及-</li>
                            <li>不允许为纯数字</li>
                            <li>不允许有空格</li>
                        </ol>
                    </section>
                </el-form-item>
                <el-form-item prop="phone" label="手机号" :error="errMsg.phoneErrMsg">
                    <el-input
                        type="text"
                        v-model="formData.phone"
                        placeholder="可用于登陆和密码找回" 
                        @focus="tips('phone')" @blur="currentInput = ''" 
                    />
                    <p class="info-tips" v-if="currentInput === 'phone'">请输入大陆手机号</p>
                        
                </el-form-item>
                <el-form-item prop="pwd" label="密码">
                    <el-input
                        type="password"
                        v-model="formData.pwd"
                        placeholder="6-14位数字、字母或特殊符号组成" 
                        @focus="tips('pwd')" @blur="currentInput = ''"
                    />
                    <section class="info-tips" v-if="currentInput === 'pwd'">   
                        <ol>
                            <li>长度为6-14个字符</li>
                            <li>支持数字、大小写字母和特殊符号</li>
                            <li>不允许有空格</li>
                        </ol>
                    </section>
                </el-form-item>
                <el-form-item prop="check_pwd" label="确认密码">
                    <el-input
                        type="password"
                        v-model="formData.check_pwd"
                        placeholder="请输入相同的密码" />
                </el-form-item>
                <el-form-item prop="code" class="getCode" label="验证码" :error="errMsg.codeErrMsg">
                    <el-input
                        type="text"
                        v-model="formData.code"
                        placeholder="请输入验证码" />
                        <code-btn :phone="this.formData.phone" type="2" @getCode="getCode"></code-btn>
                </el-form-item>
                <!-- <el-form-item prop="invitationCode" label="邀请码">
                    <el-input
                        type="text"
                        v-model="formData.invitationCode"
                        placeholder="请输入邀请码(选填)" />
                </el-form-item> -->
                <el-form-item class="protocol">
                    <el-checkbox v-model="checked" />
                    <label for="protocol">阅读并同意</label><router-link tag="a"  target="_blank" to="/protocol">《网盘使用协议》</router-link>
                    <section class="form-item-invalid" v-show="!checked">
                        <p>请勾选“阅读并同意网盘使用协议”</p>
                    </section>
                </el-form-item>
                <el-form-item>
                    <button class="btns large" @click.prevent="sign('formData1')">注册</button>
                </el-form-item>
            </el-form>
        </section>
        <transition name="fade">
            <section class="register-success" v-if="successFlag">
                <img src="../assets/images/register_toast_icon_ok.png" />
                <p>注册成功</p>
            </section>
        </transition>
    </section>
</template>
<script>
import Title from '@/components/title';
import rules from '@/util/rules';
import CodeBtn from '@/components/codebtn';
import FormItme from '@/components/form-item';
import MyForm from '@/components/form';
import reg from '@/util/reg';
export default {
    name:'Register',
    components:{
        Title,
        FormItme,
        MyForm,
        CodeBtn
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
        const check_pwd ={
            check_pwd:[
                {required:true,message:'确认密码不能为空',trigger:'blur'},
                {required:true,validator:checkpwd,message:'两次密码不一致',trigger:'blur'},
                {pattern:reg.pwd,message:"密码由6-14位数字、字母以及符号组成",trigger:'blur'},
            ]
        } 
    
        return {
            formData:{
                userName:'',
                pwd:'',
                check_pwd:'',
                phone:'',
                code:'',
                // invitationCode:''
            },
            formdata:{
                userName:'',
                pwd:'',
                check_pwd:'',
                phone:'',
                code:'',

            },
            rules:Object.assign({},rules,check_pwd),
            testrules:{
                phone:[
                    {pattern:'/^\d{11}$/',message:'手机号错误',event:'blur'}
                ]
            },
            currentInput:'',
            checked:true,
            successFlag:false,
            errMsg:{
                userNameErrMsg:'',  // 后台返回掌云ID报错信息
                phoneErrMsg:'',  // 后台返回手机号报错信息
                codeErrMsg:'', // 后台返回验证码报错信息
            }
        }
    },
    methods:{
        sign(formName){
            var that =this;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    const account = {
                        pwd:this.$md5(this.formData.pwd),
                        check_pwd:this.$md5(this.formData.check_pwd)
                    }
                    const params = Object.assign({},this.formData,account)
                    if(this.checked){
                        this.$http({
                            url:'/api/member/register',
                            method:'post',
                            data:params
                        }).then(res=>{
                            if(res.data.code === 100001 ){
                                this.successFlag = true;
                                setTimeout(() => {
                                    this.$router.push({
                                        path:'/login',
                                    })
                                }, 1500);
                            }else if(res.data.code === 100011){
                                this.errMsg.userNameErrMsg='';
                                setTimeout(function(){that.errMsg.userNameErrMsg=res.data.msg;},100)
                                // this.errMsg.userNameErrMsg=res.data.msg;
                            }else if(res.data.code === 100012){
                                this.errMsg.phoneErrMsg='';
                                setTimeout(function(){that.errMsg.phoneErrMsg=res.data.msg;},100)
                                //this.errMsg.phoneErrMsg=res.data.msg;
                            }else if(res.data.code === 100041){
                                this.errMsg.codeErrMsg='';
                                setTimeout(function(){that.errMsg.codeErrMsg=res.data.msg;},100)
                                //this.errMsg.codeErrMsg=res.data.msg;
                            }
                        })
                    }else{
                         this.$message({
                            message: '请勾选“阅读并同意网盘使用协议”',
                            type: 'warning',
                            duration:1500
                        });
                    }
                }
            })
        },
        //获取验证码
        getCode(code){
            this.formData.code = code;
        },
        checkInput(){},
        tips(elName){
            const event = window.event;
            if( event.target.value.length === 0 ){
                this.currentInput = elName;
            }
            // const el = this.$refs[ref];
            // el.style.display = "inline-block;"
        }
    },
    created(){
        // console.log( navigator.userAgent )
    }
}
</script>
<style lang="scss" scoped>
.page-register{
    width:100%; position:relative;
    & .form-content{
        & .info-tips{ display:inline-block;position:absolute;z-index:9; left:420px;vertical-align:top; background-color:#fff; color:#87949d;}
        & p.info-tips{ line-height:46px;}
        & section.info-tips{ 
            display:inline-block; position:absolute;top:0;
            line-height: 22px; 
            background-size:16px 16px;
            font-size:12px;
            & > ol{
                background-color:#eff3f8; border:1px solid #d3dbe1; padding:15px 25px; padding-right:15px;position:relative;
                & > li{ list-style:square;}
            }
            & > ol:after,
            & > ol:before{
                content:''; display:block; position:absolute; left:-16px; top:10px; border:8px solid transparent;
                border-right-color:#eff3f8;z-index:2;
            }
                & > ol:after{
                    z-index:1; left:-17px; border-right-color:#d3dbe1;
                }
        }
    }























    /**/
    // .register-box{padding-top:85px; text-align:center;}
    // form.form{
    //     display:inline-block;vertical-align: top; margin:0 auto;text-align:left; width:860px; 
    //     .form-item{position:relative; margin-top:25px;
    //         & > section{ 
    //             display:none; position:absolute;top:0; left:510px;
    //             padding:12px;padding-left:20px;line-height: 22px; 
    //             background-size:16px 16px;
    //             & > ol{
    //                 background-color:#eff3f8; border:1px solid #d3dbe1; padding:15px 25px;position:relative;
    //                 & > li{ list-style:square;}
    //             }
    //             & > ol:after,
    //             & > ol:before{
    //                 content:''; display:block; position:absolute; left:-16px; top:10px; border:8px solid transparent;
    //                 border-right-color:#eff3f8;z-index:2;
    //             }
    //              & > ol:after{
    //                  z-index:1; left:-17px; border-right-color:#d3dbe1;
    //              }
    //         }
    //         & > section.form-item-tip{
    //             color:#87949d;
    //         }
    //         .form-item-valid{background:url(~@/assets/images/tips_icons_right1.png) left center no-repeat;}
    //         .form-item-invalid{background:url(~@/assets/images/tips_icons_wrong1.png) left center no-repeat;color:#fc4343;}
    //         & label{ display:inline-block;vertical-align:top; width:80px;
    //         line-height:46px;text-align:right;color:#5a5a5a;margin-right:10px;}
    //         & input{ height:46px; width:406px; border:1px solid #d3dbe1; 
    //         padding:10px 5px; box-sizing:border-box; outline:none;}
    //         // & input:invalid{ border:1px solid #fc4343;}
    //         // & input:invalid ~ .form-item-invalid{display:block;}
    //         // & input:valid{ border-color:#67c23a;}
    //         // & input:valid ~ .form-item-valid{ display:block;}
    //         & input:focus{ border-color: #5cbbf4 !important;}
    //         // & input:focus ~ section{ display:none;}
    //         & input:focus ~ .form-item-tip{display:block;}
    //         & .large{width:406px; margin-left:95px;}
    //     }
    //     .form-item.getCode{
    //         & input{ width:200px; }
    //         & .btn{ height:45px; line-height:43px; width:193px; margin-left:8px;color:#5a5a5a;background-color: #eff3f8;
	// border: solid 1px #d3dbe1;border-radius: 0;}
    //     }
    //     .form-item.protocol{
    //         height:16px;line-height:16px; vertical-align: top;
    //         & input{ width:16px; height:16px; padding:0;margin:0; margin-left:95px; vertical-align: top;}
    //         & label{display:inline;line-height:16px; vertical-align: top;}
    //         & a{ color:#5cbbf4; line-height:16px; vertical-align: top;}
    //         & .form-item-invalid{display:block; padding:0; padding-left:20px; line-height:16px; left:310px;}
    //          & input:checked ~ .form-item-invalid{display:none;}
    //     }        
    //     .form-item.err{
    //         input{ border:1px solid #fc4343;}
    //     } 
    // }
    & .register-success{
        padding:20px 50px; background:rgba(0,0,0,0.6); border-radius:5px; position:absolute;top:50%; left:50%; transform: translate(-50%,-50%);text-align:center;
        & >p {font-size:18px; color:#fff;  margin-top:20px;}
    }
} 

   
</style>
