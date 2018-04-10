(function () {
  /*  String.prototype.temp = function (obj) {
        return this.replace(/\$\w+\$/gi, function (matchs) {
            var key=matchs.replace(/\$/g, "");
            var returns =key=="tTitle"?(obj[key].length>10?obj[key].substring(0,10):obj[key]):obj[key];
            return (returns + "") == "undefined" ? "" : returns;
        });
    };*/

    String.prototype.temp = function (obj) {
        return this.replace(/\$\w+\$/gi, function (matchs) {
            var returns = obj[matchs.replace(/\$/g, "")];
            return (returns + "") == "undefined" ? "" : returns;
        });
    };

    var htmlInfoList = '', htmlTemp = $("textarea").val(),  page=2, clock="" ;
    var args = {
        page: "1",
        pageSize: "10"
    };

    var infoDisplay={
        init:function () {
            infoDisplay.displayInfoList();//生成商品nav
            $(".wrap-info").scroll(infoDisplay.scrollStart);///滚动

        },
        displayInfoList:function () {//生成商品nav
            $.ajaxByGet("home/informationList", args, function (result) {
                if (result.code === 200) {
                    var dataLists = result.data.list;
                    if (dataLists.length > 0) {
                        dataLists.forEach(function (object, i) {
                            htmlInfoList += htmlTemp.temp(dataLists[i]);
                        });
                    }
                };
                htmlInfoList = htmlInfoList.replace(/#\w+#/gi, function (matchs) {
                    return MinImgUrl;
                });
                $('.wrap-info ul').html(htmlInfoList);

            });
        },
        scrollStart:function () {//滚动判断
            if(clock){
                clearTimeout(clock)
            }
            clock = setTimeout(function(){
                if($('.wrap-info').height()<= $('#wrap-info-list').height() + $('.wrap-info').scrollTop()){
                    infoDisplay.scrollAdd();
                }
            },300);
        },
        scrollAdd:function () {//滚动加载
            var loadShop = layer.load();
            var args = {
                page:page,//当前页数
                pageSize:"10",//每页大小
            };
            $.ajaxByPost("home/informationList",args,function(result){

                if (result.code === 200) {
                    var dataLists = result.data.list;
                    if (dataLists.length > 0) {
                        layer.close(loadShop);
                        dataLists.forEach(function (object, i) {
                            htmlInfoList += htmlTemp.temp(dataLists[i]);
                        });
                        page+=1;
                    }
                };
                htmlInfoList = htmlInfoList.replace(/#\w+#/gi, function (matchs) {
                    return MinImgUrl;
                });
                $('.wrap-info ul').append(htmlInfoList);

            });
        }
    };
    $(infoDisplay.init);

    //健康资讯
/*    $.ajaxByGet("home/informationList", args, function (result) {
        if (result.code === 200) {
            var dataLists = result.data.list;
            if (dataLists.length > 0) {
                dataLists.forEach(function (object, i) {
                    htmlInfoList += htmlTemp.temp(dataLists[i]);
                });
            }
        };
        htmlInfoList = htmlInfoList.replace(/#\w+#/gi, function (matchs) {
            return MinImgUrl;
        });
        $('.wrap-info ul').html(htmlInfoList);

    });*/

})();



