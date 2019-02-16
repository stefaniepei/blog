// jquery 首先通过$函数传入一个选择器->new jQuery.fn.init构造函数->把选择器转成DOM节点处理成数组形式和选择器通过构造函数实例化
// jQuery.fn（css,html等方法）赋值给原型
(function (window) {
    var jQuery = function (selector) {
        return new jQuery.fn.init(selector)
    }
    // 扩展插件
    jQuery.fn = {
        css: function (key, value) {
            alert('css')
        },
        html: function (value) {
            return 'html'
        }
    }
    var init = jQuery.fn.init = function (selector) {
        var slice = Array.prototype.slice
        var dom = slice.call(document.querySelectorAll(selector))
        var i, len = dom ? dom.length : 0
        for (i = 0; i < len; i++) {
            this[i] = dom[i]
        }
        this.length = len
        this.selector = selector || ''
    }
    init.prototype = jQuery.fn
    window.$ = jQuery
})(window)

// zepto 首先通过$函数传入一个选择器->zepto.init把选择器转成DOM节点处理成数组形式->zepto.Z把dom数组和选择器 new Z的实例
// $f.fn（css,html等方法）赋给了Z的原型
(function (window) {
    var zepto = {} // 空对象
    function Z(dom, selector) {
        var i, len = dom ? dom.length : 0
        for (i = 0; i < len; i++) {
            this[i] = dom[i]
        }
        this.length = len
        this.selector = selector || ''
    }
    zepto.Z = function (dom, selector) {
        return new Z(dom, selector) // Z构造函数实例化  dom变成本身
    }
    zepto.init = function (selector) {
        //...
        var slice = Array.prototype.slice
        var dom = slice.call(document.querySelectorAll(selector)) // 获取页面所有的dom树->slice过滤成数组
        return zepto.Z(dom, selector)
    }
    var $ = function (selector) {
        return zepto.init(selector)
    }
    window.$ = $
    // 扩展插件
    $.fn = {
        css: function (key, value) {
            alert('css')
        },
        html: function (value) {
            return '这是一个模拟的 html 函数'
        }
    }

    Z.prototype = $.fn // Z的原型有css和html  只有$能暴露在window全局变量，将插件扩展到此比较方便
})(window)

// 插件
$.fn.xxx = function(){
  //...
}
