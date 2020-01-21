let APIKey = "840bae92b2c263c3e01358649c74dfbf";
let currentWeatherIcon;
let savedCities;
let savedCitiesArray;
let searchWrapper = $(".col1 wrapper")
let historyDiv = $(".search-history");
let fiveDayDiv = $("#five-day")
let cardWrapper = $(".card-wrapper");
let fiveDayCard;
let weatherIconCode;
let weatherIconUrl;
let unixTimeStamp;
let convertedDate 
let forecastHeading = $("<h2>");

$(document).ready(function(){
    console.log("document loaded");

    // current day display 
    function displayCurrent(city){
        let queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=imperial`;
        $.ajax({
            url: queryURL,
            method: "GET", 
            dataType: "json"
        })
            .then(function(response){
                console.log(response);

                let f = (response.main.temp * 9 / 5 + 32).toFixed(2); // convert to f
                let city = $("#city").text(response.name);
                unixTimeStamp = response.dt;
                convertedDate = moment.unix(unixTimeStamp).utc().format("MM-DD"); // convert date
                let currentDate = $(".date").text(convertedDate) 
                let currentTemp = $("#current-temp").text(`Temperature: ${f} ${String.fromCharCode(176)}F`); // char code adds degree symbol
                let humidity = $("#current-humidity").text(`Humidity: ${response.main.humidity}%`); 
                let wind = $("#current-wind").text(`Wind Speed: ${response.wind.speed} MPH`);
                currentWeatherIcon = response.weather[0].icon;
                let currentWeatherIconUrl = $("<img>").attr("src", `http://openweathermap.org/img/w/${currentWeatherIcon}.png`);
                let countryCode = response.sys.country;
                let lon = response.coord.lon;
                let lat = response.coord.lat;
                
                currentDate.append(currentWeatherIconUrl);
                
                displayUvIndex(lat, lon);
                displayFiveDay(lat, lon);
                
                $("#current-weather").css({         //styling for border around current weather div only to appear once data is added to the dom
                    "border": "1px solid #c4c2c2",
                    "border-radius": "2%"
                });
            })
                .catch(function(error){
                    console.log(error)
                })
    }

    // five day forcast 
    function displayFiveDay(lat, lon){
        cardWrapper.empty(); // empty otherwise adds the next five on top of what was already displayed

        let queryURL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&units=imperial`
        $.ajax({
            url: queryURL,
            method: "GET", 
            dataType: "json"
        }) 
            .then(function(response){
                forecastHeading.attr("id", "forecastHeading")
                forecastHeading.text("5-Day Forcast");  
                fiveDayDiv.prepend(forecastHeading);   
                // console.log(response);

                    // the response is every 3 hours, so i+=8 so it will display the five upcoming days
                    for(let i = 0; i < response.list.length; i+=8){
                        let fiveDayDateText = $("<h5>");
                        let fiveDayHumidity = $("<p>");
                        let fiveDayTemp = $("<p>");

                        fiveDayCard = $("<div>").attr("class", "fiveDayCard");
                        fiveDayTemp.text("Temp: " + response.list[i].main.temp + String.fromCharCode(176) + " F");
                        weatherIconCode = response.list[i].weather[0].icon;
                        weatherIconUrl = $("<img>").attr("src", `http://openweathermap.org/img/w/${weatherIconCode}.png`)
                        unixTimeStamp = response.list[i].dt;
                        convertedDate = moment.unix(unixTimeStamp).utc().format("MM-DD");
                        fiveDayDateText .text(convertedDate);
                        fiveDayHumidity.text(`Humidity: ${response.list[i].main.humidity}%`)
                        
                        console.log("fiveday" + weatherIconUrl);
                        cardWrapper.append(fiveDayCard);
                        fiveDayCard.append(fiveDayDateText);
                        fiveDayCard.append(weatherIconUrl);
                        fiveDayCard.append(fiveDayTemp);
                        fiveDayCard.append(fiveDayHumidity);
                    }    
            })
    }

    // uv index requires the lat and lon to complete the AJAX call
    function displayUvIndex(lat, lon){
        let queryURL = `http://api.openweathermap.org/data/2.5/uvi?appid=${APIKey}&lat=${lat}&lon=${lon}`;
        $.ajax({
            url: queryURL,
            method: "GET", 
            dataType: "json"
        })  
            .then(function(response){
                console.log(response);
                let uvTitle = $(".uv-index-text").text("UV Index:"); 
                let uvIndex = $("#uv-index-number").text(response.value); // this span will be red for just the value of uv Index
            })
    }

    // city search after the click of search
    function submitCity(event){
        event.preventDefault(); 
        // grabbing the value entered into the form
        let city = $(".search").val().trim();
        console.log(city);
        displayCurrent(city);
        setSearchHistory(city);
    }

    // setting searched city to local storage
    function setSearchHistory(city){
        savedCitiesArray = JSON.parse(localStorage.getItem("savedCities")) || [];
        savedCitiesArray.unshift(city) // adding to the top of the array
        if (savedCitiesArray.length > 8){
            console.log(savedCitiesArray);
            savedCitiesArray.pop(); // if array is longer than 8 cities, delete last one
        }
        // set item to local storage key savedCities value savesCitiesArray
        localStorage.setItem("savedCities",JSON.stringify(savedCitiesArray));
        displaySearchHistory();
    }

    // adding buttons for each searched city 
    function displaySearchHistory(){
        historyDiv.empty(); // otherwise adds the array again
        // add saved city to the array for each search || empty array if first search
        savedCitiesArray = JSON.parse(localStorage.getItem("savedCities")) || [];
        for (let i = 0; i < savedCitiesArray.length; i++) {
            let historyBtn = $("<button>").attr("class", "historyBtn");
            historyBtn.text(savedCitiesArray[i]);
            $(historyDiv).append(historyBtn);
        } 
    }

    // will search the city based on the text on the button. event is on div itself
    function savedCitySearch(event){
        let city = $(event.target).html();
        // console.log(city);
        displayCurrent(city);
    }

    displaySearchHistory();

    $(".submit").on("click", submitCity) //search button
    $(historyDiv).on("click", savedCitySearch) // history buttons 
})