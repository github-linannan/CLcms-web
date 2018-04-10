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
            var key=matchs.replace(/\$/g, "");
            var returns =key=="tVideoClick"?(obj[key]>100000?"100000+":obj[key]):obj[key];
            return (returns + "") == "undefined" ? "" : returns;
        });
    };

    var htmlVideoList = '', htmlTemp = $("textarea").val(),  page=2, clock="" ;
    var args = {
        page: "1",
        pageSize: "3"
    };

    var videoDisplay={
        init:function () {
            videoDisplay.displayInfoList();//生成商品nav
            $(".wrap-video").scroll(videoDisplay.scrollStart);///滚动

        },
        displayInfoList:function () {//生成商品nav
            $.ajaxByGet("home/videoList", args, function (result) {
                if (result.code === 200) {
                    var dataLists = result.data.list;
                    if (dataLists.length > 0) {
                        dataLists.forEach(function (object, i) {

                            htmlVideoList += htmlTemp.temp(dataLists[i]);
                        });
                    }
                };
                htmlVideoList = htmlVideoList.replace(/#\w+#/gi, function (matchs) {
                    return img_url;
                });
                $('.wrap-video ul').html(htmlVideoList);

            });
        },
        scrollStart:function () {//滚动判断
            if(clock){
                clearTimeout(clock)
            }
            clock = setTimeout(function(){
                if($('.wrap-video').height()<= $('#wrap-video-list').height() + $('.wrap-video').scrollTop()){
                    videoDisplay.scrollAdd();
                }
            },300);
        },
        scrollAdd:function () {//滚动加载
            var loadShop = layer.load();

            var args = {
                page:page,//当前页数
                pageSize:"3",//每页大小
            };
            $.ajaxByPost("home/videoList",args,function(result){

                if (result.code === 200) {
                    var dataLists = result.data.list;
                    if (dataLists.length > 0) {
                        layer.close(loadShop);
                        dataLists.forEach(function (object, i) {
                            htmlVideoList += htmlTemp.temp(dataLists[i]);
                        });
                        page+=1;
                    }
                };
                htmlVideoList = htmlVideoList.replace(/#\w+#/gi, function (matchs) {
                    return img_url;
                });
                $('.wrap-video ul').append(htmlVideoList);

            });
        }
    };
    $(videoDisplay.init);


})();


function handleAddVideoReadNum(id) {
    var args={
        tId: id
    };
    $.ajax({
        url: web_url+"vido/addVideoCount",
        data: args,
        success: function (result) {
         console.log(111);
        },
        dataType: "json"
    });

}



