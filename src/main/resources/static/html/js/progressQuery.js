
(function () {
    var info_id=MyLocalStorage.Cache.get('orderInfoId');//商品id及数量
    String.prototype.temp = function (obj) {
        return this.replace(/\$\w+\$/gi, function (matchs) {
            var returns = obj[matchs.replace(/\$/g, "")];
            return (returns + "") == "undefined" ? "" : returns;
        });
    };
    var htmlTemp = $("textarea").val();
    var progressQuery={
        init:function () {
            progressQuery.loadInfo();//加载信息
        },
        loadInfo:function () {//加载信息
            var args = {
                orderInfoId:info_id,
                token:checkLogin
            };
            $.ajaxByGet("order/findOrderProgress",args,function(result){
                $('.zy-progress').html(htmlTemp.temp(result.data));
                /*console.log(result.data);*/
                var status=result.data.orderStatus;
                /*订单状态 0：未支付，1：支付成功，2：已发货（盒子） 3:确认收货 4：已回寄，5：已收到样品，6：检测中，7：报告待审核，8 报告已审核   9：完成报告，10、纸质已回寄 。-1支付失败，-2申请退款，-3已退款 -9 删除订单*/
                //var status=10;
                var progress=[];
                var label2_txt="";//采集器标题
                var article2_txt="";//采集器内容
                var label_on="";//当前状态标题
                var article_on="";//当前状态提示信息
                var report="";//生成报告提示
                if(status>=1){
                    progress.push(1);
                    label_on='采集器寄出中';
                    article_on='已购买产品，采集器寄出中';
                }
                if(status>=2){
                    progress.push(2);
                    label2_txt='采集器已寄出';
                    article2_txt='采集器已寄出，请您注意查收！';
                    label_on='采集器接收中';
                    article_on='采集器已寄出，采集器接收中';
                }
                if(status>=3){
                    article2_txt='已收到采集器';
                    label_on='样本待回寄';
                    article_on='您已收到采集器，采集样本后请您回寄';
                }
                if(status>=4){
                    progress.push(3);
                    label_on='样本接收中';
                    article_on='样本已回寄，样本接收中';
                }
                if(status>=5){
                    progress.push(4);
                    label_on='样本检测';
                    article_on='样本已接收，样本正在检测中...';
                }
                if(status>=6){
                    article_on='样本已接收，样本正在检测中...';
                }
                if(status>=7){
                    progress.push(5);
                    label_on='报告待审核';
                    article_on='样本检测已完成，报告待审核';
                }
                if(status>=8){
                    progress.push(6);
                    label_on='报告生成中';
                    article_on='报告已审核，报告生成中';
                }
                if(status>=9){
                    label_on='生成报告';
                    report='<div class="progress-report"><label>电子报告已生成</label><label>2018-02-08 12:35:15</label></div><div class="progress-report"><label>纸质报告正在生成...</label>  <label></label></div>';
                }
                if(status>=10){
                    report='<div class="progress-report"><label>电子报告已生成</label><label>2018-02-08 12:35:15</label></div><div class="progress-report"><label>纸质报告已回寄</label>  <label>2018-02-08 12:35:15</label></div>';
                }
                $('.label2').html(label2_txt);
                $('.article2 p').html(article2_txt);
                $('.label-on').html(label_on);
                $('.article-on p').html(article_on);
                if(report){
                    $('.article-on .progress-mid').html(report);
                }
                progress.forEach(function (t) {
                    $('.item'+t).show();
                });
                $(".progress-list").click(function () {
                    if ($(this).find("i>img").attr("src")==='images/down.png') {
                        $(this).find("i>img").attr("src","images/up.png");
                        $(this).siblings("article").removeClass("dis-none");
                    }
                    else {
                        $(this).find("i>img").attr("src","images/down.png");
                        $(this).siblings("article").addClass("dis-none");
                    }
                });
            });
        }
    };
    $(progressQuery.init);
})();

