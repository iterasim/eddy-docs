/* Pre-select the Linux or Windows tab to match the visitor's OS.
   The other tab stays one click away — we never hide it. Re-runs on every page
   load, including Material's instant navigation.

   Material's "alternate style" tabs render as:
     .tabbed-set > input[radio] ... > .tabbed-labels > label[for=<input id>]
   so the labels are NOT direct children of .tabbed-set. */
(function () {
  "use strict";

  function detect() {
    var ua = navigator.userAgent || "";
    var plat = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || "";
    if (/Win/i.test(plat) || /Windows NT/i.test(ua)) return "windows";
    if (/Android/i.test(ua) || /CrOS/i.test(ua)) return null;   /* report Linux, can't run Eddy */
    if (/Linux/i.test(plat) || /X11/i.test(ua)) return "linux";
    return null;                                                /* macOS and anything else: leave default */
  }

  function selectTabs() {
    var want = detect();
    if (!want) return;

    document.querySelectorAll(".tabbed-set").forEach(function (set) {
      var labels = set.querySelectorAll(".tabbed-labels > label");
      for (var i = 0; i < labels.length; i++) {
        if (labels[i].textContent.trim().toLowerCase() === want) {
          var id = labels[i].getAttribute("for");
          var input = id && document.getElementById(id);
          if (input && !input.checked) input.click();
          break;
        }
      }
    });
  }

  /* Run once now. Material's document$ is a plain Subject — if it already
     emitted before this script loaded, a late subscriber never fires — so the
     subscription is an extra for instant-nav, never the only trigger. */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", selectTabs);
  } else {
    selectTabs();
  }
  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(selectTabs);
  }
})();
