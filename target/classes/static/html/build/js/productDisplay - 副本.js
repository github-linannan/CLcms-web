!function(){String.prototype.temp=function(o){return this.replace(/\$\w+\$/gi,function(n){var t=o[n.replace(/\$/g,"")];return t+""=="undefined"?"":t})};var o=$("textarea").val(),n="",t=2,a="",d={page:"1",pageSize:"6",goodsTypeId:a};$(".display-cart img").on("click",function(){null==checkLogin||""==checkLogin?layer.msg("请先登录",{time:500},function(){window.location.href="login.html"}):window.location.href="shoppingCart.html"});var i={init:function(){i.addShop(),$(".product-search-btn").on("click",i.searchShop),$("main").scroll(i.scrollStart),$(".product-search-text").bind("input porpertychange",function(){i.searchShop()})},addShop:function(){$.ajaxByPost("goodsType/findGoodsTypeAll",{},function(o){var n=o.data,t="",c="";$.each(n,function(o,n){t+='<li data="'+n.goodstypeId+'">'+n.goodstypeName+"</li>",c+='<ul class="product-cont display-none" id="product'+n.goodstypeId+'"></ul>'}),$(".product-nav").append(t),$("main").append(c),i.addShopinfo(d),$(".product-nav li").on("click",function(){$(this).addClass("change-color").siblings().removeClass("change-color"),a=$(this).attr("data"),$("#product"+a).removeClass("display-none").siblings(".product-cont").addClass("display-none"),d.goodsTypeId=a,0==$("#product"+a).find("li").length&&i.addShopinfo(d)})})},addShopinfo:function(n){$.ajaxByPost("goods/findGoodsList",n,function(n){var t=n.data.product,a="";0!=t.length?t.forEach(function(n,t){a+=o.temp(n)}):(a+='<li class="no-find"><p >抱歉，暂无相应的商品</p></li>',$("#product"+d.goodsTypeId).addClass("product-cont-none")),a=a.replace(/#\w+#/gi,function(o){return MinImgUrl}),$("#product"+d.goodsTypeId).html(a)})},scrollStart:function(){n&&clearTimeout(n),n=setTimeout(function(){$("#product"+a).height()<=$("main").height()+$("main").scrollTop()&&i.scrollAdd(a)},300)},scrollAdd:function(n){var d=layer.load(),i={page:t,pageSize:"4",goodsTypeId:n};$.ajaxByPost("goods/findGoodsList",i,function(n){var i=n.data.product,c="";i&&(layer.close(d),i.forEach(function(n,t){c+=o.temp(n)}),t+=1),c=c.replace(/#\w+#/gi,function(o){return MinImgUrl}),$("#product"+a).append(c)})},searchShop:function(){var o={goodsTypeId:"",goodsName:$(".product-search-text").val()};0!=a&&(o.goodsTypeId=a),i.addShopinfo(o,a)}};$(i.init)}();