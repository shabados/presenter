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

function connect(link){
  link = "http://"+link

  if (parent.location != window.location) { link = link+"/display"; }
  else if (opener) {
    opener.parent.location.href = link+"/display";
    $('iframe', opener.parent.document).hide();
  }
  else if (typeof remote === "object") { remote.require('./main').connect(link); }

  parent.location.href = link;
}

(function () {
  function initBrowser() {
    if ($("#title-popout").length) {
      document.getElementById("title-popout").addEventListener("click", function (e) {
        parent.navWindow = open(location.href,"","");
        $('iframe', parent.document).hide();
      });
    }
    if ($("#title-popin").length) {
      document.getElementById("title-popin").addEventListener("click", function (e) {
          if (opener) {
            $('iframe', opener.parent.document).attr('src', location.href);
            $('iframe', opener.parent.document).show();
            self.close();
          } else {
            location.href = "/display";
          }
      });
    }
  }
  function initRemote() {

    if ($("#title-popout").length) {
      document.getElementById("title-popout").addEventListener("click", function (e) {
        remote.require('./main').openNavigationWindow(window.location.href);
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

      if (typeof remote === "object") {
        initRemote();
      } else {
        initBrowser();
      }
    }
  };

})();
