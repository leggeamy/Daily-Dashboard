
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


getNews();