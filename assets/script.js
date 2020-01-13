let APIKey = "840bae92b2c263c3e01358649c74dfbf";


// $(document).ready(function(){
//     console.log("document loaded");

function displayCurrent(city){
    let queryURL = `http://api.openweathermap.org/data/2.5/weather?q= ${city} &appid=7ba67ac190f85fdba2e2dc6b9d32e93c&units=imperial`;
    $.ajax({
        url: queryURL,
        method: "GET", 
        dataType: "json"
    })
        .then(function(response){
            console.log(response);

            let f = (response.main.temp * 9 / 5 + 32).toFixed(2);
            let city = $("#city").text(response.name);
            let currentTemp = $("#current-temp").text("Temperature: " + f);
            let humidity = $("#current-humidity").text("Humidity: " + response.main.humidity);
            let wind = $("#current-wind").text("Wind Speed: " + response.wind.speed);

            let countryCode = response.sys.country;
            let lon = response.coord.lon;
            let lat = response.coord.lat;

            displayUvIndex(lat, lon);
            displayFiveDay(city, countryCode);
        })
            .catch(function(error){
                console.log(error)
            })
}

function displayFiveDay(city, countryCode){
    let queryURL = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}&units=imperial`;
    $.ajax({
        url: queryURL,
        method: "GET", 
        dataType: "json"
    }) 
        .then(function(response){
            console.log(response);
          
        })

}

function displayUvIndex(lat, lon){
    let queryURL = `http://api.openweathermap.org/data/2.5/uvi?appid=${APIKey}&lat=${lat}&lon=${lon}`
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
}

$(".submit").on("click", submitCity)


// })