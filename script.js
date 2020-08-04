$("#getForecast").on("click", function(){
    var city=$("#cityInput").val().trim();
    //do nothing if not city selected
    if (city ===""){
        return;
    }
    console.log(city);
    pullForecastData(city);
    $(".forecast").attr("style", "visibility:visible")
    //add button to sidenav
    $(`<input id="${city}" value="${city}" type="submit" class="sideNavButton"><br>`).prependTo("#cityList");
    $(".sideNavButton").on("click", function(){
        var city=this.value;
        console.log(city);
        pullForecastData(city);
    });
});


var APIKey="326205de6b76d1f15a1c4162aaf828df";
//setting global variables so latitude and longitude can be used outside the call that retrieves them
var lat=0;
var lon=0;


function pullForecastData(citySelected){
$("#todayForecast").text("");
var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q="+citySelected+"&appid=" + APIKey;
$.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
        // console.log(response);
        let dailyHighTemp=0;
        let dailyHighHumidity=0;
        //looping through array to get each day's high temperature
        for (let i = 0; i < response.list.length; i++) {
            let hourlyTemp = response.list[i].main.temp-273.15;
            if (hourlyTemp>dailyHighTemp){
                dailyHighTemp=hourlyTemp;
            }
            if (response.list[i].main.humidity>dailyHighHumidity){
                dailyHighHumidity=response.list[i].main.humidity;
            }
            //data comes with 8 data points per day, so every 8th time it loops through we want to reset the daily high temperature variable
            if(i%8 == 7){
            console.log((dailyHighTemp * 9/5 +32).toFixed(2)+" degrees F high");
            console.log(dailyHighHumidity);
            
            //this calculates what day to put the data in
            let dayNum=((i+1)/8);
            let forecastDate=moment(response.list[i].dt_txt).format("L");
            
            let nextDay =document.getElementById("fiveDay" + dayNum);
            nextDay.innerHTML=(`Date: ${forecastDate}<br>High Temp: ${(dailyHighTemp * 9/5 +32).toFixed(1)}ºF <br> <img src="http://openweathermap.org/img/wn/${response.list[i].weather[0].icon}@2x.png"> <br>Humidity: ${dailyHighHumidity}%`)
            
            //reset counters
            dailyHighTemp=0;
            dailyHighHumidity=0;
            }
        }
    });
//fill in tofay's weather
var todayQueryURL="https://api.openweathermap.org/data/2.5/weather?q="+citySelected+"&appid=" + APIKey;
    $.ajax({
        url: todayQueryURL,
        method: "GET"
      }).then(function(response) {
        console.log(response);
        tempF=((response.main.temp-273.15) * 1.8 +32).toFixed(1);
        lat=response.coord.lat;
        lon=response.coord.lon;
        var cityElement=$("<h2>").text(citySelected + " " + moment().format("L"));
        var tempDisplay=$("<h4>").text(`Temperature: ${tempF}ºF`); 
        var icon=$("<img>").attr("src","http://openweathermap.org/img/wn/"+response.weather[0].icon+"@2x.png")
        var humidDisplay=$("<h4>").text(`Humidity: ${response.main.humidity}%`);
        var windSpeedDisplay=$("<h4>").text(`Wind Speed: ${response.wind.speed} MPH`);
        $("#todayForecast").append(cityElement, tempDisplay, icon, humidDisplay, windSpeedDisplay);
        var uvQueryURL="https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&%20exclude=hourly,daily&appid="+APIKey;
    $.ajax({
        url: uvQueryURL,
        method: "GET"
      }).then(function(response) {
        console.log(response);
        uvi=response.current.uvi;
        var UVIDisplay=$("<h4>").text("UV Index: "+uvi);
        //determine severity of UV index and assign class to determine background color
        if(uvi>8){
            UVIDisplay.attr("class","veryHigh");
        }
        else if(uvi>6){
            UVIDisplay.attr("class","high");
        }
        else if(uvi>3){
            UVIDisplay.attr("class","med");
        }
        else{
            UVIDisplay.attr("class","low");
        }
        $("#todayForecast").append(UVIDisplay);
    });
    });
    
    
 }
