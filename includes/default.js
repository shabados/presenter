var remote;
if (typeof parent.nodeRequire === "function") {
  remote = parent.nodeRequire('electron').remote;
}

function openOBS(topBottom){
  if (typeof remote === "object") { 
    remote.require('./main').openOBS(topBottom);
  } else {
    window.open("obs-"+topBottom);
  }
}

(function () {
  function initBrowser() {
    if ($("#title-popout").length) {
      document.getElementById("title-popout").addEventListener("click", function (e) {
        window.open("index");
        $('iframe', window.parent.document).hide();
      });
    }
    if ($("#title-popin").length) {
      document.getElementById("title-popin").addEventListener("click", function (e) {
        window.self.close();
      });
    }
  }
  function initRemote() {

    if ($("#title-popout").length) {
      document.getElementById("title-popout").addEventListener("click", function (e) {
        window = $('iframe', window.parent.document).contentWindow;
        url = window.location.href;
        remote.require('./main').openNavigationWindow(url);
      });
    }

    if ($("#title-popin").length) {
      document.getElementById("title-popin").addEventListener("click", function (e) {
        remote.require('./main').showNavigation(window.location.href);
      });
    }
    
    if ($("#title-minimize").length) {
      document.getElementById("title-minimize").addEventListener("click", function (e) {
        const window = remote.getCurrentWindow();
        window.minimize();
      });
    }
  
    if ($("#title-maximize").length) {
      document.getElementById("title-maximize").addEventListener("click", function (e) {
        const window = remote.getCurrentWindow();
        if (!window.isFullScreen()) {
          window.setFullScreen(true);
        } else {
          window.setFullScreen(false);
        }
      });
    }
    
    if ($("#title-close").length) {
      document.getElementById("title-close").addEventListener("click", function (e) {
        const window = remote.getCurrentWindow();
        window.close();
      });
    }

  };

  document.onreadystatechange = function () {
    if (document.readyState == "complete") {
      if (window.top == window.self && $("#title-popout").length) {
          $("#titlebar .buttons.right").addClass("window");
      }
      console.log(typeof remote);
      if (typeof remote === "object") {
        initRemote();
      } else {
        initBrowser();
      }
    }
  };

})();
