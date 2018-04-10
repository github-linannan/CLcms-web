
$(function () {
    String.prototype.temp = function (obj) {
        return this.replace(/\$\w+\$/gi, function (matchs) {

            if (obj[matchs.replace(/\$/g, "")] == null) {
                return matchs;
            } else {
                var key=matchs.replace(/\$/g, "");
                var returns =key=="goodsShortname"?(obj[key].length>10?obj[key].substring(0,10):obj[key]):obj[key];
                return (returns + "") == "undefined" ? "" : returns;
            }
        });
    };
    /* ============ 动态替换用户头像===========*/
    var userInfo =  MyLocalStorage.Cache.get("userInfo");
    if (userInfo!= ""  && userInfo != null){
        if (userInfo.headImage != "" && userInfo.headImage != null && userInfo.headImage != "undefined"){
            $(".user-info .nav-head-pic").attr("src", userInfo.headImage);
        }else {
            $(".user-info .nav-head-pic").attr("src", "images/product_03.jpg");
        }
        $(".user-info .nav-name-text").text(userInfo.nickname);
    }

    /* ============ end动态替换用户头像===========*/

    /* ============ 未开发部分页面点击效果===========*/
    $(".unfinished").click(function () {
        layer.msg('开发中，敬请期待！',{icon: 6});
    })
    /* ============ end未开发部分页面点击效果===========*/

//  判断 是否是后台返回的主页面，是就获取token
    var tokens=$("#pg-index #wxtoken").text();
    if(tokens!=null&&tokens!=""&&tokens!="undefined"){
    	MyLocalStorage.Cache.put('token',tokens);
    }
    
    var htmlProductList = '', htmlTemp = $("textarea").val(), htmlNewsList = $("div.temp-news-list").html();
     var htmlBannerList = '', htmlPackageList = "", htmlInfoList = "";
    var args = {
        page: "1",
        pageSize: "6"
    };
    //banner
    $.ajaxByGet("home/bannerList", args, function (result) {
        if (result.code === 200) {
             var dataLists = result.data.list;
             dataLists.forEach(function(item,index){
                htmlBannerList += '<div class="swiper-slide"><a href=""><img src="'+img_url+item.tBannerUrl+'" alt='+item.tBannerInfo+'></a></div>';
             });
        }
         $('.swiper-wrapper').html(htmlBannerList);
         if (result.data.total > 1){
            <!-- Initialize Swiper -->
            var swiper = new Swiper('.swiper-container', {
                autoplay: {
                    delay: 5000,//5秒切换一次
                },
                pagination: {
                    el: '.swiper-pagination',
                    dynamicBullets: true,
                },
            });
         }
    });
        //套餐
    $.ajaxByGet("home/packageList", args, function (result) {
        if (result.code === 200) {
             var dataLists = result.data.list;
             dataLists.forEach(function(item,index){
                htmlPackageList +='<li><a href="productDisplay.html?type=健康套餐"><img src="'+img_url+item.tPackageUrl+'" alt='+item.tPackageInfo+'> </a> </li>';
             });
        }
         $('.index-health-package ul').html(htmlPackageList);
    
    });
     
     
    $.ajaxByPost("goods/findGoodsList", args, function (result) {
        if (result.code === 200) {
            var dataLists = result.data.product,
                dataCount = dataLists.length,
                countLength;

            /*  dataLists.forEach(function(object) {
             htmlList += htmlTemp.temp(object);
             });*/


            if (dataCount > 0) {
                if (dataCount >= 3 && dataCount < 6) {
                    countLength = 3;
                } else if (dataCount >= 6) {
                    countLength = 6;
                } else {
                    countLength = dataCount;
                }
                for (var i = 0; i < countLength; i++) {

                    htmlProductList += htmlTemp.temp(dataLists[i]);
                }
                // htmlList就是我们需要的HTML代码啦！

            }

        }
        htmlProductList = htmlProductList.replace(/#\w+#/gi, function (matchs) {
            return MinImgUrl;
        });
        $('.index-health-shop .row').html(htmlProductList);

    })

         //健康资讯

    $.ajaxByGet("home/informationList", args, function (result) {
        if (result.code === 200) {
            var dataLists = result.data.list;
            dataLists.forEach(function (item, i) {
                htmlInfoList += htmlNewsList.temp(item);
            })
        }
        htmlInfoList = htmlInfoList.replace(/#\w+#/gi, function (matchs) {
            return MinImgUrl;
        });
        $('.index-health-info ul').html(htmlInfoList);

    })


});

function handleAddReadNum(id) {
   var args={
       tId: id
   }
    $.ajaxByGet("information/addInformationCount", args, function (result) {
        if (result.code == 200){
            window.location.href = "infoDetails.html?newsid="+id;
        }
    })
}