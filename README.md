# ShabadOS App
This is the golang backend for running the webserver that powers Shabad OS. Shabad OS, or Shabad Open Source, is an effort to openly and easily share gurbani with others. This specific app is for running projector software, for example at a Sikh Gurdwara during Kirtan.

The only thing missing from this backend is the database. There will be a separate repository for downloading the database release. The database should be renamed and moved to "./includes/data".

If you are a golang developer, you can run "go install" in the root directory and have a working executable. Point your web browser to localhost:8080/display.

If you are looking for an electron-wrapped app, where you can download it and execute it on your windows machine, please go to shabados.com for the latest release.
