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
    document.querySelector("#article-display").textContent = "";
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
            // create DOM Elements used to display news articles on page
            var newsContainerEl = document.querySelector("#article-display");
            var newsCardEl = document.createElement("div");
            var newsImageContainerEl = document.createElement('div');
            var newsImgEl = document.createElement("img");
            var newsCardTitleEl = document.createElement("span");
            var newsCardBtnEl = document.createElement("a");
            var newsCardBtnIconEl = document.createElement("i");
            var newsCardSummaryContainerEl = document.createElement("div");
            var newsCardSummaryEl = document.createElement("p");

            // add content to DOM Elements
            newsImgEl.setAttribute("src", articles.response.results[i].fields.thumbnail);
            newsCardTitleEl.textContent = articles.response.results[i].fields.headline;
            newsCardBtnEl.setAttribute("href", articles.response.results[i].fields.shortUrl);
            // articleAuthorEl.textContent = articles.response.results[i].fields.byline;
            newsCardSummaryEl.innerHTML = articles.response.results[i].fields.trailText;

            // set attributes of DOM Elements
            newsCardEl.classList.add("card", "small", "column");
            newsImageContainerEl.classList.add("card-image");
            newsCardTitleEl.classList.add("card-title");
            newsCardBtnEl.classList.add("btn-floating", "halfway-fab", "waves-effect", "waves-light", "red");
            newsCardBtnEl.setAttribute("target", "_blank");
            newsCardBtnIconEl.classList.add("material-icons");
            newsCardBtnIconEl.textContent = "add"
            newsCardSummaryContainerEl.classList.add("card-content");

            // combine DOM Elements and add  to container
            newsCardBtnEl.appendChild(newsCardBtnIconEl);
            newsImageContainerEl.appendChild(newsImgEl);
            newsImageContainerEl.appendChild(newsCardTitleEl);
            newsImageContainerEl.appendChild(newsCardBtnEl);
            newsCardSummaryContainerEl.appendChild(newsCardSummaryEl);
            newsCardEl.appendChild(newsImageContainerEl);
            newsCardEl.appendChild(newsCardSummaryContainerEl);
            newsContainerEl.appendChild(newsCardEl);
        }
    })
};

// get info from user search for city
function getCityName() {
    var cityName = document.querySelector("#cityname").value;
    getForecast(cityName);
    storeFavouriteCities(cityName);
    document.querySelector("#cityname").value = "";
    document.querySelector("#cityname").setAttribute("placeholder", cityName);
}

// make rows of searched cities
function makeFavouriteElement(cityName) {
    var historyEl = document.querySelector('.favourites');
    var liEl = document.createElement("li")
    liEl.classList.add("list-group-item", "list-group-item-action");
    var text = cityName;
    liEl.textContent = text;
    historyEl.appendChild(liEl);

};

// Store favourite cities in local storage
function storeFavouriteCities(cityName) {
    if (localStorage.getItem("favCities")) {
        var favCities = JSON.parse(localStorage.getItem("favCities"));
        console.log(favCities);
        if (favCities.length >= 5) {
            if (!favCities.includes(cityName)) {
                favCities.shift();
                favCities.push(cityName);
                console.log(favCities);
                localStorage.setItem("favCities", JSON.stringify(favCities));
                document.querySelector('.favourites').textContent = "";
                favCities.forEach(makeFavouriteElement);
            }
        }
        else {
            if (!favCities.includes(cityName)) {
                favCities.push(cityName);
                console.log(favCities);
                localStorage.setItem("favCities", JSON.stringify(favCities));
                favCities.forEach(makeFavouriteElement);
            }
        }
    }
    else {
        var favCities = [];
        favCities.push(cityName);
        localStorage.setItem("favCities", JSON.stringify(favCities));
        favCities.forEach(makeFavouriteElement);
    }
}



//fetch weather forecast data for that city from open weather API
function getForecast(cityName) {
    fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=ed3ceecb82da99a626e9f6aef02e2dbb&units=metric")
        .then(function (response) {
            return response.json();
        }).then(function (data) {

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
                    layout: {
                        padding: {
                            left: 50,
                            right: 0,
                            top: 0,
                            bottom: 0
                        }
                    },
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

document.querySelector('.favourites').addEventListener("click", function (event) {
    console.log(event.target.tagName);
    getForecast(event.target.textContent);
});

document.querySelector("#myBtnContainer").addEventListener("click", function (e) {
    e.preventDefault();
    e.target.classList.add("selected-news");
    getNewsCategory();
});

window.onload = function () {
    newsCategory = localStorage.getItem("recentNewsCategory");
    favCities = JSON.parse(localStorage.getItem("favCities"));
    console.log(newsCategory);
    if (newsCategory) {
        getNews(newsCategory)
    }
    else {
        var newsPromptContainerEl = document.querySelector("#article-display");
        var newsPromptEl = document.createElement("h4");
        newsPromptEl.textContent = "PLEASE SELECT A NEWS CATEGORY";
        newsPromptContainerEl.appendChild(newsPromptEl);
    };
    console.log(favCities);
    if(favCities) {
        getForecast(favCities[4]);
        document.querySelector(".favourites").textContent = "";
        favCities.forEach(makeFavouriteElement);
    }
    else {
        document.querySelector('.favourites')
    }

};

//collapsible drawer section//
$(document).ready(function () {
    $('.collapsible').collapsible();
});