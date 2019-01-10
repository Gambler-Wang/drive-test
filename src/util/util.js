import Vue from 'vue';
const md5 = require('js-md5');
const SparkMD5 = require('spark-md5');
import axios from './axios.config'
// const AWS = require('aws-sdk');
// const S3 = require('aws-sdk/clients/s3');




function createNonce( num ){
    const arr = '1234567890qwertyuiopasdfghlkjmnbvcxz'.split('');
    let str = '';
    for(let i = num; i--;){
        let random = Math.floor( Math.random() * arr.length );
        str += arr[random];
    }
    return str;
}
function method(str){
    const arr = str.split('/');
    return arr[2];
}
// class Upload {
//     constructor(){}
// }
const MyPlugin = {
    install(Vue,options){
        const prototypes = {
            $http : axios,
            $format :function( obj ){
                if( obj.constructor === Object ){
                    const keys = Object.keys(obj).sort();
                    let newObj = {};
                    for(let item of keys){
                        newObj[item] = obj[item];
                    }
                    return newObj;
                } else {
                    new Error(`${obj}不是对象`);
                }
            },
            $removeObjectNull(obj){
                for(let key in obj){
                    // console.log(!obj[key])
                    if(!obj[key]){
                        delete obj[key];
                    }
                }
                return obj;
            },
            $md5:function(str){
                return str;
                // if(str){
                //     return md5(str);
                // }
            },
            IEVersion(){
                var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
                var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
                var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
                var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
                if(isIE) {
                    var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
                    reIE.test(userAgent);
                    var fIEVersion = parseFloat(RegExp["$1"]);
                    if(fIEVersion == 7) {
                        return 7;
                    } else if(fIEVersion == 8) {
                        return 8;
                    } else if(fIEVersion == 9) {
                        return 9;
                    } else if(fIEVersion == 10) {
                        return 10;
                    } else {
                        return 6;//IE版本<=7
                    }
                } else if(isEdge) {
                    return 12;//edge
                } else if(isIE11) {
                    return 11; //IE11
                }else{
                    return -1;//不是ie浏览器
                }
            },
            //判断浏览器
            getBroswer(){
                const agent = navigator.userAgent;
                if(agent.indexOf('Firefox') > -1){
                    return '火狐浏览器'
                } else if( agent.indexOf('MSIE') > -1 || agent.indexOf('Edge') > -1 || agent.indexOf('Trident') > -1){
                    return 'IE浏览器'
                } else if( agent.indexOf('Chrome') > -1 ){
                    return '谷歌浏览器'
                } else if(agent.indexOf('Safari') > -1 && agent.indexOf('Chrome') < 0 ){
                    return 'Safari浏览器'
                }else if( agent.indexOf('Opera') > -1 ){
                    return '欧朋浏览器'
                } else {
                    return '未知浏览器'
                }
            },
            getFileMD5(fileObj){
                const promise = new Promise(function(resolve,reject){
                    let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
                        file = fileObj.file || fileObj,
                        chunkSize = 5*1024*1024,                             // Read in chunks of 5MB
                        chunks = Math.ceil(file.size / chunkSize),
                        currentChunk = 0,
                        spark = new SparkMD5.ArrayBuffer(),
                        fileReader = new FileReader();
                    fileReader.onload = function (e) {
                      spark.append(e.target.result);                   // Append array buffer
                        currentChunk++;

                        if (currentChunk < chunks) {
                            loadNext();
                        } else {
                            resolve(spark.end());
                            // console.log('finished loading');
                            // console.info('computed hash', spark.end());  // Compute hash
                        }
                    };
                    function loadNext() {
                        var start = currentChunk * chunkSize,
                            end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;

                        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
                    }
                    loadNext();

                });
                return promise;
            },
            async $filemd5(fileObj,id){
                const _this = this;
                const filemd5 = await this.getFileMD5(fileObj);
                const config = await (function(md5){
                    const params = {
                        name:fileObj.name,
                        fileSize:fileObj.size,
                        md5:md5,
                        parentId:id,
                        path:fileObj.webkitRelativePath
                    }
                    const sendAjax = _this.$http({
                        url:'/api/ceph/preupload',
                        method:'post',
                        data:params
                    })
                  return sendAjax;
                })(filemd5);
                return config;
            },
            $sign:function(obj,url){
                const app_secret = "VDDC65m9oz9kr4P5";
                let params = {
                    appId:'100001',
                    timestamp:new Date().getTime(),
                    device:"1",
                    version:'1.0.0',
                    token:localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : '',
                    nonce:createNonce(32)
                }
                let reqData = this.$format(Object.assign({}, params, obj));
                reqData = this.$removeObjectNull(reqData);
                let str = Object.entries(reqData).map( item => {
                    // if(item[0]=="file"){
                    //     return '';
                    // }
                    return item.join('');
                }).join('');
                const signData = {sign : md5(`${app_secret}${str}${app_secret}`)};
                return this.$format(Object.assign({},reqData,signData));
                // return signData;
            },
            sizeFormat(size){
                if( size === null || size === 'null' ) return '未知';
                if(size == "0"){
                    return '0KB';
                }
                let i = 0,
                    sizeStr;
                do{
                    size = size/1024;
                    i++;
                } while ( size > 1024 );
                switch(i){
                    case 1:
                        if( size < 1 ){
                            sizeStr = `1KB`;
                        } else {
                            sizeStr = `${size.toFixed(2)}KB`;
                        }
                        break;
                    case 2:
                        sizeStr = `${size.toFixed(2)}M`
                        break;
                    case 3:
                        sizeStr = `${size.toFixed(2)}G`
                        break;
                    default:
                        sizeStr = `${size.toFixed(2)}KB`;

                }
                return sizeStr;
            },
            //ydh 处理修改名称显示问题
            filterName(v){

              if(v.lastIndexOf('.')==-1){
                return v
              }else {
                return  v.slice(0 , v.lastIndexOf('.'))
              }
          },
            //ydh手机号加*
            phoneFilters(val){
              return String(val).slice(0,3)+"****"+String(val).slice(-4)
            },
           //ydh限定字符数15个
           textFilters(val){
              if(val.length>15){
                return val.slice(0,15)+"..."
              }else {
                return val
              }
          },
           clientApp(msg){
                this.$confirm(msg, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //跳转到客户端下载
                }).catch(()=>{

                })
            },
            createDownUrl( data ){
              if(Array.isArray(data).length > 1){
                    //判断多文件下载；
                    this.clientApp('web暂不支持多文件下载，建议使用客户端下载')
                    return ;
                } else {
                    data = data[0];
                }
               if(data.fileType =="1" ){
                   //不支持文件夹下载；
                   this.clientApp('web暂不支持文件夹下载，建议使用客户端下载')
                   return ;
               }
               if(data.fileSize > 150*1024*1024){
                //    this.$message({
                //        type:'warning',
                //        message:'文件过大，建议使用客户端下载'
                //    })
                   this.clientApp('文件大于150MB，建议使用客户端下载')
                   return ;
               }
              this.$http({
                    url:'/api/ceph/web_download',
                    method:'post',
                    data:{fileId:data.id}
                }).then(res=>{
                    if(res.data.code === 100001 ){
                        console.log( res.data.data );
                        let el = document.createElement('a');
                        el.setAttribute('href',res.data.data.url);
                        el.style.fontSize = 0
                        document.body.appendChild(el);
                        el.click();
                        document.body.removeChild(el);
                        el = null;
                    }
                }).catch(err=>console.log(err))



                // let url = '',
                //     path = '/api/ceph/download',
                //     params = Object.entries(this.$sign( data, path));
                // params = params.map(item=>item.join('=')).join('&');
                // url = `http://120.79.193.155:8005/api/download/download?${params}`;
                // return url;
            },
            dataFormat(timestamp) {
              if(typeof Number(timestamp) !='number'){
                return ''
              }
                var date = new Date(Number(timestamp)*1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                 var  Y = date.getFullYear() + '-';
                 var  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                 var  D = date.getDate() < 10 ? '0'+date.getDate()+" " : date.getDate() +'  ';
                 var  h = date.getHours() < 10 ? '0'+date.getHours()+":" : date.getHours()+ ':';
                 var  m = date.getMinutes() < 10 ? '0'+date.getMinutes()+":" : date.getMinutes()+ ':';
                 var  s = date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds();
                return Y+M+D+h+m+s;
            },
            // b64EncodeUnicode(str) {
            //     return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
            //         return String.fromCharCode('0x' + p1);
            //     }));
            // },
            // b64DecodeUnicode(str) {
            //     return decodeURIComponent(atob(str).split('').map(function(c) {
            //         return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            //     }).join(''));
            // },
            Base64 : {
                _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
                b64EncodeUnicode: function(e) {
                    var t = "";
                    var n, r, i, s, o, u, a;
                    var f = 0;
                    e = this._utf8_encode(e);
                    while (f < e.length) {
                    n = e.charCodeAt(f++);
                    r = e.charCodeAt(f++);
                    i = e.charCodeAt(f++);
                    s = n >> 2;
                    o = (n & 3) << 4 | r >> 4;
                    u = (r & 15) << 2 | i >> 6;
                    a = i & 63;
                    if (isNaN(r)) {
                    u = a = 64
                    } else if (isNaN(i)) {
                    a = 64
                    }
                    t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
                    }
                    return t
                },
                b64DecodeUnicode: function(e) {
                    var t = "";
                    var n, r, i;
                    var s, o, u, a;
                    var f = 0;
                    e=e.replace(/[^A-Za-z0-9+/=]/g,"");
                    while (f < e.length) {
                    s = this._keyStr.indexOf(e.charAt(f++));
                    o = this._keyStr.indexOf(e.charAt(f++));
                    u = this._keyStr.indexOf(e.charAt(f++));
                    a = this._keyStr.indexOf(e.charAt(f++));
                    n = s << 2 | o >> 4;
                    r = (o & 15) << 4 | u >> 2;
                    i = (u & 3) << 6 | a;
                    t = t + String.fromCharCode(n);
                    if (u != 64) {
                    t = t + String.fromCharCode(r)
                    }
                    if (a != 64) {
                    t = t + String.fromCharCode(i)
                    }
                    }
                    t = this._utf8_decode(t);
                    return t
                },
                _utf8_encode: function(e) {
                    e = e.replace(/rn/g, "n");
                    var t = "";
                    for (var n = 0; n < e.length; n++) {
                    var r = e.charCodeAt(n);
                    if (r < 128) {
                    t += String.fromCharCode(r)
                    } else if (r > 127 && r < 2048) {
                    t += String.fromCharCode(r >> 6 | 192);
                    t += String.fromCharCode(r & 63 | 128)
                    } else {
                    t += String.fromCharCode(r >> 12 | 224);
                    t += String.fromCharCode(r >> 6 & 63 | 128);
                    t += String.fromCharCode(r & 63 | 128)
                    }
                    }
                    return t
                },
                _utf8_decode: function(e) {
                    var t = "";
                    var n = 0;
                    var c1,c2,c3;
                    var r = c1 = c2 = 0;
                    while (n < e.length) {
                    r = e.charCodeAt(n);
                    if (r < 128) {
                    t += String.fromCharCode(r);
                    n++
                    } else if (r > 191 && r < 224) {
                    c2 = e.charCodeAt(n + 1);
                    t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                    n += 2
                    } else {
                    c2 = e.charCodeAt(n + 1);
                    c3 = e.charCodeAt(n + 2);
                    t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                    n += 3
                    }
                    }
                    return t
                }
            },
            getCookie(name) {
                var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
                if (arr = document.cookie.match(reg))
                    return (arr[2]);
                else
                    return null;
            },
            setCookie (c_name, value, expiredays) {
                var exdate = new Date();
                exdate.setDate(exdate.getDate() + expiredays);
                document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
            },
            delCookie (name) {
                var exp = new Date();
                exp.setTime(exp.getTime() - 1);
                var cval = this.getCookie(name);
                if (cval != null)
                    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
            }
        }
        Vue.prototype = Object.assign(Vue.prototype,prototypes);
        Vue.directive('focus', {
           // ：1-bind 被绑定，  2-inserted 被插入， 3-update 开始更新， 4-componentUpdated 更新完成，5-unbind 解除绑定。
           inserted: function (el) {
             // 聚焦元素
             if(el.nodeName.toUpperCase() === 'INPUT' || el.nodeName.toUpperCase() === 'TEXTAREA'){
               el.focus()
             }
           }
        })
        Vue.directive('maxLength',function(el,bunding){
            const max = bunding.arg ? Number.parseInt( bunding.arg ) : 15;
          if((typeof bunding.value) === 'string' && bunding.value.length > max){
                el.innerHTML = bunding.value.slice(0,max)+'...';
            }else{
                el.innerHTML = bunding.value;
            }
            el.setAttribute('title',bunding.value);
        });
        // 文件类型图标
        Vue.directive('addIcon',function (el, bunding) {
          switch (bunding.value){
            case 1:{
              el.className = 'img-size icon icon-folder';
              break;
            }
            case 2:{
              el.className = 'img-size icon icon-image';
              break;
            }
            case 3:{
              el.className = 'img-size icon icon-excel';
              break;
            }
            case 4:{
              el.className = 'img-size icon icon-video';
              break;
            }
            case 5:{
              el.className = 'img-size icon icon-music';
              break;
            }
            case 6:{
              el.className = 'img-size icon icon-bts';
              break;
            }
            case 7:{
              el.className = 'img-size icon icon-unknow';
              break;
            }
            default:{
              el.className = 'img-size icon icon-folder';
              break;
            }
          }
        })
    }
}

export default MyPlugin;
