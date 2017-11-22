# ShabadOS App
This is for running a web server for Shabad OS. It allows anyone on the same network to control a viewer and to view the display. It can easily be purposed for a projector, i.e. at a Sikh Gurdwara during Kirtan, for multiple viewers and controllers.

If you are looking for an electron-wrapped app, where you can download it and execute it on your windows machine, please go to our [website](https://shabados.com/) for the latest release.

This repo lacks the database used to pull up searches, gurbani, translations, etc. Use the [Database](https://github.com/ShabadOS/Database) repository for downloading the latest release. The database should be moved to "./includes/data".

## Installation
* Dependencies: [Go](https://golang.org/) and [Sass](http://sass-lang.com/).

There are two methods (*NB: Our documentation refers to the first method!*): 

(1) using `git clone`

      git clone https://github.com/ShabadOS/shabadOS.git $GOPATH/src/shabadOS
      cd $GOPATH/src/shabadOS
      
(2) using `go get` (If you don't have git, and you just need a background server)

      go get github.com/ShabadOS/shabadOS
      cd $GOPATH/src/github.com/ShabadOS/shabadOS

Then simply run `go build` or `go install` in the parent directory and execute the binary in your terminal at the same location.

      # go build -- placed in pwd
      go build
      ./shabadOS
      
      # go install -- placed in $GOPATH/src/
      go install
      shabadOS

The program starts a webserver at [localhost:8080](http://localhost:8080/). You can control the viewer from here or view ["/display"](http://localhost:8080/display) to see it.

## Usage

Anyone on the same network as the web server can connect using your IP address [[NB]](README.md#troubleshooting) and view these pages:
* Controller ([/](http://localhost:8080/)): This page is considered the "remote" to the display/projector page. You can search (first letter, spaces as wild card characters, pre-pend with hashtag for full word), see a list of banis often read, a history (with export function), and easily navigate the active shabad line for the projector. The controller is probably best used on a mobile device.
* Display ([/display](http://localhost:8080/display)): This page can be used as a projector. It has a controller embedded at the bottom right. This controller can be "popped out" if you have two screens. And if you wanted, you could always open another controller in your browser and control two different shabads at the same time!
* Kobo ([/kobo](http://localhost:8080/kobo)): This page can be opened on some experimental web browsers for eBook readers, like a Kindle. Tested on the Kobo Aura ONE. The benefit of an eInk display is that it does not need to transmit light to be readable. Makes a great alternative to reading physical pages of the Amrit Kirtan or Bahu Shabdi on a Vaja.
* OBS ([/obs-top](http://localhost:8080/obs-top) [/obs-bottom](http://localhost:8080/obs-bottom)): This page can be used by programs like [Open Broadcaster Software](https://obsproject.com/) with the green filtered out to add subtitles to videos and live streams.

## Troubleshooting

NB: If the address shown in the controller's titlebar does not match 192.168.XX.XXX, then most likely you need to use a terminal to figure out the correct IP address (Windows: Start > cmd > ipconfig; Linux: `ip addr` or `ifconfig`; Mac OS: `ifconfig | grep "inet " | grep -v 127.0.0.1`).
