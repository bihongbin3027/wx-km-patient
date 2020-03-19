﻿!function (e, t) {
  "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.TLSHelper = t() : e.TLSHelper = t()
}(this, function () {
  return function (e) {
    function t(r) {
      if (n[r]) return n[r].exports;
      var o = n[r] = { exports: {}, id: r, loaded: !1 };
      return e[r].call(o.exports, o, o.exports, t), o.loaded = !0, o.exports
    }
    
    var n = {};
    return t.m = e, t.c = n, t.p = "", t(0)
  }([function (e, t, n) {
    function r(e, t) {
      if (!e) throw new Error('we need sdkappid and url, like {sdkappid: 123, url: "http://www.example.com/success.html"}');
      for (var n = ["sdkappid", "url"], r = 0; r < n.length; r++) if (!e[n[r]]) throw new Error("we need option " + n[r]);
      var i = a + "/portal";
      for (var s in e) e.hasOwnProperty(s) && (i = o.setQuery(i, s, e[s]));
      return t && (i = o.setQuery(i, "action", "reg")), i
    }
    
    var o = n(1), a = "https://tls.qcloud.com", i = {};
    i.goLogin = function (e) {
      location.href = r(e)
    }, i.goReg = function (e) {
      location.href = r(e, !0)
    }, i.getQuery = o.getQuery, i.setQuery = o.setQuery, i.fetchUserSig = function (e) {
      if ("undefined" == typeof window.tlsGetUserSig) throw new Error("jsonp callback window.tlsGetUserSig is not defined!");
      e = e || {};
      var t = a + "/getusersig", n = {
        sdkappid: e.sdkappid || o.getQuery("sdkappid"),
        identifier: e.identifier || o.getQuery("identifier"),
        tmpsig: e.tmpsig || o.getQuery("tmpsig")
      };
      for (var r in n) n.hasOwnProperty(r) && (t = o.setQuery(t, r, n[r]));
      o.jsonp(t)
    }, i.anologin = function (e) {
      if ("undefined" == typeof window.tlsAnoLogin) throw new Error("jsonp callback window.tlsAnoLogin is not defined!");
      if ("undefined" == typeof window.Encrypt || !Encrypt.getRSAH1) throw new Error("required script https://tls.qcloud.com/libs/encrypt.min.js");
      e = e || {};
      var t = {
        sdkappid: e.sdkappid || o.getQuery("sdkappid"),
        url: e.url || o.getQuery("url"),
        passwd: Encrypt.getRSAH1()
      }, n = a + "/anologin?";
      for (var r in t) t.hasOwnProperty(r) && (n = o.setQuery(n, r, t[r]));
      o.jsonp(n)
    }, e.exports = i
  }, function (module, exports) {
    var Blue = { http: {}, dom: {}, css: {}, str: {}, report: {}, local: {} };
    Blue.each = function (e) {
      var t = "";
      for (var n in e) t += n + ": " + e[n] + "\n";
      return t
    }, Blue.extend = function (e, t, n) {
      for (var r in t) e[r] = t[r];
      return e
    };
    var dom = function () {
      function e(e) {
        return "string" == typeof e ? document.getElementById(e) : e
      }
      
      function t(t, n, r) {
        if (t) {
          if (t = e(t), document.addEventListener) return t.addEventListener(n, r, !1), a.push([t, n, r]), r;
          if (document.attachEvent) {
            var o = function () {
              return r.apply(t, arguments)
            };
            return t.attachEvent("on" + n, o), a.push([t, n, o]), o
          }
        }
      }
      
      function n(e, t, n) {
        document.addEventListener ? e.removeEventListener(t, n, !1) : e.detachEvent("on" + t, n)
      }
      
      function r() {
        for (var e = 0; e < a.length; e++) {
          var t = a[e];
          n(t[0], t[1], t[2])
        }
      }
      
      function o(e, n) {
        t(e, "input", n), t(e, "propertychange", function (e) {
          "value" == e.propertyName && n && n.apply(e.srcElement, arguments)
        })
      }
      
      var a = [];
      return window.onunload = r, { el: e, on: t, off: n, oninput: o }
    }(), css = function () {
      function e(e, t, n) {
        if (e) {
          e = dom.el(e);
          for (var r = e.className.split(/\s+/), o = {}, a = 0; a < r.length; a++) r[a] && (o[r[a]] = !0);
          t && (o[t] = !0), n && delete o[n];
          var i = [];
          for (var s in o) o.hasOwnProperty(s) && i.push(s);
          e.className = i.join(" ")
        }
      }
      
      function t(t, n) {
        e(t, n, !1)
      }
      
      function n(t, n) {
        e(t, !1, n)
      }
      
      return {
        addClass: t, removeClass: n, hasClass: function (e, t) {
          return !!e.className.match(new RegExp("(^|\\s)" + t + "(\\s|$)"))
        }, show: function (e) {
          e = dom.el(e), e && (e.style.display = "block")
        }, hide: function (e) {
          e = dom.el(e), e && (e.style.display = "none")
        }
      }
    }(), string = function () {
      return {
        trim: function (e) {
          if (!e) return "";
          e += "";
          for (var e = e.replace(/^\s+/, ""), t = /\s/, n = e.length; t.test(e.charAt(--n)););
          return e.slice(0, n + 1)
        }
      }
    }(), http = function () {
      function str2JSON(e) {
        e = string.trim(e);
        var t = /^[\],:{}\s]*$/, n = /(?:^|:|,)(?:\s*\[)+/g, r = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
          o = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g;
        return t.test(e.replace(r, "@").replace(o, "]").replace(n, "")) ? new Function("return " + e)() : {}
      }
      
      function getXHR() {
        return window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest
      }
      
      function ajax(url, para, cb, method, type) {
        var xhr = getXHR();
        return xhr.open(method, url), xhr.onreadystatechange = function () {
          4 == xhr.readyState && ((xhr.status >= 200 && xhr.status < 300 || 304 === xhr.status || 1223 === xhr.status || 0 === xhr.status) && cb("undefined" == typeof type && xhr.responseText ? eval("(" + xhr.responseText + ")") : xhr.responseText), xhr = null)
        }, xhr.send(para), xhr
      }
      
      return {
        post: function (e, t, n, r) {
          var o = "";
          for (var a in t) o += "&" + a + "=" + t[a];
          return ajax(e, o, n, "POST", r)
        }, get: function (e, t, n, r) {
          var o = [];
          for (var a in t) o.push(a + "=" + t[a]);
          return -1 == e.indexOf("?") && (e += "?"), e += o.join("&"), ajax(e, null, n, "GET", r)
        }, jsonp: function (e, t, n) {
          var r = document.createElement("script");
          return r.src = e, document.getElementsByTagName("head")[0].appendChild(r), t ? setTimeout(t, n || 3e3) : void 0
        }, loadScript: function (e, t, n) {
          var r = document.createElement("script");
          r.onload = r.onreadystatechange = function () {
            this.readyState && "loaded" !== this.readyState && "complete" !== this.readyState || ("function" == typeof t && t(), r.onload = r.onreadystatechange = null, r.parentNode && r.parentNode.removeChild(r))
          }, r.onerror = function () {
            r.onerror = null, r.parentNode && r.parentNode.removeChild(r), n && n()
          }, r.src = e, document.getElementsByTagName("head")[0].appendChild(r)
        }, setQuery: function (e, t, n) {
          var r = t + "=" + encodeURIComponent(n), o = new RegExp("(^|&)" + t + "=([^&]*)&?", "i"),
            a = /([^?]*)(\??)([^#]*)(#?)(.*)/i, i = e.match(a), s = i && i[3];
          return i ? (s = null != n && "undefined" != typeof n ? s.match(o) ? s.replace(o, "$1" + r + "&") : r + "&" + s : s.replace(o, "$1"), s = s.replace(/&$/, ""), e = e.replace(a, "$1?" + s + "$4$5")) : ""
        }, getQuery: function (e) {
          var t = window.location.search.match(new RegExp("(\\?|&)" + e + "=([^&]*)(&|$)"));
          return t ? decodeURIComponent(t[2]) : ""
        }
      }
    }(), local = function () {
      function e() {
        var e = document.createElement("link");
        return e.style.display = "none", e.id = o, document.getElementsByTagName("head")[0].appendChild(e), e.addBehavior("#default#userdata"), e
      }
      
      function t() {
        if ("undefined" == typeof r) if (window.localStorage) r = localStorage; else try {
          r = e(), r.load(o)
        } catch (t) {
          return r = !1, !1
        }
        return !0
      }
      
      function n(e) {
        return "string" != typeof e ? !1 : a.test(e)
      }
      
      var r, o = "tls.qcloud.com", a = /^[0-9A-Za-z_-]*$/;
      return {
        set: function (e, a) {
          var i = !1;
          if (n(e) && t()) try {
            a += "", window.localStorage ? (r.setItem(e, a), i = !0) : (r.setAttribute(e, a), r.save(o), i = r.getAttribute(e) === a)
          } catch (s) {
          }
          return i
        }, get: function (e) {
          if (n(e) && t()) try {
            return window.localStorage ? r.getItem(e) : r.getAttribute(e)
          } catch (o) {
          }
          return null
        }, remove: function (e) {
          if (n(e) && t()) try {
            return window.localStorage ? r.removeItem(e) : r.removeAttribute(e), !0
          } catch (o) {
          }
          return !1
        }
      }
    }(), report = function () {
      function e(e, t, n) {
        if (!("undefined" != typeof n && Math.random() >= n)) {
          var r = "https://ssl.qq.com/ptlogin/cgi-bin/ptlogin_report?",
            o = encodeURIComponent(t + "|_|" + location.href + "|_|" + window.navigator.userAgent);
          e && (r += "id=" + e + "&"), t && (r += "msg=" + o + "&"), r += "v=" + Math.random();
          var a = document.createElement("img");
          a.src = r
        }
      }
      
      return {
        log: function (t, n, r) {
          return e(t, n, r)
        }, mid: function (t, n) {
          return e(t, null, n)
        }
      }
    }();
    Blue.dom = dom, Blue.css = css, Blue.str = string, Blue.http = http, Blue.local = local, Blue.report = report, Blue.extend(Blue, {
      on: dom.on,
      off: dom.off,
      el: dom.el
    }), Blue.extend(Blue, {
      addClass: css.addClass,
      removeClass: css.removeClass,
      hasClass: css.hasClass,
      show: css.show,
      hide: css.hide
    }), Blue.extend(Blue, {
      get: http.get,
      post: http.post,
      jsonp: http.jsonp,
      loadScript: http.loadScript,
      setQuery: http.setQuery,
      getQuery: http.getQuery
    }), Blue.extend(Blue, { trim: string.trim }), !window.console && (window.console = {
      log: function () {
      }, warn: function () {
      }, error: function () {
      }
    }), module.exports = Blue
  }])
});
//# sourceMappingURL=api.min.IM.map
