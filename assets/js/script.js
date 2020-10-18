//get info from user search for city

function getCityName() {
    var cityName = document.querySelector("#cityname").value;
    getForecast(cityName);
    makeRow(cityName);
}

//make rows of searched cities (clickable)
function makeRow(cityName) {
    var liEl = document.createElement("li")
    liEl.classList.add("list-group-item", "list-group-item-action");
    var text = cityName;
    liEl.textContent = text;
    var historyEl = document.querySelector('.history');
    historyEl.onclick = function(event){
        console.log(event.target.tagName)
        if (event.target.tagName === "LI"){
            getForecast(event.target.textContent)
        }
    }
    historyEl.appendChild(liEl);
};

//fetch weather forecast data for that city from open weather API

function getForecast(cityname) {
    fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + cityname + "&appid=ed3ceecb82da99a626e9f6aef02e2dbb&units=metric")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            (function makeChart() {
                var ctx = document.getElementById('myChart').getContext('2d');
                var temps = [];
                var dates = [];

                for (var i = 0; i < data.list.length; i++) {
                    //only look at forecasts around 3pm
                    if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                        // take the date, make it into an array and only extract the day
                        var date = data.list[i].dt_txt.split(" ")[0]
                        var temp = data.list[i].main.temp_max

                        //push the values to the arrays
                        dates.push(date)
                        temps.push(temp)
                    }
                }

                console.log(dates)
                console.log(temps)


                var myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: dates,
                        datasets: [{
                            label: 'Daily Forecast Temperatures',
                            lineTension: 0,
                            data: temps,
                            backgroundColor: [
                                'rgba(82, 144, 201, 0.5)',
                            ],
                            borderColor: [
                                'rgba(82, 144, 201, 1)',
                                'rgba(82, 144, 201, 1)',
                                'rgba(82, 144, 201, 1)',
                                'rgba(82, 144, 201, 1)',
                                'rgba(82, 144, 201, 1)',
                            ],
                            borderWidth: 3
                        }]
                    },
                    options: {
                        scales: {
                            xAxes: [{
                                gridLines: {
                                    display: false
                                 },
                            yAxes: [{
                                gridLines: {
                                    display: false
                                 },
                                ticks: {
                                    beginAtZero: true,
                                }
                            }]
                          }]
                        }
                    }
                });
            })()
        
        })
}

document.querySelector("#search-button").addEventListener("click", function(e) {
    e.preventDefault()
    getCityName();
})