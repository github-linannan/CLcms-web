var appId="",timeStamp="",nonceStr="",spackage="",signType="",paySign="";

(function () {
	
    var orderId;
    var ua = window.navigator.userAgent.toLowerCase();
    var local_url=window.location.href,
        get_id="",//商品id
        get_num="",//商品数量
        order_degree="";//详情过来是1，默认是空，购物车过来为空
    var get_shop=MyLocalStorage.Cache.get('productChecked');//商品id及数量
    var address_manage=MyLocalStorage.Cache.get('addressManage');//跳到地址管理页面
    var address_list="";//地址数据
    var address_id="";//地址id
    if(get_shop){
        get_id=get_shop['productCheckedIdLists'];
        get_num=get_shop['productCheckedNumLists'];
        order_degree=get_shop['productOrderDegree'];
    }
    else {
        window.location.href="index.html";
    }
    if(address_manage){//跳转地址管理
            MyLocalStorage.Cache.remove('addressManage');
            $(".submit-order-address-manage").show();
    }
    String.prototype.temp = function (obj) {
        return this.replace(/\$\w+\$/gi, function (matchs) {
            var returns = obj[matchs.replace(/\$/g, "")];
            return (returns + "") == "undefined" ? "" : returns;
        });
    };
    var productTemp = $("#product-textarea").val();
    var addressTemp = $("#address-textarea").val();
  var submitOrder={
      init:function () {
          submitOrder.addShopInfo();//加载商品信息
          submitOrder.addAddress();//显示地址列表
          $(".submit-order-btn").on("click",submitOrder.submitOrderFun);//提交订单
          $(".pay-btn").on("click",function () {//选择支付方式
              $(this).attr("src","./images/select_after.png");
              $(this).parents("li").siblings("li").find(".pay-btn").attr("src","./images/select_before.png");
              $("#select_value").val($(this).attr("data"));

             
              //通过正则表达式匹配ua中是否含有MicroMessenger字符串
            	  if ($("#select_value").val() == 1){
                      $(".warning-text").css("display","block");
                    }else {
                        $(".warning-text").css("display","none");
                    }


          });
          $(".submit-order-address-top img").on("click",function () {//选择地址页面隐藏
              $(".submit-order-address-manage").hide();
          });
          $(".goto-address-manage").on("click",function () {//跳到管理收货地址页面
              MyLocalStorage.Cache.put('addressManage',"1");
              window.location.href="addressManage.html";
          });
          $(".goBack").on("click",function () {//返回上一页
             if(order_degree==1){
                 window.location.href='productDetails.html?categoryid='+get_shop['productCheckedIdLists'];
             }
             else if(order_degree==""){
                 window.location.href='shoppingCart.html';
             }
          });
      },
      addShopInfo:function () {//加载商品信息
          var get_id2=get_id.split(",");
          var get_num2=get_num.split(",");
          var productList={};
          for(var i=0;i<get_id2.length;i++){//商品id,数量组成对象
              productList[get_id2[i]]=get_num2[i];
          }
          var args = {
              goodsId:get_id
          };
          $.ajaxByPost("/goods/findGoodsIds",args,function(result){
              var data=result.data;
            /*  console.log(data);*/
              $.each(data,function (index,item) {
                  var shop_info="";
                  var goodsId=item.goodsId;
                          shop_info = productTemp.temp(item);
                          shop_info = shop_info.replace(/#\w+#/gi, function (matchs) {
                             return MinImgUrl;
                          });
                          $(".submit-order-shop").append(shop_info);
                          $(".num-span"+goodsId).html(productList[goodsId]);
                          submitOrder.totalPrice(goodsId);//单个商品总价

              })
              submitOrder.allPrice();//全部商品总价
              $("img.decreaseAmount").click(function () {//数量减少
                  submitOrder.calculateNum(1,$(this).attr('pid'));
              });
              $("img.increaseAmount").click(function () {//数量增加
                  submitOrder.calculateNum(2,$(this).attr('pid'));
              })
          });
      },
      submitOrderFun:function (){//提交订单
          var productSelect=submitOrder.shopSelect();//商品的id,数量,跳转方式
          if(checkLogin==null || checkLogin==""){
              layer.msg('请先登录',{time:500},function () {
                  window.location.href="login.html";
              });
          }
          else{
               if(address_id==""){
                   layer.msg('请选择地址',{time:500});
               }
               else{
            	var payType=$("#select_value").val();
               
                   var args = {
                       token:checkLogin,
                       goodsIds:productSelect.productCheckedIdLists,
                       goodsNum:productSelect.productCheckedNumLists,
                       orderPayType:$("#select_value").val(),
                       orderShipAddress:address_id,
                       userId:"",
                       userInvite:$("#referee").val(),
                       orderDegree:productSelect.productOrderDegree
                   };

                   $.ajaxByPost("order/createOrder",args,function(result) {
                       var data = result.data;
                       if(result.code==200){
                           orderId = data.orderId;
                           if (orderId != ''){
                                if(payType==1){ 
                                	var wxPayType="MWEB";
                                	var isWxType=false;
                                	   if(ua.match(/MicroMessenger/i) == 'micromessenger'){
                                		   wxPayType="JSAPI";
                                		   isWxType=true;
                                	   	}
                                		   $.ajax({  
                                    	       type:"get",  
                                    	       url:web_url+"pay/payBefault",
                                    	       dataType:"json", 
                                    	       async:false,
                                    	       data:{orderId:orderId,"wxPayType":wxPayType,token:checkLogin},
                                    	       success:function(data) {  
                                    	        if(data.code == 200){  
                                    	            url = data.data.url;  
                                    	             if(!isWxType){
                                    	            	    window.location.href=url;
                                    	            	 }else{
                                    	            		 appId=data.data.appId;
                                    	            		 timeStamp=data.data.timeStamp;
                                    	            		 nonceStr=data.data.nonceStr;
                                    	            		 spackage=data.data["package"];
                                    	            		 signType=data.data.signType;
                                    	            		 paySign=data.data.paySign;
                                    	            		 
                                    	            		 if (typeof WeixinJSBridge == "undefined"){
                                    	            			   if( document.addEventListener ){
                                    	            			       document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                                    	            			   }else if (document.attachEvent){
                                    	            			       document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
                                    	            			       document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                                    	            			   }
                                    	            			}else{
                                    	            			   onBridgeReady();
                                    	            			} 
                                    	            	 }
                                    	            	 //弹出确认微信支付是否完成
                                                         layer.open({
                                                             title: "",
                                                             type: 1,
                                                             area: '300px',
                                                             closeBtn: 0,
                                                             content:  $('#weixin')
                                                         });
                                                    $(".complete").click(function(){
                                                        var payStatusData = {
                                                            orderId: orderId,
                                                            token: checkLogin
                                                        };
                                                        $.ajax({
                                                            url: web_url+"pay/getPayStatus",
                                                            data: payStatusData,
                                                            success: function (result) {
                                                                window.location.href = "/";
                                                            },
                                                            dataType: "json"
                                                        });
                                                    });
                                                    $(".pay-failed").click(function(){
                                                        var payStatusData = {
                                                            orderId: orderId,
                                                            token: checkLogin
                                                        };
                                                        $.ajax({
                                                            url: web_url+"pay/getPayStatus",
                                                            data: payStatusData,
                                                            success: function (result) {
                                                                window.location.href ="/myOrders.html";
                                                            },
                                                            dataType: "json"
                                                        });
                                                    });
                                    	            	 return false;
                                    	            
                                    	           }else{  
                                    	            alert("统一下单失败");  
                                    	           }  
                                    	       }  
                                    	   });    
                                	  
                                }else{
                                	
                                	   $(".submit-order-btn").unbind("click",submitOrder.submitOrderFun);//只能提交一次
		                               $('#payment').attr("action",web_url+"pay/payBefault");
		                               $('#payment .payvalue').val(orderId);
		                               $('#payment').submit();
		                               return true;
		                            
                                }
                           }
                      
                       }else{
                    	   layer.msg(result.detailMessage); 
                       }
                      /* var args2 = {
                           token:checkLogin
                       };
                       $.ajaxByPost("order/findOrderList",args2,function(result) {//测试查看订单结果
                           var data = result.data;
                           console.log(data);

                       });*/
                       return false;
                   });
                

               }
          }
        
          return false;
      },
      addAddress:function () {//显示地址列表
          var args = {
              token:checkLogin
          };
          $.ajaxByPost("receiveAddress/findByLoginId",args,function(result){
              var data=result.data;
              var all_address="";
              address_list=data;
              if(data.length!=0){
                  //默认地址
                  var first=data[0];
                  $("[name^=address]").each(function (v,i) {//地址信息
                      $(this).html(first[$(this).attr('name')])
                  });
                  address_id=first.addressId;
                  $(".have-address").show();//有地址的div显示
                  $(".submit-order-addressno").hide();//无地址的div隐藏
                  $(".submit-order-address").on("click",function () {
                      submitOrder.addressManage();//选择地址
                  });
                  //地址列表
                  data.forEach(function(object,index) {
                      all_address += addressTemp.temp(object);

                  });
              }
              else{//没有地址
                  $(".goto-address-manage").html("添加");
                  $(".have-address").hide();//有地址的div隐藏
                  $(".submit-order-addressno").show();//没有收货的div显示
                  $(".submit-order-addressno").on("click",function () {//跳转选择地址
                      submitOrder.addressManage();//选择地址
                  });
              }
              $(".submit-order-address-list").html(all_address);//选择地址列表
              $(".submit-order-address-list li").eq(0).find("p").prepend('<span class="default-address">[默认地址]</span>');//默认地址
              //从列表选择地址
              $(".submit-order-address-list li").on("click",function () {
                  address_id=$(this).attr("data");//地址id
                  $("[name=addressName]").html($(this).find(".flo-l").html());//姓名
                  $("[name=addressTelephone]").html($(this).find(".flo-r").html());//电话
                  $("[name=addressComplete]").html($(this).find(".address-span").html());//地址
                  $(".submit-order-address-manage").hide();//选择地址页面隐藏
              })


          });
      },
      shopSelect:function () {//返回商品的id,数量,跳转方式
          /*var shop_id=get_id;*/
          var submit_num2=[];
          var num_result="";
          $("[id^=num-span]").each(function () {
              var sum=$(this).text();
              submit_num2.push(sum);
          });
          num_result=submit_num2.join(",");
          var productSelect={};
          productSelect.productCheckedIdLists=get_id;//商品id
          productSelect.productCheckedNumLists=num_result;//商品数量
          productSelect.productOrderDegree=order_degree;//商品详情还是购物车过来
          return productSelect;
      },
      addressManage:function () {
          if(address_list.length!=0){
              $(".submit-order-address-manage").show();
          }
          else{//地址为空，跳到添加地址
              window.location.href="addressManage.html";
          }

      },
      calculateNum:function (obj,id) {//计算数量
          var num=parseInt($(".num-span"+id).html());
          if(obj==1){
              num=num-1;
              if(num<=0){
                  num=1;
              }
          }
          else if(obj==2){
              num=num+1;
          }
          $(".num-span"+id).html(num);
          submitOrder.totalPrice(id);
      },
      totalPrice:function (id) {//单个商品总价钱
          var price=parseFloat($("#price"+id).text())*100;
          var num=parseInt($("#num-span"+id).text());
          var total_price=(price*num/100).toFixed(2);
          $("#total-price"+id).html(total_price);
          submitOrder.allPrice();
      },
      allPrice:function () {//全部商品总价钱
          var all_price=0;
          var all_num=0;
          $("[id^=total-price]").each(function () {
              all_price+=parseFloat($(this).text())*100;
          });
          $("[id^=num-span]").each(function () {
              all_num+=parseInt($(this).text());
          });
          $("#all-price").html((all_price/100).toFixed(2));
          $("#all-num").html(all_num);
      }

  };
    $(submitOrder.init());


})();


function onBridgeReady(){
	   WeixinJSBridge.invoke(
	       'getBrandWCPayRequest', {
	           "appId":appId,     //公众号名称，由商户传入     
	           "timeStamp":timeStamp,         //时间戳，自1970年以来的秒数     
	           "nonceStr":nonceStr, //随机串     
	           "package":spackage,     
	           "signType":signType,         //微信签名方式：     
	           "paySign":paySign //微信签名 
	       },
	       function(res){     
	           if(res.err_msg == "get_brand_wcpay_request:ok" ) {
	        	  // alert("支付成功");
                   /*layer.msg(支付成功);*/
	           }else{
	        	 /* alert("支付失败"+res.err_msg);*/
                  /* layer.msg("支付失败"+res.err_msg);*/
	           }     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
	       }
	   ); 
	   
	   
	  
	}



