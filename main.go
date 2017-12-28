package main

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"html/template"
	"io"
	"io/ioutil"
	"log"
	"net"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"
	"sync"

	"regexp"

	_ "github.com/mattn/go-sqlite3"
	"github.com/hashicorp/mdns"

)

// compile all templates and cache them
var templates = template.Must(template.ParseGlob("templates/*"))

var db *sql.DB // declare global db variable via sql package's namespace
var err error
var shabadJSON string
var shabadID string
var currentPK string
var JSON string
var mainID string
var toggleLines string
var timePostHistory time.Time
var historyDB string
var dbHistory *sql.DB
var settings Settings
var shabadHTML string
var pagesCount int

var host = ""
var port = 42424

var wg = sync.WaitGroup{}

type Settings struct {
	Layout                  string `json:"Layout"`
	NavigatorHeight         string `json:"Navigator Height"`
	Rahao                   bool   `json:"Sticky Rahao,string"`
	LarivaarGurbani         bool   `json:"Larivaar Gurbani,string"`
	SplitGurbaniLines		bool   `json:"Split Gurbani Lines,string"`
	EnglishTranslation      bool   `json:"English Translation,string"`
	PunjabiTranslation      bool   `json:"Punjabi Translation,string"`
	EnglishTransliteration  bool   `json:"English Transliteration,string"`
	NextLine                bool   `json:"Next Line,string"`
	FontSize                int    `json:"Font Size,string"`
	ColorScheme             string `json:"Color Scheme"`
	BackgroundImage         bool   `json:"Background Image,string"`
	BrightMode              bool   `json:"Bright Mode,string"`
	FontColor               string `json:"Font Color"`
	BackgroundColor         string `json:"Background Color"`
	VishraamColors          bool   `json:"Vishraam Colors,string"`
	VishraamColorsStrong    bool   `json:"Vishraam Colors Strong,string"`
	VishraamCharacters      bool   `json:"Vishraam Characters,string"`
	VishraamLight           bool   `json:"Vishraam Light,string"`
	VishraamLightColor      string `json:"Vishraam Light Color"`
	VishraamLightCharacter  string `json:"Vishraam Light Character"`
	VishraamMedium          bool   `json:"Vishraam Medium,string"`
	VishraamMediumColor     string `json:"Vishraam Medium Color"`
	VishraamMediumCharacter string `json:"Vishraam Medium Character"`
	VishraamHeavy           bool   `json:"Vishraam Heavy,string"`
	VishraamHeavyColor      string `json:"Vishraam Heavy Color"`
	VishraamHeavyCharacter  string `json:"Vishraam Heavy Character"`
	AkhandPaathView         bool   `json:"Akhand Paath View,string"`
}

const (
	options           string = "OPTIONS"
	allow_origin      string = "Access-Control-Allow-Origin"
	allow_methods     string = "Access-Control-Allow-Methods"
	allow_headers     string = "Access-Control-Allow-Headers"
	allow_credentials string = "Access-Control-Allow-Credentials"
	expose_headers    string = "Access-Control-Expose-Headers"
	credentials       string = "true"
	origin            string = "Origin"
	methods           string = "POST, GET, OPTIONS, PUT, DELETE, HEAD, PATCH"

	// If you want to expose some other headers add it here
	headers string = "Access-Control-Allow-Origin, Accept, Accept-Encoding, Authorization, Content-Length, Content-Type, X-CSRF-Token"
)

