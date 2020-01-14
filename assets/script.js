let APIKey = "840bae92b2c263c3e01358649c74dfbf";
let savedCities;


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
            // console.log(response);

            let f = (response.main.temp * 9 / 5 + 32).toFixed(2);
            let city = $("#city").text(response.name);
            let currentTemp = $("#current-temp").text("Temperature: " + f);
            let humidity = $("#current-humidity").text("Humidity: " + response.main.humidity);
            let wind = $("#current-wind").text("Wind Speed: " + response.wind.speed);

            let countryCode = response.sys.country;
            let lon = response.coord.lon;
            let lat = response.coord.lat;

            displayUvIndex(lat, lon);
            // displayFiveDay(lat, lon);
        })
            .catch(function(error){
                console.log(error)
            })
}

// function displayFiveDay(lat, lon){
//     let queryURL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&units=imperial`
//     $.ajax({
//         url: queryURL,
//         method: "GET", 
//         dataType: "json"
//     }) 
//         .then(function(response){
//             console.log(response);
//             let forecastHeading = $("$five-day-h2").text("5-Day Forcast");
//                 for(let i = 0; i <= 5; i++){
//                     let fiveDayTemp = $("<p>").text(response.list[i].main[0].temp);
//                     let weatherIconCode = response.list[i].weather[0].icon;
//                     let weatherIconUrl = $("<img>").attr("src", `http://openweathermap.org/img/w/${weatherIconCode}.png`)
//                     let unixTimeStamp = response.list[i].dt;
//                     let convertedDate = moment.unix(unixTimeStamp).utc().format("MM-DD");
//                     console.log(convertedDate)
//                     let fiveDayDateText = $("<h5>").text(convertedDate);
//                     let fiveDayHumidity = $("<p>").text(response.list[i].main[0].humidity)
                    

//                 }         
//         })
// }

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
    setSearchHistory(city)
    
}


function setSearchHistory(city){
    let savedCitiesArray = JSON.parse(localStorage.getItem("savedCities")) || [];
    savedCitiesArray.unshift(city)
    localStorage.setItem("savedCities",JSON.stringify(savedCitiesArray));
    displaySearchHistory();
}

function displaySearchHistory(){
    savedCitiesArray = JSON.parse(localStorage.getItem("savedCities")) || [];
    console.log(savedCitiesArray)
}

$(".submit").on("click", submitCity)


// })