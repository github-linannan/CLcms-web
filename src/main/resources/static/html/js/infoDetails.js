(function () {
  /*  String.prototype.temp = function (obj) {
        return this.replace(/\$\w+\$/gi, function (matchs) {
            var key=matchs.replace(/\$/g, "");
            var returns =key=="tTitle"?(obj[key].length>10?obj[key].substring(0,10):obj[key]):obj[key];
            return (returns + "") == "undefined" ? "" : returns;
        });
    };*/

    var  local_url=window.location.href,
        id=$.getUrlArgs(local_url).newsid;
    String.prototype.temp = function (obj) {
        return this.replace(/\$\w+\$/gi, function (matchs) {
            var returns = obj[matchs.replace(/\$/g, "")];
            return (returns + "") == "undefined" ? "" : returns;
        });
    };

    var htmlInfoList = '', htmlTemp = $("textarea").val();
    var args = {
        tId:id
    };
    //健康资讯详情
    $.ajaxByGet("home/informationbyId", args, function (result) {
        if (result.code === 200) {
            var dataLists = result.data;
                htmlInfoList += htmlTemp.temp(dataLists);
        };
        htmlInfoList = htmlInfoList.replace(/#\w+#/gi, function (matchs) {
            return MinImgUrl;
        });
        $('.wrap-info').html(htmlInfoList);

    });
})();



