let APIKey = "840bae92b2c263c3e01358649c74dfbf";


function current(city){
    let queryURL = `http://api.openweathermap.org/data/2.5/weather?q= ${city} &appid=7ba67ac190f85fdba2e2dc6b9d32e93c&units=imperial`;
    $.ajax({
        url: queryURL,
        method: "GET", 
        dataType: "json"
    })
        .then(function(response){
            console.log(response);
            let lon = response.coord.lon;
            let lat = response.coord.lat;
            uvIndex(lat, lon);
        })
            .catch(function(error){
                console.log(error)
            })
}

function fiveDayForecast(city){
    let queryURL = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}&units=imperial`;
    $.ajax({
        url: queryURL,
        method: "GET", 
        dataType: "json"
    }) 
        .then(function(response){
            console.log(response);
            let city = $("#city").text(response.name);

        })

}

function uvIndex(lat, lon){
    let queryURL = `http://api.openweathermap.org/data/2.5/uvi?appid=${APIKey}&lat=${lat}&lon=${lon}`
    $.ajax({
        url: queryURL,
        method: "GET", 
        dataType: "json"
    })  
        .then(function(response){
            console.log(response);

        })
}




$(".submit").on("click", function(event){
    event.preventDefault();
    
    let city = $(".search").val();
    console.log(city);
    current(city);
    fiveDayForecast(city);
})
