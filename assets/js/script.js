function getNews () {
    var newsCategory = "politics";
    var newsApiKey = "api-key=2d7a1e64-833c-4dd6-b4cc-5d27dee745b0";
    fetch (
        "https://content.guardianapis.com/search?q=" +
        // get user selected news category
        newsCategory+
        "&format=json&tag=us/politics,world/politics&from-date=2020-10-01&show-fields=headline,thumbnail,short-url&order-by-relevance" +
        newsApiKey
        ).then(function(response) {
            console.log(response)
        });
};


getNews();