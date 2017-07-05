(function (App) {
  var callindex = 0,
    toString = Object.prototype.toString;
  var exec = function (fn) {
    if (toString.call(fn) == "[object Function]") {
      fn();
    }
  };
  App.call = function (name) {
    var args = Array.prototype.slice.call(arguments, 1);
    var funs = Array.prototype.slice.call(arguments, 1);
    var callback = "",
      item = null;
    for (var i = 0, len = args.length; i < len; i++) {
      item = args[i];
      if (item === undefined) {
        item = "";
      }
      if (toString.call(item) == "[object Function]") {
        callback = name + "Callback" + i;
        window[callback] = item;
        item = callback;
      }
      args[i] = item;
    }
    if (App.IS_ANDROID) {
      var accessType = getParams("accessType") || Cookie("accessType") || "";
      if (accessType == "pts" || accessType == "2") {
        if (accessType == "pts") {
          Cookie("accessType", "pts");
        }
        var pams = "";
        for (var i = 0, len = args.length; i < len; i++) {
          if (i == 0) {
            pams = args[i];
          } else {
            pams = pams + "," + args[i];
          }
        }
        if (name == "changeTitle") {
          PhoneGapApp.changeTitle(pams);
        }
        if (name == "loadingBegin") {
          PhoneGapApp.loadingBegin(pams);
        }
        if (name == "loadingFinish") {
          PhoneGapApp.loadingFinish(pams);
        }
        if (name == "onload") {
          PhoneGapApp.onload(pams);
        }
        if (name == "backToHome") {
          PhoneGapApp.backToHome(pams);
        }
        if (name == "backToLogin") {
          PhoneGapApp.backToLogin(pams);
        }
        if (name == "showLoginPage") {
          PhoneGapApp.showLoginPage(pams);
        }
        if (name == "backToPage") {
          PhoneGapApp.backToPage(pams);
        }
        if (name == "alert") {
          if (args.length > 1) {
            PhoneGapApp.alert(args[0], funs[1]);
          } else {
            PhoneGapApp.alert(args[0], null);
          }
        }
        if (name == "confirm") {
          PhoneGapApp.confirm(args[0], funs[1], funs[2]);
        }
        if (name == "href") {
          PhoneGapApp.href(pams);
        }
        if (name == "open") {
          PhoneGapApp.open(pams);
        }
        if (name == "getAppVersion") {
          PhoneGapApp.getAppVersion(pams);
        }
        if (name == "getAppShare") {
          PhoneGapApp.getAppShare("", args[0]);
        }
        if (name == "updateAppShare") {
          PhoneGapApp.updateAppShare(args[0], null);
        }
        if (name == "getCurrentPosition") {
          PhoneGapApp.getCurrentPosition(args[0], funs[1]);
        }
        if (name == "setRightBtnStyle") {
          PhoneGapApp.setRightBtnStyle(args[0], null);
        }
        if (name === "openOtherApp") {
          PhoneGapApp.openOtherApp(args[0]);
        }
        if (name == "getIdentityCardInfo") {
          PhoneGapApp.getIdentityCardInfo(funs[0]);
        }
        if (name == "backToHomeNew") {
          PhoneGapApp.backToHomeNew();
        }
        if (name == "clicpboard") {
          PhoneGapApp.clicpboard(pams);
        }
        if (name == "callNativeFun") {
          PhoneGapApp.callNativeFun(args[0], funs[1]);
        }
      } else {
        try {
          for (var i = 0, len = args.length; i < len; i++) {
            args[i] = "'" + args[i] + "'";
          }
          eval("window.android." + name + "(" + args.join(",") + ")");
        } catch (e) {
          alert(e);
        }
        eval();
      }
    } else {
      if (App.IS_IOS) {
        if (args.length) {
          args = "|" + args.join("|");
        }
        callindex++;
        location.href = "#ios:" + name + args + "|" + callindex;
      }
    }
  };
  App.backToHomeNew = function (text, callback) {
    if (App.IS_NATIVE) {
      App.call("backToHomeNew", text, callback);
    } else {
      location.href = "main.html";
    }
  };
  App.getCurrentPosition = function (text, callback) {
    if (App.IS_NATIVE) {
      App.call("getCurrentPosition", text, callback);
    }
  };
  App.changeRandCode = function () {
    if (App.IS_NATIVE) {
      App.call("changeRandCode");
    }
  };
  App.alert = function (text, callback) {
    if (App.IS_NATIVE) {
      App.call("alert", text, callback);
    } else {
      alert(text);
      exec(callback);
    }
  };
  App.confirm = function (text, ok, cancel) {
    if (App.IS_NATIVE) {
      App.call("confirm", text, ok, cancel);
    } else {
      if (confirm(text)) {
        exec(ok);
      } else {
        exec(cancel);
      }
    }
  };
  App.href = function (url, prepath) {
    if (App.IS_NATIVE) {
      prepath = prepath || "";
      App.call("href", prepath + url);
    } else {
      window.location.href = url;
    }
  };
  App.openOtherApp = function (url) {
    if (App.IS_NATIVE) {
      App.call("openOtherApp", url);
    } else {
      window.location.href = url;
    }
  };
  App.recognize = function () {
    var accessType = getParams("accessType") || Cookie("accessType") || "";
    if (App.IS_NATIVE || accessType == "2") {
      App.call("recognize");
    } else {}
  };
  App.saveAppToken = function (token) {
    if (App.IS_NATIVE) {
      App.call("saveAppToken", token);
    } else {}
  };
  App.getAppToken = function () {
    if (App.IS_NATIVE) {
      App.call("getAppToken");
    }
  };
  App.open = function (url) {
    if (App.IS_NATIVE) {
      App.call("open", url);
    } else {
      window.open(url);
    }
  };
  App.onload = function () {
    if (App.IS_NATIVE) {
      App.call("onload");
    } else {
      App.onload.returnValue = true;
      if (checkBeeCanvas()) {
        AheadHandle.loadingBee.hideAll();
      }
    }
  };
  App.loadingBegin = function (notCancel) {
    if (App.IS_NATIVE) {
      App.call("loadingBegin", !!notCancel);
    } else {
      if (checkBeeCanvas()) {
        AheadHandle.loadingBee.show();
      }
    }
  };
  App.loadingFinish = function () {
    if (App.IS_NATIVE) {
      App.call("loadingFinish");
    } else {
      if (checkBeeCanvas()) {
        AheadHandle.loadingBee.hide();
      }
    }
  };
  App.showLoginPage = function () {
    if (App.IS_NATIVE) {
      App.call("showLoginPage", function () {
        Cookie("rumUserLogin", "Y");
      });
    } else {}
  };
  App.changeTitle = function (title) {
    if (App.IS_NATIVE) {
      App.call("changeTitle", title);
    } else {}
  };
  App.changeTxtTitle = function (str) {
    var accessType = getParams("accessType") || Cookie("accessType") || "";
    if (accessType == "1") {
      callindex++;
      var ua = navigator.userAgent.toUpperCase();
      var PACHART_IS_ANDROID = ua.indexOf("ANDROID") != -1;
      var PACHART_IS_IOS = ua.indexOf("IPHONE OS") != -1 || ua.indexOf("IPAD") != -1;
      if (PACHART_IS_ANDROID) {
        window.android.setWebViewTitle(str);
      } else {
        if (PACHART_IS_IOS) {
          location.href = "#ios:setWebViewTitle|" + str + "|" + callindex;
        }
      }
    }
  };
  App.setRightBtnStyle = function (fid) {
    if (App.IS_NATIVE) {
      App.call("setRightBtnStyle", fid);
    }
  };
  App.backToPage = function (menu, oldMenu) {
    if (!oldMenu) {
      oldMenu = "1";
    }
    App.call("backToPage", menu, oldMenu);
  };
  App.getPics = function (callback) {
    if (App.IS_NATIVE) {
      App.call("getPics", callback);
    } else {
      callback('{"name":"che1", "size":"566.54", "src":""}');
    }
  };
  App.callCamera = function (callback) {
    callindex++;
    var ua = navigator.userAgent.toUpperCase();
    var PACHART_IS_ANDROID = ua.indexOf("ANDROID") != -1;
    var PACHART_IS_IOS = ua.indexOf("IPHONE OS") != -1 || ua.indexOf("IPAD") != -1;
    window["onSuccessCallback"] = callback;
    if (PACHART_IS_ANDROID) {
      window.android.callCamera("onSuccessCallback");
    } else {
      if (PACHART_IS_IOS) {
        location.href = "#ios:callCamera|onSuccessCallback|" + callindex;
      }
    }
  };
  App.callCameraTxt = function (callback, b) {
    var ua = navigator.userAgent.toUpperCase();
    var PACHART_IS_ANDROID = ua.indexOf("ANDROID") != -1;
    var PACHART_IS_IOS = ua.indexOf("IPHONE OS") != -1 || ua.indexOf("IPAD") != -1;
    window["getDeviceInfoCallback2"] = callback;
    var accessType = getParams("accessType") || Cookie("accessType") || "";
    if (PACHART_IS_ANDROID) {
      if (accessType == "2") {
        App.call("getIdentityCardInfo", callback);
      } else {
        if (b) {
          window.android.getIdentityCardInfo("getDeviceInfoCallback2");
        } else {
          App.call("getIdentityCardInfo", callback);
        }
      }
    }
  };
  App.getDeviceInfo = function (callback) {
    var ua = navigator.userAgent.toUpperCase();
    var PACHART_IS_ANDROID = ua.indexOf("ANDROID") != -1;
    var PACHART_IS_IOS = ua.indexOf("IPHONE OS") != -1 || ua.indexOf("IPAD") != -1;
    window["getDeviceInfoCallback"] = callback;
    if (PACHART_IS_ANDROID) {
      window.android.getTxtDeviceId("getDeviceInfoCallback");
    } else {
      if (PACHART_IS_IOS) {
        callindex++;
        location.href = "#ios:getTxtDeviceId|getDeviceInfoCallback|" + callindex;
      }
    }
  };
  App.doCall = function (telphoneNum, callback) {
    var ua = navigator.userAgent.toUpperCase();
    var PACHART_IS_ANDROID = ua.indexOf("ANDROID") != -1;
    var PACHART_IS_IOS = ua.indexOf("IPHONE OS") != -1 || ua.indexOf("IPAD") != -1;
    window["doCallCallback"] = function (result) {
      callback(JSON.parse(result));
    };
    if (PACHART_IS_ANDROID) {
      window.android.doCall(telphoneNum, "doCallCallback");
    } else {
      if (PACHART_IS_IOS) {
        callindex++;
        location.href = "#ios:doCall|doCallCallback|" + telphoneNum + "|" + callindex;
      }
    }
  };
  App.getAppShare = function (callback) {
    if (App.IS_NATIVE) {
      if (App.IS_ANDROID) {
        callback("");
      } else {
        var appVersionCallBack = function (version) {
          var v = version.replace(/\./g, "");
          if (App.IS_IOS && v >= 202) {
            App.call("getAppShare", callback);
          } else {
            callback("");
          }
        };
        App.call("getAppVersion", appVersionCallBack);
      }
    } else {
      callback("");
    }
  };
  App.updateAppShare = function (shareData) {
    if (App.IS_NATIVE) {
      if (App.IS_ANDROID) {} else {
        App.call("updateAppShare", shareData);
      }
    } else {}
  };
  App.returnValueToNative = function (value) {
    if (App.IS_NATIVE) {
      App.call("returnValueToNative", value);
    } else {}
  };
  App.beginDateModified = function (bizQuote, forceQuote) {
    if (App.IS_NATIVE) {
      App.call("beginDateModified", bizQuote, forceQuote);
    } else {}
  };
  App.trackEvent = function (eventId, callback) {
    var c = callback ? callback : "";

    function trackSend(version) {
      var v = version.replace(/\./g, "");
      if (App.IS_IOS && v > 201) {
        App.call("trackEvent", eventId, c);
        App.IOS_Version = version;
      } else {
        if (App.IS_ANDROID && v > 101) {
          App.call("trackEvent", eventId, c);
          App.ANDROID_Version = version;
        }
      }
    }
    if (App.IS_NATIVE) {
      if (App.IS_IOS) {
        if (App.IOS_Version) {
          trackSend(App.IOS_Version);
        } else {
          App.call("getAppVersion", trackSend);
        }
      } else {
        if (App.IS_ANDROID) {
          if (App.ANDROID_Version) {
            trackSend(App.ANDROID_Version);
          } else {
            App.call("getAppVersion", trackSend);
          }
        }
      }
    } else {
      if (typeof callback == "function") {
        exec(callback);
      }
      console.log(eventId);
    }
  };
  App.callNativeFun = function (actionFlag, callback) {
    if ("getVerifyCode" == actionFlag) {
      if (App.IS_ANDROID) {
        App.call("callNativeFun", actionFlag, callback);
      }
    } else {
      if (App.IS_NATIVE) {
        App.call("callNativeFun", actionFlag, callback);
      }
    }
  };
  App.clicpboard = function (str) {
    if (App.IS_NATIVE) {
      App.call("clicpboard", str);
    } else {}
  };
})(App);
window.back = function () {};
window.registerSuccess = function () {
  Cookie("rumUserLogin", "Y");
  if (App.IS_ANDROID) {
    App.returnValueToNative(true);
  }
};
window.rumUserIsLogin = function () {
  if (Cookie("rumUserLogin")) {
    return true;
  }
  return false;
};
window.reqJudgeIsLogin = function () {
  $.ajax({
    type: "POST",
    url: App.getWebServiceUrl("imageCount"),
    data: {
      responseProtocol: "json"
    },
    dataType: "json",
    success: function (a) {
      Cookie("rumUserLogin", "Y");
      App.returnValueToNative(true);
    },
    error: function (b, a) {
      if (b.status == 0) {
        Cookie("rumUserLogin", null);
        App.returnValueToNative(false);
      }
    }
  });
};
window.rumUserLogout = function () {
  if (App.IS_ANDROID) {
    Cookie("rumUserLogin", null);
    App.returnValueToNative(false);
  } else {
    Cookie("rumUserLogin", null);
  }
};