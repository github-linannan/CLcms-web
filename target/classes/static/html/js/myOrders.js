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

    var ua = window.navigator.userAgent.toLowerCase();
    var htmlTemp = $("textarea").val(),
        htmlProductList=$("div.tabs-product-lists").html(),
        orderStatus = "",
        markSelectedText = "全部";
    /*原订单状态 0：未支付，1：支付成功，2：发货（盒子） 3：回寄，4：收样品，5：检测中，6：报告待审核，7：完成报告 。-1支付失败，-2申请退款，-3已退款*/
    var args = {
        token: checkLogin,
        orderStatus: orderStatus
    };
    SwitchToShowDifferentStatusList();//默认全部显示

 /* =====================  tabs 切换 =========================================*/
    var $menu = $('.tabs > .tabs_menu a'), markSelectedClass;
    $menu.click(function(){
        $(this).addClass('selected').siblings().removeClass('selected');
        markSelectedText = $(this).text();
       switch (markSelectedText){
           case '全部':
               orderStatus =  ""
               break;
           case '待付款':
               orderStatus =  "0"
               break;
           case '待收货':
               orderStatus =  "1,2"
               break;
           case '待回寄':
               orderStatus =  '3'
               break;
           case '报告':
               orderStatus =  '4,5,6,7'
               break;
       }
        args = {
            token: checkLogin,
            orderStatus: orderStatus
        };
        SwitchToShowDifferentStatusList();
    });


    function SwitchToShowDifferentStatusList() {

        console.log(markSelectedText);
        if (checkLogin == null || checkLogin == "") {
            window.location.href = 'login.html';
        } else {
          $.ajaxByPost("order/findOrderDeatils", args, function (result) {
            if (result.code === 200) {
                var dataLists = result.data,
                    htmlMyOrdersList = "";
                if (dataLists.length > 0) {
                    dataLists.forEach(function (object, i) {
                        var dataOrderInfoList = object.orderInfo,
                            dataStatus = object.orderStatus;
                        var htmlbtnDetail;
                        /*原订单状态 0：未支付，1：支付成功，2：发货（盒子） 3：回寄，4：收样品，5：检测中，6：报告待审核，7：完成报告 。-1支付失败，-2申请退款，-3已退款*/

                       /* 新的订单状态 0：未支付，1：支付成功，2：已发货（盒子）3：已回寄，4：已收到样品，5：检测中，6：报告待审核，7 报告已审核   8：完成报告 。-1支付失败，-2申请退款，-3已退款 -9 删除订单       调整了：6，7，8*/
                        if (dataStatus == "1" || dataStatus == "2") {
                            htmlbtnDetail =
                                "<button class='logistics border-radius-style btn-style'>查看物流" +
                             "</button><button class='border-radius-style btn-style'>确认收货</button>";
                        } else if (dataStatus == "3") {
                            htmlbtnDetail =
                                "<button class='logistics border-radius-style btn-style'>查看物流" +
                                "</button><button class='Information-entry border-radius-style btn-style live-border-color'>信息录入</button>";
                        }
                        else if (dataStatus == "4" || dataStatus == "5" || dataStatus == "6") {
                            htmlbtnDetail =
                                "<button class='progress border-radius-style btn-style'>进度查询";
                        }
                        else if (dataStatus == "7") {
                            htmlbtnDetail =
                                "<button class='progress border-radius-style btn-style'>进度查询";
                        }
                        else {
                            htmlbtnDetail = "<button  class='delete border-radius-style btn-style'>删除订单" +
                                "</button> <button  class='payment border-radius-style btn-style live-border-color'>去付款</button>";
                        }
                        var productlist = "";
                        dataOrderInfoList.forEach(function (orderItem, orderIndex) {
                            productlist += htmlProductList.temp(orderItem);
                        });
                        /*
                         console.info(htmlTemp.temp(object).replace("#productlist#",productlist));*/
                        htmlMyOrdersList += htmlTemp.temp(object).replace("#productlist#", productlist).replace("#btnDetails#", htmlbtnDetail);

                        //  htmlMyOrdersList +=htmlproduct;
                        /*   htmlMyOrdersList += htmlTemp.temp(dataLists[i]);*/
                    });
                }
            }

            htmlMyOrdersList = htmlMyOrdersList.replace(/#\w+#/gi, function (matchs) {
                return MinImgUrl;
            });
            $('.tabs_content_wrap').html(htmlMyOrdersList);

            //删除订单
            $(".delete").click(function(e){
                var orderNumber = $(this).parent().attr("orderNumber");
                var deleteHtml = $(this).parents(".tabs_content");
                var deleteData = {
                    token: checkLogin,
                    orderNumber: orderNumber
                }
                $.ajaxByPost("order/deleteOrderStatus", deleteData, function (result) {
                    if (result.code === 200) {
                        deleteHtml.remove();
                    }else {
                        layer.msg(result.detailMessage);
                    }
                });

            });

            //支付---去付款
            $('.payment').click(function () {
                var orderId = $(this).parent().attr("orderId");
                var payType = $(this).parent().attr("orderPayType");
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
                                        type:"get",
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
                                        type:"get",
                                        url: web_url+"pay/getPayStatus",
                                        data: payStatusData,
                                        success: function (result) {
                                            window.location.href = web_url+"myOrders.html";
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
                /*if (orderId != '') {
                    //http://flynynui.3w.dkys.org:8082/pay/payBefault
                    $('#payment').attr("action", web_url + "pay/payBefault");
                    $('#payment .payvalue').val(orderId);
                    $('#payment').submit();
                }*/
            });

        });
      }

    }






})

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
               /* alert("支付成功");*/
            }else{
                /*alert("支付失败"+res.err_msg);*/
            }     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
        }
    );



}