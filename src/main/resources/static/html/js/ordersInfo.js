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
        htmlOrderInfoTemp = $(".temp-order-info-list").html(),
        htmlMyOrderInfoList = "";
    var local_url=window.location.href,
        orderId=$.getUrlArgs(local_url).orderId;
    var args = {
        token: checkLogin,
        orderId:orderId
    };
    $.ajaxByGet("order/findOrderInfo", args, function (result) {
        if (result.code === 200){
            var orderInfoDataLists = result.data.orderInfo;
            var htmlbtnDetail,
                dataStatus = result.data.order.orderStatus,
                orderNumber = result.data.order.orderNumber,
                orderId = result.data.order.orderId,
                orderPayType = result.data.order.orderPayType;
console.log(dataStatus);
            if (dataStatus == "1" || dataStatus == "2") {
                htmlbtnDetail =
                    "<button class='logistics border-radius-style btn-style'>查看物流" +
                    "</button><button class='border-radius-style btn-style live-border-color'>确认收货</button>";
            } else if (dataStatus >= 3 && dataStatus >= 10) {
                htmlbtnDetail = "";
            } else {
                htmlbtnDetail = "<button  class='delete border-radius-style btn-style'>删除订单" +
                    "</button> <button  class='payment border-radius-style btn-style live-border-color'>去付款</button>";
            }
            orderInfoDataLists.forEach(function (item, i) {
                htmlMyOrderInfoList += htmlOrderInfoTemp.temp(item);
            })

            htmlMyOrderInfoList = htmlMyOrderInfoList.replace(/#\w+#/gi, function (matchs) {
                return MinImgUrl;
            });
            $(".btn-deal").attr({orderId:orderId, orderNumber:orderNumber, orderPayType:orderPayType}).html(htmlbtnDetail);
            $("#num-span66").text(result.data.orderTotalGoodsNum);
            $("#total-price66").text(result.data.order.orderPayTotalPrice);
            $(".order-number p").text(result.data.order.orderNumber);
            $(".order-create-time p").text(result.data.order.orderCreateTime);

        }
        $('.submit-order-shop .submit-order-seller-name').after(htmlMyOrderInfoList);
        //删除订单
        $(".delete").click(function(e){
            var orderNumber = $(this).parent().attr("orderNumber");
            /*var deleteHtml = $(this).parents(".tabs_content");*/
            var deleteData = {
                token: checkLogin,
                orderNumber: orderNumber
            }
            $.ajaxByPost("order/deleteOrderStatus", deleteData, function (result) {
                if (result.code === 200) {
                    layer.open({
                        title: '',
                        closeBtn: 0,
                        content: '可以填写任意的layer代码',
                        yes: function(index, layero){
                            window.location.href="myOrders.html";
                        }
                    });


                }else {
                    layer.msg(result.detailMessage);
                }
            });

        });




        //支付---去付款
        payment();
    });



})