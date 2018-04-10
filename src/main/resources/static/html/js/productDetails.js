(function () {
    var local_url=window.location.href,
        id=$.getUrlArgs(local_url).categoryid,
        $mask=$(".product-detail-mask"),//背景
        $sure=$(".product-detail-select-btn"),//确定按钮
        $cart=$(".product-detail-cart"),//加入购物车按钮
        $buy=$(".product-detail-buy")//立即购买按钮
        $jian=$("#jian"),//减按钮
        $jia=$("#jia");//加按钮
    String.prototype.temp = function (obj) {
        return this.replace(/\$\w+\$/gi, function (matchs) {
            var returns = obj[matchs.replace(/\$/g, "")];
            return (returns + "") == "undefined" ? "" : returns;
        });
    };
    var hl_detail_height=parseInt($('.hl-detail').get(0).offsetHeight)+10;//导内容与详情间的空白高度
    var htmlTemp = $("#detail-cont").val();
    //导航切换
    $("#product-detail-list").on("click","a",function () {
        var select_id=$(this).attr('class');
        var scroll_height=$('#'+select_id).offset().top-$('#product-detail-list').height();//滚动的位置
        if(select_id=='introduce'){
            scroll_height=$('#'+select_id).offset().top;
        }
        $("html, body").scrollTop(scroll_height);
        $(this).parent().siblings().removeClass("select-style");
        $(this).parent().addClass("select-style");
    });
    $(".display-cart img").on("click",function () {
        if(checkLogin==null || checkLogin==""){
            layer.msg('请先登录',{time:500},function () {
                window.location.href="login.html";
            });
        }
        else{
            window.location.href="shoppingCart.html";
        }
    });
    $(".goBack").on("click",function () {
        var referrer  = document.referrer;
        if( referrer.indexOf('submitOrder')!=-1 || referrer=='' ){
            window.location.href='index.html';
        }
        else{
            window.location.href=referrer;
        }
    });
  var productDetails={
      init:function () {
          var args = {
                  goodsId:id
                     };
              productDetails.addShopinfo(args);
          //滚动事件
          $(window).trigger('scroll');
          $(window).on("scroll",productDetails.scrollPosition);
          $cart.on("click",productDetails.cartBtn);
          $buy.on("click",productDetails.buyBtn);
          $(".cart-close").on("click",productDetails.selectHide);
          $mask.on("click",productDetails.selectHide);
          $jian.on("click",function () {
              productDetails.calculateNum(1);
          });
          $jia.on("click",function () {
              productDetails.calculateNum(2);
          });
      },
      addShopinfo:function (args) {
          var shop="";
          var banner="";
          $.ajaxByPost("goods/findByGoodsId",args,function(result){
              var data=result.data;
              var  img_list=[data.goodsImageOne,data.goodsImageTwo,data.goodsImageThree,data.goodsImageFour,data.goodsImage1Five];
               for(var i=0;i<img_list.length;i++){
                   if(img_list[i]!=""){
                       banner+='<div class="swiper-slide"><a href="javascript:;"><img src="'+img_url+img_list[i]+'"></a></div>';
                   }
               }
              $(".swiper-wrapper").html(banner);
              shop = htmlTemp.temp(data);
              $(".product-detail-cont").html(shop);
              $("#select-img").attr("src",MinImgUrl+data.goodsImageOne);
              $("#select-price").html(data.goodsDiscountPrice);
              var swiper = new Swiper('.swiper-container', {
                  autoplay: {
                      delay: 5000,//5秒切换一次
                  },
                  pagination: {
                      el: '.swiper-pagination',
                      dynamicBullets: true,
                  },
              });
          });
          $.ajaxByPost("goodsInfo/findGoodsInfoList",args,function(result){
              var data=result.data;
              if(data.goodsinfoDetails!=""){
                  var goodsinfo_details=data.goodsinfoDetails.replace(/weditor/g, img_url);
                  goodsinfo_details=goodsinfo_details.replace(/<table/g, '<table class="product-detail-table"');
                  $(".product-detail-detail").append(goodsinfo_details);
                  $(".product-detail-detail p img").parents('p').addClass('product-detail-imgp');
              }


          });
      },
      scrollPosition:function () {
          /*		滑动定位的样式*/
          var top=$(document).scrollTop();
          var top_cont=$(".product-detail-cont").offset().top;//标题 top
          var top_banner=$(".product-detail-banner").offset().top;//banner top
          var $detail_list=$("#product-detail-list li");
          var $detail_nav=$(".product-detail-nav");
          var num=top/top_cont;
          num=num.toFixed(2);
          if(0<=top&&top<10){
              $detail_nav.css({"opacity":0,"z-index":-1});
          }
          else{
              if(top_banner<=top&&top<top_cont){//banner top 到标题 top的范围
                  $detail_list.eq(0).addClass("select-style").siblings().removeClass("select-style");
                  $detail_nav.css({"opacity":num,"z-index":2});
              }
              else if(top_cont<=top&&top<$(".hl-detail").offset().top-hl_detail_height){//标题到商品详情的范围
                  $detail_list.eq(0).addClass("select-style").siblings().removeClass("select-style");
                  $detail_nav.css({"opacity":1,"z-index":2});
              }
              else if($(".hl-detail").offset().top-hl_detail_height<=top){//商品详情区域
                  $detail_list.eq(1).addClass("select-style").siblings().removeClass("select-style");
                  $detail_nav.css({"opacity":1,"z-index":2});
              }
              else{
                  $detail_list.removeClass("select-style");
                  $detail_nav.css({"opacity":1,"z-index":2});
              }
          }

      },
      selectShow:function () {//弹框出现
          var $mask=$(".product-detail-mask"),//背景
              $select=$(".product-detail-select");//弹框
          $mask.show();
          $select.animate({"bottom": "0"},500);
      },
      selectHide:function () {//弹框隐藏
          var $mask=$(".product-detail-mask"),//背景
              $select=$(".product-detail-select"),//弹框
              $img=$(".product-detail-select-img");//弹框里定位的图片
          var height1=$select.height();
          var height2=$img.position().top;
          var cur=height1-height2;
          $mask.hide();
          $select.animate({"bottom": "-"+cur+"px"},200);
      },
      calculateNum:function (obj) {//计算件数 1为减 2为加
          var num=parseInt($("#num").html());
          if(obj==1){
              num=num-1;
              if(num<=0){
                  num=1;
              }
          }
          else if(obj==2){
              num=num+1;
          }
          $("#num").html(num);
      },
      addCart:function () {//加入购物车
          productDetails.selectHide();
              var args = {
                  token:checkLogin,
                  goodsId:id,
                  count:parseInt($("#num").html())
              };
              $.ajaxByPost("shopingCart/addOrUpdateCart",args,function(result){
                  if(result.code==200){
                      layer.msg('已加入购物车');
                      $(".display-cart span").addClass("cart-span-bg");
                  }

              });
      },
      cartBtn:function () {
          if(checkLogin==null || checkLogin==""){
              layer.msg('请先登录',{time:500},function () {
                  window.location.href="login.html";
              });
          }
          else{
              productDetails.selectShow();
              $sure.unbind("click",productDetails.goOrder);
              $sure.on("click",productDetails.addCart);
          }

      },
      buyBtn:function () {
          if(checkLogin==null || checkLogin==""){
              layer.msg('请先登录',{time:500},function () {
                  window.location.href="login.html";
              });
          }
          else{
              productDetails.selectShow();
              $sure.unbind("click",productDetails.addCart);
              $sure.on("click",productDetails.goOrder);
          }
      },
      goOrder:function () {
          var productChecked = {};
              productChecked.productCheckedIdLists=id;
          productChecked.productCheckedNumLists=$("#num").html();
          productChecked.productOrderDegree='1';
          if(MyLocalStorage.Cache.get('productChecked')){//缓存存在
              MyLocalStorage.Cache.remove('productChecked'); //移除缓存
          }
          MyLocalStorage.Cache.put('productChecked', productChecked,120);
              window.location.href="submitOrder.html";
      },
      addImage:function (obj,value) {
          
      }

  };
  $(productDetails.init);
})();

