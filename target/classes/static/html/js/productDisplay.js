(function () {
    String.prototype.temp = function (obj) {
        return this.replace(/\$\w+\$/gi, function (matchs) {
            var returns = obj[matchs.replace(/\$/g, "")];
            return (returns + "") == "undefined" ? "" : returns;
        });
    };
    var htmlTemp = $("textarea").val();
    var pages={};//所有类型加载页数数组，下标为type+id
    pages['type']=['1',false,""];//全部类型  [第几页 下拉加载绑定  搜索框的值]
    var cur="";//选中的商品类别，空为全部
    var args = {//查找商品列表参数
        page:"1",//第几页
        pageSize:"6",//每页大小
        goodsShortname:"",//查找的商品名称
        goodsTypeId:cur//商品类型
    };
    var goods_type="";//url传过来的商品类型
    var local_url=window.location.href,
        goods_type=$.getUrlArgs(local_url).type;
    //返回上一页
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
    var productDisplay={
      init:function () {
          productDisplay.addShop();//生成商品nav
      },
        addShop:function () {//生成商品nav
            $.ajaxByPost("goodsType/findGoodsTypeAll",{},function(result){
                var data=result.data;
                var type_li="";//nav
                var type_ul="";//productList
                $.each(data,function (index,item) {
                    pages['type'+item.goodstypeId]=['1',false,""];
                    if(goods_type && goods_type==item.goodstypeName){//默认类型是健康套餐
                        type_li+='<li class="swiper-slide active" data="'+item.goodstypeId+'" id="active"><a href="#">'+item.goodstypeName+'</a></li>';
                        $(".swiper-wrapper > li").eq(0).removeAttr('id').removeClass('active');
                        cur=item.goodstypeId;
                        args.goodsTypeId=item.goodstypeId;
                        type_ul+='<ul class="product-cont" id="product'+item.goodstypeId+'"></ul>';
                        $(".product-cont").eq(0).addClass('display-none');
                    }
                    else{//默认类型是全部
                        type_li+='<li class="swiper-slide" data="'+item.goodstypeId+'"><a href="#">'+item.goodstypeName+'</a></li>';
                        type_ul+='<ul class="product-cont display-none" id="product'+item.goodstypeId+'"></ul>';
                    }

                });
                $(".swiper-wrapper").append(type_li);//商品nav
                $("article").append(type_ul);//商品列表ul


                // dropload
                var dropload = $('.product-list').dropload({
                    scrollArea: window,
                    domDown: {
                        domClass: 'dropload-down',
                        domRefresh: '<div class="dropload-refresh">上拉加载更多</div>',
                        domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
                        domNoData: '<div class="dropload-noData">—— 到底啦 ——</div>'
                    },
                    loadDownFn: function (me) {
                       if (pages['type'+cur][1]==true){
                            me.resetload();
                            me.lock();
                            me.noData();
                            me.resetload();
                            return;
                        }
                        args.page=pages['type'+cur][0];//页数
                        //var start = new Date().getTime();//起始时间
                        $.ajaxByPost("goods/findGoodsList",args,function(result){
                            //var end = new Date().getTime();//接受时间
                            //console.log((end - start)+"ms");
                            pages['type'+cur][2]=$(".product-search-text").val();//保存搜索框的值
                            pages['type'+cur][0]=(parseInt(pages['type'+cur][0])+1).toString();//页数加1
                            var data=result.data.product;
                            var shop="";
                            if(data.length!=0){
                                data.forEach(function(object,index) {
                                    shop += htmlTemp.temp(object);
                                });
                            }
                            if(data.length < parseInt(args.pageSize)){//表示一页未满已经没有数据
                                // 锁定
                                me.lock();
                                // 无数据
                                me.noData();
                                pages['type'+cur][1]=true;

                            }
                            shop = shop.replace(/#\w+#/gi, function (matchs) {
                                return MinImgUrl;
                            });

                                $("#product"+args.goodsTypeId).append(shop);//下拉用append
                                new ImgLazy();
                               me.resetload();
                        });

                    }
                });
                //tab切换
                nav('swiper_nav');
                $("#swiper_nav > ul > li").click(function() {
                    cur=$(this).attr('data');
                    $(this).addClass('active').attr('id', 'active');
                    $(this).siblings('li').removeClass('active').removeAttr('id');
                    nav('swiper_nav');
                    $("#product"+cur).removeClass("display-none").siblings(".product-cont").addClass("display-none");
                    args.goodsTypeId=cur;
                    searchSop();
                });
                //查找
                $(".product-search-btn").on("click",searchSop);
                /*$(".product-search-text").bind('input porpertychange',function(){//text值改变，查找商品类型
                    searchSop();
                });*/
                function searchSop() {
                    args.goodsShortname=$(".product-search-text").val();
                    if(pages['type'+cur][2]!=$(".product-search-text").val()){//搜索框的值发生变化
                        pages['type'+cur][1]=false;//可以下拉加载
                        pages['type'+cur][0]="1";//从第一页开始
                        $("#product"+args.goodsTypeId).html("");//搜索清空
                    }
                    if (!pages['type'+cur][1]) {//下拉true或者false
                        dropload.unlock();
                        dropload.noData(false);
                    } else {
                        dropload.lock('down');
                        dropload.noData();
                    }
                    dropload.resetload();
                }
            });
        }
    };
    $(productDisplay.init);
})();

