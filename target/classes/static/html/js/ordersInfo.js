$(function () {
    String.prototype.temp = function (obj) {
        return this.replace(/\$\w+\$/gi, function (matchs) {
            if (obj[matchs.replace(/\$/g, "")] == null) {
                return matchs;
            } else {
                var key=matchs.replace(/\$/g, "");
                var returns =key=="goodsName"?(obj[key].length>20?obj[key].substring(0,20):obj[key]):obj[key];
                return (returns + "") == "undefined" ? "" : returns;
            }
        });

    };

    var htmlTemp = $("textarea").val(),
        htmlProductList=$("div.tabs-product-lists").html();

    var args = {
        token: checkLogin
    };






})