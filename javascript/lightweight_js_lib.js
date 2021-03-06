/*global document, $, jQuery, alert, console, angular*/
/**
 *
 * @authors Ted Shiu (tedshd@gmail.com)
 * @date    2014-04-22 11:46:25
 * @version $Id$
 */

// handle get element
function node(selector) {
    if (selector.indexOf('.') === -1) {
        if (document.querySelectorAll(selector).length === 1) {
            return document.querySelector(selector);
        }
        return document.querySelectorAll(selector);
    }
    return document.querySelectorAll(selector);
}

// handle index
function indexInParent(node) {
    var children = node.parentNode.childNodes,
        num = 0;
    for (var i = 0; i < children.length; i++) {
         if (children[i]==node) return num;
         if (children[i].nodeType==1) num++;
    }
    return -1;
}

// handle delete element
function delElement(dom) {
    if (dom.length) {
        for (var i = 0; i < dom.length; i++) {
            dom[i].outerHTML = '';
        }
    } else {
        dom.outerHTML = '';
    }
    dom = null;
}

// add class
function addClass(dom, className) {
    if (dom.classList) {
        dom.classList.add(className);
    } else {
        dom.className += ' ' + className;
    }
}

// remove class
function removeClass(dom, className) {
    if (dom.classList) {
        dom.classList.remove(className);
    } else {
        var reg = new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi');
        dom.className = dom.className.replace(reg, ' ');
    }
}

// has class
function hasClass(dom, className) {
    if (dom.classList) {
        return dom.classList.contains(className);
    } else {
        return (dom.className.search(className) === -1)? false: true;
    }
}

// handle time
function toHHMMSS(sec_num) {
    var hours   = Math.floor(sec_num / 3600),
        minutes = Math.floor((sec_num - (hours * 3600)) / 60),
        seconds = Math.floor(sec_num - (hours * 3600) - (minutes * 60));

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    return time;
}

function timeConverter(timestamp){
  var a = new Date(timestamp * 1000);
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}

// handel cookie
function setCookie(option)
{
    var name = option.name || '',
        value = option.value || '',
        exdays = option.exday || '',
        domain = option.domain || '',
        path = option.path || '',
        day = '',
        expires = '';
    if (exdays) {
        day = new Date();
        day.setTime(day.getTime() + (exdays*24*60*60*1000));
        expires = 'expires=' + day.toGMTString() + ';';
    }
    if (domain) {
        domain = 'domain=' + domain + ';';
    }
    if (path) {
        path = 'path=' + path + ';';
    }
    document.cookie = name + '=' + value + ';' + domain + path + expires;
}

function getCookie(cname)
{
var name = cname + "=";
var ca = document.cookie.split(';');
for(var i=0; i<ca.length; i++)
  {
  var c = ca[i].trim();
  if (c.indexOf(name)==0) return c.substring(name.length,c.length);
  }
return "";
}

// get url query String
function getQueryString(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// check IE & version
function isIE() {
    var myNav = navigator.userAgent.toLowerCase();
    return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
}

// detect iOS
var Apple = {};
Apple.UA = navigator.userAgent;
Apple.Device = false;
Apple.Types = ["iPhone", "iPod", "iPad"];
for (var d = 0; d < Apple.Types.length; d++) {
    var t = Apple.Types[d];
    Apple[t] = !!Apple.UA.match(new RegExp(t, "i"));
    Apple.Device = Apple.Device || Apple[t];
}

// delegate event
var div = document.createElement("div"),
    prefix = ["moz","webkit","ms","o"].filter(function(prefix){
    return prefix+"MatchesSelector" in div;
    })[0] + "MatchesSelector";

Element.prototype.addDelegateListener = function(type, selector, fn) {
    this.addEventListener(type, function(e){
        var target = e.target;

        while(target && target !== this && !target[prefix](selector)) {
            target = target.parentNode;
        }

        if(target && target !== this) {
            return fn.call( target, e );
        }

    }, false);
};

// handle trim method
if (!String.prototype.trim) {
    (function() {
        var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
        String.prototype.trim = function() {
            return this.replace(rtrim, '');
        };
    })();
}

// handle console in IE7-
(function() {
    var method,
        noop = function () {},
        methods = [
            'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
            'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
            'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
            'timeStamp', 'trace', 'warn'
        ];

    var length = methods.length,
        console = (window.console = window.console || {});
    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// 半形轉全形
String.prototype.halfToFull = function () {
    var temp = "";
    for (var i = 0; i < this.toString().length; i++) {
        var charCode = this.toString().charCodeAt(i);
        if (charCode <= 126 && charCode >= 33) {
            charCode += 65248;
        } else if (charCode == 32) { // 半形空白轉全形
            charCode = 12288;
        }
        temp = temp + String.fromCharCode(charCode);
    }
    return temp;
};

function halfToFull(value) {
　　　　if(value.charCodeAt(i)== 12288){
　　　　　　result += " ";
　　　　}else{
　　　　　　if(value.charCodeAt(i) > 65280 && value.charCodeAt(i) < 65375){
　　　　　　　　result += String.fromCharCode(value.charCodeAt(i) - 65248);
　　　　　　}else{
　　　　　　　　result += String.fromCharCode(value.charCodeAt(i));
　　　　　　}
　　　　}
return result;
}

/**
     * mbStrwidth
     * @param String
     * @return int
     * @see http://php.net/manual/ja/function.mb-strwidth.php
     */
    function mbStrwidth(str) {
        var i=0,l=str.length,c='',length=0;
        for(;i<l;i++){
            c=str.charCodeAt(i);
            if(0x0000<=c&&c<=0x0019){
                length += 0;
            }else if(0x0020<=c&&c<=0x1FFF){
                length += 1;
            }else if(0x2000<=c&&c<=0xFF60){
                length += 2;
            }else if(0xFF61<=c&&c<=0xFF9F){
                length += 1;
            }else if(0xFFA0<=c){
                length += 2;
            }
        }
        return length;
    }

    /**
     * mbStrimwidth
     * @param String
     * @param int
     * @param int
     * @param String
     * @return String
     * @see http://www.php.net/manual/ja/function.mb-strimwidth.php
     */
    function mbStrimwidth(str, start, width, trimmarker) {
        if(typeof trimmarker === 'undefined') trimmarker = '';
        var trimmakerWidth = mbStrwidth(trimmarker),i = start, l=str. length,trimmedLength = 0, trimmedStr = '';
        for(;i<l;i++){
            var charCode=str.charCodeAt(i),c=str.charAt(i),charWidth=mbStrwidth(c),next=str.charAt(i+1),nextWidth=mbStrwidth(next);
            trimmedLength += charWidth;
            trimmedStr += c;
            if(trimmedLength+trimmakerWidth+nextWidth>width) {
                trimmedStr += trimmarker;
                break;
            }
        }
        return trimmedStr;
    }
function thousandth(argument) {
    if (typeof(argument) === 'number') {
        argument = argument + '';
    }
    if (typeof(argument) !== 'string') {
        console.error('argument type error');
        return;
    }
    var count = 0,
        tmp = '';
    for (var i = argument.length - 1; i >= 0; i--) {
        if (count === 3) {
            tmp = ',' + tmp;
            count = 0;
        }
        tmp = argument[i] + tmp;
        count++;
    }
    return tmp;
}
