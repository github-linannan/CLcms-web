$(function () {

    /*判断是否登陆显示不同页面*/
    if (checkLogin != '' && checkLogin != null){//假如已登錄
        $('#person-info-down .tools-login-no').removeClass('show');
        $('#person-info-down .tools-login-yes').addClass('show');
    }

})