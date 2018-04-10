/**
 * Created by GraceLea on 2017/10/23.
 */
 web_url = "http://10.10.7.11:8082/";
//web_url = "http://10.10.3.83:8082/";//陈飞*/
//web_url = "http://10.10.2.244:8082/";//董志博*/
//web_url = "http://www.clpremed.com:8082/";//生产*/

$.extend({
    /**
     * @param ele  分页容器
     * @param num_entries  //数据总数
     * @param pageselectCallback  //回调函数
     * @param per_items  //每页显示的数据条目
     */
    paging: function (ele, num_entries, pageselectCallback, per_items) {
        per_items = per_items || 10;
        ele.pagination(num_entries, {
            current_page: 0,
            callback: pageselectCallback,
            items_per_page: per_items, //每页显示10项
            load_first_page: false,
            num_edge_entries: 1, //边缘页数
            num_display_entries: 4, //主体页数
            prev_text: "上一页",
            next_text: "下一页"
        });
    },
    /**
     * get 方式，返回类型 json【包含code,对code进行处理】
     * //pc端用msg,移动端用open layer.msg
     * @param url
     * @param d
     * @param callback
     */
    ajaxByGet: function (url, d, callback) {
        var loadIndex = layer.load();
        jQuery.ajax({
            url: web_url + url,
            type: 'GET',
            contentType: "application/json; charset=utf-8",
            data: d,
            cache: false,
            dataType: 'json',
            success: function (data) {
                if (data.code == 201) {
                    layer.msg("Created");
                } else if (data.code == 401) {//token 过期
                    window.location.href = "login.html";
                    /*layer.msg("Unauthorized");*/
                } else if (data.code == 402) {//token 参数丢失
                    window.location.href = "login.html";
                   /* layer.msg("Unauthorized");*/
                } else if (data.code == 404) {
                    layer.msg("Not Found");
                } else if (data.code == 20007 || data.code == 740) {
                    if (url != "login/login") {
                        localStorage.current_url = window.location.href;
                    }
                    window.location.href = "login.html";
                } else {
                    callback(data);
                }
                layer.close(loadIndex);
            },
            error: function () {
                layer.close(loadIndex);
                localStorage.current_url = "";
                layer.open('获取数据失败请稍后再试！');
            }
        });
    },
    /**pc端
     * post 方式，返回类型 json【包含code,对code进行处理】
     * //pc端用msg,移动端用open
     * @param url
     * @param d
     * @param callback
     */
    ajaxByPost: function (url, d, callback, loading) {
        // loading = loading==undefined?false:true;
        // var loadIndex;
        // if(!loading)(
        //     loadIndex = layer.load()
        // );
        jQuery.ajax({
            url: web_url + url,
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(d),//JSON.stringify(d)
            cache: false,
            dataType: 'json',
            success: function (data) {
                if (data.code == 201) {
                    layer.msg("Created");
                } else if (data.code == 401) {
                  /*  layer.msg("Unauthorized");*/
                    window.location.href = "login.html";
                } else if (data.code == 402) {
                    window.location.href = "login.html";
                   /* layer.msg("Unauthorized");*/
                } else if (data.code == 404) {
                    layer.msg("Not Found");
                } else if (data.code == 20007 || data.code == 740) {
                    if (url != "login/login") {
                        localStorage.current_url = window.location.href;
                    }
                    window.location.href = "login.html";
                } else {
                    callback(data);
                }
                // layer.close(loadIndex);
            },
            error: function () {
                // layer.close(loadIndex);
                localStorage.current_url = "";
                layer.msg('获取数据失败请稍后再试！');
            }
        });
    },

    //扩展方法获取url参数
    getUrlParam: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; //返回参数值
    },
    getUrlArgs: function (url) {//得到地址传递的参数，返回： 参数对象
        url = url || window.location.href;
        url = decodeURIComponent(url);
        var argsString = (url.indexOf('?') === -1) ? "" : url.substring(url.indexOf('?') + 1);
        var arrObj = {};
        if (argsString !== "") {
            argsString = argsString.split('&');
            for (var i = 0; i < argsString.length; i++) {
                var key = argsString[i].split('=')[0];
                arrObj[key] = argsString[i].split('=')[1];
            }
        }
        return arrObj;
    },
    onlyNum: function (ele) { //文本框只能输入数字
        ele.on('keyup', function (event) {
            var $this = $(this);
            $this.val($this.val().replace(/[^\d.]/g, ''));
        });
    },
    //注册登录表单验证
    validate: function(ele){
        var msg = "";
        var value = ele.valTrim(),
            id = ele.attr('id');
        switch (id) {

            case 'phone':
                if (value === "") {
                    msg = "请输入手机号";
                }
                else if (!(value.match(/^1(3|4|5|7|8)\d{9}$/))) {
                    msg ="请输入正确的手机号码";
                }
                break;
            case 'pwd':
                if (value === "") {
                    msg = "请输入密码";
                }
                break;
                //修改密码f
            case 'fnewPwd':
                if (value === "") {
                    msg = "请输入新密码";
                }else if(!(value.match(/^[a-zA-Z0-9]{8,16}$/))){
                    msg ="请输入正确的密码格式";
                }
                else if($("#pwd").valTrim()==value){
                    msg ="新密码和旧密码不能相同";
                }
                break;
            case 'fconfirmPwd':
                console.log($("#fnewPwd").valTrim())
                if (value === "") {
                    msg = "请输入确认密码";

                }else if($("#fnewPwd").valTrim()!=value){
                    msg = "两次密码输入不一致";
                }
                break;
            case 'newPwd':
                if (value === "") {
                    msg = "请输入新密码";
                }else if(!(value.match(/^[a-zA-Z0-9]{8,16}$/))){
                    msg ="请输入正确的密码格式";
                }
                break;
            case 'confirmPwd':
                if (value === "") {
                    msg = "请输入确认密码";
                }else if($("#newPwd").valTrim()!=value){
                    msg = "两次密码输入不一致";
                }
                break;
            case 'verify-code':
                if (value === "") {
                    msg = "请输入6位验证码";
                }
                break;
        }
//                console.log(msg);
        if (msg != "") {//校验失败
            layer.msg(msg);
            ele.addClass('border-error');
            return false;
        } else {
            ele.removeClass('border-error');
        }
        return true;
    },
    getTimeDetail: function (time, typeFormat) {
        var dateTime;
        if (time === 'now') {
            dateTime = new Date();
        } else {
            time = parseInt(time);
            dateTime = new Date(time);
        }
        console.log(dateTime);
        var zeroAdd = function (val) {
            if (val < 10) {
                val = "0" + val;
            }
            return val;
        };
        var detail = {
            year: dateTime.getFullYear(),  //年
            month: zeroAdd(parseInt(dateTime.getMonth() + 1)),    //月
            date: zeroAdd(dateTime.getDate()),       //日
            hour: zeroAdd(dateTime.getHours()),   //时
            minute: zeroAdd(dateTime.getMinutes()),  //分
            second: zeroAdd(dateTime.getSeconds()),  //秒
            week: dateTime.getDay()       //星期几[0:表示星期天，1-6: 星期一到星期六]

        };
        if (typeFormat == 1) {
            return detail.year + "年" + detail.month + "月" + detail.date + "日    " + detail.hour + ":" + detail.minute + ":" + detail.second;
        } else if (typeFormat == 2) {
            return detail.year + "-" + detail.month + "-" + detail.date + " " + detail.hour + ":" + detail.minute;
        } else if (typeFormat == 3) {
            return detail.year + "-" + detail.month + "-" + detail.date + " 23:59";
        } else if (typeFormat == 4) {
            return detail.year + "." + detail.month + "." + detail.date;
        } else {
            return detail;
        }
    },
    getSfm: function (seconds) {
        var h = Math.floor(seconds / 3600);
        var m = Math.floor((seconds / 60 % 60));
        var s = Math.floor((seconds % 60));
        return h + ":" + m + ":" + s;
    },


});
jQuery.fn.valTrim = function () {
    if (!String.prototype.trim) {
        String.prototype.trim = function () {    //首尾空格 去掉
            var regEx = /(^\s*)|(\s*$)/g;
            return this.replace(regEx, '');
        };
    }
    return $(this).val().trim();
};