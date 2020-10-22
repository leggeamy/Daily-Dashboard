// Store API Key in a variable
var newsApiKey = "&api-key=2d7a1e64-833c-4dd6-b4cc-5d27dee745b0";

// Find user selected news category
function getNewsCategory() {
    // get news button with class selected-news
    var newsCategory = document.querySelector(".selected-news").textContent;
    // Store most recentNewsCategory to local storage
    localStorage.setItem("recentNewsCategory", newsCategory);
    // Call getNews fuction and pass newsCategory
    getNews(newsCategory);
    // Remove class selected-news from clicked button
    document.querySelector(".selected-news").classList.remove("selected-news");
}

function getNews(newsCategory) {
    // clear news slides
    document.querySelector("#carousel-first-slide").textContent = "";
    document.querySelector("#carousel-second-slide").textContent = "";
    // store current day
    var fromDate = moment().format("YYYY-MM-DD");
    console.log(fromDate);
    // get news for selected newsCategory fromDate
    fetch(
        `https://content.guardianapis.com/search?q=${newsCategory}&format=json&${fromDate}&show-fields=headline,byline,trailText,thumbnail,short-url&order-by-relevance&${newsApiKey}`
    ).then(function (response) {
        return response.json();
    }).then(function (articles) {
        console.log(articles);
        for (i = 0; i < 4; i++) {
            if (i < 2) {
                // create DOM Elements used to display news articles on page
                var newsContainerEl = document.querySelector("#carousel-first-slide");
                newsContainerEl.classList.add("carousel-item", "active");
            }
            else {
                var newsContainerEl = document.querySelector("#carousel-second-slide");
                newsContainerEl.classList.add("carousel-item");
            }
            var articleContainerEl = document.createElement("div");
            var articleLabelEl = document.createElement("div");
            var articleHeadlineEl = document.createElement("h3");
            var articleAuthorEl = document.createElement("h4");
            var articleImgEl = document.createElement("img");
            var articleSummaryEl = document.createElement("p");
            var articleLinkEl = document.createElement("a");

            // add content to DOM Elements
            articleHeadlineEl.textContent = articles.response.results[i].fields.headline;
            articleAuthorEl.textContent = articles.response.results[i].fields.byline;
            articleImgEl.setAttribute("src", articles.response.results[i].fields.thumbnail);
            articleSummaryEl.innerHTML = articles.response.results[i].fields.trailText;
            articleLinkEl.setAttribute("href", articles.response.results[i].fields.shortUrl);
            articleLinkEl.setAttribute("target", "_blank");
            articleLinkEl.innerText = "CLICK TO READ";

            // set attributes of DOM Elements
            articleContainerEl.classList.add("news-card");
            articleLabelEl.classList.add("article-label");

            // combine DOM Elements and add  to container
            articleLabelEl.appendChild(articleHeadlineEl);
            articleLabelEl.appendChild(articleAuthorEl);
            articleContainerEl.appendChild(articleLabelEl);
            articleContainerEl.appendChild(articleImgEl);
            articleContainerEl.appendChild(articleSummaryEl);
            articleContainerEl.appendChild(articleLinkEl);
            newsContainerEl.appendChild(articleContainerEl);
        }
    })
};

//DAILY WEATHER FUNCTION -- > *not currently working, no errors in dev console* <--
var getWeatherData = function(cityname) {
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&appid=ed3ceecb82da99a626e9f6aef02e2dbb&units=imperial")
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data)

        //clear any old content
        todayEl = document.querySelector("#today");
        todayEl.textContent = " ";
        
        //create html content for current weather
        var titleEl = document.createElement("h3")
        titleEl.classList.add("card-title");
        titleEl.textContent = data.name + " (" + new Date().toLocaleDateString() + ")";
        var cardEl = document.createElement("div");
        cardEl.classList.add("card");
        var windEl = document.createElement("p");
        windEl.classList.add("card-text");
        var humidEl = document.createElement("p");
        humidEl.classList.add("card-text");
        var tempEl = document.createElement("p");
        tempEl.classList.add("card-text");
        humidEl.textContent = "Humidity: " + data.main.humidity + " %";
        tempEl.textContent = "Temperature: " + data.main.temp + " °F";
        var cardBodyEl = document.createElement("div");
        cardBodyEl.classList.add("card-body");
        var imgEl = document.createElement("img");
        imgEl.setAttribute("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png");

        titleEl.appendChild(imgEl)
        cardBodyEl.appendChild(titleEl);
        cardBodyEl.appendChild(tempEl);
        cardBodyEl.appendChild(humidEl);
        cardBodyEl.appendChild(windEl);
        cardEl.appendChild(cardBodyEl);
        todayEl.appendChild(cardEl);

        getForecast(cityname);
        getUVIndex(data.coord.lat, data.coord.lon);
    }
)}

function getUVIndex(lat, lon) {
    fetch("https://api.openweathermap.org/data/2.5/uvi?appid=ed3ceecb82da99a626e9f6aef02e2dbb&lat=" + lat + "&lon=" + lon)
    .then(function(response){
        return response.json();
    }).then(function(data) {
        var bodyEl = document.querySelector(".card-body");
        var uvEl = document.createElement("p");
        uvEl.textContent = "UV Index: "
        var buttonEl = document.createElement("span");
        buttonEl.classList.add("btn", "btn-sm");
        buttonEl.innerHTML = data.value;

        if (data.value < 3) {
            buttonEl.classList.add("btn-success");
        }
        else if (data.value < 7) {
            buttonEl.classList.add("btn-warning");
        }
        else {
            buttonEl.classList.add("btn-danger");
        }

        bodyEl.appendChild(uvEl);
        uvEl.appendChild(buttonEl);
    })
}

document.querySelector("#search-button").addEventListener("click", function(e) {
    e.preventDefault()
    getCityName();
});

// FORECAST CHART FUNCTION
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
    historyEl.onclick = function (event) {
        console.log(event.target.tagName)
        if (event.target.tagName === "LI") {
            getForecast(event.target.textContent)
        }
    }
    historyEl.appendChild(liEl);
};



//fetch weather forecast data for that city from open weather API

function getForecast(cityName) {
    fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=ed3ceecb82da99a626e9f6aef02e2dbb&units=metric")
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
};

document.querySelector("#search-button").addEventListener("click", function (e) {
    e.preventDefault();
    getCityName();
});

document.querySelector("#myBtnContainer").addEventListener("click", function (e) {
    e.preventDefault();
    e.target.classList.add("selected-news");
    getNewsCategory();
});

window.onload = function () {
    newsCategory = localStorage.getItem("recentNewsCategory");
    console.log(newsCategory);
    if(newsCategory) {
        getNews(newsCategory)
    }
    else {
        document.querySelector("#carousel-first-slide").innerHTML = "<h2>PLEASE SELECT A NEWS CATEGORY</h2>";
        document.querySelector("#carousel-second-slide").innerHTML = "<h2>PLEASE SELECT A NEWS CATEGORY</h2>";
    };
};

//collapsible drawer section//
$(document).ready(function(){
    $('.collapsible').collapsible();
  });

  //carousel section//
  $(document).ready(function(){
    $('.carousel').carousel();
  });

