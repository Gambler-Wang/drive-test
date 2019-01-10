import Vue from 'vue';
import axios from 'axios';
const qs = require('querystring');
const _this = new Vue();
axios.interceptors.request.use(config => {
    // console.log(config.data,config.url);
    if(config.headers['Content-Type'] === "multipart/form-data"){

        let formdata = new FormData(),
            data = _this.$sign(config.data,config.url);
        for(let key in data){
            formdata.append(key,data[key])
        }
        config.data = formdata;
    } else if(config.method === "get"){
        config.params = _this.$sign(config.params,config.url);
    } else {
        config.data = _this.$sign(config.data,config.url)
    }


    // Object.assign(config.headers,{
    //     'Content-Type':'application/json',
    //     'deviceType':'web'
    // });

    // console.log(config.data.file&&config.data.file.has(file))
    return config;
}, error=>Promise.reject(error));

axios.interceptors.response.use(res=>{
    //100201 预上传成功
    //100081 移动目标文件名已存在
    //100101 100102 100103分享文件被删除,失效,取消
    //100091 提取码错误
    // 100071 文件不存在
    if(res.data.code === 100001 || res.data.code===100081 || res.data.code ===100201 ||res.data.code ==="10005" || res.data.code === 100101 || res.data.code === 100102 || res.data.code === 100103 || res.data.code === 100091 || res.data.code === 100071
    ){
        return res;
    } else {
       // token失效处理
        if( res.data.code === 110002){
          localStorage.removeItem("token");
          localStorage.removeItem("userInfo");
          _this.$message({
              type:'error',
              message:res.data.msg
          });
        //   _this.$router.replace({path:'/login'});
          setTimeout(function () {
            //   _this.$router.replace({path:'/login'});
              window.location.href = '/';
          },1500)
          return ;
        }
        if(res.data.code === "10002" && res.data.msg==="目标文件记录id错误"){
            _this.$message({
                message:res.data.msg,
                type:'error',
                duration:1000
            });
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
            return ;
        }
        _this.$message({
            message:res.data.msg,
            type:'error',
          duration:1000
        });
        return res;
    }

},error => Promise.reject(error))
export default axios;
