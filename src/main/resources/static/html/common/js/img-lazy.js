;(function(win, doc) {
    function ImgLazy(params) {
        this.params = params || {};
        this.init(params);
    }
    ImgLazy.prototype = {
        init : function() {
            this.initParams();
            this.scrollTimer = null;
            this.addDefaultImg();
            this.loadImg();
            window.onscroll = function() {
                this.scrollListener();
            }.bind(this);
            window.onresize = function() {
                this.resizeListener();
            }.bind(this);
        },

        // 初始化参数
        initParams : function() {
            var optionDefault = {
                    tag : 'data-src',
                    throtteTime : 16, 
                    distance : 0,
                    defaultImg : null
                },
                elements = null;
            this.extend(this.params, optionDefault);
            elements = document.querySelectorAll("["+ this.params.tag +"]");
            this.newElementsDomArr = Array.prototype.slice.call(elements, 0);
            this.elements = this.newElementsDomArr;
            this.getWH();
        },

        // 添加默认图片并且添加动态效果
        addDefaultImg : function() {
            var newElements = this.newElementsDomArr,
                defaultImg = this.params.defaultImg;
            newElements.forEach( function( item, index, arr ) {
                if ( defaultImg ) {
                    item.setAttribute('src', defaultImg)
                }
                /*item.style.webkitTransition = 'opacity 1s';
                item.style.opacity = 1;
                item.style.filter = "alpha(opacity = " + 100 + ")";*/
            });
        },

        // 滚动事件
        scrollListener : function() {
            if ( this.scrollTimer ) {
                return;
            }
            this.scrollTimer = setTimeout( function() {
                this.scrollTimer = null;
                this.loadImg();
            }.bind(this), this.params.throtteTime);
        },

        // 浏览器改变大小事件
        resizeListener : function() {
            var oThis = this;
            oThis.getWH();
            oThis.loadImg();
        },

        // 判断是否加载真实的图片
        loadImg : function() {
            var len = this.elements.length,
                distance = this.params.distance;
            for ( var i= 0; i < len ; i++ ) {
                var ele = this.elements[i];
                if ( !ele ) {
                    continue;
                }
                // 获取元素距离浏览器视图边界的距离
                var rect = ele.getBoundingClientRect();
                if ( ( rect.top >= 0 && this.H + distance >= rect.top ) || ( rect.top < 0 && rect.top + rect.height >= -distance ) ) {
                    if ( ( rect.left >= 0 && this.W + distance >= rect.left) || (rect.left < 0 && (rect.left + rect.width >= -distance ) ) ) {
                        // 加载真实图片
                        this.loadItem(ele);
                        // 删除数据里面已经懒加载过的元素
                        this.elements.splice(i, 1, null);
                    }
                }
            }
        },

        // 加载真实图片
        loadItem : function(ele) {
            var tag = this.params.tag,
                imgUrl = ele.getAttribute(tag);
            ele.setAttribute('src', imgUrl);
            ele.removeAttribute(tag);
            /*ele.style.opacity = 1;
            ele.style.filter = "alpha(opacity = " + 100 + ")";*/
        },

        // 获取浏览器宽高
        getWH: function() {
            this.W = document.documentElement.clientWidth || document.body.clientWidth;
            this.H = document.documentElement.clientHeight || document.body.clientHeight;
        },

        // 对象属性替换
        extend : function(options, tag) {
           for(var i in tag) {
                if( !(i in options) ) {
                    options[i] = tag[i];
                }
           }
           return this;
        }
    };
    win.ImgLazy = ImgLazy;
})(window, document);
