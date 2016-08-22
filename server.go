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

	authenticator := auth.NewBasicAuthenticator("lekparken.nu", Secret)
	router := mux.NewRouter().StrictSlash(true)
	http.HandleFunc("/", auth.JustCheck(authenticator, Index))
	router.HandleFunc("/api", DBApi)
	http.Handle("/api", router)
	http.Handle("/js/", http.StripPrefix("/js/", http.FileServer(http.Dir("./js/")))) 
	http.Handle("/css/", http.StripPrefix("/css/", http.FileServer(http.Dir("./css/")))) 
	log.Println("Server running on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func Secret(user, realm string) string {

        if user == "lekparken" {
                return "$1$e1a09609$NRYb1LoqKq9oHDnwyKhP61"
        }
        return ""
}


func Index(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "index.html")
}	


func DBApi(w http.ResponseWriter, r *http.Request) {

	r.ParseForm()

	var hunter string = ""
	var species string = ""
	var limit int = 0 

	if val, ok := r.Form["hunter"]; ok	{
		hunter = val[0]
	}

	if val, ok := r.Form["species"]; ok	{
		species = val[0]
	}
	
        if val, ok := r.Form["limit"]; ok     {
                limit, _ = strconv.Atoi(val[0])
        }

	switch r.Form["action"][0]	{

		case "getkills":
			kills, err := json.Marshal(l.GetKills(hunter, species, limit))
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
                        scorers, err := json.Marshal(l.GetTopTen())
                        if err != nil   {
                                fmt.Println("JSON marshal error: ", err)
                        }
                        w.Header().Set("Content-Type", "application/json")
                        w.Write(scorers)
		case "gettotals":
                        scorers, err := json.Marshal(l.GetTotals(hunter, species))
                        if err != nil   {
                                fmt.Println("JSON marshal error: ", err)
                        }
                        w.Header().Set("Content-Type", "application/json")
                        w.Write(scorers)
                case "gettimeline":
                        timeline, err := json.Marshal(l.GetTimeLine(hunter, species, limit))
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
