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



// $(document).ready(function(){
//     console.log("document loaded");

function displayCurrent(city){
    let queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=imperial`;
    $.ajax({
        url: queryURL,
        method: "GET", 
        dataType: "json"
    })
        .then(function(response){
            console.log(response);

            let f = (response.main.temp * 9 / 5 + 32).toFixed(2);
            let city = $("#city").text(response.name);
            let currentTemp = $("#current-temp").text("Temperature: " + f + String.fromCharCode(176) + " F");
            let humidity = $("#current-humidity").text("Humidity: " + response.main.humidity + "%");
            let wind = $("#current-wind").text("Wind Speed: " + response.wind.speed + " MPH");
            currentWeatherIcon = response.weather[0].icon;
            let currentWeatherIconUrl = $("<img>").attr("src", `http://openweathermap.org/img/w/${currentWeatherIcon}.png`);
            let countryCode = response.sys.country;
            let lon = response.coord.lon;
            let lat = response.coord.lat;

            city.append(currentWeatherIconUrl);
            displayUvIndex(lat, lon);
            displayFiveDay(lat, lon);
        })
            .catch(function(error){
                console.log(error)
            })
}

function displayFiveDay(lat, lon){
    cardWrapper.empty();

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
                    fiveDayHumidity.text("Humidity: " + response.list[i].main.humidity + "%")
                    
                    console.log("fiveday" + weatherIconUrl);
                    cardWrapper.append(fiveDayCard);
                    fiveDayCard.append(fiveDayDateText);
                    fiveDayCard.append(weatherIconUrl);
                    fiveDayCard.append(fiveDayTemp);
                    fiveDayCard.append(fiveDayHumidity);
                }    
        })
}

function displayUvIndex(lat, lon){
    let queryURL = `http://api.openweathermap.org/data/2.5/uvi?appid=${APIKey}&lat=${lat}&lon=${lon}&cnt=5`
    $.ajax({
        url: queryURL,
        method: "GET", 
        dataType: "json"
    })  
        .then(function(response){
            // console.log(response);
            let uvIndex = $("#uv-index").text("UV Index: " + response.value)
        })
}

function submitCity(event){
    event.preventDefault();
    let city = $(".search").val().trim();
    console.log(city);
    displayCurrent(city);
    setSearchHistory(city);
}


function setSearchHistory(city){
    savedCitiesArray = JSON.parse(localStorage.getItem("savedCities")) || [];
    savedCitiesArray.unshift(city)
    if (savedCitiesArray.length > 5){
        console.log(savedCitiesArray);
        savedCitiesArray.pop();
    }
    localStorage.setItem("savedCities",JSON.stringify(savedCitiesArray));
    displaySearchHistory();
}

function displaySearchHistory(){
    historyDiv.empty();
    savedCitiesArray = JSON.parse(localStorage.getItem("savedCities")) || [];
    // console.log(savedCitiesArray)

    for (let i = 0; i < savedCitiesArray.length; i++) {
        let historyBtn = $("<button>").attr("class", "historyBtn");
        historyBtn.text(savedCitiesArray[i]);
        $(historyDiv).append(historyBtn);
    } 
  
}

function savedCitySearch(event){
    let city = $(event.target).html();
    // console.log(city);
    displayCurrent(city);
}


displaySearchHistory();


$(".submit").on("click", submitCity)
$(historyDiv).on("click", savedCitySearch)


// })