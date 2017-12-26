# ShabadOS App
This is for running a web server for Shabad OS. It allows anyone on the same network to control a viewer and to view the display. It can easily be purposed for a projector, i.e. at a Sikh Gurdwara during Kirtan, for multiple viewers and controllers.

If you are looking for an electron-wrapped app, where you can download it and execute it on your windows machine, please go to our [website](https://shabados.com/) for the latest release.

This repo lacks the database used to pull up searches, gurbani, translations, etc. Use the [Database](https://github.com/ShabadOS/database) repository for downloading the latest release. The database should be moved to "./includes/data".

## Installation
* Dependencies: [Go](https://golang.org/) and [Sass](http://sass-lang.com/).
* Possible dependency: Avahi (You could try the rest of the instructions and it might work, this is for "Connect to.." via mDNS feature).
  * Linux: avahi daemon, avahi dns_sd compat library and its header files
    * Ubuntu might have avahi-daemon pre-installed
    * Solus: install avahi-devel through software center

There are three methods (*NB: Our documentation refers to the first method!*): 

(1) using `git clone`

    git clone https://github.com/ShabadOS/core.git $GOPATH/src/shabadOS
    cd $GOPATH/src/shabadOS
      
(2) using `go get` (If you don't have git, and you just need a background server)

    go get github.com/ShabadOS/core
    cd $GOPATH/src/github.com/ShabadOS/core
      
  
With the above methods,you need to install Go dependencies with `go get` in the core directory, and
then simply run `go build` or `go install` in the parent directory and execute the binary in your terminal at the same location.

    # go build -- placed in pwd
    go build
    ./shabadOS
      
    # go install -- placed in $GOPATH/src/
    go install
    shabadOS

(3) using `docker` and `docker-compose` (you don't need to install any dependencies, or download the database separately):
    
    git clone https://github.com/ShabadOS/core.git shabadOS
    cd shabadOS
    docker-compose up  

The program starts a webserver at [localhost:42424](http://localhost:42424/). You can control the viewer from here or view ["/display"](http://localhost:42424/display) to see it.

## Usage

Anyone on the same network as the web server can connect using your IP address [[NB]](#troubleshooting) and view these pages:
* Controller ([/](http://localhost:42424/)): This page is considered the "remote" to the display/projector page. You can search (first letter, spaces as wild card characters, pre-pend with hashtag for full word), see a list of banis often read, a history (with export function), and easily navigate the active shabad line for the projector. The controller is probably best used on a mobile device.
* Display ([/display](http://localhost:42424/display)): This page can be used as a projector. It has a controller embedded at the bottom right. This controller can be "popped out" if you have two screens. And if you wanted, you could always open another controller in your browser and control two different shabads at the same time!
* Kobo ([/kobo](http://localhost:42424/kobo)): This page can be opened on some experimental web browsers for eBook readers, like a Kindle. Tested on the Kobo Aura ONE. The benefit of an eInk display is that it does not need to transmit light to be readable. Makes a great alternative to reading physical pages of the Amrit Kirtan or Bahu Shabdi on a Vaja.
* OBS ([/obs-top](http://localhost:42424/obs-top) [/obs-bottom](http://localhost:42424/obs-bottom)): This page can be used by programs like [Open Broadcaster Software](https://obsproject.com/) with the green filtered out to add subtitles to videos and live streams.

## Troubleshooting

NB: If the address shown in the controller's titlebar does not match 192.168.XX.XXX, then most likely you need to use a terminal to figure out the correct IP address (Windows: Start > cmd > ipconfig; Linux: `ip addr` or `ifconfig`; Mac OS: `ifconfig | grep "inet " | grep -v 127.0.0.1`). Similarly if both devices are on the network and have Shabad OS core installed, they can use the built-in "Connect to" feature in the menu.

## Development

Make CSS changes to the SCSS file and use Sass to compile it. Check the examples against your pwd:

    # one time
    sass styles/main.scss styles/main.css
    
    # repeat until ctrl-c
    sass --watch styles/main.scss:styles/main.css
