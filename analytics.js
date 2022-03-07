let device;
let baseURL = "https://ncqa.kapitalwise.com/";

let checklist = {
    cdnLoaded: false,
    TPCcalled: false,
    messgePassingDone :false,
}
var COOKIE ;
const checklistDone = () => {
    return checklist.cdnLoaded && checklist.TPCcalled && checklist.messgePassingDone
}

function setCookie(cname, exdays,id) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    // id = new Date().getTime();
    document.cookie = cname + "=" + id + ";" + expires + ";path=/" + ";SameSite=None; Secure";
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
function customScript(window) {
   // let id = COOKIE;
    window.companyID = "0";
    
    let publishBaseUrl = "https://qaevent.kapitalwise.com/";
    let triggers = [];
    let pageURLTriggers = [];
    let triggersArrived = false;
    let documentHasLoaded = false;
    let didPublish = false;
    const sentEventsContainer = new Set();
    window.sentEventsContainer = sentEventsContainer;
    // let device = {};
    // function deviceDataAllocater() {
    //     let client = new ClientJS();
    //     device['browserEngine'] = client.getEngine();
    //     device['browserEngineVersion'] = client.getEngineVersion();
    //     device['cpuArchitecture'] = client.getCPU();
    //     device['isMobile'] = client.isMobileMajor();
    //     device['isMobileAndroid'] = client.isMobileAndroid();
    //     device['isIpad'] = client.isIpad();
    //     device['isIphone'] = client.isIphone();
    //     device['colorDepth'] = client.getColorDepth();
    //     device['currentResolution'] = client.getCurrentResolution();
    //     device['timezone'] = client.getTimeZone();
    //     device['browser'] = client.getBrowser();
    //     device['browserVersion'] = client.getBrowserVersion();
    //     device['os'] = client.getOS();
    //     device['osVersion'] = client.getOSVersion();
    //     device['userAgent'] = client.getUserAgent();
    //     device['deviceXDPI'] = client.getDeviceXDPI();
    //     device['deviceYDPI'] = client.getDeviceYDPI();
    //     device['systemLanguage'] = navigator.systemLanguage;
    //     device['plugins'] = client.getPlugins();

    // }

    // let dep = document.createElement("script");
    // dep.src =
    //     "https://cdnjs.cloudflare.com/ajax/libs/ClientJS/0.2.0/client.min.js";
    // dep.type = "text/javascript";
    // dep.async = false;
    // dep.defer = false;
    // document.getElementsByTagName("head")[0].appendChild(dep);
    // dep.addEventListener("load", deviceDataAllocater);
    try {
        //    kw.stopAll();
    } catch (e) { }
    // function setCookie(cname, exdays) {
    //     const d = new Date();
    //     d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    //     let expires = "expires=" + d.toUTCString();
    //     id = new Date().getTime();
    //     document.cookie = cname + "=" + id + ";" + expires + ";path=/" + ";SameSite=None; Secure";
    // }

    // function getCookie(cname) {
    //     let name = cname + "=";
    //     let ca = document.cookie.split(";");
    //     for (let i = 0; i < ca.length; i++) {
    //         let c = ca[i];
    //         while (c.charAt(0) == " ") {
    //             c = c.substring(1);
    //         }
    //         if (c.indexOf(name) == 0) {
    //             return c.substring(name.length, c.length);
    //         }
    //     }
    //     return "";
    // }

    // function getId() {
    //     let user = getCookie("_ka");
    //     return user;
    // }

    // if (getCookie("_ka") != "") {
    //     id = getId();
    // } else {
    //     if (localStorage.getItem('isKwCookiesAllowed') == 'false') {
    //         //return;
    //     }
    //     else
    //         setCookie("_ka", 10000000);
    // }
    async function beaconRequest(url, data) {
        try {
            window.navigator.sendBeacon(url, data);
        } catch (e) { }
    }
    ////
    function postEvents() {
        window.sentEventsContainer.forEach(function (value) {
            //  console.log(value);

            let sendData = {
                eventDefinitionId: value,
                companyKey: companyID,
                eventData: { webpageUrl: window.location.href, device: device },
                cookieId: COOKIE,
            };
            beaconRequest(publishBaseUrl + `events/publish`, JSON.stringify(sendData));
        });
        window.sentEventsContainer.clear();
    }
    setInterval(postEvents, 1000);

    ////
    let pushState = history.pushState;
    let replaceState = history.replaceState;

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
    window.addEventListener('beforeunload', function () {
        postEvents();
    });

    function publishPageURLEvents() {
        pageURLTriggers.forEach((t) => {
            let u = window.location.href;
            let p = window.location.pathname;
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
            if (this.elemType == "input" && elem.tagName != "INPUT") {
                return false;
            }
            if (this.elemType == "input" && this.filterCategory == "text") {
                return true;
            }

            if (this.elemType == "form" && elem.tagName != "FORM") {
                return false;
            }

            if (
                (this.filterCategory == "class" || this.filterCategory == "id") &&
                (this.filterAction == "is not" ||
                    this.filterAction == "does not contain")
            ) {
                let a = elem;
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
                let a = this.CategoryOfElem(elem);

                return this.byAction(a, this.filterValue);
            }
        }

        send() {
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
            let t = a.substring(a.length - b.length, a.length);
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

            if (elem.tagName == "INPUT") {
                return elem.value.toLowerCase();
            }
            let t = elem.innerText || elem.innerHTML;
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


    function createTriggers(e, eID) {
        let trs = e.webpageTriggers;
        trs.forEach((t) => {
            let fs = t.webpageTriggerFilters;
            if (fs.length == 0) {
            } else {
                fs.forEach((f) => {
                    let lis;
                    let cat;
                    let elemT = "all";

                    let a = f.webpageTriggerFilterPropertyId.name.toLowerCase();
                    let b = f.webpageTriggerFilterActionId.name.toLowerCase();

                    let c = f.webpageTriggerFilterValue;
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
                    let newT = new Trigger(cat, b, c, lis, eID, elemT);
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
    let requestedEventsCount = 0;
    let ArrivedEventsCount = 0;

    const kw = (cID) => {
        window.companyID = cID;
    };

    const kw_event = (eID) => {
        requestedEventsCount++;
        fetch(
            baseURL +
            `eventDefinitions/${eID}/webpageTriggers?companyKey=${companyID}`
        )
            .then((data) => {
                return data.json();
            })
            .then((event) => {
                ArrivedEventsCount++;
                createTriggers(event, eID);
                if (ArrivedEventsCount == requestedEventsCount) {
                    triggersArrived = true;
                    onDocumentLoad();
                }
            })
            .catch((e) => { });
    };
    window.kw = kw;
    window.kw_event = kw_event;

    const sendEvent = (y) => {
        return (e) => {
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
        for (let i = 0; i < all.length; i++) {
            let x = all[i];
            for (let j = 0; j < triggers.length; j++) {
                let y = triggers[j];
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
                let all = mutation.addedNodes;
                elementsIterator(all);
            }
        });
    });

    function publishTriggers() {
        // published = true;
        let all = document.querySelectorAll("*");
        elementsIterator(all);
        observer.observe(document.body, { childList: !0, subtree: !0 });
    }

    /////////////////////////////////////
    function withEnd(a) {
        let b = "com/";
        if (b.length > a.length) return false;
        let t = a.substring(a.length - b.length, a.length);
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
                let u = window.location.href;
                let h = window.location.host;
                let p = window.location.pathname;
                p = withEnd(p);
                u = withEnd(u);

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
}


let DEFAULT_QUEUE =[];

function publishAllDefault() {
    let publishBaseUrl = "https://qaevent.kapitalwise.com/";
    
    DEFAULT_QUEUE.forEach(e => {
        window.navigator
            .sendBeacon(publishBaseUrl + "events/publish", JSON.stringify(e))

    })
    DEFAULT_QUEUE = []

}

function defaultScript(window) {
   // let id = COOKIE;
   // let baseURL = "https://ncqa.kapitalwise.com/"
    const d = new Date();
  

    window.addEventListener('beforeunload', function () {
        publishAllDefault();
    });

    let campaignID = '';
    let kwObj = {};
    window.kwObj = kwObj;
    let clickTracker = {
        eventData: { webpageUrl: window.location.href },
        cookieId: COOKIE,
    };

    let viewTracker = {
        eventData: { webpageUrl: window.location.href },
        cookieId: COOKIE,
    };
    let heartBeat = {
        eventData: { webpageUrl: window.location.href },
        cookieId: COOKIE,
    };

    window.kw_web = function (key) {
        kwObj.COMPANY_KEY = key;
        let event = new CustomEvent('DefaultScript_companyKey', { detail: { companyKey: key } })
        window.dispatchEvent(event)

        getEvents();
    }

    const getEvents = () => {
        fetch(baseURL + `events/default/web`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${kwObj.COMPANY_KEY}`,
                //'companyKey': `611fa075fc6d4e008f059203`, 
            },
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            data.forEach(ev => {

                if (ev.key.toLowerCase() == "click") {
                    clickTracker.eventDefinitionId = ev.id;
                    document.addEventListener("click", handleClicks);
                } else if (ev.key.toLowerCase() == "view") {
                    viewTracker.eventDefinitionId = ev.id;
                    handlePageView();
                    document.addEventListener("DOMContentLoaded", handlePageView);
                }
                else if (ev.key.toLowerCase() == "heartbeat") {
                    heartBeat.eventDefinitionId = ev.id;
                    document.addEventListener('scroll', function (e) {
                        eventsFlag = true;
                    });
                    window.setInterval(function () {
                        if (isVideoPlaying() || eventsFlag) {
                            eventsFlag = false;
                            handleHeartBeat();
                        }
                    }, 6e4);
                }
            })

        }).catch(function (error) {
            //  console.log(error);
        });


    }



    kwObj.triggerKey = null;
    kwObj.campaignKey = null;

    window.kw_campaign = function (id) {
        kwObj.campaignKey = id;

    }

    window.kw_trigger = function (id) {
        kwObj.triggerKey = id
    }

    window.kw_company = function (id) {
        kwObj.companyId = id
    }

    kwObj.stopAll = function () {
        try {
            document.removeEventListener("DOMContentLoaded", handlePageView);
            document.removeEventListener("click", handleClicks);
        } catch (e) { }
    };

    function handleClicks(e) {
        if (!kwObj.triggerKey && !kwObj.campaignKey)
            return;
        let target = e.target || e.srcElement;
        if (target.nodeName == "BUTTON" || target.tagName == "BUTTON") {
            clickTracker.eventData = { webpageUrl: window.location.href };
        } else if (target.nodeName == "A" || target.tagName == "A") {
            let t = { webpageUrl: window.location.href, link: target.href };

            clickTracker.eventData = t;
        }
        if (
            target.nodeName == "BUTTON" ||
            target.tagName == "BUTTON" ||
            target.nodeName == "A" ||
            target.tagName == "A"
        )
            try {
                clickTracker.eventData['device'] = device;
                if (!kwObj.triggerKey)
                    clickTracker.eventData['campaignId'] = kwObj.campaignKey;
                else
                    clickTracker.eventData['webpageTriggerId'] = kwObj.triggerKey;
                //clickTracker.eventData['campaignId'] = campaignID;
                clickTracker.eventData['referrer'] = document.referrer;
                clickTracker.companyKey = kwObj.COMPANY_KEY;
                clickTracker.cookieId = COOKIE
                DEFAULT_QUEUE.push(clickTracker);
                if (checklistDone()) {
                    publishAllDefault();
                }
            } catch (e) { }
    }
    function handlePageView() {
        if (!kwObj.triggerKey && !kwObj.campaignKey)
            return;

        let recent = localStorage.getItem(window.location.href);
        let time = d.getTime();
        if (recent && time - parseInt(recent) < 1000)
            return;
        localStorage.setItem(window.location.href, time);
        try {
            viewTracker.eventData['device'] = device;
            if (!kwObj.triggerKey)
                viewTracker.eventData['campaignId'] = kwObj.campaignKey;
            else
                viewTracker.eventData['webpageTriggerId'] = kwObj.triggerKey;

            viewTracker.eventData['webpageUrl'] = window.location.href;
            viewTracker.eventData['referrer'] = document.referrer;
            viewTracker.companyKey = kwObj.COMPANY_KEY;
            viewTracker.cookieId = COOKIE

            DEFAULT_QUEUE.push(viewTracker);
            if (checklistDone()) {
                publishAllDefault();
            }

        } catch (e) { }
    }
    function handleHeartBeat() {
        if (!kwObj.triggerKey && !kwObj.campaignKey)
            return;
        try {


            heartBeat.eventData['device'] = device;
            if (!kwObj.triggerKey)
                heartBeat.eventData['campaignId'] = kwObj.campaignKey;
            else
                heartBeat.eventData['webpageTriggerId'] = kwObj.triggerKey;

            heartBeat.eventData['referrer'] = document.referrer;
            heartBeat.companyKey = kwObj.COMPANY_KEY;
            heartBeat.cookieId = COOKIE


            DEFAULT_QUEUE.push(heartBeat);
            if (checklistDone()) {
                publishAllDefault();
            }
        } catch (e) { }
    }

    let eventsFlag = false;
    const isVideoPlaying = () => {
        let vids = document.querySelectorAll('video');
        let isplay = false;
        vids.forEach(v => {
            if (!v.paused)
                isplay = true;
        })
        return isplay;
    }

    let pushState = history.pushState;
    let replaceState = history.replaceState;
    let lastPath = window.location.pathname;
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
    window.addEventListener("locationchange", (e) => {
        if (window.location.pathname != lastPath) {
            lastPath = window.location.pathname;
            handlePageView();
        }
    });

}



function deviceDataAllocater() {
    let client = new ClientJS();
    let device ={};
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
    device['userAgent'] = client.getUserAgentLowerCase();
    device['deviceXDPI'] = client.getDeviceXDPI();
    device['deviceYDPI'] = client.getDeviceYDPI();
    device['systemLanguage'] = navigator.systemLanguage;
    device['plugins'] = client.getPlugins();
    return device;
}

function isInIframe() {
    return window !== window.parent
}

function propagateCookie(){
    let event = new CustomEvent('cookie', { detail: { cookie: COOKIE } })
    window.dispatchEvent(event)
}

function childScriptFlow (){
    console.log("iside chi")
    let currCookie = getCookie('_ka')

    setTimeout(() => {
        checklist.messgePassingDone = true;
        if (checklistDone()) publishAllDefault();
    }
    ,2000)  /// if parent didn't respond in 2secs then publish anyway
    //
    let msg ={
        senderType :'child',
        type:"childIdentify",
        cookie: currCookie
    }
    window.parent.postMessage(JSON.stringify(msg), '*');
    window.onmessage = function (e) {
        let recMsg = JSON.parse(e.data);
        if(recMsg.senderType=='parent' && recMsg.cookie){
            COOKIE = recMsg.cookie
            if(!currCookie){
                setCookie('_ka', 99999999999999999,COOKIE )
            }
        }
        checklist.messgePassingDone = true;
        if (checklistDone()) publishAllDefault();

    };

}
function parentScriptFlow() { 
    console.log("iside pare")
    let currCookie = getCookie('_ka')
    if(!currCookie){
        setCookie('_ka', 99999999999999999, new Date().getTime())
    } 
    window.onmessage = function (e) {
        let recMsg = JSON.parse(e.data);
        if (recMsg.senderType == 'child' && recMsg.cookie) {
            let msg = {
                senderType :'parent',
                type: "setCookie",
                cookie: COOKIE
            }
            window.parent.postMessage(JSON.stringify(msg), '*');
        }

    };

}

(function (window) {

    COOKIE = getCookie('_ka');


    setInterval(() => {
        propagateCookie()
    }
    , 200)  //  propagateCookie  to all listeners if any  


    customScript(window);
    defaultScript(window);

    let dep = document.createElement("script");
    dep.src =
        "https://cdnjs.cloudflare.com/ajax/libs/ClientJS/0.2.0/client.min.js";
    dep.type = "text/javascript";
    dep.async = false;
    dep.defer = false;
    document.getElementsByTagName("head")[0].appendChild(dep);
    dep.addEventListener("load", () => { device = deviceDataAllocater(); checklist.cdnLoaded = true; if (checklistDone()) publishAllDefault() });

    if (localStorage.getItem('isKwCookiesAllowed') != 'false') {

        window.addEventListener('DefaultScript_companyKey', (e) => {
            fetch(baseURL + 'events/prePublish', {
                method: 'get', credentials: 'include', headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${e.detail.companyKey}`,
                },
            }).then(r => {
                checklist.TPCcalled = true;
                if (checklistDone()) publishAllDefault();
            }).catch(e => { console.log(e) })
        })


        if(isInIframe())
            childScriptFlow();
        else{
            parentScriptFlow()
            checklist.messgePassingDone=true;
        }
    }


})(window)