(function (window) {
  var id;
  window.companyID = "0";
   var baseURL =  "http://ncdev.kapitalwise.com/";
  var publishBaseUrl="http://100.25.151.35:1340/";
  var triggers = [];
  var pageURLTriggers = [];
  var triggersArrived = false;
  var documentHasLoaded = false;
  var didPublish = false;
  const sentEventsContainer = new Set();
  window.sentEventsContainer = sentEventsContainer;
    var device = {};
  function deviceDataAllocater() {
    var client = new ClientJS();
    device['browserEngine'] = client.getEngine();
    device['browserEngineVersion'] = client.getEngineVersion();
    device['cpuArchitecture'] = client.getCPU();
    device['isMobile'] = client.isMobileMajor();
    device['isMobileAndroid'] = client.isMobileAndroid();
    device['isIpad'] = client.isIpad();
    device['isIphone'] = client.isIphone();
    device['colorDepth'] = client.getColorDepth();
    device['currentResolution'] = client.getCurrentResolution();
    device['timezone'] = client.getTimeZone();
    device['browser'] = client.getBrowser();
    device['browserVersion'] = client.getBrowserVersion();
    device['os'] = client.getOS();
    device['osVersion'] = client.getOSVersion();
    device['userAgent'] = client.getUserAgent();
     device['deviceXDPI']= client.getDeviceXDPI();
    device['deviceYDPI']= client.getDeviceYDPI();
     device['systemLanguage']= client.SystemLanguage();
     device['plugins'] = client.getPlugins();

  }

  var dep = document.createElement("script");
  dep.src =
    "https://cdnjs.cloudflare.com/ajax/libs/ClientJS/0.2.0/client.min.js";
  dep.type = "text/javascript";
  dep.async = false;
  dep.defer = false;
  document.getElementsByTagName("head")[0].appendChild(dep);
  dep.addEventListener("load", deviceDataAllocater);
  try {
    kw.stopAll();
  } catch (e) {}
  function setCookie(cname, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    id = new Date().getTime();
    document.cookie = cname + "=" + id + ";" + expires + ";path=/";
  }

  function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  function getId() {
    let user = getCookie("_ka");
    // console.log("Welcome again " + user);
    return user;
  }

  if (getCookie("_ka") != "") {
    id = getId();
  } else {
    setCookie("_ka", 10000000);
  }
  async function beaconRequest(url, data) {
    try {
    //  window.navigator.sendBeacon(url, data);

    fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'no-cors', // no-cors, *cors, same-origin
   // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  //  credentials: 'same-origin', // include, *same-origin, omit
    // headers: {
    //   'Content-Type': 'application/json'
    //   // 'Content-Type': 'application/x-www-form-urlencoded',
    // },
      credentials: 'omit'
,
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: data// body data type must match "Content-Type" header
  });

    } catch (e) {}
  }
  ////
  function postEvents() {
    window.sentEventsContainer.forEach(function (value) {
      //  console.log(value);

      var sendData = {
        eventDefinitionId: value,
        companyKey: companyID,
        eventData: { webpageUrl: window.location.href ,device:device},
        cookieId: id,
      };
      beaconRequest(publishBaseUrl + `events/publish`, JSON.stringify(sendData));
    });
    window.sentEventsContainer.clear();
  }
  setInterval(postEvents, 1000);

  ////
  var pushState = history.pushState;
  var replaceState = history.replaceState;

  history.pushState = function () {
    pushState.apply(history, arguments);
    window.dispatchEvent(new Event("pushstate"));
    window.dispatchEvent(new Event("locationchange"));
  };

  history.replaceState = function () {
    replaceState.apply(history, arguments);
    window.dispatchEvent(new Event("replacestate"));
    window.dispatchEvent(new Event("locationchange"));
  };

  window.addEventListener("popstate", function () {
    window.dispatchEvent(new Event("locationchange"));
  });
  window.addEventListener("locationchange", publishPageURLEvents);
  window.onbeforeunload = function () {
    postEvents();
  };
  /////////
  function publishPageURLEvents() {
    pageURLTriggers.forEach((t) => {
      var u = window.location.href;
      var p = window.location.pathname;
      u = withEnd(u);
      p = withEnd(p);
      if (t.filterCategory == "path" && t.byAction(p, t.filterValue)) {
        t.send();
      } else if (t.filterCategory == "url" && t.byAction(u, t.filterValue)) {
        t.send();
      }
    });
  }
  class Trigger {
    constructor(fc, fa, fv, l, eID, elemType) {
      // console.log(fc, fa, fv, l, eID, elemType);
      this.filterCategory = fc;
      this.filterAction = fa;
      this.filterValue = fv;
      this.listener = l;
      this.elemType = elemType;
      this.eventID = eID;
      let filt = new Filter();
      this.CategoryOfElem = filt.getCompareVal(this.filterCategory);
      this.byAction = filt.getActionCompare(this.filterAction);
    }
    isTrigger(elem) {
      // if (elem.href != undefined)
      //   console.log(this.byAction(elem.href, this.filterValue));

      if (
        elem == document ||
        elem == document.body ||
        elem == window ||
        elem == document.head ||
        elem.tagName == "HTML" ||
        elem.tagName == "BODY" ||
        elem.tagName == "HEAD"
      ) {
        return false;
      }

      // console.log(elem);
      //   console.log(this.filterValue, this.CategoryOfElem(elem));
      if (this.elemType == "input" && elem.tagName != "INPUT") {
        return false;
      }
      if (this.elemType == "input" && this.filterCategory == "text") {
        return true;
      }

      if (this.elemType == "form" && elem.tagName != "FORM") {
        // console.log("returned");
        return false;
      }

      if (
        (this.filterCategory == "class" || this.filterCategory == "id") &&
        (this.filterAction == "is not" ||
          this.filterAction == "does not contain")
      ) {
        var a = elem;
        //  console.log(a);
        while (a) {
          if (
            a == document ||
            a == document.body ||
            a == window ||
            a == document.head ||
            a.tagName == "HTML" ||
            a.tagName == "BODY" ||
            a.tagName == "HEAD"
          ) {
            break;
          }
          if (!this.byAction(this.CategoryOfElem(a), this.filterValue)) {
            return false;
          }

          a = a.parentNode;
        }

        return true;
      } else {
        var a = this.CategoryOfElem(elem);
        //  console.log(a, this.filterValue, this.byAction(a, this.filterValue));

        return this.byAction(a, this.filterValue);
      }
    }

    send() {
      // var data = {
      //   companyKey: companyID,
      //   eventDefinitionId: this.eventID,
      //   eventData: { webpageUrl: window.location.href },
      //   cookieId: id,
      // };
      window.sentEventsContainer.add(this.eventID);
    }
  }
  class Filter {
    getActionCompare(action) {
      if (action == "is") return this.is;
      if (action == "is not") return this.isNot;
      if (action == "contains") return this.contains;
      if (action == "does not contain") return this.notContain;
      if (action == "starts with") return this.startWith;
      if (action == "ends with") return this.endWith;
      else
        return (a, b) => {
          return false;
        };
    }
    is(a, b) {
      return a === b;
    }
    isNot(a, b) {
      return a != b;
    }
    contains(a, b) {
      return a.includes(b);
    }
    notContain(a, b) {
      return !a.includes(b);
    }
    startWith(a, b) {
      return a.indexOf(b) == 0;
    }
    endWith(a, b) {
      if (b.length > a.length) return false;
      var t = a.substring(a.length - b.length, a.length);
      return t == b;
    }

    getCompareVal(val) {
      if (val == "class") return this.byclass;
      if (val == "id") return this.byID;
      if (val == "element") return this.byelement;
      if (val == "url") return this.byURL;
      if (val == "target") return this.byTarg;
      if (val == "text") return this.byText;
    }
    byclass(elem) {
      if (elem.className) {
        return elem.className.toLowerCase();
      }
      return "";
    }
    byID(elem) {
      if (elem.id) {
        return elem.id.toLowerCase();
      }
      return "";
    }
    byText(elem) {
      // if (elem.tagName == "FORM") {
      //   var x = "";
      //   if (elem.innerHTML != null || elem.innerText != null)
      //     //  x += elem.innerHTML || elem.innerText;
      //     var allelems = elem.querySelectorAll("*");
      //   for (var i = 0; i < allelems.length; i++) {
      //     var a = allelems[i];
      //     //   console.log(a);

      //     if (a.tagName != "BUTTON" && a.tagName != "INPUT")
      //       x += a.innerHTML || a.innerText;
      //   }
      //   if (x) {
      //     //console.log(x);
      //     return x.toLowerCase();
      //   }
      //   return "";
      if (elem.tagName == "INPUT") {
        return elem.value.toLowerCase();
      }
      var t = elem.innerText || elem.innerHTML;
      if (t) {
        return t.toLowerCase();
      }
      return "";
    }
    byelement(elem) {
      if (elem.tagName) {
        return elem.tagName.toLowerCase();
      }
      return "";
    }
    byURL(elem) {
      if (elem.tagName == "FORM") {
        if (elem.action) {
          return withEnd(elem.action.toLowerCase());
        }
        return "";
      }
      if (elem.href == undefined || elem.href == null) return "";
      return withEnd(elem.href.toLowerCase());
    }
    byTarg(elem) {
      if (elem.target) {
        return withEnd(elem.target.toLowerCase());
      }
      return "";
    }
  }

  /////////////////////

  function createTriggers(e,eID) {
    // evs.forEach((e) => {
    var trs = e.webpageTriggers;
    trs.forEach((t) => {
      var fs = t.webpageTriggerFilters;
      if (fs.length == 0) {
      } else {
        fs.forEach((f) => {
          var lis;
          var cat;
          var elemT = "all";

          var a = f.webpageTriggerFilterPropertyId.name.toLowerCase();
          var b = f.webpageTriggerFilterActionId.name.toLowerCase();

          var c = f.webpageTriggerFilterValue;
          if (!a.includes("page")) {
            c = c.toLowerCase();
          }
          if (a.includes("page")) {
            lis = "locationchange";
            elemT = "page";
          } else if (a.includes("form")) {
            lis = "submit";
            elemT = "form";
          } else if (a.includes("input")) {
            lis = "change";
            elemT = "input";
          } else {
            lis = "click";
          }
          if (a.includes("id")) {
            cat = "id";
          } else if (a.includes("class")) {
            cat = "class";
          } else if (a.includes("text")) {
            cat = "text";
          } else if (a.includes("element")) {
            cat = "element";
          } else if (a.includes("url")) {
            cat = "url";
          } else if (a.includes("target")) {
            cat = "target";
          } else if (a.includes("hostname")) {
            cat = "hostname";
          } else if (a.includes("path")) {
            cat = "path";
          } else if (a.includes("url")) {
            cat = "url";
          }
          var newT = new Trigger(cat, b, c, lis, eID, elemT);
          //   console.log(cat, b, c, lis, e.id, elemT);
          if (elemT != "page") {
            triggers.push(newT);
          } else {
            pageURLTriggers.push(newT);
          }
        });
      }
    });
    // });
  }
  /////////////////
  var requestedEventsCount = 0;
  var ArrivedEventsCount = 0;

  const kw = (cID) => {
    window.companyID = cID;
    // fetch(baseURL + "eventDefinitions/custom?companyKey=" + companyID)
    //   .then((data) => {
    //     return data.json();
    //   })
    //   .then((events) => {
    //     createTriggers(events);
    //     triggersArrived = true;

    //     onDocumentLoad();
    //   })
    //   .catch((e) => {});
  };

  const kw_event = (eID) => {
    requestedEventsCount++;
     fetch(
      baseURL +
         `eventDefinitions/${eID}/webpageTriggers?companyKey=${companyID}`,{
    // )
      //  fetch(url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
  //  mode: 'no-cors', // no-cors, *cors, same-origin
   // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  //  credentials: 'same-origin', // include, *same-origin, omit
    // headers: {
    //   'Content-Type': 'application/json'
    //   // 'Content-Type': 'application/x-www-form-urlencoded',
    // },
      credentials: 'omit'

    // redirect: 'follow', // manual, *follow, error
 //   referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  }).then((data) => {
            console.log(data);

        return data.json();
      })
      .then((event) => {
        console.log(event);
        ArrivedEventsCount++;
        createTriggers(event,eID);
        if (ArrivedEventsCount == requestedEventsCount) {
          triggersArrived = true;
          onDocumentLoad();
        }
      })
      .catch((e) => {});
  };
  window.kw = kw;
  window.kw_event = kw_event;

  // var t1 = new Trigger("url", "contains", "ggg", "click", "r666", "all");

  // var t2 = new Trigger("text", "is", "salah", "change", "4443", "input");
  // var t3 = new Trigger(
  //   "url",
  //   "ends with",
  //   "file.html",
  //   "locationchange",
  //   "99999999999",
  //   "page"
  // );
  // pageURLTriggers.push(t3);

  // triggers.push(t1);
  // triggers.push(t2);
  // triggersArrived = true;
  // onDocumentLoad();

  ///////////////////////

  const sendEvent = (y) => {
    return (e) => {
      // console.log(
      //   y.filterCategory,
      //   e.target.tagName,
      //   y.byAction(y.CategoryOfElem(e.target), y.filterValue)
      // );
      if (y.filterAction == "is not" || y.filterAction == "does not contain") {
        if (e.currentTarget === e.target) {
          y.send();
        }
      } else if (
        y.filterCategory == "text" &&
        e.target.tagName == "INPUT" &&
        y.byAction(y.CategoryOfElem(e.target), y.filterValue)
      ) {
        y.send();
      } else if (!(y.filterCategory == "text" && e.target.tagName == "INPUT")) {
        y.send();
      }
    };
  };

  function elementsIterator(all) {
    for (var i = 0; i < all.length; i++) {
      var x = all[i];
      for (var j = 0; j < triggers.length; j++) {
        var y = triggers[j];
        if (y.isTrigger(x)) {
          if (x.tagName == "IFRAME") {
            x.contentDocument.body.addEventListener(y.listener, sendEvent(y));
          } else {
            x.addEventListener(y.listener, sendEvent(y));
          }
        }
      }
    }
  }
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.addedNodes.length) {
        var all = mutation.addedNodes;
        elementsIterator(all);
      }
    });
  });

  function publishTriggers() {
    // published = true;
    var all = document.querySelectorAll("*");
    elementsIterator(all);
    observer.observe(document.body, { childList: !0, subtree: !0 });
  }

  /////////////////////////////////////
  function withEnd(a) {
    var b = "com/";
    if (b.length > a.length) return false;
    var t = a.substring(a.length - b.length, a.length);
    if (t == b) {
      return a.substring(0, a.length - 1);
    }
    return a;
  }
  function onDocumentLoad() {
    if (triggersArrived && !didPublish && documentHasLoaded) {
      didPublish = false;
      publishTriggers();
      pageURLTriggers.forEach((t) => {
        var u = window.location.href;
        var h = window.location.host;
        var p = window.location.pathname;
        p = withEnd(p);
        u = withEnd(u);
        // console.log(t.filterValue);
        // console.log(
        //   t.filterCategory,
        //   u,
        //   t.filterValue.toLowerCase(),
        //   u == t.filterValue.toLowerCase()
        // );
        console.log(
          t.filterCategory,
          u,
          t.filterValue,
          t.byAction(u, t.filterValue)
        );
        if (t.filterCategory == "hostname" && t.byAction(h, t.filterValue)) {
          t.send();
        }
        if (t.filterCategory == "url" && t.byAction(u, t.filterValue)) {
          t.send();
        }
        if (t.filterCategory == "path" && t.byAction(p, t.filterValue)) {
          t.send();
        }
      });
    }
  }
  function whenLoad() {
    documentHasLoaded = true;
    onDocumentLoad();
  }

  document.addEventListener("DOMContentLoaded", whenLoad);
})(window);
