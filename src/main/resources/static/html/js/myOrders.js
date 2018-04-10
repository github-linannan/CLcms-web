$(function () {
    String.prototype.temp = function (obj) {
        return this.replace(/\$\w+\$/gi, function (matchs) {
            if (obj[matchs.replace(/\$/g, "")] == null) {
                return matchs;
            } else {
                var key=matchs.replace(/\$/g, "");
                var returns =key=="goodsName"?(obj[key].length>20?obj[key].substring(0,20):obj[key]):obj[key];
               /* 判断报告已出还是未出的图标显示*/
             // var returns =key=="orderInfoStatus"?(obj[key]>=9?'<span class="report-status report-yes">报告已出</span>':'<span class="report-status report-no">报告未出</span>'):obj[key];
                return (returns + "") == "undefined" ? "" : returns;
            }
        });

    };


    var htmlTemp = $("textarea").val(),
        htmlProductList=$("div.tabs-product-lists").html(),
        htmlReportProductList=$("div.tabs-report-product-lists").html(),
        orderStatus = "",
        markSelectedText = "全部";
    /*原订单状态 0：未支付，1：支付成功，2：发货（盒子） 3：回寄，4：收样品，5：检测中，6：报告待审核，7：完成报告 。-1支付失败，-2申请退款，-3已退款*/

    // 新的订单状态 0：未支付，1：支付成功，2：已发货（盒子） 3:确认收货 4：已回寄，5：已收到样品，6：检测中，7：报告待审核，8 报告已审核   9：完成报告，10、纸质已回寄 。-1支付失败，-2申请退款，-3已退款 -9 删除订单
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
               orderStatus =  '4,5,6,7,8,9'
               break;
       }
        args = {
            token: checkLogin,
            orderStatus: orderStatus
        };
        SwitchToShowDifferentStatusList();
    });


    function SwitchToShowDifferentStatusList() {
        if (checkLogin == null || checkLogin == "") {
            window.location.href = 'login.html';
        } else {
          $.ajaxByPost("order/findOrderDeatils", args, function (result) {
            if (result.code === 200) {
                var dataLists = result.data,
                    htmlMyOrdersList = "";
                if (dataLists.length != 0) {
                    dataLists.forEach(function (object, i) {
                        var dataOrderInfoList = object.orderInfo,
                            dataStatus = object.orderStatus;
                        var htmlbtnDetail, htmlReportBtnDetail;
                        var productlist = "";
                        /*原订单状态 0：未支付，1：支付成功，2：发货（盒子） 3：回寄，4：收样品，5：检测中，6：报告待审核，7：完成报告 。-1支付失败，-2申请退款，-3已退款*/

                      // 新的订单状态 0：未支付，1：支付成功，2：已发货（盒子） 3:确认收货 4：已回寄，5：已收到样品，6：检测中，7：报告待审核，8 报告已审核   9：完成报告，10、纸质已回寄 。-1支付失败，-2申请退款，-3已退款 -9 删除订单

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
                        if (dataStatus >= "3"){//待回寄
                               
                                  var productlistchild;
                            dataOrderInfoList.forEach(function (orderItem, orderIndex) {
                            	 productlistchild= $(htmlReportProductList.temp(orderItem));                          
                                    if(orderItem.orderInfoStatus >3&orderItem.orderInfoStatus <=9){
                                    	$(".order-info-desc",productlistchild).removeClass("dis-none").addClass("dis-inb");
                                    	$(".report-status",productlistchild).removeClass("dis-none").addClass("dis-inb");
                                    	$(".report-status",productlistchild).removeClass("report-yes").addClass("report-no").text("报告未出");
                                    	$(".report",productlistchild).addClass("dis-none").removeClass("dis-inb");
                                    	$(".progress-query",productlistchild).removeClass("dis-none").addClass("dis-inb");
                                       $(".information-entry",productlistchild).addClass("dis-none").removeClass("dis-inb");
                                    }else if(orderItem.orderInfoStatus >9) {
                                    	$(".order-info-desc",productlistchild).removeClass("dis-none").addClass("dis-inb");
                                    	$(".report-status",productlistchild).removeClass("dis-none").addClass("dis-inb");
                                    	$(".report-status",productlistchild).removeClass("report-no").addClass("report-yes").text("报告已出");
                                    	$(".report, .progress-query",productlistchild).removeClass("dis-none").addClass("dis-inb");
                                    	$(".information-entry",productlistchild).addClass("dis-none").removeClass("dis-inb");
                                    }else{  //  小于等于3
                                    	$(".order-info-desc",productlistchild).addClass("dis-none");
                                    	$(".report-status",productlistchild).addClass("dis-none");
                                    	$(".information-entry",productlistchild).addClass("dis-inb").removeClass("dis-none");
                                    	$(".report",productlistchild).addClass("dis-none");
                                    	$(".progress-query",productlistchild).addClass("dis-none");
                                    }
   
                                productlist +=productlistchild.prop("outerHTML");
                              
                            });
                          //查报告
                        }else {//普通订单列表模板
                            dataOrderInfoList.forEach(function (orderItem, orderIndex) {
                                productlist += htmlProductList.temp(orderItem);
                            });
                        }
                        htmlMyOrdersList += htmlTemp.temp(object).replace("#productlist#", productlist).replace("#btnDetails#", htmlbtnDetail);
                    });
                }
                htmlMyOrdersList = htmlMyOrdersList.replace(/#\w+#/gi, function (matchs) {
                    return MinImgUrl;
                });
            }

            $('.tabs_content_wrap').html(htmlMyOrdersList);
           /* 进度查询*/
              $(".progress-query").click(function (e) {
                  var orderInfoId = $(this).parent().attr("orderInfoId");

                  MyLocalStorage.Cache.put("orderInfoId",orderInfoId);
                  window.location.href = "progressQuery.html";
              });
            /*填写资料*/
            $(".information-entry").click(function (e) {
                var orderNumber = $(this).parent().attr("orderNumber");
                var orderInfoId = $(this).parent().attr("orderInfoId");
             
                MyLocalStorage.Cache.put("orderInfo",{
                    "orderNumber": orderNumber,
                    "orderInfoId": orderInfoId
                });
                window.location.href = "infoEntry1.html";
            });
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
              payment();

        });
      }

    }






})

