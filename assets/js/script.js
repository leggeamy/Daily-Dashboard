
var newsApiKey = "&api-key=2d7a1e64-833c-4dd6-b4cc-5d27dee745b0";


function getNews() {
    var newsCategory = "politics";
    var fromDate = "from-date=2020-10-16"
    console.log(newsCategory);
    fetch(
        `https://content.guardianapis.com/search?q=${newsCategory}&format=json&${fromDate}&show-fields=headline,thumbnail,short-url&order-by-relevance${newsApiKey}`
    ).then(function (response) {
        return response.json();
    }).then(function (articles) {
        console.log(articles);
        for (i = 0; i < 4; i++) {
            // create DOM Elements used to display news articles on page
            var newsContainerEl = document.querySelector(".news-container");
            var articleEl = document.createElement("div");
            var articleLinkEl = document.createElement("a");
            var articleImgEl = document.createElement("img");
            var articleHeadlineEl = document.createElement("p");

            // add content to DOM Elements
            // articleLinkEl.innerHTML = 'href="' + articles.response.results[i].fields.shortUrl + '">' + '<img src="' + articles.response.results[i].fields.thumbnail + '">';
            articleLinkEl.setAttribute("href",articles.response.results[i].fields.shortUrl);
            articleLinkEl.setAttribute("target","_blank");
            articleImgEl.setAttribute("src", articles.response.results[i].fields.thumbnail);
            articleHeadlineEl.textContent = articles.response.results[i].fields.headline;

            // combine DOM Elements and add  to container
            articleLinkEl.append(articleImgEl);
            articleEl.appendChild(articleLinkEl);
            articleEl.appendChild(articleHeadlineEl);
            newsContainerEl.appendChild(articleEl);

        }
    })
};

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

getNews();

