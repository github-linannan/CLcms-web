/**
 * Created by linannan on 2018/4/2.
 */

var ua = window.navigator.userAgent.toLowerCase();

//支付---去付款
function payment() {
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
                                    window.location.href = "/myOrders.html";
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
}
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
