var randCodeImgage = $("#randCodeImgage");
var username = $("#username");
var password = $("#password");
var randCode = $("#randCode");
var deviceId = $("#deviceId");
var platform = $("#platform");
var GesutureFlag = $("#GustureFlag");
var txtId = "";
var jid = "";
var loginButton = $("#loginButton");
var rateSwitchFlag = null;
var noKeepFlowFlag = true;
var publicKey = "";
var isForgetPassword = false;
var urlzizhubao = "http://www.i-pingan.com/coupon/itzzb.html";
var flowid = null;
var toRenewalLogin = function () {
  App.loadingBegin();
  $.ajax({
    url: App.getWebServiceUrl("toRenewalLogin"),
    data: {
      "WT.mc_id": App.resource,
      responseProtocol: "json",
      requestKey: true
    },
    type: "POST",
    dataType: "json",
    error: function () {
      App.loadingFinish();
    },
    success: function (a) {
      randCodeImgage.attr("src", "data:image/jpg;base64," + a.image);
      App.loadingFinish();
      App.loadingFinish();
      App.changeRandCode();
      if (+a.resultCode !== 0) {
        App.alert(a.error.value);
        return;
      }
      flowid = a.flowid || "";
      Cookie("flowid", flowid);
      publicKey = a.publicKey;
    }
  });
};
toRenewalLogin();
var accessType = getParams("accessType") || Cookie("accessType") || "";
if (accessType != null && accessType != "") {
  Cookie("accessType", accessType);
  if (accessType == "1") {
    App.getDeviceInfo(function (a) {
      var b = JSON.parse(a);
      platform.val("txt");
      deviceId.val(b.deviceId);
      txtId = b.txtId;
      jid = b.jId || getParams("jid") || "";
    });
    if (window.localStorage.getItem("username") != null && window.localStorage.getItem("username") != "") {
      username.val($.trim(window.localStorage.getItem("username").toUpperCase()));
    }
  }
}
var changeRandCodeImage = function (a) {
  App.loadingBegin();
  $.ajax({
    url: App.getWebServiceUrl("toRenewalLogin"),
    data: {
      "WT.mc_id": App.resource,
      responseProtocol: "json"
    },
    type: "POST",
    dataType: "json",
    cache: false,
    error: function () {
      App.loadingFinish();
      App.alert("请求出错，请联系系统管理员");
    },
    success: function (b) {
      if (+b.resultCode !== 0) {
        App.loadingFinish();
        App.alert(b.error.value);
        return;
      }
      App.loadingFinish();
      randCodeImgage.attr("src", "data:image/jpg;base64," + b.image);
      App.changeRandCode();
      flowid = b.flowid || "";
      Cookie("flowid", flowid);
      if (typeof a == "function") {
        a();
      }
    }
  });
};
var getRandImageSrc = function () {
  return randCodeImgage.attr("src");
};
randCodeImgage.on("click", changeRandCodeImage);
var loginsubmit = function (b) {
  b = b + "";
  if (username.val() == "") {
    App.alert("请输入用户名！");
    return;
  }
  if (password.val() == "") {
    App.alert("请输入密码！");
    return;
  }
  if (randCode.val() == "" && b == "true") {
    App.alert("请输入验证码！");
    return;
  }
  var a = $.trim(username.val().toUpperCase());
  username.val(a);
  var c = md5(a + password.val() + randCode.val() + flowid + deviceId.val() + "1" + GesutureFlag.val() + b);
  $.ajax({
    url: App.getWebServiceUrl("appLogin"),
    data: {
      flowid: flowid,
      username: a,
      password: password.val(),
      randCode: randCode.val(),
      deviceId: deviceId.val(),
      platform: platform.val(),
      GusetureFlag: GesutureFlag.val(),
      txtId: txtId,
      jid: jid,
      "WT.mc_id": App.resource,
      "isCheckRandCode": b,
      digest: c,
      responseProtocol: "json"
    },
    type: "POST",
    dataType: "json",
    cache: false,
    error: function () {
      App.loadingFinish();
      App.alert("登录失败");
      window.location.reload();
    },
    success: function (e) {
      if (e.resultCode != "0") {
        isFirstClickOrFocus = true;
      }
      if (e.resultCode == "0") {
        if (accessType == "1") {
          var g = window.localStorage.getItem("username");
          if (g == null || g == "" || username.val() != g) {
            window.localStorage.setItem("username", $.trim(username.val()));
          }
        }
        Cookie("useInsureType", "1", {
          expires: 365
        });
        window.registerSuccess();
        rateSwitchFlag = e.rateSwitchFlag;
        Cookie("txt_rateSwitchFlag", rateSwitchFlag, {
          expires: 365
        });
        Cookie("txt_employeeFlag", e.employeeFlag, {
          expires: 365
        });
        Cookie("loginFlag", "success", {
          expires: 365
        });
        Cookie("loginMillis", (new Date()).getTime(), {
          expires: 365
        });
        var f = getLocalData("umAccount"),
          d = $.trim(username.val());
        if (!App.IS_NATIVE && accessType == "1" && (e.hasGesture == "0" || isForgetPassword)) {
          App.loadingFinish();
          initScreenLock("create", "remote", {
            umAccount: $.trim(username.val()),
            rateSwitchFlag: rateSwitchFlag,
            employeeFlag: e.employeeFlag
          });
          isForgetPassword = false;
        } else {
          if (e.hasGesture == "1") {
            setLocalData("umAccount", d);
          }
          App.saveAppToken("token=" + e.token + "&flowid=" + e.flowid);
          App.href("main.html?rateSwitchFlag=" + rateSwitchFlag + "&employeeFlag=" + e.employeeFlag + "&umCode=" + e.umCode + "&pertainBussinessType=" + e.pertainBussinessType + "&provinceCode=" + e.provinceCode + "&partnerCode=" + e.partnerCode + "&partnerProjectCode=" + e.partnerProjectCode + "&dataSource=" + e.dataSource + "&dataSourceDetail=" + e.dataSourceDetail + "&cityCode=" + e.cityCode + "&url=" + urlzizhubao);
        }
        App.returnValueToNative(true);
      } else {
        if (e.resultCode == "1") {
          App.returnValueToNative(false);
          App.alert("用户名或密码错误");
          changeRandCodeImage();
        } else {
          if (e.resultCode == "2" && b == "true") {
            App.returnValueToNative(false);
            App.alert("验证码错误");
            changeRandCodeImage();
          } else {
            if (e.resultCode == "4") {
              App.returnValueToNative(false);
              App.alert(e.message);
              changeRandCodeImage();
            } else {
              if (e.resultCode == "5") {
                App.returnValueToNative(false);
                App.alert("用户不存在于系统中 ");
              } else {
                if (e.resultCode == "6") {
                  App.returnValueToNative(false);
                  App.alert("用户未绑定公司 ");
                } else {
                  if (e.resultCode == "9") {
                    App.returnValueToNative(false);
                    App.href("../../automobile/mobile/caselist.html");
                  } else {
                    if (e.resultCode == "11") {
                      App.returnValueToNative(false);
                      App.alert("该用户无权限登录 ");
                    } else {
                      App.returnValueToNative(false);
                      App.alert("登录失败");
                      changeRandCodeImage();
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });
};
var getCityByCode = function (h) {
  if (!h) {
    return false;
  }
  var a = null,
    p = null,
    o = "",
    k = "",
    l = "";
  for (var e = 0, f = localCity.length; e < f; e++) {
    p = localCity[e];
    l = $.trim(p.cityCode);
    if (l == h) {
      a = localCity[e];
      a.carPrefix = a.carNo;
      a.cityName = a.cName;
      return a;
    }
  }
  var n = serverCity.split("||"),
    b = [],
    d = null;
  var g = provinceName = "";
  for (var e = 0, f = n.length; e < f; e++) {
    b = n[e];
    if (b) {
      b = b.split("|");
      for (var c = 0, m = b.length; c < m; c++) {
        d = b[c];
        if (d) {
          d = d.split(",");
          if (d.length == 10) {
            g = d[0];
            provinceName = d[1];
          } else {
            d.unshift(provinceName);
            d.unshift(g);
          }
          o = $.trim(d[4]);
          k = $.trim(d[3]);
          l = $.trim(d[2]);
          if (l == h) {
            return {
              provinceCode: d[0],
              provinceName: d[1],
              cityCode: d[2],
              cityName: k,
              cityAlias: o,
              cityPinyin: d[5],
              cityPinyinAlias: d[6],
              departMentCode: d[7],
              carPrefix: d[8].replace(/\s/g, ""),
              lastCode: d[9]
            };
          }
        }
      }
    }
  }
  return false;
};
var loginsubmitFun = function () {
  if (randCode.css("display") == "none") {
    loginsubmit(false);
  } else {
    loginsubmit(true);
  }
};
loginButton.on("click", loginsubmitFun);
App.changeTitle("登录");
App.changeTxtTitle("登录");
var getLocalData = function (a) {
  return localStorage.getItem(a) || Cookie(a);
};
var setLocalData = function (a, b) {
  localStorage.setItem(a, b);
  Cookie(a, b, {
    expires: 365
  });
};
var removeLocalData = function (a) {
  localStorage.setItem(a, "");
  Cookie(a, "", {
    expires: 365
  });
};
var RSAEncrypt = function (b) {
  var a = new RSAKey();
  a.setPublic(publicKey, "10001");
  return a.encrypt(b);
};
var GESTUREMODE = {
  "create": "0",
  "verify": "1"
};
var doGestureRequest = function (b, d, a, c) {
  changeRandCodeImage(function () {
    App.loadingBegin();
    $.ajax({
      url: App.getWebServiceUrl("appLogin"),
      data: {
        flowid: flowid,
        isGesture: true,
        doGesture: GESTUREMODE[b],
        username: d,
        password: a,
        deviceId: deviceId.val(),
        platform: platform.val(),
        txtId: txtId,
        jid: jid
      },
      type: "POST",
      dataType: "json",
      cache: false,
      error: function () {
        App.loadingFinish();
        App.alert("登录失败");
        window.location.reload();
      },
      success: function (e) {
        c(e);
        App.loadingFinish();
      }
    });
  });
};
var isScreenLockRender = false;
var $mode, $verify, $extra;
var initScreenLock = function (d, c, a) {
  $mode = d;
  $verify = c;
  $extra = a;
  $("#umcode").html($extra.umAccount);
  var b = "";
  if ($mode == "create") {
    b = "请设置手势";
  }
  if (isScreenLockRender) {
    window.screenlock.mode = $mode;
    window.screenlock.verify = $verify;
    window.screenlock.reset();
    window.screenlock.repaint();
    setTimeout(function () {
      window.screenlock.showMessage(b);
    }, 500);
    $(".formLogin").hide();
    $("#canvasWrap").show();
    return;
  }
  window.screenlock = new ScreenLock({
    canvasID: "loginCanvas",
    circleCount: 3,
    minSelected: 6,
    mode: $mode,
    verify: $verify,
    showTip: b,
    callback: function (g) {
      var e = screenlock.selectedCircles2Index(),
        f = RSAEncrypt(e);
      doGestureRequest($mode, $extra.umAccount, f, function (h) {
        if (h.resultCode != "0") {
          isFirstClickOrFocus = true;
          systemMonitor("InputTime", "");
        }
        if (h.resultCode == "0") {
          if ($mode == "create") {
            setLocalData("umAccount", $extra.umAccount);
            App.loadingBegin();
            App.href("main.html?rateSwitchFlag=" + $extra.rateSwitchFlag + "&employeeFlag=" + $extra.employeeFlag);
          } else {
            if ($mode == "verify") {
              if (accessType == "1") {
                var j = window.localStorage.getItem("username");
                if (j == null || j == "" || username.val() != j) {
                  window.localStorage.setItem("username", $.trim(username.val()));
                }
              }
              Cookie("useInsureType", "1", {
                expires: 365
              });
              window.registerSuccess();
              rateSwitchFlag = h.rateSwitchFlag;
              Cookie("txt_rateSwitchFlag", rateSwitchFlag, {
                expires: 365
              });
              Cookie("txt_employeeFlag", h.employeeFlag, {
                expires: 365
              });
              Cookie("loginFlag", "success", {
                expires: 365
              });
              Cookie("loginMillis", (new Date()).getTime(), {
                expires: 365
              });
              App.loadingBegin();
              App.href("main.html?rateSwitchFlag=" + rateSwitchFlag + "&employeeFlag=" + h.employeeFlag);
            }
          }
        } else {
          if (h.resultCode == "100") {
            App.alert("非法设置手势");
          } else {
            if (h.resultCode == "101" || h.resultCode == "102" || h.resultCode == "103" || h.resultCode == "104") {
              App.alert("登录失败(error=" + h.resultCode + ")");
            } else {
              if (h.resultCode == "105" || h.resultCode == "106") {
                var i = parseInt(h.tryTotal);
                if (i < 5) {
                  screenlock.showMessage("密码错误，还可以再输入" + (5 - i) + "次");
                } else {
                  App.alert("您已经连续5次输错手势，手势解锁已关闭，请重新登录。");
                  $("#canvasWrap").hide();
                  $(".formLogin").show();
                  setLocalData("umAccount", "");
                  changeRandCodeImage();
                }
              } else {
                if (h.resultCode == "4") {
                  App.alert(h.message);
                } else {
                  if (h.resultCode == "5") {
                    App.alert("用户不存在于系统中 ");
                  } else {
                    if (h.resultCode == "6") {
                      App.alert("用户未绑定公司 ");
                    } else {
                      if (h.resultCode == "9") {
                        App.href("../../automobile/mobile/caselist.html");
                      } else {
                        if (h.resultCode == "11") {
                          App.alert("该用户无权限登录 ");
                        } else {
                          App.alert("登录失败");
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });
    }
  });
  $(".formLogin").hide();
  $("#canvasWrap").show();
  $("#forgetPass").live("tap click", function () {
    $("#canvasWrap").hide();
    $(".formLogin").show();
    setLocalData("umAccount", "");
    changeRandCodeImage();
    isForgetPassword = true;
  });
  $("#anotherAccount").live("tap click", function () {
    $("#canvasWrap").hide();
    $(".formLogin").show();
    changeRandCodeImage();
    username.val("");
    password.val("");
    randCode.val("");
  });
  isScreenLockRender = true;
};
var umAccount = getLocalData("umAccount");
if (umAccount && accessType == "1") {
  initScreenLock("verify", "remote", {
    umAccount: umAccount
  });
  systemMonitor("InputTime", "");
} else {
  $(".formLogin").show();
}