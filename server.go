package main

import (
	"log"
	"net/http"
	"github.com/gorilla/mux"
	l "lpjdbapi"
	"fmt"
	"encoding/json"
	"strconv"
	"github.com/abbot/go-http-auth"
)

type APIArgs	struct {
	Action string
}

type APIReply	struct {
	Message string
}

func main() {

	UserAuthenticator := auth.NewBasicAuthenticator("lekparken.nu", UserSecret)
	AdminAuthenticator := auth.NewBasicAuthenticator("lekparken.nu", AdminSecret)
	router := mux.NewRouter().StrictSlash(true)
	http.HandleFunc("/", auth.JustCheck(UserAuthenticator, Index))
	http.HandleFunc("/admin", auth.JustCheck(AdminAuthenticator, Admin))
	router.HandleFunc("/api", DBApi)
	http.Handle("/api", router)
	http.Handle("/js/", http.StripPrefix("/js/", http.FileServer(http.Dir("./js/")))) 
	http.Handle("/css/", http.StripPrefix("/css/", http.FileServer(http.Dir("./css/")))) 
	log.Println("Server running on :80")
	log.Fatal(http.ListenAndServe(":80", nil))
}

func UserSecret(user, realm string) string {

        if user == "lekparken" {
                return "$1$e1a09609$NRYb1LoqKq9oHDnwyKhP61"
        }
	if user == "admin"	{
		return "$1$3b5482cf$ToEXIdAF/H01ZnOl1DPJI0"	
	}
        return ""
}

func AdminSecret(user, realm string) string {

	if user == "admin"	{
		return "$1$3b5482cf$ToEXIdAF/H01ZnOl1DPJI0"	
	}
        return ""
}

func Index(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "index.html")
}
	
func Admin(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "admin.html")
}	


func DBApi(w http.ResponseWriter, r *http.Request) {

	r.ParseForm()

	var hunter string = ""
	var species string = ""
	var limit int = 0 
	var year string = "" 

	if val, ok := r.Form["hunter"]; ok	{
		hunter = val[0]
	}

	if val, ok := r.Form["species"]; ok	{
		species = val[0]
	}
	
        if val, ok := r.Form["limit"]; ok     {
                limit, _ = strconv.Atoi(val[0])
        }

        if val, ok := r.Form["year"]; ok     {
                year = val[0]
        }


	switch r.Form["action"][0]	{

		case "getkills":
			kills, err := json.Marshal(l.GetKills(hunter, species, limit, year))
			if err != nil	{
				fmt.Println("JSON marshal error: ", err)
			}
			w.Header().Set("Content-Type", "application/json")
  			w.Write(kills)
		case "gethunters":
			hunters, err := json.Marshal(l.GetHunters())
			if err != nil   {
                                fmt.Println("JSON marshal error: ", err)
                        }
                        w.Header().Set("Content-Type", "application/json")
                        w.Write(hunters)
                case "getspecies":
                        species, err := json.Marshal(l.GetPredators())
                        if err != nil   {
                                fmt.Println("JSON marshal error: ", err)
                        }
                        w.Header().Set("Content-Type", "application/json")
                        w.Write(species)
                case "gettopten":
                        scorers, err := json.Marshal(l.GetTopTen(year))
                        if err != nil   {
                                fmt.Println("JSON marshal error: ", err)
                        }
                        w.Header().Set("Content-Type", "application/json")
                        w.Write(scorers)
                case "gettoptenforspecies":
                        scorers, err := json.Marshal(l.GetTopTenForSpecies(year, species))
                        if err != nil   {
                                fmt.Println("JSON marshal error: ", err)
                        }
                        w.Header().Set("Content-Type", "application/json")
                        w.Write(scorers)
		case "gettotals":
                        scorers, err := json.Marshal(l.GetTotals(hunter, species, year))
                        if err != nil   {
                                fmt.Println("JSON marshal error: ", err)
                        }
                        w.Header().Set("Content-Type", "application/json")
                        w.Write(scorers)
                case "gettimeline":
                        timeline, err := json.Marshal(l.GetTimeLine(hunter, species, limit, year))
                        if err != nil   {
                                fmt.Println("JSON marshal error: ", err)
                        }
                        w.Header().Set("Content-Type", "application/json")
                        w.Write(timeline)

		case "getyears":
			years, err := json.Marshal(l.GetYears())
                        if err != nil   {
                                fmt.Println("JSON marshal error: ", err)
                        }
                        w.Header().Set("Content-Type", "application/json")
                        w.Write(years)

	}
}