// Handler will allow cross-origin HTTP requests
func CORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set allow origin to match origin of our request or fall back to *
		if o := r.Header.Get(origin); o != "" {
			w.Header().Set(allow_origin, o)
		} else {
			w.Header().Set(allow_origin, "*")
		}

		// Set other headers
		w.Header().Set(allow_headers, headers)
		w.Header().Set(allow_methods, methods)
		w.Header().Set(allow_credentials, credentials)
		w.Header().Set(expose_headers, headers)

		// If this was preflight options request let's write empty ok response and return
		if r.Method == options {
			w.WriteHeader(http.StatusOK)
			w.Write(nil)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func getJSON(w http.ResponseWriter, r *http.Request) {
	// displayShabadID := r.FormValue("shabadID")
	// displayPK := r.FormValue("PK")
	// for displayShabadID == shabadID && displayPK == currentPK { }

	fmt.Fprint(w, JSON)
	time.Sleep(99 * time.Millisecond) //what does this line do?
}

func getLineID(w http.ResponseWriter, r *http.Request) {
	// displayShabadID := r.FormValue("shabadID")
	// displayPK := r.FormValue("PK")
	// for displayShabadID == shabadID && displayPK == currentPK { }

	fmt.Fprint(w, `{"shabadID":"`+shabadID+`","PK":"`+currentPK+`"}`)
	time.Sleep(99 * time.Millisecond) //what does this line do?
}

func copyFile(src, dst string) error {
	s, err := os.Open(src)
	eh(err, "1")
	// no need to check errors on read only file, we already got everything
	// we need from the filesystem, so nothing can go wrong now.
	defer s.Close()
	d, err := os.Create(dst)
	eh(err, "2")
	if _, err := io.Copy(d, s); err != nil {
		d.Close()
		eh(err, "3")
	}
	return d.Close()
}

func simpleHandler(w http.ResponseWriter, r *http.Request) {
	title := "Search"
	templateName := "indexPage"
	theme := ` color-scheme-`+strings.Replace(strings.ToLower(settings.ColorScheme), " ", "-", -1)

	switch r.URL.Path {
		case "/obs-top":
			title = "OBS"
			templateName = "display2Page"
		case "/obs-bottom":
			title = "OBS"
			templateName = "display2Page"
		case "/kobo":
			title = "kobo"
			templateName = "koboPage"
		case "/menu":
			title = "Menu"
			templateName = "menuPage"
		case "/connect":
			title = "Connect"
			templateName = "connectPage"
		case "/history":
			title = "History"
			templateName = "historyPage"
			//tk: History html page to view/export/import/reload history
		case "/banis":
			title = "Bookmarks"
			templateName = "banisPage"
	}
	data := struct {
		Title string
		Theme template.HTML
		Host string
	}{
		title,
		template.HTML(theme),
		host,
	}
	err = templates.ExecuteTemplate(w, templateName, &data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func isLocal(r *http.Request) bool {
	IP, _, err := net.SplitHostPort(r.RemoteAddr)
	eh(err,"4.1")
	if (IP == "::1") {
		return true
	}
	return false
}

func displayHandler(w http.ResponseWriter, r *http.Request) {
	setClasses := ""

	setClasses += ` layout-`+strings.Replace(strings.ToLower(settings.Layout), " ", "-", -1)

	setClasses += ` navigator-height-`+strings.Replace(strings.ToLower(settings.NavigatorHeight), " ", "-", -1)

	if settings.LarivaarGurbani == true {
		setClasses += ` hide-gurbani-spaces`
	}
	if settings.SplitGurbaniLines == true {
		setClasses += ` split-gurbani-lines`
	}

	if settings.EnglishTranslation == false {
		setClasses += ` hide-english-translation`
	}
	if settings.PunjabiTranslation == false {
		setClasses += ` hide-punjabi-translation`
	}
	if settings.EnglishTransliteration == false {
		setClasses += ` hide-english-transliteration`
	}
	if settings.NextLine == false {
		setClasses += ` hide-next-line`
	}

	setClasses += ` fs-`+strconv.Itoa(settings.FontSize)

	setClasses += ` color-scheme-`+strings.Replace(strings.ToLower(settings.ColorScheme), " ", "-", -1)

	if settings.BackgroundImage == false {
		setClasses += ` hide-background-image`
	}
	if settings.VishraamColors == false {
		setClasses += ` hide-vishraam-colors`
	}
	if settings.VishraamCharacters == false {
		setClasses += ` hide-vishraam-characters`
	}
	if settings.VishraamLight == false {
		setClasses += ` hide-vishraam-light`
	}
	if settings.VishraamMedium == false {
		setClasses += ` hide-vishraam-medium`
	}
	if settings.VishraamHeavy == false {
		setClasses += ` hide-vishraam-heavy`
	}

	data := struct {
		Title       string
		Settings template.HTML
		Host	string
	}{
		"display",
		template.HTML(setClasses),
		host,
	}
	err = templates.ExecuteTemplate(w, "displayPage", &data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func settingsHandler(w http.ResponseWriter, r *http.Request) {
	theme := ` color-scheme-`+strings.Replace(strings.ToLower(settings.ColorScheme), " ", "-", -1)
	sendJSON, err := json.Marshal(settings)
	eh(err, "4")
	textColorChoices := `<li class="mdl-menu__item red"><div class="cb red"></div><!--Red--></li>
            <li class="mdl-menu__item pink"><div class="cb pink"></div><!--Pink--></li>
            <li class="mdl-menu__item purple"><div class="cb purple"></div><!--Purple--></li>
            <li class="mdl-menu__item deep-purple"><div class="cb deep-purple"></div><!--Deep Purple--></li>
            <li class="mdl-menu__item indigo"><div class="cb indigo"></div><!--Indigo--></li>
            <li class="mdl-menu__item blue"><div class="cb blue"></div><!--Blue--></li>
            <li class="mdl-menu__item light-blue"><div class="cb light-blue"></div><!--Light Blue--></li>
            <li class="mdl-menu__item cyan"><div class="cb cyan"></div><!--Cyan--></li>
            <li class="mdl-menu__item teal"><div class="cb teal"></div><!--Teal--></li>
            <li class="mdl-menu__item green"><div class="cb green"></div><!--Green--></li>
            <li class="mdl-menu__item light-green"><div class="cb light-green"></div><!--Light Green--></li>
            <li class="mdl-menu__item lime"><div class="cb lime"></div><!--Lime--></li>
            <li class="mdl-menu__item yellow"><div class="cb yellow"></div><!--Yellow--></li>
            <li class="mdl-menu__item amber"><div class="cb amber"></div><!--Amber--></li>
            <li class="mdl-menu__item orange"><div class="cb orange"></div><!--Orange--></li>
            <li class="mdl-menu__item deep-orange"><div class="cb deep-orange"></div><!--Deep Orange--></li>
            <li class="mdl-menu__item brown"><div class="cb brown"></div><!--Brown--></li>
            <li class="mdl-menu__item grey"><div class="cb grey"></div><!--Grey--></li>
            <li class="mdl-menu__item blue-grey"><div class="cb blue-grey"></div><!--Blue Grey--></li>
            <li class="mdl-menu__item black"><div class="cb black"></div><!--Black--></li>
            <li class="mdl-menu__item white"><div class="cb white"></div><!--White--></li>`
	data := struct {
		Title            string
		SettingsJSON     string
		TextColorChoices template.HTML
		Theme template.HTML
		Host string
	}{
		"Settings",
		string(sendJSON),
		template.HTML(textColorChoices),
		template.HTML(theme),
		host,
	}
	err = templates.ExecuteTemplate(w, "settingsPage", &data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func updateShabad(id string) {
	var rows, rows2 *sql.Rows
	var err error
	var query, query2, pk, nextPK, gurmukhi, transliteration, english, darpan string
	pageHTML, shabadJSONTemp, gurmukhiFull, transliterationFull, translationFull, darpanFull := "", "", "", "", "", ""
	shabadType := "shabad"
	counter, pageID := 0, 0
	lineID := 1
	lastPageID := -1
	hotkeys := [36]string{"1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m"}

	dbHistory, err = sql.Open("sqlite3", historyDB)
	eh(err, "5")
	defer dbHistory.Close()
	//if id is a string, then check compiled banis
	if _, err := strconv.Atoi(id); err != nil {
		query = "SELECT BANI_LINE_ID, GURMUKHI, TRANSLITERATION, ENGLISH, PUNJABI, BANI_SHABAD_TYPE, BANI_PAGE_ID FROM SHABAD NATURAL JOIN bani_" + id
		query2 = "SELECT BANI_LINE_ID FROM bani_" + id

		rows, err = dbHistory.Query("SELECT PK FROM HISTORY WHERE SHABAD_ID='" + id + "' ORDER BY ID DESC LIMIT 1")
		eh(err, "6")
		defer rows.Close()
		rows.Next()
		if err := rows.Scan(&currentPK); err != nil {
			currentPK = "1"
		}
	} else { // search SHABAD table instead
		query = "SELECT PK, GURMUKHI, TRANSLITERATION, ENGLISH, PUNJABI FROM SHABAD WHERE SHABAD_ID=" + id
		query2 = "SELECT PK FROM SHABAD WHERE SHABAD_ID=" + id

		rows, err = dbHistory.Query("SELECT TOGGLELINES FROM SHABADS WHERE SHABAD_ID='" + id + "' ORDER BY ID DESC")
		eh(err, "7")
		defer rows.Close()
		rows.Next()
		if err := rows.Scan(&toggleLines); err != nil {
			toggleLines = "0-0-0"
		}
	}

	rows, err = db.Query(query)
	eh(err, "8")
	defer rows.Close()

	rows2, err = db.Query(query2)
	eh(err, "9")
	defer rows2.Close()
	rows2.Next()

	for rows.Next() {

		if _, err := strconv.Atoi(id); err != nil {
			rows.Scan(&pk, &gurmukhi, &transliteration, &english, &darpan, &shabadType, &pageID)
		} else {
			rows.Scan(&pk, &gurmukhi, &transliteration, &english, &darpan)
			pageID++
		}

		rows2.Next()
		if err := rows2.Scan(&nextPK); err != nil {
			nextPK = "-1"
		}

		gurmukhiArray := strings.Split(gurmukhi, " ")
		for key := range gurmukhiArray {
			gak := gurmukhiArray[key] // what we will replace the array element with
			str := gak                //element as string
			end := str[len(str)-1:]   // last character of element
			// this can be improved to break by heavy, then by medium, then by light.
			// currently this logic only breaks on heavies
			switch end {
			case ";", ",", ".":
				gak = `<div class="vishraam`
				if end == ";" {
					gak += `Heavy`
				} else if end == "," {
					gak += `Medium`
				} else if end == "." {
					gak += `Light`
				}
				gak += `">` + str[0:len(str)-1] + `<div class="vishraamChar">` + end + `</div></div>`
				if end == ";" { // fix for heavy vishraams to break on long lines
					gak += `</div><div>`
				}
			case "]":
				// check for following, if exist, include it's work
				if key < len(gurmukhiArray)-1 {
					gak = str
					//gurmukhiArray[key+1] += `</div></div><div><div>`
				} else {
					gak = str + `</div></div><div><div>` // after first closing div we had <div class="nbsp">&nbsp;</div>
				}
			}
			gurmukhiArray[key] = gak
		}

		gurmukhi = strings.Join(gurmukhiArray, `<div class="nbsp">&nbsp;</div>`)
		if len(gurmukhiFull) > 0 {
			gurmukhi = `<div class="nbsp">&nbsp;</div>` + gurmukhi
		}

		gurmukhiFull += `<div><div>` + gurmukhi + `</div></div>`

		transliterationFull += " " + transliteration
		translationFull += " " + english
		darpanFull += " " + darpan

		if pk != nextPK {
			//gurmukhiFull = strings.TrimSpace(gurmukhiFull)
			gurmukhiFull = strings.Replace(gurmukhiFull, `<div><div></div></div>`, "", -1)
			transliterationFull = strings.TrimLeft(transliterationFull, " ")
			translationFull = strings.TrimLeft(translationFull, " ")
			darpanFull = strings.TrimLeft(darpanFull, " ")
			hotkeyClass := "hotkey"
			hotkey := ""

			if lastPageID == pageID {
				hotkeyClass = "notHotkey"
			} else {
				if counter < len(hotkeys) {
					hotkey = hotkeys[counter]
				}
				counter++
			}
			pageHTML += "<span id=\"" + pk + "\" class=\"navigationForDisplay line" + strconv.Itoa(lineID) + " " + hotkeyClass + "\" data-lineID=\"" + strconv.Itoa(lineID) + "\" data-shabadID=\"" + id + "\" data-pageID=\"" + strconv.Itoa(counter) + "\" data-shabadType=\"" + shabadType + "\"><div class=\"searchresult"
			if lastPageID != pageID {
				pageHTML += " last" + strconv.Itoa(counter-1) + " pageID" + strconv.Itoa(counter) + " searchresult-" + hotkey + "\" data-hotkey=\"yes"
			}
			pageHTML += "\"><div><div class=\"gurmukhifont\"><span class=\"codefont\"><span class=\"number\">" + hotkey + "</span></span>" + gurmukhiFull + "</div></div></div></span>"
			shabadJSONTemp += "{\"gurmukhi\":\"" + strings.Replace(gurmukhiFull, `"`, `\"`, -1) + "\",\"transliteration\":\"" + strings.Replace(transliterationFull, `"`, `\"`, -1) + "\",\"translation\":\"" + strings.Replace(translationFull, `"`, `\"`, -1) + "\",\"darpan\":\"" + strings.Replace(darpanFull, `"`, `\"`, -1) + "\",\"lineID\":\"" + strconv.Itoa(lineID) + "\",\"PK\":\"" + pk + "\"},"
			gurmukhiFull = ""
			transliterationFull = ""
			translationFull = ""
			darpanFull = ""
			lineID++
			lastPageID = pageID
		}
	}

	shabadJSON = "[" + strings.TrimRight(shabadJSONTemp, ",") + "]"
	shabadHTML = pageHTML
	pagesCount = counter
}

func navigateHandler(w http.ResponseWriter, r *http.Request) {
	theme := ` color-scheme-`+strings.Replace(strings.ToLower(settings.ColorScheme), " ", "-", -1)
	id := r.FormValue("id") // possibly requires removing white space
	if (!(id == shabadID || id == "current")) { updateShabad(id) }

	if (shabadHTML == "") { //tk should check shabadID == 0, but then the page won't load and won't post to histry... that should just happen in updateShabad, though
		simpleHandler(w,r)
		return
	}

	data := struct {
		Title           string
		Body            template.HTML
		ID              string
		ShabadJSON      string
		ToggleLines     string
		CurrentPK       string
		AkhandPaathView bool
		TotalPages      string
		Theme template.HTML
		Host string
	}{
		"Navigator",
		template.HTML(shabadHTML),
		id,
		shabadJSON,
		toggleLines,
		currentPK,
		settings.AkhandPaathView,
		strconv.Itoa(pagesCount),
		template.HTML(theme),
		host,
	}
	// err = template.HTMLEscape(w, &data.Body)
	err = templates.ExecuteTemplate(w, "navigatePage", &data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func convertFirstLetters(gurmukhi string) string {
	words := strings.Split(gurmukhi, " ")
	for key, word := range words {
		firstLetter := word[0:1]
		if firstLetter == "]" {
			firstLetter = " "
		} //EOL--this could skip a word if there's no space after!
		if firstLetter == "i" {
			firstLetter = word[1:2]
		} //replace sihari
		if firstLetter == "^" {
			firstLetter = "K"
		} //khakha pair bindi
		if firstLetter == "E" {
			firstLetter = "a"
		} //open oora
		if firstLetter == "&" {
			firstLetter = "P"
		} //phapha pair bindi
		if firstLetter == "S" {
			firstLetter = "s"
		} //sassa pair bindi
		if firstLetter == "z" {
			firstLetter = "j"
		} //jajjapair bindi
		if firstLetter == "Z" {
			firstLetter = "g"
		} //gagga pair bindi
		if firstLetter == "L" {
			firstLetter = "l"
		} //lalla pair bindi
		words[key] = firstLetter + word[1:len(word)]
	}
	return strings.Join(words, " ")
}

func getResultsHTML(w http.ResponseWriter, r *http.Request) {
	query := r.FormValue("search")
	var searchResults bytes.Buffer
	var pk string
	var id string
	var gurmukhi string
	var firstLetters string
	hotkeys := [10]string{"1", "2", "3", "4", "5", "6", "7", "8", "9", "0"}
	counter := 0
	// start := time.Now()
	// maxSearchConst := 100 * time.Millisecond

	if len(query) == 0 {
	} else if string(query[0]) == "#" {
		query = strings.TrimLeft(query, "#")
		query = strings.Trim(query, " ")
		regex := regexp.MustCompile("\\s+")
		query = regex.ReplaceAllLiteralString(query, " ")
		qArray := strings.Split(query, " ")
		query = strings.Replace(query, " ", "%\" AND GURMUKHI LIKE \"%", -1)
		if len(query) > 1 {
			rows, err := db.Query("SELECT PK, SHABAD_ID, GURMUKHI FROM SHABAD WHERE GURMUKHI LIKE \"%" + query + "%\" LIMIT 20")
			eh(err, "10")
			defer rows.Close()
			for rows.Next() {
				rows.Scan(&pk, &id, &gurmukhi)
				gurmukhi = strings.Replace(gurmukhi, ";", "", -1)
				gurmukhi = strings.Replace(gurmukhi, ",", "", -1)
				gurmukhi = strings.Replace(gurmukhi, ".", "", -1)

				qResult := strings.Join(qArray, "|")
				regex = regexp.MustCompile("(" + qResult + ")")
				gurmukhi = regex.ReplaceAllString(gurmukhi, "<span class='slink-highlight'>$1</span>")

				searchResults.WriteString("<a id=\"" + strconv.Itoa(counter) + "\" href=\"shabad?id=" + id + "#" + pk + "\" class=\"navigationForDisplay searchResultUpdateHistory\" data-lineID=\"" + pk + "\" data-shabadID=\"" + id + "\"><div class=\"searchresult")

				if counter >= len(hotkeys) {
					searchResults.WriteString("\"><p class=\"gurmukhifont\"><span class=\"codefont\"><span class=\"number\">&nbsp;</span></span>")
					counter++
				} else {
					searchResults.WriteString(" searchresult-" + hotkeys[counter] + "\"><p class=\"gurmukhifont\"><span class=\"codefont\"><span class=\"number\">" + hotkeys[counter] + "</span></span>")
					counter++
				}

				searchResults.WriteString(gurmukhi + "</p></div></a>")
			}
		}
	} else {
		query = strings.Replace(query, " ", "?", -1)
		// qArray := strings.Split(q, "?")
		stmt, err := db.Prepare("select PK, SHABAD_ID, GURMUKHI, FIRST_LETTERS from SHABAD where FIRST_LETTERS GLOB ? LIMIT 10")
		eh(err, "11")
		defer stmt.Close()

		for key, q := range [3]string{query, query + "?*", "?*" + query + "*"} {
			rows, err := stmt.Query(q)
			eh(err, "12")
			defer rows.Close()
			for rows.Next() {
				rows.Scan(&pk, &id, &gurmukhi, &firstLetters)
				gurmukhi = strings.Replace(gurmukhi, ";", "", -1)
				gurmukhi = strings.Replace(gurmukhi, ",", "", -1)
				gurmukhi = strings.Replace(gurmukhi, ".", "", -1)

				if key == 0 {
					gurmukhi = "<span class='slink-highlight'>" + gurmukhi + "<span class='slink-highlight'>"
				} else {
					qSearch := strings.Replace(query, "?", ".", -1)
					qResult := strings.Join(strings.Split(qSearch, ""), "\\S*\\s*i*") + "\\S*"
					if key == 1 {
						regHighlight := regexp.MustCompile("(^i*" + qResult + ")")
						index := regHighlight.FindStringIndex(convertFirstLetters(gurmukhi))
						gurmukhi = "<span class='slink-highlight'>" + gurmukhi[0:index[1]] + "</span>" + gurmukhi[index[1]:len(gurmukhi)]
					} else if key == 2 {
						regHighlight := regexp.MustCompile("(\\si*" + qResult + ")")
						index := regHighlight.FindStringIndex(convertFirstLetters(gurmukhi))
						regToEnd := regexp.MustCompile(qSearch + "$")

						gurmukhiFinal := ""
						// if index[0] == 0 {
						// 	gurmukhiFinal = "<span class='slink-highlight'>"
						// } else {
						gurmukhiFinal = gurmukhi[0:index[0]+1] + "<span class='slink-highlight'>"
						// }
						if regToEnd.MatchString(firstLetters) {
							gurmukhiFinal = gurmukhiFinal + gurmukhi[index[0]+1:len(gurmukhi)] + "</span>"
						} else {
							gurmukhiFinal = gurmukhiFinal + gurmukhi[index[0]+1:index[1]] + "</span>" + gurmukhi[index[1]:len(gurmukhi)]
						}
						gurmukhi = gurmukhiFinal
					}
				}

				searchResults.WriteString("<a id=\"" + strconv.Itoa(counter) + "\" href=\"shabad?id=" + id + "#" + pk + "\" class=\"navigationForDisplay searchResultUpdateHistory\" data-lineID=\"" + pk + "\" data-shabadID=\"" + id + "\"><div class=\"searchresult")

				if counter >= len(hotkeys) {
					searchResults.WriteString("\"><p class=\"gurmukhifont\"><span class=\"codefont\"><span class=\"number\">&nbsp;</span></span>")
					counter++
				} else {
					searchResults.WriteString(" searchresult-" + hotkeys[counter] + "\"><p class=\"gurmukhifont\"><span class=\"codefont\"><span class=\"number\">" + hotkeys[counter] + "</span></span>")
					counter++
				}
				searchResults.WriteString(gurmukhi + "</p></div></a>")
			}
		}
	}
	fmt.Fprint(w, searchResults.String())
}

func getHistoryHTML(w http.ResponseWriter, r *http.Request) {
	hotkeys := [10]string{"1", "2", "3", "4", "5", "6", "7", "8", "9", "0"}
	counter := 1
	pageHTML := ""

	dbHistory, err = sql.Open("sqlite3", historyDB)
	eh(err, "15")
	defer dbHistory.Close()

	var rows *sql.Rows
	var err error
	rows, err = dbHistory.Query("SELECT PK,SHABAD_ID,GURMUKHI,TRANSLITERATION,TOGGLELINES FROM SHABADS ORDER BY ID DESC")
	eh(err, "16")
	defer rows.Close()

	for rows.Next() {
		var pk string
		var shabadID string
		var gurmukhi string
		var transliteration string
		err := rows.Scan(&pk, &shabadID, &gurmukhi, &transliteration, &toggleLines)
		if shabadID == "adv" {
			gurmukhi = "Awsw dI vwr *"
		}
		eh(err, "17")
		if _, err := strconv.Atoi(shabadID); err != nil { //determines if shabadID referes to a shabad or compiled bani
			pageHTML += "<a href=\"shabad?id=" + shabadID + "\""
		} else {
			pageHTML += "<a href=\"shabad?id=" + shabadID + "#" + pk + "$" + toggleLines + "\""
		}
		pageHTML += " id=\"" + strconv.Itoa(counter) + "\" class=\"navigationForDisplay searchResultUpdateHistory historyEntry\" data-lineID=\"" + pk + "\" data-shabadID=\"" + shabadID + "\" title=\"" + transliteration + "\"><div class=\"searchresult"

		if counter >= len(hotkeys) {
			pageHTML += "\"><p class=\"gurmukhifont\"><span class=\"codefont\"><span class=\"number\">&nbsp;</span></span>"
		} else {
			pageHTML += " searchresult-" + hotkeys[counter] + "\"><p class=\"gurmukhifont\"><span class=\"codefont\"><span class=\"number\">" + hotkeys[counter] + "</span></span>"
		}
		counter++

		pageHTML += gurmukhi + "</p></div></a>"
	}

	fmt.Fprint(w, pageHTML)
}

func eh(err error, code string) {
	if err != nil {
		fmt.Println("--------------------------------------------------------------------------------\nError Code: " + code)
		fmt.Println(err)
		fmt.Println("--------------------------------------------------------------------------------")
	}
}

func getHistoryCSV(w http.ResponseWriter, r *http.Request) {
	var historyTable, historyFilename string
	lines := r.FormValue("lines")
	if lines == "complete" {
		historyFilename = "History (All Lines)"
		historyTable = "History"
	} else {
		historyFilename = "History"
		historyTable = "Shabads"
	}
	filename := historyFilename + " from " + timePostHistory.Format("2006-01-02 150405") + ".csv"
	w.Header().Set("Content-Disposition", "attachment; filename="+filename)

	dbHistory, err = sql.Open("sqlite3", historyDB)
	if err != nil {
		log.Fatal(err)
	}
	defer dbHistory.Close()

	var rows *sql.Rows
	var err error
	rows, err = dbHistory.Query("SELECT datetime(TIMESTAMP),SHABAD_ID,PK,GURMUKHI,TRANSLITERATION FROM " + historyTable + " ORDER BY ID")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	fmt.Fprint(w, "\"TIMESTAMP\",\"SHABAD_ID\",\"LINE_ID\",\"GURMUKHI\",\"TRANSLITERATION\"\n")

	for rows.Next() {
		var timestamp string
		var id string
		var PK string
		var gurmukhi string
		var transliteration string
		err := rows.Scan(&timestamp, &id, &PK, &gurmukhi, &transliteration)
		if err != nil {
			log.Fatal(err)
		}
		fmt.Fprint(w, "\""+timestamp+"\",\""+id+"\",\""+PK+"\",\""+gurmukhi+"\",\""+transliteration+"\"\n")
	}
}

func postSettings(w http.ResponseWriter, r *http.Request) {
	if (!isLocal(r)) { return }

	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&settings)
	eh(err, "18")
	saveSettings()
}

func saveSettings() {
	nf, _ := json.MarshalIndent(settings, "", "    ")

	err := ioutil.WriteFile("settings.json", nf, 0666)
	eh(err, "19")

}

func postHistory(w http.ResponseWriter, r *http.Request) {
	currentPK = r.FormValue("PK")
	id := r.FormValue("shabadID")
	JSON = "{\"shabad\":" + r.FormValue("shabad") + ",\"shabadID\":\"" + id + "\",\"PK\":\"" + currentPK + "\"}"
	newToggleLines := r.FormValue("toggleLines")
	newMainID := r.FormValue("mainID")
	gurmukhi, transliteration := "", ""
	var rows *sql.Rows
	var err error
	var query string

	if time.Since(timePostHistory).Minutes() > 10 {
		newHistory()
	}

	dbHistory, err = sql.Open("sqlite3", historyDB)
	eh(err, "23")
	defer dbHistory.Close()

	if currentPK == "0" { //cleared display
		clearShabad()
	} else {
		if _, err := strconv.Atoi(id); err != nil { //determines if shabadID referes to a shabad or compiled bani
			query = "SELECT GURMUKHI,TRANSLITERATION FROM SHABAD NATURAL JOIN bani_" + id + " WHERE BANI_LINE_ID=" + currentPK
		} else {
			query = "SELECT GURMUKHI,TRANSLITERATION FROM SHABAD WHERE PK=" + currentPK
		}

		rows, err = db.Query(query)
		eh(err, "24")
		defer rows.Close()
		for rows.Next() {
			err := rows.Scan(&gurmukhi, &transliteration)
			eh(err, "25")
		}

		if shabadID != id { //new shabad
			shabadID = id
			shabadJSON = r.FormValue("shabad")

			tx, err := dbHistory.Begin()
			eh(err, "26")

			stmt, err := tx.Prepare("INSERT INTO SHABADS (PK,SHABAD_ID,GURMUKHI,TRANSLITERATION,TOGGLELINES) values (?, ?, ?, ?, ?)")
			eh(err, "27")
			defer stmt.Close()

			_, err = stmt.Exec(currentPK, shabadID, gurmukhi, transliteration, toggleLines)
			eh(err, "28")

			tx.Commit()
		}
		if mainID != newMainID {
			mainID = newMainID
			toggleLines = newToggleLines

			tx, err := dbHistory.Begin()
			eh(err, "29")

			stmt, err := tx.Prepare("UPDATE SHABADS SET PK=?, GURMUKHI=?, TRANSLITERATION=?, TOGGLELINES=? WHERE ID = (SELECT MAX(ID) FROM SHABADS)")
			eh(err, "30")
			defer stmt.Close()

			_, err = stmt.Exec(currentPK, gurmukhi, transliteration, toggleLines)
			eh(err, "31")

			tx.Commit()
		} else if toggleLines != newToggleLines {
			toggleLines = newToggleLines

			tx, err := dbHistory.Begin()
			eh(err, "32")

			stmt, err := tx.Prepare("UPDATE SHABADS SET TOGGLELINES='" + toggleLines + "' WHERE ID = (SELECT MAX(ID) FROM SHABADS)")
			eh(err, "33")
			defer stmt.Close()

			_, err = stmt.Exec()
			eh(err, "34")

			tx.Commit()
		}
		shabadID = r.FormValue("shabadID") //superfluous?
		shabadJSON = r.FormValue("shabad") //superfluous?
	}

	tx, err := dbHistory.Begin()
	eh(err, "35")

	stmt, err := tx.Prepare("INSERT INTO HISTORY (PK,SHABAD_ID,GURMUKHI,TRANSLITERATION,TOGGLELINES) values (?, ?, ?, ?, ?)")
	eh(err, "36")
	defer stmt.Close()

	_, err = stmt.Exec(currentPK, shabadID, gurmukhi, transliteration, toggleLines)
	eh(err, "37")

	tx.Commit()

	timePostHistory = time.Now()
}

func newHistory() {
	timePostHistory = time.Now()
	historyDB = "history/" + timePostHistory.Format("2006-01-02 150405")
	err := copyFile("includes/historyTemplate", historyDB)
	eh(err, "4")
}

func clearHistory(w http.ResponseWriter, r *http.Request) {
	if (!isLocal(r)) { return }
	clearShabad()
	newHistory()
}

func updateFirstLetters(w http.ResponseWriter, r *http.Request) {
	var rows *sql.Rows
	var err error
	rows, err = db.Query("SELECT PK,GURMUKHI,FIRST_LETTERS,SOURCE_ID FROM SHABAD")
	eh(err, "38")
	var queries []string
	// queries = append(queries,"UPDATE SHABAD SET GURMUKHI=TRIM(REPLACE(GURMUKHI,']',' ] '))") // extra code to add padding to ]'s--ONLY USE IF PADDING NOT THERE!

	defer rows.Close()
	for rows.Next() {
		var pk int
		var gurmukhi string
		var firstLetters string
		var updatedFirstLetters string
		var source string

		err := rows.Scan(&pk, &gurmukhi, &firstLetters, &source)
		eh(err, "39")

		regex := regexp.MustCompile("] ([0-9]*) ]")
		if regex.MatchString(gurmukhi) {
			gurmukhi = regex.ReplaceAllString(gurmukhi, "]$1]")
			// queries = append(queries,"UPDATE SHABAD SET GURMUKHI='" + gurmukhi + "' WHERE PK=" + strconv.Itoa(pk)) //extra code to fix "] 87 ]" to "]87]", may need to run twice!
		}

		gurmukhi = strings.Replace(gurmukhi, "] rhwau ]", "] ]", -1)
		gurmukhi = strings.Replace(gurmukhi, "] rhwau dUjw ]", "] ]", -1)
		gurmukhi = strings.Replace(gurmukhi, "] suDu", "]", -1)
		gurmukhi = strings.Replace(gurmukhi, "] jumlw", "]", -1)
		gurmukhi = strings.Replace(gurmukhi, "] bweIs caupdy qQw pMcpdy", "]", -1)
		gurmukhi = strings.Replace(gurmukhi, "] Ckw 1", "]", -1)
		gurmukhi = strings.Replace(gurmukhi, "] joVu", "]", -1)
		gurmukhi = strings.Replace(gurmukhi, "] Cky 2", "]", -1)
		gurmukhi = strings.Replace(gurmukhi, "] Cky 3", "]", -1)
		gurmukhi = strings.Replace(gurmukhi, "] Ckw 1", "]", -1)
		gurmukhi = strings.Replace(gurmukhi, "] Ckw 1", "]", -1)
		gurmukhi = strings.Replace(gurmukhi, "] Ckw 1", "]", -1)
		gurmukhi = strings.Replace(gurmukhi, "] Ckw 1", "]", -1)
		if gurmukhi == "Awsw ] iqpdw ] iekqukw ]" || gurmukhi == "kbIru ] mwrU ]" || gurmukhi == "muK Bwg" {
			gurmukhi = ""
		}

		regex = regexp.MustCompile("m \\d | mhlw \\d | hlI bwc | kbIr jI| bwc ]$")
		regexDasam := regexp.MustCompile(" CMd ]")
		if gurmukhi == "" || regex.MatchString(gurmukhi) || (regexDasam.MatchString(gurmukhi) && source == "D") {
			updatedFirstLetters = ""
		} else {
			words := strings.Split(gurmukhi, " ")
			for key := range words {
				word := words[key]
				firstLetter := word[0:1]
				if firstLetter == "]" {
					firstLetter = ""
				} //EOL--this could skip a word if there's no space after!
				if firstLetter == "i" {
					firstLetter = word[1:2]
				} //sihari
				if firstLetter == "^" {
					firstLetter = "K"
				} //khakha pair bindi
				if firstLetter == "E" {
					firstLetter = "a"
				} //open oora
				if firstLetter == "&" {
					firstLetter = "P"
				} //phapha pair bindi
				if firstLetter == "S" {
					firstLetter = "s"
				} //sassa pair bindi
				if firstLetter == "z" {
					firstLetter = "j"
				} //jajjapair bindi
				if firstLetter == "Z" {
					firstLetter = "g"
				} //gagga pair bindi
				if firstLetter == "L" {
					firstLetter = "l"
				} //lalla pair bindi
				words[key] = firstLetter
			}
			updatedFirstLetters = strings.Join(words, "")
			if len(updatedFirstLetters) == 1 {
				updatedFirstLetters = ""
			}
		}

		if firstLetters != updatedFirstLetters {
			queries = append(queries, "UPDATE SHABAD SET FIRST_LETTERS='"+updatedFirstLetters+"' WHERE PK="+strconv.Itoa(pk))
		}
	}

	file, err := os.Create("queries.txt")
	eh(err, "40")
	defer file.Close()
	fmt.Fprintf(file, strings.Join(queries, ";\n"))
}

func findMistakes(w http.ResponseWriter, r *http.Request) {
	// previousEnglish, previousTransliteration := "",""
	var rows *sql.Rows
	var err error
	rows, err = db.Query("SELECT PK,GURMUKHI,ENGLISH,TRANSLITERATION FROM SHABAD")
	eh(err, "41")
	var queries []string

	defer rows.Close()
	for rows.Next() {
		var pk int
		var gurmukhi, english, transliteration string

		rows.Scan(&pk, &gurmukhi, &english, &transliteration)

		// if ((english != "" && english == previousEnglish) || (transliteration != "" && transliteration == previousTransliteration)) {
		// queries = append(queries,strconv.Itoa(pk-1))
		// queries = append(queries,strconv.Itoa(pk))
		// }

		// previousEnglish = english
		// previousTransliteration = transliteration

		english = regexp.MustCompile("]([0-9]*[Pause]*)]").FindString(english)
		gurmukhi = regexp.MustCompile("]([0-9]*[rhwau]*)]").FindString(gurmukhi)
		transliteration = regexp.MustCompile("]([0-9]*[Rehaao]*)]").FindString(transliteration)
		//fmt.Println(english+gurmukhi+transliteration)
		if true {
			queries = append(queries, strconv.Itoa(pk))
		}
	}

	file, err := os.Create("duplicates.txt")
	eh(err, "42")
	defer file.Close()
	fmt.Fprintf(file, "SELECT GURMUKHI,TRANSLITERATION,ENGLISH FROM SHABAD WHERE PK IN ("+strings.Join(queries, ",")+")")
}

func executeQuery(query string) {
	tx, err := db.Begin()
	eh(err, "43")
	stmt, err := tx.Prepare(query)
	eh(err, "44")
	defer stmt.Close()
	_, err = stmt.Exec()
	eh(err, "45")
	tx.Commit()
}

func clearShabad() {
	shabadJSON = "[{\"gurmukhi\":\"\",\"translation\":\"\",\"transliteration\":\"\",\"darpan\":\"\",\"PK\":\"0\"}]"
	shabadHTML = ""
	shabadID = "0"
	currentPK = "0"
	toggleLines = "0-0-0"
	mainID = "0"
	JSON = "{\"shabad\":" + shabadJSON + ",\"shabadID\":\"" + shabadID + "\",\"PK\":\"" + currentPK + "\"}"
}

func getServersJSON(w http.ResponseWriter, r *http.Request) {
	var servers []interface{}

	// Make a channel for results and start listening
	entriesCh := make(chan *mdns.ServiceEntry, 4)
	go func() {
		for entry := range entriesCh {
			servers = append(servers, entry)
		}
	}()

	// Start the lookup
	mdns.Lookup("._shabadOS._tcp", entriesCh)
	close(entriesCh)

	serversJSON, err := json.Marshal(servers)
	eh(err, "45b")

	w.Header().Set("Content-Type", "application/json")
	w.Write(serversJSON)
}

// Loads and updates settings
func loadSettings(filename string) {
	settingsFile, _ :=os.Open(filename)
	defer settingsFile.Close()
	decoder := json.NewDecoder(settingsFile)
	decoder.Decode(&settings)
}

// Updates settings by combining settings.json with settings.json.default, using settings struct
func updateSettings() {
	// Load default settings
	loadSettings("settings.json.default")

	// Override with new settings, ignore if it doesn't exist
	loadSettings("settings.json")

	// Save 'em back
	saveSettings()
}

func main() {

	fmt.Println("--- Started! ---")
	// \nYou can minimize this. If you want to stop the program, then close this window.\n\n--- Setup ---\n1. Open Google Chrome.\n2. Type (or copy & paste) in Address Bar:\n      localhost:8080/display\n3. Display in Full Screen with F11 or through the ≡ menu.\n4. Other devices can connect to your program using this address:\n      " + ip + ":8080\n\n--- Universal Shortcuts ---\nClear Display ..... esc\nHide Controller ... shift+h\nSearch ............ shift+s\nHistory Back ...... alt+left\nHistory Forward ... alt+right\n\n--- Shabad Hotkeys ---\n1. Number (123-890) and letter keys (QWERTY-CVBNM) will activate the\n corresponding line (i.e. 'Q' for 11th line & 'F' for 24th line).\n2. (Advanced) Spacebar activates a main line toggle. You can use spacebar from\n another line to hop back to the main line and spacebar on the main line to go\n to the next line. Can be buggy if activating from display (outside controller\n box).\n3. Shift+[, Shift+] turn on/off vishraam colors/commas respectively.
	clearShabad()
	newHistory()
	db, err = sql.Open("sqlite3", "includes/data")
	eh(err, "46")
	defer db.Close()

	updateSettings()
	eh(err, "47")

	mux := http.NewServeMux()

	//basic handlers for files
	mux.Handle("/styles/", http.StripPrefix("/styles/", http.FileServer(http.Dir("styles"))))
	mux.Handle("/styles/set/", http.StripPrefix("/styles/set/", http.FileServer(http.Dir("styles/set"))))
	mux.Handle("/includes/", http.StripPrefix("/includes/", http.FileServer(http.Dir("includes"))))
	//basic handlers for pages without many variables
	// webpages := [5]{}
	// mux.Handle("/", mux.FileServer(assetFS()))

	//Public Server Functions
	mux.HandleFunc("/searchresults", getResultsHTML)
	mux.HandleFunc("/getJSON", getJSON)
	mux.HandleFunc("/getLineID", getLineID)
	mux.HandleFunc("/postHistory", postHistory)
	mux.HandleFunc("/history.csv", getHistoryCSV)
	mux.HandleFunc("/getHistoryHTML", getHistoryHTML)

	//Local private
	mux.HandleFunc("/clearHistory", clearHistory)
	mux.HandleFunc("/postSettings", postSettings)
	// mux.HandleFunc("/findMistakes", findMistakes)
	// mux.HandleFunc("/updateFirstLetters", updateFirstLetters)

	//Local functions
	mux.HandleFunc("/display", displayHandler)
	mux.HandleFunc("/shabad", navigateHandler)
	mux.HandleFunc("/settings", settingsHandler)
	mux.HandleFunc("/findServers", getServersJSON)

	//Rest are local and simple
	mux.HandleFunc("/", simpleHandler)

	wg.Add(1)
	go func () {
		log.Fatal(http.ListenAndServe(":"+strconv.Itoa(port), CORS(mux)))
		wg.Done()
	}()

	// Setup our service export
	host, _ = os.Hostname()
	info := []string{host}
	service, _ := mdns.NewMDNSService(host, "_shabadOS._tcp", "", "", port, nil, info)

	// Create the mDNS server, defer shutdown
	server, _ := mdns.NewServer(&mdns.Config{Zone: service})
	defer server.Shutdown()

	wg.Wait()
}
